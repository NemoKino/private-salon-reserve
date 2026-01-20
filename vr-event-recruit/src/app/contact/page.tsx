import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import styles from './page.module.css';

export const metadata = {
    title: 'お問い合わせ | VR CAST LINK',
    description: 'VR CAST LINKへのお問い合わせ',
};

export default function ContactPage() {
    // User's Twitter DM URL
    const twitterUrl = "https://x.com/vr_cast_link";

    return (
        <>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>お問い合わせ</h1>

                <div className={styles.card}>
                    <p className={styles.text}>
                        当サイトに関するご質問、ご要望は、<br />
                        管理用アカウントのX (Twitter) DMまでお気軽にご連絡ください。
                    </p>

                    <div className={styles.buttonWrapper}>
                        <Button href={twitterUrl} external size="lg" variant="primary">
                            管理用アカウントへ連絡する
                        </Button>
                    </div>
                </div>

                <div className={styles.faqSection}>
                    <h2 className={styles.faqTitle}>よくある質問</h2>
                    <Accordion items={[
                        {
                            question: 'イベントの掲載方法は？',
                            answer: '「イベント掲載について」のページをご覧ください。\n専用のGoogleフォームより掲載依頼をお送りいただき、内容確認後に掲載となります。'
                        },
                        {
                            question: '掲載期間やキャンセルについては？',
                            answer: '原則として掲載期間に定めはなく、自動的に削除されることはありません。\n掲載終了をご希望の場合は、管理用アカウント（@vr_cast_link）までDMにてご連絡いただければ、速やかに取り下げを行います。'
                        },
                        {
                            question: '自分のイベントが勝手に掲載されているのですが',
                            answer: '申し訳ございません。イベント主催者様ご本人より管理用アカウントへDMにてご連絡ください。\nご本人確認ができ次第、直ちに削除対応させていただきます。当サイトはVRChatイベントの活性化を目的としておりますが、主催者様の意向を最優先いたします。'
                        },
                        {
                            question: 'トラブルが発生した場合は？',
                            answer: '当サイトを介した応募や、その後のDMでのやり取り等で生じた利用者間のトラブルにつきましては、当サイトでは一切の責任を負いかねます。\nトラブル等は当事者間での解決をお願いいたします。'
                        }
                    ]} />
                </div>
            </main>
            <Footer />
        </>
    );
}
