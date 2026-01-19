'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EventForm from '@/components/admin/EventForm';
import styles from '../admin.module.css';

export default function NewEventPage() {
    const router = useRouter();

    const handleSubmit = async (eventData: any) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                alert('登録しました');
                router.push('/admin');
            } else {
                alert('登録に失敗しました');
            }
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>新規イベント登録</h1>
                <Link href="/admin">
                    <Button variant="ghost">キャンセル</Button>
                </Link>
            </div>

            <EventForm onSubmit={handleSubmit} />
        </div>
    );
}
