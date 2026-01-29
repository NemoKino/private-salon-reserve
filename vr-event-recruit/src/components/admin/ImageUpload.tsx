'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ImageUpload.module.css';
import Button from '@/components/ui/Button';

interface ImageUploadProps {
    label: React.ReactNode;
    value: string;
    onChange: (url: string) => void;
    helperText?: React.ReactNode;
    onFileSelect?: (file: File) => void;
}

export default function ImageUpload({ label, value, onChange, helperText, onFileSelect }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(value);

    // Sync preview with value prop changes (e.g. from invalid to valid data load)
    useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size validation (4MB to fit Vercel's 4.5MB limit)
        if (file.size > 4 * 1024 * 1024) {
            alert('ファイルサイズは4MB以下にしてください（サーバー制限のため）。');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // If onFileSelect is provided, use it instead of immediate upload
        if (onFileSelect) {
            const objectUrl = URL.createObjectURL(file);
            onChange(objectUrl);
            setPreview(objectUrl);
            onFileSelect(file);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await res.json();
            onChange(data.url);
            setPreview(data.url);
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(error.message || '画像のアップロードに失敗しました。');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setPreview(e.target.value);
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div className={styles.uploadArea}>
                <div className={styles.previewContainer}>
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className={styles.previewImage}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    ) : (
                        <div className={styles.placeholder}>No Image</div>
                    )}
                </div>

                <div className={styles.controls}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.hiddenInput}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'アップロード中...' : '画像を選択'}
                    </Button>

                </div>
            </div>
            {helperText && <div className={styles.helper}>{helperText}</div>}
        </div>
    );
}
