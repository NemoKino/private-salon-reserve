'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ value = [], onChange, placeholder = 'タグを入力...' }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch tags on mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('/api/tags');
                if (res.ok) {
                    const data = await res.json();
                    setAllTags(data);
                }
            } catch (error) {
                console.error('Failed to fetch tags', error);
            }
        };
        fetchTags();
    }, []);

    // Filter suggestions
    useEffect(() => {
        if (!inputValue.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = allTags.filter(tag =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(tag)
        );
        setSuggestions(filtered);
        setActiveSuggestionIndex(-1);
    }, [inputValue, allTags, value]);

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tag: string) => {
        const newTag = tag.trim();
        if (newTag && !value.includes(newTag)) {
            onChange([...value, newTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (index: number) => {
        const newTags = [...value];
        newTags.splice(index, 1);
        onChange(newTags);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                addTag(suggestions[activeSuggestionIndex]);
            } else if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const renderSuggestion = (tag: string) => {
        const matchIndex = tag.toLowerCase().indexOf(inputValue.toLowerCase());
        if (matchIndex === -1) return tag;

        const before = tag.slice(0, matchIndex);
        const match = tag.slice(matchIndex, matchIndex + inputValue.length);
        const after = tag.slice(matchIndex + inputValue.length);

        return (
            <>
                {before}
                <span className={styles.match}>{match}</span>
                {after}
            </>
        );
    };

    return (
        <div className={styles.container} ref={containerRef} onClick={() => document.getElementById('tag-input-field')?.focus()}>
            {value.map((tag, index) => (
                <div key={`${tag}-${index}`} className={styles.chip}>
                    <span>{tag}</span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(index); }}
                        className={styles.removeButton}
                    >
                        ×
                    </button>
                </div>
            ))}
            <input
                id="tag-input-field"
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder={value.length === 0 ? placeholder : ''}
                autoComplete="off"
            />

            {showSuggestions && (inputValue || suggestions.length > 0) && (
                <ul className={styles.suggestions}>
                    {/* Show explicit "Add [Input]" option if input doesn't match any existing tag exactly */}
                    {inputValue.trim() && !allTags.includes(inputValue.trim()) && !value.includes(inputValue.trim()) && (
                        <li
                            className={`${styles.suggestionItem} ${activeSuggestionIndex === -1 ? styles.active : ''}`}
                            onClick={() => addTag(inputValue)}
                        >
                            Enter (改行) でタグを追加: <strong>{inputValue}</strong>
                        </li>
                    )}

                    {suggestions.map((tag, index) => (
                        <li
                            key={tag}
                            className={`${styles.suggestionItem} ${index === activeSuggestionIndex ? styles.active : ''}`}
                            onClick={() => addTag(tag)}
                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                            {renderSuggestion(tag)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
