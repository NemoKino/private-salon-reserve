'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Event } from '@/types';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (event: Event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            const res = await fetch(`/api/events/${eventToDelete.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setEvents(events.filter(e => e.id !== eventToDelete.id));
                setIsDeleteModalOpen(false);
                setEventToDelete(null);
            } else {
                alert('削除に失敗しました');
            }
        } catch (error) {
            console.error('Delete error', error);
            alert('エラーが発生しました');
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>管理ダッシュボード</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                        ログアウト
                    </Button>
                    <Button href="/admin/new" variant="primary">
                        + 新規イベント作成
                    </Button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>画像</th>
                            <th className={styles.th}>イベント名</th>
                            <th className={styles.th}>開催ステータス</th>
                            <th className={styles.th}>頻度</th>
                            <th className={styles.th}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className={styles.row}>
                                <td className={styles.td}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={event.thumbnail}
                                        alt=""
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td className={styles.td} style={{ fontWeight: 'bold' }}>{event.title}</td>
                                <td className={styles.td}>
                                    <span className={`${styles.status} ${styles['status_' + event.status]}`}>
                                        {event.status === 'recruiting' ? '募集中' : '終了'}
                                    </span>
                                </td>
                                <td className={styles.td}>{event.frequency}</td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <Link href={`/admin/edit/${event.id}`} className={styles.editButton}>
                                            編集
                                        </Link>
                                        <Link href={`/events/${event.id}`} target="_blank" style={{ fontSize: '0.875rem', textDecoration: 'underline', color: '#64748b' }}>
                                            確認
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteClick(event);
                                            }}
                                            className={styles.deleteButton}
                                        >
                                            削除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="イベントの削除"
                primaryAction={{
                    label: '削除する',
                    onClick: confirmDelete,
                    variant: 'danger',
                }}
                secondaryAction={{
                    label: 'キャンセル',
                    onClick: () => setIsDeleteModalOpen(false),
                }}
            >
                <p>
                    イベント「{eventToDelete?.title}」を削除してもよろしいですか？
                    <br />
                    この操作は取り消せません。
                </p>
            </Modal>
        </div>
    );
}
