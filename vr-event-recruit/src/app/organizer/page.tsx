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
                            まずは管理者（根本希乃）のX (Twitter) DMにて、イベント掲載希望の旨をご連絡ください。<br />
                            その際、掲載したい「イベント名」を一緒にお知らせいただけるとスムーズです。
                        </p>
                        <div className={styles.templateBox}>
                            【DM送信テンプレート】<br />
                            VR CAST LINKへのイベント掲載を希望します。<br />
                            イベント名：〇〇〇〇
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button href="https://x.com/tmt_massage" external size="lg" variant="primary">
                                X (Twitter) DMを送る
                            </Button>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 2</div>
                        <h2 className={styles.stepTitle}>詳細情報の入力</h2>
                        <p className={styles.stepText}>
                            DMを確認後、管理者よりイベント掲載用の「Googleフォーム」のURLをお送りします。<br />
                            フォームに従って、イベントの画像、詳細、キャストの募集条件などをご入力ください。
                        </p>
                    </div>

                    {/* STEP 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 3</div>
                        <h2 className={styles.stepTitle}>確認・サイト掲載</h2>
                        <p className={styles.stepText}>
                            ご入力いただいた内容を管理者が確認いたします。<br />
                            内容に問題がなければサイトへ掲載し、DMにて掲載完了のご連絡を差し上げます。
                        </p>
                    </div>

                    {/* STEP 4 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>STEP 4</div>
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
