'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import styles from '@/app/admin/admin.module.css'; // Reusing admin styles for consistency
import ImageUpload from '@/components/admin/ImageUpload';
import { Event } from '@/types';
import EventDetailView from '@/components/events/EventDetailView';
import ImageCropper from '@/components/ui/ImageCropper';
import TagInput from '@/components/ui/TagInput';
import Modal from '@/components/ui/Modal';
import StepIndicator from '@/components/ui/StepIndicator';

import { useRouter } from 'next/navigation';

interface FormData {
    title: string;
    thumbnail: string;
    frequency: string; // Auto-generated
    description: string;
    tags: string[];
    heroImage: string;
    longDescription: string;
    scheduleText: string;
    scheduleType: string;
    scheduleDays: string[];
    scheduleTime: string;
    scheduleTimeEnd: string;
    scheduleDate: number | null;
    scheduleDateString: string; // for oneoff (YYYY-MM-DD)
    organizerName: string;
    twitterId: string;
    galleryImages: string[];
    requirementsText: string;
    listingPeriod: string;
    listingEndDate: string;
}

interface PublicEventFormProps {
    onSubmit: (data: any) => Promise<any>;
}


// Helper Component for Image Location Guide
const ImageLocationGuide = ({ type }: { type: 'thumbnail' | 'hero' | 'gallery' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    let guideTitle = '';
    let guideSrc = '';

    switch (type) {
        case 'thumbnail':
            guideTitle = 'イベント一覧での表示';
            guideSrc = '/images/guide-thumbnail.png';
            break;
        case 'hero':
            guideTitle = 'イベント詳細ページでの表示 (メイン)';
            guideSrc = '/images/guide-hero.png';
            break;
        case 'gallery':
            guideTitle = 'イベント詳細ページでの表示 (ギャラリー)';
            guideSrc = '/images/guide-gallery.png';
            break;
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                position: 'relative',
                cursor: 'help',
                width: '1.2rem',
                height: '1.2rem',
                borderRadius: '50%',
                background: '#cbd5e1',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 'bold'
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            ?

            {showTooltip && (
                <div style={{
                    position: 'absolute',
                    bottom: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '0.5rem',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    width: '320px',
                    zIndex: 50,
                    pointerEvents: 'none'
                }}>
                    <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#1e293b', textAlign: 'center' }}>
                        {guideTitle}
                    </div>

                    <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img
                            src={guideSrc}
                            alt="Display Guide"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: '12px',
                        height: '12px',
                        background: 'white',
                        borderRight: '1px solid #e2e8f0',
                        borderBottom: '1px solid #e2e8f0'
                    }}></div>
                </div>
            )}
        </span>
    );
};



export default function PublicEventForm({ onSubmit }: PublicEventFormProps) {
    // ... existing code ...

    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1); // 1: Input, 2: Preview
    const [loading, setLoading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File }>({});
    const [formData, setFormData] = useState<FormData>({
        title: '',
        thumbnail: '',
        frequency: '毎週金曜日',
        description: '',
        tags: [],
        heroImage: '',
        longDescription: '',
        scheduleText: '',
        scheduleType: 'weekly',
        scheduleDays: ['Fri'],
        scheduleTime: '22:00',
        scheduleTimeEnd: '',
        scheduleDate: null,
        scheduleDateString: '',

        organizerName: '',
        twitterId: '',
        galleryImages: [''], // Initialize with one empty slot
        requirementsText: '',
        listingPeriod: 'indefinite',
        listingEndDate: '',
    });

    const [cropperState, setCropperState] = useState<{
        isOpen: boolean;
        file: string | null;
        targetKey: string | null;
        aspect: number;
    }>({
        isOpen: false,
        file: null,
        targetKey: null,
        aspect: 1,
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = async (key: string, file: File) => {
        let fileToProcess = file;

        // Check if file is > 4MB
        if (file.size > 4 * 1024 * 1024) {
            const confirmed = window.confirm('画像サイズが4MBを超えています。自動的に圧縮してアップロードしますか？\n(キャンセルすると選択を解除します)');
            if (!confirmed) return;

            try {
                // Dynamically import to ensure client-side execution
                const { compressImage } = await import('@/utils/imageCompression');
                fileToProcess = await compressImage(file);
            } catch (e) {
                console.error('Compression failed', e);
                alert('画像の圧縮に失敗しました。');
                return;
            }
        }

        const objectUrl = URL.createObjectURL(fileToProcess);

        // Direct update for gallery images (no crop)
        if (key.startsWith('gallery_')) {
            const index = parseInt(key.split('_')[1]);
            const newGallery = [...formData.galleryImages];
            newGallery[index] = objectUrl;
            setFormData(prev => ({ ...prev, galleryImages: newGallery }));
            setPendingFiles(prev => ({ ...prev, [key]: fileToProcess }));
            return;
        }

        // Determine aspect ratio based on key
        let aspect = 1.91; // Default widely used for OG etc (approx 16:9)
        if (key === 'thumbnail') aspect = 1; // Square for thumbnail
        else if (key === 'heroImage') aspect = 3 / 1; // Ultra-wide for hero header

        setCropperState({
            isOpen: true,
            file: objectUrl,
            targetKey: key,
            aspect: aspect,
        });
    };

    const handleCropComplete = (croppedFile: File) => {
        if (!cropperState.targetKey) return;

        const key = cropperState.targetKey;
        const objectUrl = URL.createObjectURL(croppedFile);

        if (key === 'thumbnail') setFormData(prev => ({ ...prev, thumbnail: objectUrl }));
        else if (key === 'heroImage') setFormData(prev => ({ ...prev, heroImage: objectUrl }));
        else if (key.startsWith('gallery_')) {
            const index = parseInt(key.split('_')[1]);
            const newGallery = [...formData.galleryImages];
            newGallery[index] = objectUrl;
            setFormData(prev => ({ ...prev, galleryImages: newGallery }));
        }

        setPendingFiles(prev => ({ ...prev, [key]: croppedFile }));
        setCropperState({ isOpen: false, file: null, targetKey: null, aspect: 1 });
    };

    const handleCropCancel = () => {
        setCropperState({ isOpen: false, file: null, targetKey: null, aspect: 1 });
    };

    const handleDayChange = (day: string) => {
        setFormData(prev => {
            const days = prev.scheduleDays.includes(day)
                ? prev.scheduleDays.filter(d => d !== day)
                : [...prev.scheduleDays, day];
            return { ...prev, scheduleDays: days };
        });
    };

    // Auto-generate frequency string
    useEffect(() => {
        let text = '';
        const time = formData.scheduleTime;
        const timeEnd = formData.scheduleTimeEnd ? `〜${formData.scheduleTimeEnd}` : '';
        const timeStr = `${time}${timeEnd}`; // Combine start and end

        const dayMap: { [key: string]: string } = {
            'Mon': '月', 'Tue': '火', 'Wed': '水', 'Thu': '木', 'Fri': '金', 'Sat': '土', 'Sun': '日'
        };

        switch (formData.scheduleType) {
            case 'daily':
                text = `毎日 ${timeStr}`;
                break;
            case 'weekly':
                const daysW = formData.scheduleDays.map(d => dayMap[d]).join('・');
                text = daysW ? `毎週 ${daysW}曜 ${timeStr}` : `毎週 ${timeStr}`;
                break;
            case 'biweekly':
                const daysB = formData.scheduleDays.map(d => dayMap[d]).join('・');
                text = daysB ? `隔週 ${daysB}曜 ${timeStr}` : `隔週 ${timeStr}`;
                break;
            case 'monthly':
                text = `毎月${formData.scheduleDate || '1'}日 ${timeStr}`;
                break;
            case 'oneoff':
                text = `${formData.scheduleDateString} ${timeStr}`;
                break;
            case 'irregular':
                text = '不定期開催';
                break;
            case 'other':
                text = '詳細は説明文を参照';
                break;
            default:
                text = '';
        }
        setFormData(prev => ({ ...prev, frequency: text }));
    }, [
        formData.scheduleType,
        formData.scheduleDays,
        formData.scheduleTime,
        formData.scheduleTimeEnd,
        formData.scheduleDate,
        formData.scheduleDateString
    ]);

    const handleGalleryImageChange = (index: number, url: string) => {
        const newGallery = [...formData.galleryImages];
        newGallery[index] = url;
        setFormData(prev => ({ ...prev, galleryImages: newGallery }));
    };

    const handleAddGalleryImage = () => {
        if (formData.galleryImages.length < 3) {
            setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ''] }));
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));
    };
    const handleConfirm = (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();

        // Manual Validation
        const missingFields = [];
        if (!formData.title) missingFields.push('イベント名');
        if (!formData.description) missingFields.push('簡易説明');
        if (!formData.longDescription) missingFields.push('詳細説明');

        if (!formData.organizerName) missingFields.push('主催者名');
        if (!formData.twitterId) missingFields.push('Twitter ID');
        if (!formData.thumbnail) missingFields.push('サムネイル画像');
        if (!formData.heroImage) missingFields.push('メイン画像');

        if (missingFields.length > 0) {
            alert(`以下の必須項目が入力されていません:\n${missingFields.join('\n')}`);
            return;
        }

        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleFinalSubmit = () => {
        setShowConfirmModal(true);
    };

    const handleRealSubmit = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        // Upload Pending Files
        const uploadPromises: Promise<void>[] = [];
        let uploadedThumbnail = formData.thumbnail;
        let uploadedHeroImage = formData.heroImage;
        const uploadedGalleryImages = [...formData.galleryImages];

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

        // Calculate listingEndDate based on period if not custom
        let computedListingEndDate = formData.listingEndDate;
        if (formData.listingPeriod !== 'custom' && formData.listingPeriod !== 'indefinite') {
            const now = new Date();
            const endDate = new Date(now);

            switch (formData.listingPeriod) {
                case '1day':
                    endDate.setDate(now.getDate() + 1);
                    break;
                case '7days':
                    endDate.setDate(now.getDate() + 7);
                    break;
                case '1month':
                    endDate.setMonth(now.getMonth() + 1);
                    break;
                case '3months':
                    endDate.setMonth(now.getMonth() + 3);
                    break;
                case '6months':
                    endDate.setMonth(now.getMonth() + 6);
                    break;
                case '12months':
                    endDate.setMonth(now.getMonth() + 12);
                    break;
            }
            // Format YYYY-MM-DD
            computedListingEndDate = endDate.toISOString().split('T')[0];
        } else if (formData.listingPeriod === 'indefinite') {
            computedListingEndDate = ''; // No end date
        }

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
                    timeEnd: formData.scheduleTimeEnd,
                    dateOfMonth: formData.scheduleDate,
                },
                galleryImages: uploadedGalleryImages.filter(url => url.length > 0),
                location: 'VRChat',
                listingPeriod: formData.listingPeriod as any,
                listingEndDate: computedListingEndDate,
            },
            organizer: {
                name: formData.organizerName,
                icon: '/images/organizer-icon.jpg',
                twitterUrl: twitterUrl,
            },
            isFeaturedTop: false,
        };

        try {
            const result = await onSubmit(eventPayload);
            router.push(`/organizer/completed?title=${encodeURIComponent(formData.title)}&id=${result?.id || ''}`);
        } catch (error) {
            console.error(error);
            alert('送信に失敗しました。もう一度お試しください。');
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
                timeEnd: formData.scheduleTimeEnd,
                dateOfMonth: formData.scheduleDate || undefined,
            },
            galleryImages: formData.galleryImages,
            // location removed
            listingPeriod: formData.listingPeriod as any,
        },
        organizer: {
            name: formData.organizerName || '主催者名',
            icon: '/images/organizer-icon.jpg',
            twitterUrl: formData.twitterId ? `https://x.com/${formData.twitterId.replace(/^@/, '')}` : '#',
        },
        isFeaturedTop: false,
    });

    return (
        <div className={styles.formContainer}>
            {/* Image Cropper Modal */}
            {cropperState.isOpen && cropperState.file && (
                <ImageCropper
                    imageSrc={cropperState.file}
                    aspect={cropperState.aspect}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}

            {/* Step Progress Bar */}
            <StepIndicator currentStep={step === 2 ? 2 : 1} />

            {/* Preview Overlay (Full Screen) */}
            {
                step === 2 && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: '#fff',
                        zIndex: 9999,
                        overflowY: 'auto',
                    }}>
                        {/* Preview Header */}
                        <div style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 10000,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{
                                background: '#3b82f6',
                                color: 'white',
                                textAlign: 'center',
                                padding: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                letterSpacing: '0.1em'
                            }}>
                                PREVIEW MODE
                            </div>
                            <div style={{
                                padding: '1rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '1rem', display: 'inline-block', color: '#64748b' }}>
                                        この内容はプレビューです
                                    </span>
                                    <Button type="button" variant="secondary" size="sm" onClick={handleBack}>
                                        ← 修正する
                                    </Button>
                                </div>
                                <Button type="button" variant="primary" size="md" onClick={handleFinalSubmit} disabled={loading}>
                                    次へ (本人確認)
                                </Button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <EventDetailView event={getPreviewEvent()} isPreview />

                        {/* Bottom Actions */}
                        <div style={{ padding: '4rem 1rem', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid var(--color-border)' }}>
                            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                                内容にお間違いがなければ、次へお進みください。<br />
                                最後に本人確認（DM送信）を行うことで申請完了となります。
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch', maxWidth: '400px', margin: '0 auto' }}>
                                <Button type="button" variant="secondary" size="lg" onClick={handleBack} style={{ width: '100%' }}>
                                    修正する
                                </Button>
                                <Button type="button" variant="primary" size="lg" onClick={handleFinalSubmit} disabled={loading} style={{ width: '100%' }}>
                                    次へ (本人確認)
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }






            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="申請内容の確認"
                primaryAction={{
                    label: '申請して本人確認へ進む',
                    onClick: handleRealSubmit,
                    loading: loading
                }}
                secondaryAction={{
                    label: '戻って修正する',
                    onClick: () => setShowConfirmModal(false),
                    variant: 'secondary'
                }}
            >
                <div style={{ padding: '0.5rem 0' }}>
                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#1e293b' }}>
                        申請が完了すると、<strong style={{ color: '#0369a1' }}>本人確認画面</strong>へ移動します。<br />
                        <span style={{ fontSize: '0.9em', color: '#ef4444', fontWeight: 'bold' }}>
                            ※ この先、申請内容を変更することは出来ません
                        </span>
                    </p>
                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>最終チェック</p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', color: '#334155', fontSize: '0.95rem' }}>
                            <li>イベント名に誤字はありませんか？</li>
                            <li>X (Twitter) ID は正しいですか？</li>
                            <li>画像は正しく設定されていますか？</li>
                        </ul>
                    </div>
                </div>
            </Modal>

            <form className={styles.form} onSubmit={handleConfirm}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input type="time" name="scheduleTime" className={styles.input} value={formData.scheduleTime} onChange={handleChange} style={{ width: 'auto', flex: '1 1 120px' }} />
                                <span>〜</span>
                                <input type="time" name="scheduleTimeEnd" className={styles.input} value={formData.scheduleTimeEnd} onChange={handleChange} style={{ width: 'auto', flex: '1 1 120px' }} />
                                <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>(終了時間は任意)</span>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '6px', color: '#1e40af' }}>
                        <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>サイト上の表示:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.frequency}</span>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <ImageUpload
                        label={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                サムネイル画像 * <ImageLocationGuide type="thumbnail" />
                            </span>
                        }
                        value={formData.thumbnail}
                        onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                        onFileSelect={(file) => handleFileSelect('thumbnail', file)}
                        helperText="一覧に表示される正方形の画像"
                    />
                </div>

                <div className={styles.formGroup}>
                    <ImageUpload
                        label={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                メイン画像 * <ImageLocationGuide type="hero" />
                            </span>
                        }
                        value={formData.heroImage}
                        onChange={(url) => setFormData({ ...formData, heroImage: url })}
                        onFileSelect={(file) => handleFileSelect('heroImage', file)}
                        helperText="詳細ページのトップに大きく表示される画像"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        ギャラリー画像 (最大3枚) <ImageLocationGuide type="gallery" />
                    </label>
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

                <div className={styles.formGroup} style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    <label className={styles.label} style={{ fontSize: '1.1rem', borderBottom: '2px solid #bae6fd', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#0369a1' }}>掲載期間の設定</label>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>希望掲載期間</label>
                        <select name="listingPeriod" className={styles.select} value={formData.listingPeriod} onChange={handleChange} style={{ width: 'auto' }}>
                            <option value="1day">1日 (イベント当日のみなど)</option>
                            <option value="7days">1週間</option>
                            <option value="1month">1ヶ月</option>
                            <option value="3months">3ヶ月</option>
                            <option value="6months">6ヶ月</option>
                            <option value="12months">12ヶ月</option>
                            <option value="indefinite">無期限</option>
                            <option value="custom">カスタム (日付指定)</option>
                        </select>
                    </div>

                    {formData.listingPeriod === 'custom' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label className={styles.label}>掲載終了日</label>
                            <input type="date" name="listingEndDate" required className={styles.input} value={formData.listingEndDate} onChange={handleChange} style={{ width: 'auto' }} />
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                                ※ 指定した日付の23:59まで掲載されます。
                            </p>
                        </div>
                    )}

                    {formData.listingPeriod === 'indefinite' && (
                        <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', color: '#B45309', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <span>⚠️</span>
                            <span>
                                無期限を選択された場合、掲載終了や情報の更新が必要になった際は、必ず管理者までご連絡ください。
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.buttonGroup} style={{ justifyContent: 'center' }}>
                    <Button type="submit" variant="primary" size="lg" disabled={loading}>
                        プレビューへ進む
                    </Button>
                </div>
            </form>
        </div >
    );
}
