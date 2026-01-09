export type EventStatus = 'recruiting' | 'closed' | 'ended';

export interface EventDetail {
    heroImage: string;
    longDescription: string;
    requirements: string[];
    schedule: string;
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
