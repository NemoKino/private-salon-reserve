import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { eventApplySchema } from '@/lib/validations/eventSchema';
import { sendAdminNotification } from '@/lib/mail';

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

        // Format tags for Postgres array (text[])
        const tagsArrayLiteral = `{${data.tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(',')}}`;

        // Use validated data for insertion
        await sql`
            INSERT INTO events (id, title, thumbnail, frequency, status, tags, description, detail, organizer, is_featured_top)
            VALUES (
                ${id}, 
                ${data.title}, 
                ${data.thumbnail}, 
                ${data.frequency}, 
                ${status}, 
                ${tagsArrayLiteral}, 
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
                location: 'VRChat',
                listingPeriod: data.listingPeriod,
                listingEndDate: data.listingEndDate
            })}::jsonb, 
                ${JSON.stringify({
                name: data.organizerName,
                icon: '/images/organizer-icon.jpg',
                twitterUrl: `https://x.com/${data.twitterId.replace('@', '')}`
            })}::jsonb, 
                ${isFeaturedTop}
            )
        `;

        // Send Email Notification to Admin (Async)
        sendAdminNotification({
            title: data.title,
            organizerName: data.organizerName,
            twitterId: data.twitterId,
        }).catch(err => console.error('Email notification background error:', err));

        const newEvent = {
            id,
            ...data,
            status,
            isFeaturedTop,
        };

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('CRITICAL: Error saving application:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ 
            error: 'Failed to save application',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
