import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Event } from '@/types';

export const dynamic = 'force-dynamic';

// POST: Submit a new event application (Public)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Simple ID generation
        const id = `event-${Date.now()}`;

        // Force status to 'pending'
        const status = 'pending';
        // Force isFeaturedTop to false
        const isFeaturedTop = false;

        await sql`
            INSERT INTO events (id, title, thumbnail, frequency, status, tags, description, detail, organizer, is_featured_top)
            VALUES (
                ${id}, 
                ${body.title}, 
                ${body.thumbnail}, 
                ${body.frequency}, 
                ${status}, 
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
            status,
            isFeaturedTop,
        };

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }
}
