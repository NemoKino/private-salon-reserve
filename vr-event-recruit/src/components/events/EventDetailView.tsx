import Image from 'next/image';
import Link from 'next/link';
import ShareButtons from '@/components/events/ShareButtons';
import EventGallery from '@/components/events/EventGallery';
import Button from '@/components/ui/Button';
import { Event } from '@/types';
import styles from './EventDetailView.module.css';

interface EventDetailViewProps {
    event: Event;
    isPreview?: boolean;
}

export default function EventDetailView({ event, isPreview = false }: EventDetailViewProps) {
    const getTwitterId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:twitter\.com|x\.com)\/([^/?]+)/);
        return match ? match[1] : null;
    };

    const twitterId = getTwitterId(event.organizer.twitterUrl);
    const isDefaultIcon = event.organizer.icon === '/images/organizer-icon.jpg';

    // Use unavatar if we have a Twitter ID and the current icon is the default placeholder
    const displayIcon = (twitterId && isDefaultIcon)
        ? `https://unavatar.io/twitter/${twitterId}`
        : event.organizer.icon;

    return (
        <div className={styles.container}>
            {/* Cover Image */}
            <div className={styles.coverWrapper}>
                {event.detail.heroImage ? (
                    <Image
                        src={event.detail.heroImage}
                        alt={event.title}
                        fill
                        className={styles.coverImage}
                        priority={!isPreview}
                        unoptimized={typeof event.detail.heroImage === 'string' && event.detail.heroImage.startsWith('blob:')}
                    />
                ) : (
                    <div className={styles.coverPlaceholder} />
                )}
                <div className={styles.coverOverlay}>
                    <div className={`container ${styles.headerContent}`}>
                        <div className={styles.headerText}>
                            <div className={styles.tags}>
                                <span className={styles.statusBadge}>{event.frequency}</span>
                                {event.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                            </div>
                            <h1 className={styles.title}>{event.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`container ${styles.layout}`}>
                {/* Main Content */}
                <div className={styles.contentColumn}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>イベントについて</h2>

                        {/* Gallery */}
                        <div className="mb-6">
                            <EventGallery
                                images={(event.detail.galleryImages || []).filter(Boolean)}
                                title={event.title}
                            />
                        </div>

                        <p className={styles.text}>{event.detail.longDescription}</p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>募集要項</h2>
                        <ul className={styles.requirementsList}>
                            {event.detail.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>開催情報</h2>
                        <dl className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <dt>開催日時</dt>
                                <dd>{event.detail.schedule.text}</dd>
                            </div>

                        </dl>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>主催者・お問い合わせ</h2>
                        <div className={styles.organizerCard}>
                            {event.organizer.icon && (
                                <Image
                                    src={displayIcon}
                                    alt={event.organizer.name}
                                    width={64}
                                    height={64}
                                    className={styles.organizerIcon}
                                    unoptimized={typeof displayIcon === 'string' && (displayIcon.startsWith('blob:') || displayIcon.startsWith('https://unavatar.io'))}
                                />
                            )}
                            <div>
                                <div className={styles.organizerName}>{event.organizer.name}</div>
                                {event.organizer.twitterUrl && (
                                    <a
                                        href={event.organizer.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.twitterLink}
                                    >
                                        @{event.organizer.twitterUrl.split('/').pop()}
                                    </a>
                                )}
                            </div>
                        </div>
                        {!isPreview && <ShareButtons title={event.title} />}
                    </section>
                </div>

                {/* Sidebar CTA */}
                <aside className={styles.sidebar}>
                    <div className={styles.stickyCard}>
                        <h3 className={styles.ctaTitle}>キャストに応募する</h3>
                        <p className={styles.ctaDesc}>
                            応募・お問い合わせは主催者のTwitter（DM）へご連絡ください。
                        </p>
                        <Button
                            href={event.organizer.twitterUrl || '#'}
                            external
                            size="lg"
                            className={styles.ctaButton}
                            disabled={!event.organizer.twitterUrl}
                        >
                            X (Twitter) で連絡する
                        </Button>
                    </div>
                </aside>
            </div>

            {/* Mobile Sticky CTA */}
            <div className={styles.mobileCta}>
                <Button
                    href={event.organizer.twitterUrl || '#'}
                    external
                    size="md"
                    className={styles.ctaButton}
                    disabled={!event.organizer.twitterUrl}
                >
                    X (Twitter) で連絡する
                </Button>
            </div>
        </div>
    );
}
