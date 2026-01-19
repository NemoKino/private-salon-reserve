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

    if (!images || images.length === 0) {
        return null;
    }

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainDisplay}>
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
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
