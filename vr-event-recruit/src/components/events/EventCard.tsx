import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import styles from './EventCard.module.css';

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <Link href={`/events/${event.id}`} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
                <div className={styles.thumbnailPlaceholder}>
                    {/* Fallback color if image fails or while loading, but using Image component */}
                </div>
                <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.statusBadge}>{event.frequency}</div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{event.title}</h3>
                <div className={styles.tags}>
                    {event.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
                <p className={styles.description}>{event.description}</p>
            </div>
        </Link>
    );
}
