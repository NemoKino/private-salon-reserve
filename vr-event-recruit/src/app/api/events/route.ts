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

// GET: List all events
export async function GET() {
    try {
        const events = getEvents();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
    }
}

// POST: Add new event
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const events = getEvents();

        // Simple validation or default values could go here
        const newEvent: Event = {
            id: `event-${Date.now()}`, // Generate simple ID
            ...body,
            isFeaturedTop: body.isFeaturedTop || false,
        };

        const updatedEvents = [...events, newEvent];
        fs.writeFileSync(dataFilePath, JSON.stringify(updatedEvents, null, 2), 'utf8');

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error saving event:', error);
        return NextResponse.json({ error: 'Failed to save event' }, { status: 500 });
    }
}
