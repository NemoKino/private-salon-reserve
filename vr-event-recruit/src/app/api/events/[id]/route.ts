import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Event } from '@/types';
import { deleteImage } from '@/lib/cloudinary';

// GET: Get an event by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { rows } = await sql`SELECT * FROM events WHERE id = ${id}`;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const row = rows[0];
        const event: Event = {
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

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}

// DELETE: Remove an event
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Fetch event to get images
        const { rows } = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        const event = rows[0];

        // 2. Delete images from Cloudinary
        const imagesToDelete = [
            event.thumbnail,
            event.detail.heroImage,
            ...(event.detail.galleryImages || [])
        ].filter(url => url && url.includes('cloudinary')); // Only delete cloudinary images

        await Promise.all(imagesToDelete.map(url => deleteImage(url)));

        // 3. Delete from DB
        const { rowCount } = await sql`DELETE FROM events WHERE id = ${id}`;

        if (rowCount === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}

// PUT: Update an event
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // 1. Fetch current event to compare images
        const { rows: currentRows } = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (currentRows.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        const currentEvent = currentRows[0];

        // 2. Identify images to delete (present in current but not in new body)
        const oldImages = [
            currentEvent.thumbnail,
            currentEvent.detail.heroImage,
            ...(currentEvent.detail.galleryImages || [])
        ];

        const newImages = [
            body.thumbnail,
            body.detail.heroImage,
            ...(body.detail.galleryImages || [])
        ];

        const imagesToDelete = oldImages.filter(url =>
            url &&
            url.includes('cloudinary') &&
            !newImages.includes(url)
        );

        // Delete replaced/removed images
        if (imagesToDelete.length > 0) {
            // Don't await this to keep response fast? Or await for safety?
            // Awaiting is safer to avoid unhandled rejections if serverless function freezes.
            await Promise.all(imagesToDelete.map(url => deleteImage(url)));
        }

        const isFeaturedTop = body.isFeaturedTop !== undefined ? body.isFeaturedTop : false;

        const { rowCount } = await sql`
            UPDATE events 
            SET 
                title = ${body.title}, 
                thumbnail = ${body.thumbnail}, 
                frequency = ${body.frequency}, 
                status = ${body.status}, 
                tags = ${body.tags}, 
                description = ${body.description}, 
                detail = ${body.detail}::jsonb, 
                organizer = ${body.organizer}::jsonb, 
                is_featured_top = ${isFeaturedTop}
            WHERE id = ${id}
        `;

        if (rowCount === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Fetch updated event to return
        // Ideally we return from UPDATE ... RETURNING *
        const { rows } = await sql`SELECT * FROM events WHERE id = ${id}`;
        const row = rows[0];
        const updatedEvent: Event = {
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

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}
