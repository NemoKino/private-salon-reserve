import Button from '../ui/Button';
import styles from './Hero.module.css';
import CyberBackground from './CyberBackground';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    イベントで彩る、
                    <br />
                    <span className={styles.highlight}>VRライフ</span>
                </h1>
                <p className={styles.description}>
                    VRChatイベントの
                    <br />
                    キャスト・スタッフ募集掲示板
                </p>
                <div className={styles.actions}>
                    <Button href="/list" size="lg">
                        募集中イベントを見る
                    </Button>
                    <Button href="/organizer" variant="secondary" size="lg">
                        イベント掲載について
                    </Button>
                </div>
            </div>
            <CyberBackground />
        </section>
    );
}
