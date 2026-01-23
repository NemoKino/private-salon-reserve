import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Update status to 'pending' (Pending Review)
        await sql`
            UPDATE events 
            SET status = 'pending' 
            WHERE id = ${id}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error finalizing event:', error);
        return NextResponse.json({ error: 'Failed to finalize event' }, { status: 500 });
    }
}
