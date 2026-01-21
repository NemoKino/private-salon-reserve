import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Event } from '@/types';

export const dynamic = 'force-dynamic';

// GET: List ALL events (for Admin) - Protected by middleware
export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM events ORDER BY created_at DESC`;

        const events: Event[] = rows.map((row: any) => ({
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

        return NextResponse.json(events);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
