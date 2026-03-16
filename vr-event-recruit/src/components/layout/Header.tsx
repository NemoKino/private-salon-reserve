'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import styles from './Header.module.css';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                    VR Workers
                </Link>

                <button
                    className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
                    <Link href="/list" className={styles.link} onClick={() => setIsOpen(false)}>
                        イベントを探す
                    </Link>
                    <Link href="/organizer" className={styles.link} onClick={() => setIsOpen(false)}>
                        イベントを掲載する
                    </Link>
                    <Link href="/about" className={styles.link} onClick={() => setIsOpen(false)}>
                        このサイトについて
                    </Link>
                    <Link href="/contact" className={styles.link} onClick={() => setIsOpen(false)}>
                        お問い合わせ
                    </Link>
                </nav>
            </div>
        </header>
    );
}
