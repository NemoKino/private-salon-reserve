import Button from '../ui/Button';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    イベントで飾る、
                    <br />
                    <span className={styles.highlight}>VRライフ</span>
                </h1>
                <p className={styles.description}>
                    VRChatで継続開催されているイベントの
                    <br />
                    キャスト・スタッフ募集掲示板
                </p>
                <div className={styles.actions}>
                    <Button href="/list" size="lg">
                        募集中イベントを見る
                    </Button>
                    <Button href="https://docs.google.com/forms" external variant="outline" size="lg">
                        イベントを掲載する
                    </Button>
                </div>
            </div>
            <div className={styles.background} />
        </section>
    );
}
