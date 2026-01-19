'use client';

import { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionItemProps {
    question: string;
    answer: string;
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.item}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                {question}
                <svg
                    className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div className={`${styles.contentWrapper} ${isOpen ? styles.contentWrapperOpen : ''}`}>
                <div className={styles.content}>
                    <div className={styles.contentInner}>
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AccordionProps {
    items: { question: string; answer: string }[];
}

export default function Accordion({ items }: AccordionProps) {
    return (
        <div className={styles.container}>
            {items.map((item, index) => (
                <AccordionItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
    );
}
