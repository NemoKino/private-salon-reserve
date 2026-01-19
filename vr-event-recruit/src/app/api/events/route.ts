import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Event } from '@/types';

// GET: List all events
export async function GET() {
    try {
        // Prevent caching for real-time updates
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

// POST: Add new event
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Simple ID generation (could use UUID)
        const id = `event-${Date.now()}`;
        const isFeaturedTop = body.isFeaturedTop || false;

        await sql`
            INSERT INTO events (id, title, thumbnail, frequency, status, tags, description, detail, organizer, is_featured_top)
            VALUES (
                ${id}, 
                ${body.title}, 
                ${body.thumbnail}, 
                ${body.frequency}, 
                ${body.status}, 
                ${body.tags}, 
                ${body.description}, 
                ${body.detail}::jsonb, 
                ${body.organizer}::jsonb, 
                ${isFeaturedTop}
            )
        `;

        const newEvent: Event = {
            id,
            ...body,
            isFeaturedTop,
        };

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error saving event:', error);
        return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
    }
}
