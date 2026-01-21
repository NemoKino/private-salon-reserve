import { notFound } from 'next/navigation';
import ShareButtons from '@/components/events/ShareButtons';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { getEvents, getEventById } from '@/utils/events';
import { Event } from '@/types';
import styles from './page.module.css';
import { getSession } from '@/lib/auth';
import EventDetailView from '@/components/events/EventDetailView';

interface Props {
    params: Promise<{ id: string }>;
}

export const revalidate = 0;
export const dynamicParams = true; // Allow new IDs not generated at build time

// Generate static params for all known events (optional for dynamic but good for existing pages)
export async function generateStaticParams() {
    const events = await getEvents();
    return events.map((event) => ({
        id: event.id,
    }));
}

export async function generateMetadata(props: Props) {
    const params = await props.params;
    const event = await getEventById(params.id);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: event.title,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: [event.detail.heroImage || event.thumbnail],
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description,
            images: [event.detail.heroImage || event.thumbnail],
        },
    };
}

export default async function EventDetailPage(props: Props) {
    const params = await props.params;
    const event = await getEventById(params.id);

    if (!event) {
        notFound();
    }

    // Check if event is pending
    if (event.status === 'pending') {
        const session = await getSession();
        if (!session) {
            notFound();
        }
    }

    return (
        <>
            <Header />
            <EventDetailView event={event} />
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Event',
                        name: event.title,
                        description: event.description,
                        image: event.thumbnail ? [event.thumbnail] : [],
                        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
                        eventStatus: 'https://schema.org/EventScheduled',
                        location: {
                            '@type': 'VirtualLocation',
                            url: (event.detail.location && event.detail.location.startsWith('http')) ? event.detail.location : 'https://vrchat.com',
                        },
                        startDate: (() => {
                            // Quick approximation for demo/MVP. 
                            // Ideally we parse schedule.daily/weekly to next occurrence.
                            // For now, using created_at as a placeholder if no specific date logic exist.
                            // Schema.org requires valid ISO date.
                            return new Date().toISOString();
                        })(),
                        organizer: {
                            '@type': 'Person',
                            name: event.organizer.name,
                            url: event.organizer.twitterUrl,
                        },
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'JPY',
                            availability: 'https://schema.org/InStock',
                        },
                    }),
                }}
            />
        </>
    );
}
