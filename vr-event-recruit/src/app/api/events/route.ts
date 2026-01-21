import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Event } from '@/types';
import { getPaginatedEvents } from '@/utils/events';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const keyword = searchParams.get('keyword') || undefined;
        const tags = searchParams.getAll('tags');
        const scheduleType = searchParams.getAll('scheduleType');
        const days = searchParams.getAll('days');
        const onlyRecruiting = searchParams.get('onlyRecruiting') === 'true';
        const sort = (searchParams.get('sort') as 'newest' | 'oldest') || 'newest';

        const result = await getPaginatedEvents({
            page,
            limit,
            keyword,
            tags,
            scheduleType,
            days,
            onlyRecruiting,
            sort
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
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
