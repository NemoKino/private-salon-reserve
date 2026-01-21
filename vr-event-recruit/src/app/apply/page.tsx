'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicEventForm from '@/components/public/PublicEventForm';
import styles from './page.module.css';

export default function ApplyPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert('掲載申請を受け付けました！\n確認メール等はありませんので、完了までお待ちください。');
                router.push('/');
            } else {
                alert('エラーが発生しました');
            }
        } catch (error) {
            console.error(error);
            alert('通信エラーが発生しました');
        }
    };

    return (
        <>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>イベント掲載申請</h1>
                <p className={styles.description}>
                    以下のフォームに必要事項を入力して申請してください。<br />
                    内容を確認後、問題がなければ数日以内に掲載されます。
                </p>
                <div className={styles.formWrapper}>
                    <PublicEventForm onSubmit={handleSubmit} />
                </div>
            </main>
            <Footer />
        </>
    );
}
