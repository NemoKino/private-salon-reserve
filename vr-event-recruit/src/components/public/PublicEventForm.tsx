'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from '@/app/admin/admin.module.css'; // Reusing admin styles for consistency
import ImageUpload from '@/components/admin/ImageUpload';
import { Event } from '@/types';
import EventDetailView from '@/components/events/EventDetailView';
import ImageCropper from '@/components/ui/ImageCropper';
import TagInput from '@/components/ui/TagInput';

interface FormData {
    title: string;
    thumbnail: string;
    frequency: string; // Auto-generated
    description: string;
    tags: string[]; // Changed to array
    heroImage: string;
    longDescription: string;
    scheduleText: string;
    scheduleType: string;
    scheduleDays: string[];
    scheduleTime: string;
    scheduleDate: number | null;
    scheduleDateString: string; // for oneoff (YYYY-MM-DD)
    location: string;
    organizerName: string;
    twitterId: string; // Changed from twitterUrl
    galleryImages: string[];
    requirementsText: string;
}

interface PublicEventFormProps {
    onSubmit: (data: any) => Promise<void>;
}

export default function PublicEventForm({ onSubmit }: PublicEventFormProps) {
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        thumbnail: '',
        frequency: '',
        description: '',
        tags: [], // array
        heroImage: '',
        longDescription: '',
        scheduleText: '',
        scheduleType: 'weekly',
        scheduleDays: [],
        scheduleTime: '22:00',
        scheduleDate: 1,
        scheduleDateString: '',
        location: '',
        organizerName: '',
        twitterId: '',
        galleryImages: [],
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

    // Auto-generate Frequency Text
    useEffect(() => {
        let text = '';
        const time = formData.scheduleTime;
        const daysMap: { [key: string]: string } = {
            'Mon': '月曜', 'Tue': '火曜', 'Wed': '水曜', 'Thu': '木曜', 'Fri': '金曜', 'Sat': '土曜', 'Sun': '日曜'
        };
        const daysStr = formData.scheduleDays.map(d => daysMap[d]).join('・');

        switch (formData.scheduleType) {
            case 'daily':
                text = `毎日 ${time}`;
                break;
            case 'weekly':
                text = `毎週 ${daysStr} ${time}`;
                break;
            case 'biweekly':
                text = `隔週 ${daysStr} ${time}`;
                break;
            case 'monthly':
                text = `毎月 ${formData.scheduleDate}日 ${time}`;
                break;
            case 'oneoff':
                // Format YYYY-MM-DD to YYYY年MM月DD日
                if (formData.scheduleDateString) {
                    try {
                        const date = new Date(formData.scheduleDateString);
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        text = `${year}年${month}月${day}日 ${time}`;
                    } catch (e) {
                        text = `単発 (日付未定)`;
                    }
                } else {
                    text = `単発 (日付未定)`;
                }
                break;
            case 'irregular':
                text = '不定期';
                break;
            case 'other':
                text = 'その他';
                break;
            default:
                text = 'その他';
        }

        // If specific types, override text
        if (['irregular', 'other', 'oneoff'].includes(formData.scheduleType)) {
            // Logic handled in switch
        }

        setFormData(prev => ({ ...prev, frequency: text }));
    }, [formData.scheduleType, formData.scheduleDays, formData.scheduleTime, formData.scheduleDate, formData.scheduleDateString]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDayChange = (day: string) => {
        const currentDays = formData.scheduleDays;
        setFormData({
            ...formData,
            scheduleDays: currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day]
        });
    };

    // Gallery (Same as Admin)
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

        // Remove from pending files if exists (need to shift keys or just rebuild? shifting is hard)
        // Simplification: logic for gallery pending files might be tricky if we delete from middle.
        // Easier approach: map pendingFiles to gallery indices dynamically or use unique IDs.
        // For now, let's just clear ALL gallery related pending files if we remove one? No that's bad.
        // Let's rely on simple key 'gallery_{index}'. If we allow delete, we might have mismatch.
        // BUT, handleRemoveGalleryImage removes from formData array.
        // We probably should just NOT support delete of pending file in this simple version OR
        // Re-implement gallery to strictly map index.
        // Given complexity, let's reset pendingFiles for gallery to match new images array?
        // Actually, if we just use strings in formData, we lose the file map consistency.
        // Let's assume for MVP: Deleting an image simply removes it from formData.
        // The pendingFile for that index becomes orphaned in state but won't be used if we iterate based on formData length?
        // Wait, if I delete index 0, index 1 becomes index 0. `pendingFiles['gallery_1']` should become `pendingFiles['gallery_0']`.
        // BUT, handleRemoveGalleryImage removes from formData array.

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

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();

        // Manual Validation
        const missingFields = [];
        if (!formData.title) missingFields.push('イベント名');
        if (!formData.description) missingFields.push('簡易説明');
        if (!formData.longDescription) missingFields.push('詳細説明');
        if (!formData.location) missingFields.push('開催場所');
        if (!formData.organizerName) missingFields.push('主催者名');
        if (!formData.twitterId) missingFields.push('Twitter ID');
        if (!formData.thumbnail) missingFields.push('サムネイル画像');
        if (!formData.heroImage) missingFields.push('メイン画像');

        if (missingFields.length > 0) {
            alert(`以下の必須項目が入力されていません:\n${missingFields.join('\n')}`);
            return;
        }

        setLoading(true);

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

        const requirements = formData.requirementsText
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        // Construct Twitter URL from ID
        const twitterIdClean = formData.twitterId.replace(/^@/, '');
        const twitterUrl = `https://x.com/${twitterIdClean}`;

        const eventPayload = {
            title: formData.title,
            thumbnail: uploadedThumbnail,
            frequency: formData.frequency,
            status: 'pending',
            tags: formData.tags, // Array
            description: formData.description,
            detail: {
                heroImage: uploadedHeroImage,
                longDescription: formData.longDescription,
                requirements: requirements,
                schedule: {
                    text: formData.frequency,
                    type: formData.scheduleType,
                    days: formData.scheduleDays,
                    time: formData.scheduleTime,
                    dateOfMonth: formData.scheduleDate,
                },
                galleryImages: uploadedGalleryImages.filter(url => url.length > 0),
                location: formData.location,
            },
            organizer: {
                name: formData.organizerName,
                icon: '/images/organizer-icon.jpg',
                twitterUrl: twitterUrl,
            },
            isFeaturedTop: false,
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
        id: 'preview',
        title: formData.title || 'イベント名 (プレビュー)',
        thumbnail: formData.thumbnail || '/images/sample-bar.jpg',
        frequency: formData.frequency,
        status: 'pending',
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
                time: formData.scheduleTime,
                dateOfMonth: formData.scheduleDate || undefined,
            },
            galleryImages: formData.galleryImages,
            location: formData.location || '開催場所',
        },
        organizer: {
            name: formData.organizerName || '主催者名',
            icon: '/images/organizer-icon.jpg',
            twitterUrl: formData.twitterId ? `https://x.com/${formData.twitterId.replace(/^@/, '')}` : '#',
        },
        isFeaturedTop: false,
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
                            ← 入力に戻る
                        </Button>
                    </div>
                    <Button type="button" variant="primary" size="md" onClick={(e) => handleSubmit(e)} disabled={loading}>
                        {loading ? '送信中...' : 'この内容で申請する'}
                    </Button>
                </div>

                {/* Preview Content - Full Width */}
                <EventDetailView event={getPreviewEvent()} isPreview />

                {/* Bottom Action Area (Optional duplication for usability) */}
                <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ marginBottom: '1rem', color: '#64748b' }}>内容に問題がなければ、申請を行ってください。</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Button type="button" variant="secondary" size="lg" onClick={() => setShowPreview(false)}>
                            修正する
                        </Button>
                        <Button type="button" variant="primary" size="lg" onClick={(e) => handleSubmit(e)} disabled={loading}>
                            {loading ? '送信中...' : '申請する'}
                        </Button>
                    </div>
                </div>
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
            <div className={styles.formGroup}>
                <label className={styles.label}>イベント名 <span className="text-red-500">*</span></label>
                <input name="title" required className={styles.input} value={formData.title} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>簡易説明 (一覧用) <span className="text-red-500">*</span></label>
                <input name="description" required className={styles.input} value={formData.description} onChange={handleChange} placeholder="例: 毎週金曜開催の雑談系Barイベントです！" />
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

            {/* Schedule Section */}
            <div className={styles.formGroup} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label className={styles.label} style={{ fontSize: '1.1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>開催スケジュール設定</label>

                <div style={{ marginBottom: '1rem' }}>
                    <label className={styles.label}>開催頻度</label>
                    <select name="scheduleType" className={styles.select} value={formData.scheduleType} onChange={handleChange} style={{ width: 'auto' }}>
                        <option value="daily">毎日</option>
                        <option value="weekly">毎週</option>
                        <option value="biweekly">隔週</option>
                        <option value="monthly">毎月</option>
                        <option value="oneoff">単発</option>
                        <option value="irregular">不定期</option>
                        <option value="other">その他</option>
                    </select>
                </div>

                {/* Days Selection (Weekly/Biweekly) */}
                {(formData.scheduleType === 'weekly' || formData.scheduleType === 'biweekly') && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>曜日 (複数選択可)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', border: formData.scheduleDays.includes(day) ? '2px solid #3b82f6' : '1px solid #cbd5e1' }}>
                                    <input type="checkbox" checked={formData.scheduleDays.includes(day)} onChange={() => handleDayChange(day)} style={{ display: 'none' }} />
                                    <span style={{ fontWeight: formData.scheduleDays.includes(day) ? 'bold' : 'normal', color: formData.scheduleDays.includes(day) ? '#3b82f6' : '#64748b' }}>
                                        {day === 'Mon' ? '月' : day === 'Tue' ? '火' : day === 'Wed' ? '水' : day === 'Thu' ? '木' : day === 'Fri' ? '金' : day === 'Sat' ? '土' : '日'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Date Selection (Monthly) */}
                {formData.scheduleType === 'monthly' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>開催日</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>毎月</span>
                            <input type="number" name="scheduleDate" min="1" max="31" className={styles.input} value={formData.scheduleDate || ''} onChange={(e) => setFormData({ ...formData, scheduleDate: parseInt(e.target.value) })} style={{ width: '80px' }} />
                            <span>日</span>
                        </div>
                    </div>
                )}

                {/* Date Selection (One-off) */}
                {formData.scheduleType === 'oneoff' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>開催日</label>
                        <input type="date" name="scheduleDateString" className={styles.input} value={formData.scheduleDateString} onChange={handleChange} style={{ width: 'auto' }} />
                    </div>
                )}

                {/* Time Selection (Not for Irregular/Other) */}
                {!['irregular', 'other'].includes(formData.scheduleType) && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>開催時間</label>
                        <input type="time" name="scheduleTime" className={styles.input} value={formData.scheduleTime} onChange={handleChange} style={{ width: 'auto' }} />
                    </div>
                )}

                <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px', color: '#1e40af' }}>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>サイト上の表示:</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.frequency}</span>
                </div>
            </div>

            <div className={styles.formGroup}>
                <ImageUpload
                    label="サムネイル画像 *"
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    onFileSelect={(file) => handleFileSelect('thumbnail', file)}
                    helperText="一覧に表示される正方形の画像"
                />
            </div>

            <div className={styles.formGroup}>
                <ImageUpload
                    label="メイン画像 *"
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
                                <Button type="button" variant="outline" onClick={() => handleRemoveGalleryImage(index)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>削除</Button>
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
                        <Button type="button" variant="secondary" onClick={handleAddGalleryImage}>+ 画像を追加</Button>
                    </div>
                )}
            </div>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />

            <div className={styles.formGroup}>
                <label className={styles.label}>詳細説明 <span className="text-red-500">*</span></label>
                <textarea name="longDescription" required className={styles.textarea} value={formData.longDescription} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>参加条件 (改行区切り)</label>
                <textarea name="requirementsText" placeholder="VRChatプレイ時間500時間以上&#13;&#10;Discord必須" className={styles.textarea} value={formData.requirementsText} onChange={handleChange} style={{ minHeight: '100px' }} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>開催場所 (インスタンス名など) <span className="text-red-500">*</span></label>
                <input name="location" required className={styles.input} value={formData.location} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>主催者名 <span className="text-red-500">*</span></label>
                <input name="organizerName" required className={styles.input} value={formData.organizerName} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>X (旧Twitter) ID <span className="text-red-500">*</span></label>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                    応募の連絡先として使用されます。管理者またはイベント公式アカウントのIDを入力してください。
                </p>
                <input name="twitterId" required className={styles.input} value={formData.twitterId} onChange={handleChange} placeholder="@vr_cast_link" />
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    ※ @から始まるIDを入力してください。<br />
                    ※ 申請後の合否通知も、こちらのアカウントへDMにてお送りします。
                </p>
            </div>

            <div className={styles.buttonGroup}>
                <Button type="button" variant="secondary" style={{ marginRight: '1rem' }} onClick={() => setShowPreview(true)}>
                    プレビューを確認
                </Button>
                <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? '送信中...' : '掲載を申請する'}
                </Button>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                    申請後、管理者による確認を経て掲載されます。
                </p>
            </div>
        </form>
    );
}
