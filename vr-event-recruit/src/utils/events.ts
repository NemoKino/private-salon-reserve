import { sql } from '@/lib/db';
import { Event } from '@/types';

export async function getEvents(): Promise<Event[]> {
    try {
        const { rows } = await sql`SELECT * FROM events ORDER BY created_at DESC`;
        return rows.map((row: any) => ({
            id: row.id,
            title: row.title,
            thumbnail: row.thumbnail,
            frequency: row.frequency,
            status: row.status,
            tags: row.tags,
            description: row.description,
            detail: row.detail,
            organizer: row.organizer,
            isFeaturedTop: row.is_featured_top,
        }));
    } catch (error) {
        console.error('Failed to read events:', error);
        return [];
    }
}

export async function getEventById(id: string): Promise<Event | undefined> {
    try {
        const { rows } = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (rows.length === 0) return undefined;

        const row = rows[0];
        return {
            id: row.id,
            title: row.title,
            thumbnail: row.thumbnail,
            frequency: row.frequency,
            status: row.status,
            tags: row.tags,
            description: row.description,
            detail: row.detail,
            organizer: row.organizer,
            isFeaturedTop: row.is_featured_top,
        };
    } catch (error) {
        console.error('Failed to get event by id:', error);
        return undefined;
    }
}
