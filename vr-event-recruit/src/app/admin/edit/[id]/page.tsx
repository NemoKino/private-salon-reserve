'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EventForm from '@/components/admin/EventForm';
import { Event } from '@/types';
import styles from '../../admin.module.css';

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditEventPage(props: Props) {
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await props.params;
            setId(resolvedParams.id);
            fetchEvent(resolvedParams.id);
        };
        resolveParams();
    }, [props.params]);

    const fetchEvent = async (eventId: string) => {
        try {
            const res = await fetch(`/api/events/${eventId}`);
            if (res.ok) {
                const data = await res.json();
                setEvent(data);
            } else {
                alert('イベントの取得に失敗しました');
                router.push('/admin');
            }
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (eventData: any) => {
        try {
            const res = await fetch(`/api/events/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                alert('更新しました');
                router.push('/admin');
            } else {
                alert('更新に失敗しました');
            }
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (!event) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>イベント編集</h1>
                <Link href="/admin">
                    <Button variant="ghost">キャンセル</Button>
                </Link>
            </div>

            <EventForm initialData={event} onSubmit={handleSubmit} isEditing />
        </div>
    );
}
