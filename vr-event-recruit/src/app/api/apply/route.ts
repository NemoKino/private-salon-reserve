import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { eventApplySchema } from '@/lib/validations/eventSchema';

export const dynamic = 'force-dynamic';

// POST: Submit a new event application (Public)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Server-Side Validation
        const result = eventApplySchema.safeParse(body);

        if (!result.success) {
            // Return validation errors
            return NextResponse.json(
                {
                    error: 'Validation Failed',
                    details: result.error.format()
                },
                { status: 400 }
            );
        }

        const data = result.data; // Type-safe data

        // Simple ID generation
        const id = `event-${Date.now()}`;

        // Force status to 'draft' until verified
        const status = 'draft';
        // Force isFeaturedTop to false
        const isFeaturedTop = false;

        // Use validated data for insertion
        await sql`
            INSERT INTO events (id, title, thumbnail, frequency, status, tags, description, detail, organizer, is_featured_top)
            VALUES (
                ${id}, 
                ${data.title}, 
                ${data.thumbnail}, 
                ${data.frequency}, 
                ${status}, 
                ${JSON.stringify(data.tags)}, 
                ${data.description}, 
                ${JSON.stringify({
                heroImage: data.heroImage,
                longDescription: data.longDescription,
                requirements: data.requirementsText ? data.requirementsText.split('\n') : [],
                schedule: {
                    text: data.frequency,
                    type: data.scheduleType,
                    days: data.scheduleDays,
                    time: data.scheduleTime,
                    timeEnd: data.scheduleTimeEnd,
                    dateOfMonth: data.scheduleDate,
                },
                galleryImages: data.galleryImages.filter((url: string) => url !== ''),
                listingPeriod: data.listingPeriod,
                listingEndDate: data.listingEndDate
            })}::jsonb, 
                ${JSON.stringify({
                name: data.organizerName,
                icon: '/images/organizer-icon.jpg',
                twitterUrl: `https://twitter.com/${data.twitterId.replace('@', '')}`
            })}::jsonb, 
                ${isFeaturedTop}
            )
        `;

        const newEvent = {
            id,
            ...data,
            status,
            isFeaturedTop,
        };

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }
}
