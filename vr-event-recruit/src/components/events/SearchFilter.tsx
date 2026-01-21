'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScheduleType, DayOfWeek } from '@/types';
import Button from '../ui/Button';
import styles from './SearchFilter.module.css';
import TagInput from '../ui/TagInput';
import SortSelect from '../ui/SortSelect';

interface SearchFilterProps {
    onFilterChange: (filters: SearchFilters) => void;
    popularTags: string[];
}

export interface SearchFilters {
    keyword: string;
    tags: string[];
    schedule: {
        types: ScheduleType[];
        days: DayOfWeek[];
    };
    onlyRecruiting: boolean;
    sort: 'newest' | 'oldest';
}

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

export default function SearchFilter({ onFilterChange, popularTags }: SearchFilterProps) {
    const [keyword, setKeyword] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [selectedScheduleTypes, setSelectedScheduleTypes] = useState<ScheduleType[]>([]);
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
    const [onlyRecruiting, setOnlyRecruiting] = useState(false);
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

    // Debounce filter updates
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({
                keyword,
                tags,
                schedule: {
                    types: selectedScheduleTypes,
                    days: selectedDays,
                },
                onlyRecruiting,
                sort,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [keyword, tags, selectedScheduleTypes, selectedDays, onlyRecruiting, sort, onFilterChange]);

    const handleTagClick = (selectedTag: string) => {
        setTags(prev =>
            prev.includes(selectedTag)
                ? prev.filter(t => t !== selectedTag)
                : [...prev, selectedTag]
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
            {/* Top Row: Keyword & Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className={`${styles.section} flex-1`}>
                    <label className={styles.label}>キーワード検索</label>
                    <input
                        type="text"
                        placeholder="イベント名、説明文から検索..."
                        className={styles.input}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className={styles.section} style={{ minWidth: '180px' }}>
                    <label className={styles.label}>並び替え</label>
                    <SortSelect
                        value={sort}
                        onChange={(val) => setSort(val as 'newest' | 'oldest')}
                        options={[
                            { value: 'newest', label: '新着順' },
                            { value: 'oldest', label: '登録が古い順' }
                        ]}
                    />
                </div>
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

            {/* Tag Search */}
            <div className={styles.section}>
                <label className={styles.label}>タグ検索</label>
                <div style={{ marginBottom: '0.75rem' }}>
                    <TagInput
                        value={tags}
                        onChange={setTags}
                        placeholder="タグを入力..."
                    />
                </div>
                {popularTags.length > 0 && (
                    <div>
                        <p className={styles.label} style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>人気のタグ</p>
                        <div className={styles.chipGroup}>
                            {popularTags.map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleTagClick(t)}
                                    className={`${styles.chip} ${tags.includes(t) ? styles.active : ''}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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
