'use client';

import Link from 'next/link'; // Not strictly needed but checking consistency
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from '@/app/admin/admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';
import { Event } from '@/types';
import EventDetailView from '@/components/events/EventDetailView';
import ImageCropper from '@/components/ui/ImageCropper';
import TagInput from '@/components/ui/TagInput';

interface FormData {
    title: string;
    thumbnail: string;
    frequency: string;
    status: 'recruiting' | 'closed' | 'ended';
    description: string;
    tags: string[]; // Changed
    heroImage: string;
    longDescription: string;
    scheduleText: string;
    scheduleType: string;
    scheduleDays: string[];
    location: string;
    organizerName: string;
    twitterUrl: string;
    galleryImages: string[];
    requirementsText: string;
}

interface EventFormProps {
    initialData?: Event;
    onSubmit: (data: any) => Promise<void>;
    isEditing?: boolean;
}

export default function EventForm({ initialData, onSubmit, isEditing = false }: EventFormProps) {
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        thumbnail: '/images/sample-bar.jpg',
        frequency: '毎週金曜 22:00',
        status: 'recruiting',
        description: '',
        tags: [], // Changed
        heroImage: '/images/sample-bar-hero.jpg',
        longDescription: '',
        scheduleText: '',
        scheduleType: 'weekly',
        scheduleDays: [],
        location: '',
        organizerName: '',
        twitterUrl: 'https://twitter.com/',
        galleryImages: [], // Changed to array
        requirementsText: '',
    });
    const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File }>({});

    // Cropper State
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [croppingOriginalFile, setCroppingOriginalFile] = useState<File | null>(null);

    // Helper to store file for later upload
    const handleFileSelect = (key: string, file: File) => {
        if (key === 'heroImage') {
            const url = URL.createObjectURL(file);
            setCroppingImage(url);
            setCroppingOriginalFile(file);
            return;
        }
        setPendingFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleCropComplete = (croppedFile: File) => {
        setPendingFiles(prev => ({ ...prev, heroImage: croppedFile }));

        // Update the preview (formData) to show the cropped version
        const url = URL.createObjectURL(croppedFile);
        setFormData(prev => ({ ...prev, heroImage: url }));

        setCroppingImage(null);
        setCroppingOriginalFile(null);
    };

    const handleCropCancel = () => {
        // Fallback to original
        if (croppingOriginalFile) {
            setPendingFiles(prev => ({ ...prev, heroImage: croppingOriginalFile }));
        }
        setCroppingImage(null);
        setCroppingOriginalFile(null);
    };

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.url;
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                thumbnail: initialData.thumbnail,
                frequency: initialData.frequency,
                status: initialData.status as any,
                description: initialData.description,
                tags: initialData.tags, // Keep as array
                heroImage: initialData.detail.heroImage,
                longDescription: initialData.detail.longDescription,
                scheduleText: initialData.detail.schedule.text,
                scheduleType: initialData.detail.schedule.type || 'weekly',
                scheduleDays: (initialData.detail.schedule.days as string[]) || [],
                location: initialData.detail.location,
                organizerName: initialData.organizer.name,
                twitterUrl: initialData.organizer.twitterUrl,
                galleryImages: initialData.detail.galleryImages || [], // Load as array
                requirementsText: initialData.detail.requirements ? initialData.detail.requirements.join('\n') : '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDayChange = (day: string) => {
        const currentDays = formData.scheduleDays;
        if (currentDays.includes(day)) {
            setFormData({ ...formData, scheduleDays: currentDays.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, scheduleDays: [...currentDays, day] });
        }
    };

    // Gallery Image Handlers
    const handleGalleryImageChange = (index: number, url: string) => {
        const newImages = [...formData.galleryImages];
        newImages[index] = url;
        setFormData({ ...formData, galleryImages: newImages });
    };

    const handleAddGalleryImage = () => {
        if (formData.galleryImages.length < 3) {
            setFormData({ ...formData, galleryImages: [...formData.galleryImages, ''] });
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        const newImages = formData.galleryImages.filter((_, i) => i !== index);
        setFormData({ ...formData, galleryImages: newImages });

        const newPendingFiles = { ...pendingFiles };
        // Shift pending files
        for (let i = index; i < formData.galleryImages.length - 1; i++) {
            if (newPendingFiles[`gallery_${i + 1}`]) {
                newPendingFiles[`gallery_${i}`] = newPendingFiles[`gallery_${i + 1}`];
            } else {
                delete newPendingFiles[`gallery_${i}`];
            }
        }
        delete newPendingFiles[`gallery_${formData.galleryImages.length - 1}`];
        setPendingFiles(newPendingFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Manual Validation
        const missingFields = [];
        if (!formData.title) missingFields.push('イベント名');
        if (!formData.description) missingFields.push('簡易説明');
        if (!formData.longDescription) missingFields.push('詳細説明');
        if (!formData.location) missingFields.push('開催場所');
        if (!formData.organizerName) missingFields.push('主催者名');
        if (!formData.twitterUrl) missingFields.push('Twitter URL');

        // Admin form might not strictly enforce images in logic, but let's check basic text fields at least.

        if (missingFields.length > 0) {
            alert(`以下の必須項目が入力されていません:\n${missingFields.join('\n')}`);
            return;
        }

        setLoading(true);

        const requirements = formData.requirementsText
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        // Upload Pending Files
        const uploadPromises: Promise<void>[] = [];
        let uploadedThumbnail = formData.thumbnail;
        let uploadedHeroImage = formData.heroImage;
        let uploadedGalleryImages = [...formData.galleryImages];

        if (pendingFiles['thumbnail']) {
            uploadPromises.push(uploadFile(pendingFiles['thumbnail']).then(url => { uploadedThumbnail = url; }));
        }
        if (pendingFiles['heroImage']) {
            uploadPromises.push(uploadFile(pendingFiles['heroImage']).then(url => { uploadedHeroImage = url; }));
        }

        Object.keys(pendingFiles).forEach(key => {
            if (key.startsWith('gallery_')) {
                const index = parseInt(key.split('_')[1]);
                uploadPromises.push(uploadFile(pendingFiles[key]).then(url => { uploadedGalleryImages[index] = url; }));
            }
        });

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('画像のアップロードに失敗しました。');
            setLoading(false);
            return;
        }

        const eventPayload = {
            title: formData.title,
            thumbnail: uploadedThumbnail,
            frequency: formData.frequency,
            status: formData.status,
            tags: formData.tags, // Direct array
            description: formData.description,
            detail: {
                heroImage: uploadedHeroImage,
                longDescription: formData.longDescription,
                requirements: requirements,
                schedule: {
                    text: formData.frequency,
                    type: formData.scheduleType,
                    days: formData.scheduleDays,
                },
                galleryImages: uploadedGalleryImages.filter(url => url.length > 0), // Filter empty
                location: formData.location,
            },
            organizer: {
                name: formData.organizerName,
                icon: '/images/organizer-icon.jpg',
                twitterUrl: formData.twitterUrl,
            },
            isFeaturedTop: initialData ? initialData.isFeaturedTop : false,
        };

        try {
            await onSubmit(eventPayload);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getPreviewEvent = (): Event => ({
        id: initialData?.id || 'preview',
        title: formData.title || 'イベント名 (プレビュー)',
        thumbnail: formData.thumbnail || '/images/sample-bar.jpg',
        frequency: formData.frequency || '開催日時',
        status: formData.status,
        tags: formData.tags, // Array
        description: formData.description,
        detail: {
            heroImage: formData.heroImage || '/images/sample-bar-hero.jpg',
            longDescription: formData.longDescription || '詳細説明文がここに入ります。',
            requirements: formData.requirementsText.split('\n').filter(Boolean),
            schedule: {
                text: formData.frequency,
                type: formData.scheduleType as any,
                days: formData.scheduleDays as any[],
            },
            galleryImages: formData.galleryImages,
            location: formData.location || '開催場所',
        },
        organizer: {
            name: formData.organizerName || '主催者名',
            icon: '/images/organizer-icon.jpg',
            twitterUrl: formData.twitterUrl || '#',
        },
        isFeaturedTop: initialData ? initialData.isFeaturedTop : false,
    });

    if (showPreview) {
        return (
            <div style={{ width: '100%', minHeight: '100vh', background: '#fff' }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>プレビューモード</span>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setShowPreview(false)}>
                            ← 編集に戻る
                        </Button>
                    </div>
                    {/* Admin save button usually at bottom, but adding here for convenience? Admin might want to scroll down first. 
                        Let's keep it simple at top or just 'Exit Preview' at top. 
                        The user asked for public form specifically, but consistency is good.
                        I'll add the save button here too for consistency.
                    */}
                    <Button type="button" variant="primary" size="md" onClick={(e) => handleSubmit(e as any)} disabled={loading}>
                        {loading ? '保存中...' : (isEditing ? '更新を保存' : '保存する')}
                    </Button>
                </div>

                <EventDetailView event={getPreviewEvent()} isPreview />
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {croppingImage && (
                <ImageCropper
                    imageSrc={croppingImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspect={3 / 1}
                />
            )}
            <div className={styles.buttonGroup} style={{ marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => setShowPreview(true)}>
                    プレビューを確認
                </Button>
            </div>
            {/* Basic Info */}
            <div className={styles.formGroup}>
                <label className={styles.label}>イベント名</label>
                <input
                    name="title"
                    required
                    className={styles.input}
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>簡易説明 (一覧用)</label>
                <input
                    name="description"
                    required
                    className={styles.input}
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>タグ</label>
                <TagInput
                    value={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                    placeholder="Bar, RP, 初心者歓迎..."
                />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    タグを入力してEnterまたはクリックで追加できます。既存のタグが表示されます。
                </p>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>開催スケジュール</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <select
                        name="scheduleType"
                        className={styles.select}
                        value={formData.scheduleType}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    >
                        <option value="daily">毎日</option>
                        <option value="weekly">毎週</option>
                        <option value="biweekly">隔週</option>
                        <option value="monthly">毎月</option>
                        <option value="irregular">不定期</option>
                        <option value="oneoff">単発</option>
                        <option value="other">その他</option>
                    </select>
                </div>

                {(formData.scheduleType === 'weekly' || formData.scheduleType === 'biweekly') && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.scheduleDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                />
                                {day === 'Mon' ? '月' : day === 'Tue' ? '火' : day === 'Wed' ? '水' : day === 'Thu' ? '木' : day === 'Fri' ? '金' : day === 'Sat' ? '土' : '日'}
                            </label>
                        ))}
                    </div>
                )}

                <label className={styles.label} style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>表示テキスト (例: 毎週金曜 22:00)</label>
                <input
                    name="frequency"
                    placeholder="毎週金曜 22:00"
                    required
                    className={styles.input}
                    value={formData.frequency}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <ImageUpload
                    label="サムネイル画像"
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    onFileSelect={(file) => handleFileSelect('thumbnail', file)}
                    helperText="一覧に表示される正方形の画像"
                />
            </div>

            <div className={styles.formGroup}>
                <ImageUpload
                    label="メイン画像"
                    value={formData.heroImage}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                    onFileSelect={(file) => handleFileSelect('heroImage', file)}
                    helperText="詳細ページのトップに大きく表示される画像"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>ギャラリー画像 (最大3枚)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {formData.galleryImages.map((url, index) => (
                        <div key={index} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10 }}>
                                <Button
                                    type="button"
                                    variant="ghost" // Use ghost or create a danger variant if needed, but styling inline for delete is quick
                                    onClick={() => handleRemoveGalleryImage(index)}
                                    style={{ color: '#ef4444', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                >
                                    削除
                                </Button>
                            </div>
                            <ImageUpload
                                label={`画像 ${index + 1}`}
                                value={url}
                                onChange={(newUrl) => handleGalleryImageChange(index, newUrl)}
                                onFileSelect={(file) => handleFileSelect(`gallery_${index}`, file)}
                            />
                        </div>
                    ))}
                </div>
                {formData.galleryImages.length < 3 && (
                    <div style={{ marginTop: '1rem' }}>
                        <Button type="button" variant="secondary" onClick={handleAddGalleryImage}>
                            + 画像を追加
                        </Button>
                    </div>
                )}
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
                <label className={styles.label}>ステータス</label>
                <select name="status" className={styles.select} value={formData.status} onChange={handleChange}>
                    <option value="recruiting">募集中</option>
                    <option value="closed">募集終了</option>
                </select>
            </div>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />

            {/* Details */}
            <div className={styles.formGroup}>
                <label className={styles.label}>詳細説明</label>
                <textarea
                    name="longDescription"
                    required
                    className={styles.textarea}
                    value={formData.longDescription}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>参加条件 (改行区切り)</label>
                <textarea
                    name="requirementsText"
                    placeholder="VRChatプレイ時間500時間以上&#13;&#10;Discord必須"
                    className={styles.textarea}
                    value={formData.requirementsText}
                    onChange={handleChange}
                    style={{ minHeight: '100px' }}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>開催場所 (インスタンス名など)</label>
                <input
                    name="location"
                    required
                    className={styles.input}
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>主催者名</label>
                <input
                    name="organizerName"
                    required
                    className={styles.input}
                    value={formData.organizerName}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Twitter URL</label>
                <input
                    name="twitterUrl"
                    required
                    className={styles.input}
                    value={formData.twitterUrl}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? '保存中...' : (isEditing ? '更新を保存' : 'イベントを保存')}
                </Button>
            </div>
        </form>
    );
}
