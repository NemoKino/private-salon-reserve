import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await sql`
            INSERT INTO events (id, title, thumbnail, frequency, status, tags, description, detail, organizer, is_featured_top)
            VALUES 
            (
                'seed-1', 
                'Beginner Bar Event', 
                '/images/sample-bar.jpg', 
                'Weekly', 
                'recruiting', 
                ARRAY['VRChat', 'Bar', 'Beginner'], 
                'A bar for beginners', 
                '{}'::jsonb, 
                '{"name": "Organizer A"}'::jsonb, 
                false
            ),
            (
                'seed-2', 
                'Music Night', 
                '/images/sample-bar.jpg', 
                'Monthly', 
                'recruiting', 
                ARRAY['VRChat', 'Music', 'DJ', 'Live'], 
                'Music event', 
                '{}'::jsonb, 
                '{"name": "Organizer B"}'::jsonb, 
                false
            ),
            (
                'seed-3', 
                'Roleplay Cafe', 
                '/images/sample-bar.jpg', 
                'Weekly', 
                'recruiting', 
                ARRAY['VRChat', 'Roleplay', 'Cafe', 'RP'], 
                'Roleplay cafe event', 
                '{}'::jsonb, 
                '{"name": "Organizer C"}'::jsonb, 
                false
            )
            ON CONFLICT (id) DO NOTHING
        `;

        return NextResponse.json({ message: 'Seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
