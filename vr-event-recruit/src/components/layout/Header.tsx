import Link from 'next/link';
import Button from '../ui/Button';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.logo}>
                    VR Event Recruit
                </Link>
                <nav className={styles.nav}>
                    <Link href="/list" className={styles.link}>
                        イベントを探す
                    </Link>
                    <Button href="https://docs.google.com/forms" external size="sm" variant="ghost">
                        主催者の方へ
                    </Button>
                </nav>
            </div>
        </header>
    );
}
