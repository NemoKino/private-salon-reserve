import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.nav}>
                    <Link href="/list" className={styles.link}>イベントを探す</Link>
                    <Link href="/organizer" className={styles.link}>イベントを掲載する</Link>
                    <Link href="/about" className={styles.link}>このサイトについて</Link>
                    <Link href="/terms" className={styles.link}>利用規約</Link>
                    <Link href="/privacy" className={styles.link}>プライバシーポリシー</Link>
                    <Link href="/contact" className={styles.link}>お問い合わせ</Link>
                </div>
                <p className={styles.copy}>
                    &copy; {new Date().getFullYear()} VR Workers. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
