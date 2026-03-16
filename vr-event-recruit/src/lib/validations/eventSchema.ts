import { z } from 'zod';

// Helper for image URLs (basic check)
const urlSchema = z.string().url().max(500);

export const eventApplySchema = z.object({
    // 1. Basic Information
    title: z.string().min(1, 'イベント名は必須です').max(100, 'イベント名は100文字以内で入力してください'),
    organizerName: z.string().min(1, '主催者名は必須です').max(50, '主催者名は50文字以内で入力してください'),
    twitterId: z.string().min(1, 'Twitter IDは必須です').max(16, 'Twitter IDは16文字以内で入力してください').regex(/^@?[a-zA-Z0-9_]+$/, 'Twitter IDは半角英数字とアンダースコアのみ使用できます'),

    // 2. Descriptions
    description: z.string().min(1, '簡易説明は必須です').max(200, '簡易説明は200文字以内で入力してください'),
    longDescription: z.string().min(1, '詳細説明は必須です').max(3000, '詳細説明は3000文字以内で入力してください'),
    requirementsText: z.string().max(2000, '参加条件が長すぎます').optional(), // Assuming it comes as a string from the form, or array? Checking PublicEventForm.. it sends `requirements` as array in `detail`, but here we validate request body structure.

    // 3. Images
    thumbnail: urlSchema,
    heroImage: urlSchema,
    galleryImages: z.array(z.string().url().or(z.literal(''))).max(10, 'ギャラリー画像は最大10枚までです'), // Allow empty strings if form sends them, or filter before? usage: filter(url => url.length > 0) in form.

    // 4. Schedule & Classification
    frequency: z.string().min(1, '頻度は必須です'),
    scheduleType: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'oneoff', 'irregular', 'other']),
    scheduleDays: z.array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])),
    scheduleTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '有効な時間形式(HH:MM)で入力してください'),
    scheduleTimeEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '有効な時間形式(HH:MM)で入力してください').or(z.literal('')),
    scheduleDate: z.number().min(1).max(31).nullable(),

    // Listing Period
    listingPeriod: z.enum(['1day', '7days', '1month', '3months', '6months', '12months', 'indefinite', 'custom']),
    listingEndDate: z.string().optional(), // Date string validation could be added if strict

    tags: z.array(z.string().max(20, 'タグは20文字以内で入力してください')).max(10, 'タグは最大10個までです'),
});
