import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all unique tags from the events table
        // Assuming tags is stored as text[] (Postgres array)
        const { rows } = await sql`
            SELECT DISTINCT unnest(tags) as tag 
            FROM events 
            WHERE status != 'pending'
            ORDER BY tag ASC
        `;

        const tags = rows.map((row: any) => row.tag).filter((tag: string) => tag && tag.trim().length > 0);

        return NextResponse.json(tags);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}
