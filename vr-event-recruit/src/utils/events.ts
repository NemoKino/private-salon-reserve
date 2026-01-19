import fs from 'fs';
import path from 'path';
import { Event } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/events.json');

export function getEvents(): Event[] {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return [];
        }
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Failed to read events:', error);
        return [];
    }
}

export function getEventById(id: string): Event | undefined {
    const events = getEvents();
    return events.find(e => e.id === id);
}
