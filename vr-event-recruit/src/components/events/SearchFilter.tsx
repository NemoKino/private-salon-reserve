'use client';

import { useState, useEffect } from 'react';
import { ScheduleType, DayOfWeek } from '@/types';
import Button from '../ui/Button';
import styles from './SearchFilter.module.css';

interface SearchFilterProps {
    onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    keyword: string;
    categories: string[];
    schedule: {
        types: ScheduleType[];
        days: DayOfWeek[];
    };
    onlyRecruiting: boolean;
}

const CATEGORIES = [
    { label: 'Bar', value: 'Bar' },
    { label: 'Club', value: 'Club' },
    { label: 'RP', value: 'RP' },
    { label: '初心者歓迎', value: '初心者歓迎' },
];

const SCHEDULE_TYPES: { label: string; value: ScheduleType }[] = [
    { label: '毎日', value: 'daily' },
    { label: '毎週', value: 'weekly' },
    { label: '隔週', value: 'biweekly' },
    { label: '毎月', value: 'monthly' },
    { label: '単発', value: 'oneoff' },
    { label: '不定期', value: 'irregular' },
    { label: 'その他', value: 'other' },
];

const DAYS_OF_WEEK: { label: string; value: DayOfWeek }[] = [
    { label: '月', value: 'Mon' },
    { label: '火', value: 'Tue' },
    { label: '水', value: 'Wed' },
    { label: '木', value: 'Thu' },
    { label: '金', value: 'Fri' },
    { label: '土', value: 'Sat' },
    { label: '日', value: 'Sun' },
];

export default function SearchFilter({ onFilterChange }: SearchFilterProps) {
    const [keyword, setKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedScheduleTypes, setSelectedScheduleTypes] = useState<ScheduleType[]>([]);
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
    const [onlyRecruiting, setOnlyRecruiting] = useState(false);

    // Debounce filter updates
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({
                keyword,
                categories: selectedCategories,
                schedule: {
                    types: selectedScheduleTypes,
                    days: selectedDays,
                },
                onlyRecruiting,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [keyword, selectedCategories, selectedScheduleTypes, selectedDays, onlyRecruiting, onFilterChange]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleScheduleType = (type: ScheduleType) => {
        setSelectedScheduleTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleDay = (day: DayOfWeek) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className={styles.container}>
            {/* Keyword Search */}
            <div className={styles.section}>
                <label className={styles.label}>キーワード検索</label>
                <input
                    type="text"
                    placeholder="イベント名、タグ、説明文から検索..."
                    className={styles.input}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* Status Filter */}
            <div className={styles.section}>
                <label className={styles.checkboxWrapper}>
                    <input
                        type="checkbox"
                        checked={onlyRecruiting}
                        onChange={(e) => setOnlyRecruiting(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                    />
                    募集中のみ表示
                </label>
            </div>

            {/* Category Filter */}
            <div className={styles.section}>
                <label className={styles.label}>カテゴリ (タグ)</label>
                <div className={styles.chipGroup}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => toggleCategory(cat.value)}
                            className={`${styles.chip} ${selectedCategories.includes(cat.value) ? styles.active : ''}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schedule Filter */}
            <div>
                <label className={styles.label}>開催頻度</label>
                <div className={styles.chipGroup}>
                    {SCHEDULE_TYPES.map(type => (
                        <button
                            key={type.value}
                            onClick={() => toggleScheduleType(type.value)}
                            className={`${styles.chip} ${selectedScheduleTypes.includes(type.value) ? styles.activeSchedule : ''}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Day Selection - Show only for Weekly or Biweekly */}
                <div className={`${styles.daysSection} ${(selectedScheduleTypes.includes('weekly') || selectedScheduleTypes.includes('biweekly')) ? styles.visible : ''}`}>
                    <div className={styles.daysContainer}>
                        <p className={styles.label} style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>曜日を選択</p>
                        <div className={styles.chipGroup}>
                            {DAYS_OF_WEEK.map(day => (
                                <button
                                    key={day.value}
                                    onClick={() => toggleDay(day.value)}
                                    className={`${styles.dayChip} ${selectedDays.includes(day.value) ? styles.active : ''}`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
