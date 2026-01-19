'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';
import SearchFilter, { SearchFilters } from './SearchFilter';

interface EventListContainerProps {
    events: Event[];
}

export default function EventListContainer({ events }: EventListContainerProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        keyword: '',
        categories: [],
        schedule: { types: [], days: [] },
        onlyRecruiting: false
    });

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            // 0. Status Filter
            if (filters.onlyRecruiting) {
                if (e.status !== 'recruiting') return false;
            }

            // 1. Keyword Filter
            if (filters.keyword) {
                const searchLower = filters.keyword.toLowerCase();
                const matchesTitle = e.title.toLowerCase().includes(searchLower);
                const matchesDesc = e.description.toLowerCase().includes(searchLower);
                const matchesDetDesc = e.detail.longDescription.toLowerCase().includes(searchLower);
                const matchesTags = e.tags.some(t => t.toLowerCase().includes(searchLower));

                if (!matchesTitle && !matchesDesc && !matchesDetDesc && !matchesTags) {
                    return false;
                }
            }

            // 2. Category Filter (OR logic within categories, AND logic with other filters)
            if (filters.categories.length > 0) {
                const hasCategory = filters.categories.some(cat => e.tags.includes(cat));
                if (!hasCategory) return false;
            }

            // 3. Schedule Type Filter
            if (filters.schedule.types.length > 0) {
                if (!e.detail.schedule.type || !filters.schedule.types.includes(e.detail.schedule.type)) {
                    return false;
                }
            }

            // 4. Day of Week Filter
            if (filters.schedule.days.length > 0) {
                // If event is 'daily', we assume it matches any day filter (matches all days)
                if (e.detail.schedule.type === 'daily') return true;

                const eventDays = e.detail.schedule.days;
                if (!eventDays) return false; // If filter requires days but event has none, exclude

                // If filtering by days, event must match AT LEAST ONE selected day
                const hasDay = filters.schedule.days.some(day => eventDays.includes(day));
                if (!hasDay) return false;
            }

            return true;
        });
    }, [filters, events]);

    return (
        <div className="container mx-auto px-4">
            <SearchFilter onFilterChange={setFilters} />

            <div className="mb-8 flex justify-between items-center">
                <p className="text-slate-500 font-medium">
                    <span className="text-2xl font-bold text-slate-900 mr-2">{filteredEvents.length}</span>
                    件のイベントが見つかりました
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-xl text-slate-400 font-medium">条件に一致するイベントは見つかりませんでした。</p>
                    <p className="text-sm text-slate-400 mt-2">検索条件を変更して再度お試しください。</p>
                </div>
            )}
        </div>
    );
}
