'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './EventGallery.module.css';

interface EventGalleryProps {
    images: string[];
    title: string;
}

export default function EventGallery({ images, title }: EventGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!images || images.length === 0) {
        return null;
    }

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainDisplay} onClick={openModal} style={{ cursor: 'zoom-in' }}>
                {images.length > 1 && (
                    <button
                        onClick={handlePrev}
                        className={`${styles.navButton} ${styles.prevButton}`}
                        aria-label="Previous image"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}

                <div className={styles.imageWrapper}>
                    <Image
                        src={images[selectedIndex]}
                        alt={`${title} - Image ${selectedIndex + 1}`}
                        fill
                        className={styles.image}
                        priority={selectedIndex === 0}
                        unoptimized={typeof images[selectedIndex] === 'string' && images[selectedIndex].startsWith('blob:')}
                    />
                </div>

                {images.length > 1 && (
                    <button
                        onClick={handleNext}
                        className={`${styles.navButton} ${styles.nextButton}`}
                        aria-label="Next image"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`${styles.thumbnailButton} ${selectedIndex === index ? styles.active : ''}`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className={styles.thumbImage}
                                sizes="80px"
                                unoptimized={typeof img === 'string' && img.startsWith('blob:')}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <button className={styles.modalClose} onClick={closeModal}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className={`${styles.modalNavButton} ${styles.modalPrev}`}
                                    aria-label="Previous image"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className={`${styles.modalNavButton} ${styles.modalNext}`}
                                    aria-label="Next image"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}

                        <div className={styles.modalImageWrapper}>
                            <Image
                                src={images[selectedIndex]}
                                alt={`${title} - Large View`}
                                fill
                                className={styles.modalImage}
                                unoptimized={typeof images[selectedIndex] === 'string' && images[selectedIndex].startsWith('blob:')}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
