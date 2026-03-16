'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicEventForm from '@/components/public/PublicEventForm';
import styles from './page.module.css';

export default function ApplyPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        const res = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            if (res.status === 400) {
                const errorData = await res.json();
                console.error('Validation Error:', errorData);
                // Return structured error message if available
                if (errorData.details) {
                    const fields = Object.keys(errorData.details)
                        .filter(k => k !== '_errors')
                        .join(', ');
                    throw new Error(`入力内容の検証に失敗しました (${fields})。内容を確認してください。`);
                }
            }
            throw new Error('Failed to submit application');
        }

        return await res.json();
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
