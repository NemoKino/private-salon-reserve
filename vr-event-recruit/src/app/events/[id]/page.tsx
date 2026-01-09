import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import events from '@/data/events.json';
import { Event } from '@/types';
import styles from './page.module.css';

interface Props {
    params: Promise<{ id: string }>;
}

// Generate static params for all events
export async function generateStaticParams() {
    return events.map((event) => ({
        id: event.id,
    }));
}

export default async function EventDetailPage(props: Props) {
    const params = await props.params;
    const event = events.find((e) => e.id === params.id) as Event | undefined;

    if (!event) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Cover Image */}
                <div className={styles.coverWrapper}>
                    <Image
                        src={event.detail.heroImage}
                        alt={event.title}
                        fill
                        className={styles.coverImage}
                        priority
                    />
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
                                    <dd>{event.detail.schedule}</dd>
                                </div>
                                <div className={styles.infoItem}>
                                    <dt>開催場所</dt>
                                    <dd>{event.detail.location}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>主催者・お問い合わせ</h2>
                            <div className={styles.organizerCard}>
                                <Image
                                    src={event.organizer.icon}
                                    alt={event.organizer.name}
                                    width={64}
                                    height={64}
                                    className={styles.organizerIcon}
                                />
                                <div>
                                    <div className={styles.organizerName}>{event.organizer.name}</div>
                                    <a
                                        href={event.organizer.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.twitterLink}
                                    >
                                        @{event.organizer.twitterUrl.split('/').pop()}
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar CTA */}
                    <aside className={styles.sidebar}>
                        <div className={styles.stickyCard}>
                            <h3 className={styles.ctaTitle}>キャストに応募する</h3>
                            <p className={styles.ctaDesc}>
                                応募・お問い合わせは主催者のTwitter（DM）へご連絡ください。
                            </p>
                            <Button href={event.organizer.twitterUrl} external size="lg" className={styles.ctaButton}>
                                X (Twitter) で連絡する
                            </Button>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Mobile Sticky CTA */}
            <div className={styles.mobileCta}>
                <Button href={event.organizer.twitterUrl} external size="md" className={styles.ctaButton}>
                    X (Twitter) で連絡する
                </Button>
            </div>

            <Footer />
        </>
    );
}
