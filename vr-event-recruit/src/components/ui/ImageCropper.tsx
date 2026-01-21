'use client';

import { useState } from 'react';
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
        } finally {
            setLoading(false);
        }
    };

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
