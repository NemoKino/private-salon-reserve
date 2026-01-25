'use client';

import { useState, useEffect } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import Button from './Button';
import getCroppedImg from '@/utils/cropImage';
import styles from './ImageCropper.module.css';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (file: File) => void;
    onCancel: () => void;
    aspect?: number;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspect = 3 / 1 }: ImageCropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Validate image load
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onerror = () => {
            console.error('Failed to load image for cropping');
            setError(true);
        };
    }, [imageSrc]);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropAreaChange = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
            alert('画像の処理に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal} style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '3rem' }}>⚠️</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
                        画像の読み込みに失敗しました
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
                        ファイルが破損しているか、<br />
                        ブラウザが未対応の形式の可能性があります。<br />
                        別の画像を試してみてください。
                    </p>
                    <Button variant="secondary" onClick={onCancel} style={{ width: '100%' }}>
                        閉じる
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.cropperContainer}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropAreaChange}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className={styles.footer}>
                    <div className={styles.controls}>
                        <span className={styles.label}>Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>
                    <div className={styles.actions}>
                        <span className={styles.hint}>
                            ドラッグして位置を調整
                        </span>
                        <div className={styles.buttons}>
                            <Button variant="ghost" onClick={onCancel} disabled={loading} style={{ color: '#cbd5e1' }}>
                                キャンセル
                            </Button>
                            <Button variant="primary" onClick={handleSave} disabled={loading}>
                                {loading ? '処理中...' : '適用する'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
