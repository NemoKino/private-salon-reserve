import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        thumbnail TEXT,
        frequency TEXT,
        status TEXT,
        tags TEXT[],
        description TEXT,
        detail JSONB,
        organizer JSONB,
        is_featured_top BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        return NextResponse.json({ message: 'Table created successfully' });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
