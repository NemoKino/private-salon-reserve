import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/events.json');

// Helper to read events
function getEvents(): Event[] {
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
}

// GET: Get an event by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const events = getEvents();
        const event = events.find(e => e.id === id);

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
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
        const events = getEvents();

        const filteredEvents = events.filter(event => event.id !== id);

        if (events.length === filteredEvents.length) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(filteredEvents, null, 2), 'utf8');

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
        const events = getEvents();

        const index = events.findIndex(e => e.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Merge existing event with updates
        const updatedEvent: Event = {
            ...events[index],
            ...body,
            id: id, // Ensure ID doesn't change
            detail: {
                ...events[index].detail,
                ...body.detail,
                schedule: {
                    ...events[index].detail.schedule,
                    ...body.detail.schedule
                }
            },
            organizer: {
                ...events[index].organizer,
                ...body.organizer
            }
        };

        events[index] = updatedEvent;
        fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), 'utf8');

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}
