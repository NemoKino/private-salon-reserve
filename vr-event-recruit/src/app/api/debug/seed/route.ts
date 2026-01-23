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
            ),
            (
                'event-expired', 
                '終了したイベント（表示されないはず）', 
                '/images/sample-bar.jpg', 
                '毎週月曜 22:00', 
                'recruiting', 
                ARRAY['Bar', 'Expired'], 
                'このイベントは掲載期間が終了しています。', 
                '{"heroImage": "/images/sample-bar-hero.jpg", "longDescription": "詳細説明文", "requirements": ["条件1"], "schedule": {"text": "毎週月曜 22:00", "type": "weekly", "days": ["Mon"]}, "galleryImages": [], "location": "Expired World", "listingPeriod": "custom", "listingEndDate": "2023-01-01"}'::jsonb, 
                '{"name": "Expired Organizer", "icon": "/images/organizer-icon.jpg", "twitterUrl": "https://twitter.com/expired"}'::jsonb, 
                false
            ),
            (
                'event-deadline-near', 
                '【期限間近】明日終了イベント', 
                '/images/sample-bar.jpg', 
                '単発', 
                'recruiting', 
                ARRAY['Bar', 'Near'], 
                'もうすぐ終わります。', 
                '{"heroImage": "/images/sample-bar-hero.jpg", "longDescription": "詳細", "schedule": {"text": "単発", "type": "oneoff"}, "galleryImages": [], "listingPeriod": "custom", "listingEndDate": "2030-01-02"}'::jsonb, 
                '{"name": "Near Organizer", "icon": "/images/organizer-icon.jpg", "twitterUrl": "https://twitter.com/near"}'::jsonb, 
                false
            ),
            (
                'event-deadline-far', 
                '【期限遠い】来年終了イベント', 
                '/images/sample-bar.jpg', 
                '単発', 
                'recruiting', 
                ARRAY['Bar', 'Far'], 
                'まだまだ続きます。', 
                '{"heroImage": "/images/sample-bar-hero.jpg", "longDescription": "詳細", "schedule": {"text": "単発", "type": "oneoff"}, "galleryImages": [], "listingPeriod": "custom", "listingEndDate": "2031-01-01"}'::jsonb, 
                '{"name": "Far Organizer", "icon": "/images/organizer-icon.jpg", "twitterUrl": "https://twitter.com/far"}'::jsonb, 
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
