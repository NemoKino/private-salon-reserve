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
    const [activeTab, setActiveTab] = useState<'published' | 'pending'>('published');
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Fetch from ADMIN API to get all statuses including pending
            const res = await fetch('/api/admin/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);

                // If there are pending events, switch to pending tab by default?
                // Optional: const hasPending = data.some((e: Event) => e.status === 'pending');
                // if (hasPending) setActiveTab('pending');
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (event: Event) => {
        if (!confirm(`「${event.title}」を承認して公開しますか？`)) return;

        try {
            const res = await fetch(`/api/events/${event.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'recruiting' }),
            });

            if (res.ok) {
                alert('公開しました！');
                fetchEvents();
            } else {
                alert('更新に失敗しました');
            }
        } catch (error) {
            console.error('Error approving event', error);
            alert('通信エラーが発生しました');
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

    // DM Modal State
    const [isDMModalOpen, setIsDMModalOpen] = useState(false);
    const [targetEventForDM, setTargetEventForDM] = useState<Event | null>(null);

    const openDMModal = (event: Event) => {
        setTargetEventForDM(event);
        setIsDMModalOpen(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('コピーしました');
    };

    const getTemplate = (type: 'approve' | 'clarify' | 'image_request') => {
        if (!targetEventForDM) return '';
        const title = targetEventForDM.title;
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/events/${targetEventForDM.id}`;

        switch (type) {
            case 'approve':
                return `【掲載承認のご連絡】\n\nご申請いただいたイベント『${title}』を掲載承認・公開いたしました！\n\n確認はこちら:\n${url}\n\n引き続きVR Workersをよろしくお願いいたします。`;
            case 'clarify':
                return `【確認のご連絡】\n\nご申請いただいた『${title}』について確認です。\n\nVR Workersは『キャスト募集』に特化したプラットフォームです。\n今回の申請内容はイベント告知の要素が強く、具体的な募集要項（条件、シフト、報酬など）が確認できませんでした。\n\nもしスタッフ・キャストの募集も兼ねている場合は、お手数ですが募集の詳細を教えていただけますでしょうか？\n（募集がない場合は、申し訳ありませんが掲載を見送らせていただく場合があります）`;
            case 'image_request':
                return `【画像修正のご依頼】\n\nご申請いただいた『${title}』についてです。\n\n添付いただいた画像の一部が見切れている、または解像度が不足しているようです。\nお手数ですが、16:9または3:4比率の画像、あるいはより高画質なものを、このDMにて再送いただけますでしょうか？`;
            default:
                return '';
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    const pendingEvents = events.filter(e => e.status === 'pending' || e.status === 'draft');
    const publishedEvents = events.filter(e => e.status !== 'pending' && e.status !== 'draft');
    const displayedEvents = activeTab === 'pending' ? pendingEvents : publishedEvents;

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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setActiveTab('published')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderBottom: activeTab === 'published' ? '2px solid #3b82f6' : 'none',
                        color: activeTab === 'published' ? '#3b82f6' : '#64748b',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    公開中 / 終了 ({publishedEvents.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderBottom: activeTab === 'pending' ? '2px solid #ef4444' : 'none',
                        color: activeTab === 'pending' ? '#ef4444' : '#64748b',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    承認待ち / 未完了 ({pendingEvents.length})
                    {pendingEvents.length > 0 && (
                        <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>
                            {pendingEvents.length}
                        </span>
                    )}
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>画像</th>
                            <th className={styles.th}>イベント名</th>
                            <th className={styles.th}>ステータス</th>
                            <th className={styles.th}>頻度</th>
                            <th className={styles.th}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedEvents.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    {activeTab === 'pending' ? '承認待ちのイベントはありません' : 'イベントがありません'}
                                </td>
                            </tr>
                        ) : (
                            displayedEvents.map((event) => (
                                <tr key={event.id} className={styles.row}>
                                    <td className={styles.td}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={event.thumbnail}
                                            alt=""
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td className={styles.td} data-label="イベント名" style={{ fontWeight: 'bold' }}>{event.title}</td>
                                    <td className={styles.td} data-label="ステータス">
                                        <span className={`${styles.status} ${styles['status_' + event.status]}`}>
                                            {(() => {
                                                if (event.status === 'draft') return '本人確認未完了';
                                                if (event.status === 'pending') return '承認待ち';

                                                // Check for expiration (Only on client)
                                                if (isClient && event.detail?.listingEndDate) {
                                                    const endDate = new Date(event.detail.listingEndDate);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);

                                                    const todayStr = today.toISOString().split('T')[0];
                                                    if (event.detail.listingEndDate < todayStr) {
                                                        return '掲載終了';
                                                    }
                                                }

                                                switch (event.status) {
                                                    case 'recruiting': return '募集中';
                                                    case 'closed': return '募集終了';
                                                    case 'ended': return '開催終了';
                                                    default: return event.status;
                                                }
                                            })()}
                                        </span>
                                    </td>
                                    <td className={styles.td} data-label="頻度">{event.frequency}</td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            {event.status === 'pending' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleApprove(event);
                                                        }}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold',
                                                            background: '#22c55e',
                                                            color: 'white',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        承認
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            openDMModal(event);
                                                        }}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold',
                                                            background: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        連絡
                                                    </button>
                                                </>
                                            )}
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
                            ))
                        )}
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

            {/* DM Template Modal */}
            <Modal
                isOpen={isDMModalOpen}
                onClose={() => setIsDMModalOpen(false)}
                title={`連絡用テンプレート (${targetEventForDM?.title})`}
                secondaryAction={{
                    label: '閉じる',
                    onClick: () => setIsDMModalOpen(false),
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '4px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>申請者Twitter</p>
                        {targetEventForDM?.organizer?.twitterUrl ? (
                            <a
                                href={targetEventForDM.organizer.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3b82f6', textDecoration: 'underline' }}
                            >
                                {targetEventForDM.organizer.twitterUrl}
                            </a>
                        ) : (
                            <span style={{ color: '#94a3b8' }}>URLなし</span>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>1. 承認完了通知</label>
                            <button
                                onClick={() => copyToClipboard(getTemplate('approve'))}
                                style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', cursor: 'pointer' }}
                            >
                                コピー
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={getTemplate('approve')}
                            style={{ width: '100%', height: '100px', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>2. 趣旨確認（キャスト募集ではない場合）</label>
                            <button
                                onClick={() => copyToClipboard(getTemplate('clarify'))}
                                style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', cursor: 'pointer' }}
                            >
                                コピー
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={getTemplate('clarify')}
                            style={{ width: '100%', height: '120px', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>3. 画像不備の連絡</label>
                            <button
                                onClick={() => copyToClipboard(getTemplate('image_request'))}
                                style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', cursor: 'pointer' }}
                            >
                                コピー
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={getTemplate('image_request')}
                            style={{ width: '100%', height: '100px', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
