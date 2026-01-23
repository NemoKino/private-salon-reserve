export type EventStatus = 'recruiting' | 'closed' | 'ended' | 'pending' | 'draft';

export type ScheduleType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'oneoff' | 'irregular' | 'other';
export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface EventDetail {
    heroImage: string;
    longDescription: string;
    requirements: string[];
    schedule: {
        text: string;
        type: ScheduleType;
        days?: DayOfWeek[];
        dateOfMonth?: number;
        time?: string; // HH:mm
        timeEnd?: string; // HH:mm
    };
    galleryImages?: string[];
    location?: string;
    listingPeriod?: '1day' | '7days' | '1month' | '3months' | '6months' | '12months' | 'indefinite' | 'custom';
    listingEndDate?: string; // YYYY-MM-DD
}

export interface Organizer {
    name: string;
    icon: string;
    twitterUrl: string;
}

export interface Event {
    id: string;
    title: string;
    thumbnail: string;
    frequency: string;
    status: EventStatus;
    tags: string[];
    description: string;
    detail: EventDetail;
    organizer: Organizer;
    isFeaturedTop: boolean;
}
