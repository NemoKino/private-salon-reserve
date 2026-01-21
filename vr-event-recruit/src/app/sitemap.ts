import { MetadataRoute } from 'next';
import { getEvents } from '@/utils/events';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const events = await getEvents();

    // Static routes
    const routes = [
        '',
        '/list',
        '/organizer',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic event routes
    const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: new Date(), // Ideally this would be event.updated_at
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...routes, ...eventRoutes];
}
