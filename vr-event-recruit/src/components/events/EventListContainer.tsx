'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';
import SearchFilter, { SearchFilters } from './SearchFilter';
import Pagination from '../ui/Pagination';

interface EventListContainerProps {
    initialEvents: Event[];
    initialTotal: number;
    popularTags: string[];
}

export default function EventListContainer({ initialEvents, initialTotal, popularTags }: EventListContainerProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [total, setTotal] = useState(initialTotal);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Initial filters state (empty)
    const [filters, setFilters] = useState<SearchFilters>({
        keyword: '',
        tags: [],
        schedule: { types: [], days: [] },
        sort: 'newest'
    });

    // Fetch Events Function
    const fetchEvents = useCallback(async (page: number, currentFilters: SearchFilters) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '20'); // Hardcoded limit for now

            if (currentFilters.keyword) params.set('keyword', currentFilters.keyword);

            currentFilters.tags.forEach(t => params.append('tags', t));
            currentFilters.schedule.types.forEach(t => params.append('scheduleType', t));
            currentFilters.schedule.days.forEach(d => params.append('days', d));

            if (currentFilters.sort) params.set('sort', currentFilters.sort);

            const res = await fetch(`/api/events?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            setEvents(data.events);
            setTotal(data.total);
            setCurrentPage(data.page);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Optionally set error state
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Filter Change Handler (Reset to page 1)
    const handleFilterChange = useCallback((newFilters: SearchFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        fetchEvents(1, newFilters);
    }, [fetchEvents]);

    // Page Change Handler
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchEvents(page, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(total / 20);

    return (
        <div className="container mx-auto px-4">
            <SearchFilter onFilterChange={handleFilterChange} popularTags={popularTags} />

            <div className="mb-8 flex justify-between items-center relative min-h-[40px]">
                <p className="text-slate-500 font-medium">
                    <span className="text-2xl font-bold text-slate-900 mr-2">{total}</span>
                    件のイベントが見つかりました
                </p>
            </div>

            <div className={`grid transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {events.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p className="text-xl text-slate-400 font-medium">条件に一致するイベントは見つかりませんでした。</p>
                    <p className="text-sm text-slate-400 mt-2">検索条件を変更して再度お試しください。</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
