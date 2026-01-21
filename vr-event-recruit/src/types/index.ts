export type EventStatus = 'recruiting' | 'closed' | 'ended' | 'pending';

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
    };
    galleryImages?: string[];
    location: string;
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
