'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from '@/app/admin/admin.module.css';
import ImageUpload from '@/components/admin/ImageUpload';
import { Event } from '@/types';

interface FormData {
    title: string;
    thumbnail: string;
    frequency: string;
    status: 'recruiting' | 'closed' | 'ended';
    description: string;
    tags: string;
    heroImage: string;
    longDescription: string;
    scheduleText: string;
    scheduleType: string;
    scheduleDays: string[];
    location: string;
    organizerName: string;
    twitterUrl: string;
    galleryImagesText: string;
    requirementsText: string;
}

interface EventFormProps {
    initialData?: Event;
    onSubmit: (data: any) => Promise<void>;
    isEditing?: boolean;
}

export default function EventForm({ initialData, onSubmit, isEditing = false }: EventFormProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        thumbnail: '/images/sample-bar.jpg',
        frequency: '毎週金曜 22:00',
        status: 'recruiting',
        description: '',
        tags: '',
        heroImage: '/images/sample-bar-hero.jpg',
        longDescription: '',
        scheduleText: '',
        scheduleType: 'weekly',
        scheduleDays: [],
        location: '',
        organizerName: '',
        twitterUrl: 'https://twitter.com/',
        galleryImagesText: '',
        requirementsText: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                thumbnail: initialData.thumbnail,
                frequency: initialData.frequency,
                status: initialData.status as any,
                description: initialData.description,
                tags: initialData.tags.join(', '),
                heroImage: initialData.detail.heroImage,
                longDescription: initialData.detail.longDescription,
                scheduleText: initialData.detail.schedule.text,
                scheduleType: initialData.detail.schedule.type || 'weekly',
                scheduleDays: (initialData.detail.schedule.days as string[]) || [],
                location: initialData.detail.location,
                organizerName: initialData.organizer.name,
                twitterUrl: initialData.organizer.twitterUrl,
                galleryImagesText: initialData.detail.galleryImages ? initialData.detail.galleryImages.join('\n') : '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const galleryImages = formData.galleryImagesText
            .split(/[\n,]/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const requirements = formData.requirementsText
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const eventPayload = {
            title: formData.title,
            thumbnail: formData.thumbnail,
            frequency: formData.frequency,
            status: formData.status,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            description: formData.description,
            detail: {
                heroImage: formData.heroImage,
                longDescription: formData.longDescription,
                requirements: requirements,
                schedule: {
                    text: formData.frequency,
                    type: formData.scheduleType,
                    days: formData.scheduleDays,
                },
                galleryImages: galleryImages,
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

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
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
                <label className={styles.label}>タグ (カンマ区切り)</label>
                <input
                    name="tags"
                    placeholder="Bar, RP, 初心者歓迎"
                    className={styles.input}
                    value={formData.tags}
                    onChange={handleChange}
                />
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
                    helperText="一覧に表示される正方形の画像"
                />
            </div>

            <div className={styles.formGroup}>
                <ImageUpload
                    label="メイン画像"
                    value={formData.heroImage}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                    helperText="詳細ページのトップに大きく表示される画像"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>ギャラリー画像 (URL) - 複数可</label>
                <textarea
                    name="galleryImagesText"
                    placeholder="/images/photo1.jpg, /images/photo2.jpg"
                    className={styles.textarea}
                    value={formData.galleryImagesText}
                    onChange={handleChange}
                    style={{ minHeight: '80px' }}
                />
                <div className={styles.helper}>カンマ区切りまたは改行で複数の画像URLを指定できます</div>
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
