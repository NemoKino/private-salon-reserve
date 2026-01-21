import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata = {
    title: 'イベント掲載について | VR CAST LINK',
    description: 'VR CAST LINKへのイベント掲載方法と流れ',
};

export default function OrganizerPage() {
    return (
        <>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>イベント掲載の流れ</h1>

                <div className={styles.stepList}>
                    {/* STEP 1 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 1</div>
                        <h2 className={styles.stepTitle}>お問い合わせ・掲載依頼</h2>
                        <p className={styles.stepText}>
                            以下の「掲載依頼フォーム」より、イベントの掲載依頼をお送りください。<br />
                            必要な画像やイベント詳細情報を入力していただきます。
                        </p>
                        <div className={styles.buttonWrapper}>
                            <Button href="/apply" size="lg" variant="primary">
                                掲載依頼フォームへ進む
                            </Button>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 2</div>
                        <h2 className={styles.stepTitle}>審査・合否のご連絡</h2>
                        <p className={styles.stepText}>
                            ご入力いただいた内容を管理者が確認し、掲載の可否を審査いたします。<br />
                            <br />
                            <strong>審査結果（合否）は、管理用アカウントからX (Twitter) のDMにてご連絡いたします。</strong><br />
                            DMを受け取れるよう、以下の管理用アカウントのフォローを推奨しています。
                        </p>
                        <div className={styles.buttonWrapper}>
                            <Button
                                href="https://x.com/vr_cast_link"
                                external
                                variant="secondary"
                                size="lg"
                                style={{ backgroundColor: '#000', color: '#fff', border: 'none' }}
                            >
                                𝕏 をフォロー
                            </Button>
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 3</div>
                        <h2 className={styles.stepTitle}>キャスト募集・採用</h2>
                        <p className={styles.stepText}>
                            募集を開始すると、希望者から主催者様のX (Twitter) DMへ直接連絡が入ります。<br />
                            面接や採用の合否については、主催者様と応募者様の間で直接やり取りを進めてください。
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
