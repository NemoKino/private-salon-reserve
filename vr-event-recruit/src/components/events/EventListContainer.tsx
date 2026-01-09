'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';
import Button from '../ui/Button';

interface EventListContainerProps {
    events: Event[];
}

export default function EventListContainer({ events }: EventListContainerProps) {
    const [filter, setFilter] = useState<'all' | 'recruiting'>('all');

    const filteredEvents = useMemo(() => {
        if (filter === 'recruiting') {
            return events.filter((e) => e.status === 'recruiting');
        }
        return events;
    }, [filter, events]);

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <p className="subtitle">{filteredEvents.length} events found</p>
                <div className="flex gap-md">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        すべて
                    </Button>
                    <Button
                        variant={filter === 'recruiting' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('recruiting')}
                    >
                        募集中のみ
                    </Button>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center" style={{ padding: '4rem 0' }}>
                    <p className="subtitle">条件に一致するイベントは見つかりませんでした。</p>
                </div>
            )}
        </div>
    );
}
