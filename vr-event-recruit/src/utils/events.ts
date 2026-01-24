import { sql } from '@/lib/db';
import { Event } from '@/types';

export async function getPopularTags(): Promise<string[]> {
    try {
        // Efficient tag counting using unnest
        const { rows } = await sql`
            SELECT tag, COUNT(*) as count
            FROM (
                SELECT unnest(tags) as tag FROM events WHERE status != 'pending' AND status != 'draft'
            ) t
            GROUP BY tag
            ORDER BY count DESC
            LIMIT 10
        `;
        return rows.map((row: any) => row.tag);
    } catch (error) {
        console.error('Failed to get popular tags:', error);
        return [];
    }
}

export async function getEvents(): Promise<Event[]> {
    try {
        const { rows } = await sql`SELECT * FROM events WHERE status != 'pending' AND status != 'draft' ORDER BY created_at DESC`;
        return rows.map((row: any) => ({
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
        }));
    } catch (error) {
        console.error('Failed to read events:', error);
        return [];
    }
}

export async function getEventById(id: string): Promise<Event | undefined> {
    try {
        const { rows } = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (rows.length === 0) return undefined;

        const row = rows[0];
        return {
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
    } catch (error) {
        console.error('Failed to get event by id:', error);
        return undefined;
    }
}

export interface GetEventsOptions {
    page?: number;
    limit?: number;
    keyword?: string;
    tags?: string[];
    scheduleType?: string[];
    days?: string[];
    onlyRecruiting?: boolean;
    sort?: 'newest' | 'oldest' | 'deadline';
}

export interface PaginatedResult {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
}

export async function getPaginatedEvents(options: GetEventsOptions): Promise<PaginatedResult> {
    const {
        page = 1,
        limit = 20,
        keyword,
        tags = [],
        scheduleType = [],
        days = [],
        onlyRecruiting = false,
        sort = 'newest'
    } = options;

    const offset = (page - 1) * limit;
    const keywordPattern = keyword ? `%${keyword}%` : null;
    const statusFilter = onlyRecruiting ? 'recruiting' : null;

    const tagsArray = (tags.length > 0 ? tags : null) as any;
    const scheduleTypesArray = (scheduleType.length > 0 ? scheduleType : null) as any;
    const daysArray = (days.length > 0 ? days : null) as any;

    try {
        const { rows } = await sql`
            SELECT * FROM events
            WHERE
                (status != 'pending' AND status != 'draft')
                AND (${statusFilter}::text IS NULL OR status = ${statusFilter})
                AND (
                    (detail->>'listingEndDate') IS NULL 
                    OR (detail->>'listingEndDate') = ''
                    OR (detail->>'listingEndDate')::date >= CURRENT_DATE
                )
                AND (
                    ${keywordPattern}::text IS NULL OR 
                    title ILIKE ${keywordPattern} OR 
                    description ILIKE ${keywordPattern} OR
                    detail->>'longDescription' ILIKE ${keywordPattern}
                )
                AND (${tagsArray}::text[] IS NULL OR tags @> ${tagsArray}::text[])
                AND (${scheduleTypesArray}::text[] IS NULL OR detail->'schedule'->>'type' = ANY(${scheduleTypesArray}::text[]))
                AND (
                    ${daysArray}::text[] IS NULL OR 
                    (detail->'schedule'->'days')::jsonb ?| ${daysArray}::text[] OR
                    detail->'schedule'->>'type' = 'daily'
                )
            ORDER BY
                CASE WHEN ${sort} = 'deadline' THEN (detail->>'listingEndDate')::date END ASC NULLS LAST,
                CASE WHEN ${sort} = 'newest' THEN created_at END DESC,
                CASE WHEN ${sort} = 'oldest' THEN created_at END ASC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const countResult = await sql`
            SELECT COUNT(*) as total FROM events
            WHERE
                (status != 'pending' AND status != 'draft')
                AND (${statusFilter}::text IS NULL OR status = ${statusFilter})
                AND (
                    (detail->>'listingEndDate') IS NULL 
                    OR (detail->>'listingEndDate') = ''
                    OR (detail->>'listingEndDate')::date >= CURRENT_DATE
                )
                AND (
                    ${keywordPattern}::text IS NULL OR 
                    title ILIKE ${keywordPattern} OR 
                    description ILIKE ${keywordPattern} OR
                    detail->>'longDescription' ILIKE ${keywordPattern}
                )
                AND (${tagsArray}::text[] IS NULL OR tags @> ${tagsArray}::text[])
                AND (${scheduleTypesArray}::text[] IS NULL OR detail->'schedule'->>'type' = ANY(${scheduleTypesArray}::text[]))
                AND (
                    ${daysArray}::text[] IS NULL OR 
                    (detail->'schedule'->'days')::jsonb ?| ${daysArray}::text[] OR
                    detail->'schedule'->>'type' = 'daily'
                )
        `;

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        const events: Event[] = rows.map((row: any) => ({
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
        }));

        return {
            events,
            total,
            page,
            totalPages
        };

    } catch (error) {
        console.error('Failed to fetch paginated events:', error);
        return { events: [], total: 0, page, totalPages: 0 };
    }
}
