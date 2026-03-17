'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StepIndicator from '@/components/ui/StepIndicator';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import styles from './page.module.css';

function RegistrationCompletedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventTitle = searchParams.get('title') || 'イベント名';
    const eventId = searchParams.get('id');
    const adminTwitterId = process.env.NEXT_PUBLIC_ADMIN_TWITTER_ID || '@vrc_workers';
    const adminTwitterUrl = `https://x.com/${adminTwitterId.replace(/^@/, '')}`;

    const [isVerified, setIsVerified] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isVerified) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isVerified]);

    const handleExit = (e: React.MouseEvent, path: string) => {
        e.preventDefault(); // Prevent any default button behavior
        console.log('handleExit called', { isVerified });

        if (!isVerified) {
            // Use a slight delay to ensure UI updates if needed, though confirm blocks
            const confirmed = window.confirm('申請が完了していません。\nこのページを離れると、申請手続きが中断される可能性があります。\n\n移動してもよろしいですか？');
            console.log('Confirm result:', confirmed);
            if (!confirmed) {
                return;
            }
        }
        console.log('Navigating to:', path);
        router.push(path);
    };

    const dmTemplate = `【申請連絡】\nイベント名: ${eventTitle}\nID: ${eventId || '不明'}\n\n上記イベントの掲載申請を行いました。`;

    const handleCopy = () => {
        navigator.clipboard.writeText(dmTemplate);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleVerify = async () => {
        setIsSubmitting(true);
        try {
            if (eventId) {
                await fetch('/api/events/finalize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: eventId }),
                });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsVerified(true);
        } catch (e) {
            console.error(e);
            alert('通信エラーが発生しましたが、DM送信済みであれば問題ありません。');
            setIsVerified(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>

                <div className={styles.stepWrapper}>
                    <StepIndicator currentStep={isVerified ? 4 : 3} />
                </div>

                <div className={styles.card}>
                    {/* Hero Section */}
                    <div className={`${styles.hero} ${isVerified ? styles.heroSuccess : styles.heroWarning}`}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.icon}>{isVerified ? '🎉' : '🛡️'}</span>
                        </div>
                        <h1 className={styles.title}>{isVerified ? '申請を受け付けました！' : '本人確認をお願いします'}</h1>
                        <p className={styles.subtitle}>
                            {isVerified ? '管理者の承認をお待ちください。' : '偽装・なりすまし防止のため、DMによる確認を行っています。'}
                        </p>
                    </div>

                    {/* Body Section */}
                    <div className={styles.body}>
                        {!isVerified ? (
                            <>
                                <div className={styles.alert}>
                                    <h2 className={styles.alertTitle}>
                                        最後のステップ
                                    </h2>
                                    <p className={styles.alertText}>
                                        いたずら申請防止のため、X (Twitter) のDM機能を使用した本人確認を実施しています。<br />
                                        お手数ですが、以下の手順でメッセージを送信してください。
                                    </p>
                                </div>

                                <div className={styles.section}>
                                    <div style={{ position: 'relative' }}>
                                        <label className={styles.label}>送信メッセージ用テンプレート</label>
                                        <div className={styles.templateBox}>
                                            <pre className={styles.pre}>{dmTemplate}</pre>
                                            <button
                                                onClick={handleCopy}
                                                className={styles.copyButton}
                                            >
                                                {copied ? (
                                                    <>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        Copied
                                                    </>
                                                ) : 'Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <a
                                            href={adminTwitterUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.dmButton}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            <span>X でDMを送信する</span>
                                        </a>

                                        <button
                                            className={styles.verifyButton}
                                            onClick={handleVerify}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? '処理中...' : 'DMを送信しました (完了画面へ)'}
                                        </button>
                                    </div>
                                    <p className={styles.note}>
                                        ※ DM送信後、ボタンを押してください。
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className={styles.section} style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#ecfccb',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem auto',
                                    color: '#65a30d',
                                    fontSize: '2.5rem'
                                }}>
                                    ✓
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
                                    申請ありがとうございます
                                </h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' }}>
                                    管理者がDMを確認し、内容に問題がなければ<br />
                                    サイトにイベントが掲載されます。
                                </p>

                                <div className={styles.footerLink} style={{ marginTop: 0 }}>
                                    <Link href="/" className={styles.link}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                                        トップページへ戻る
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!isVerified && (
                    <div className={styles.footerLink}>
                        <Link
                            href="/"
                            onClick={(e) => handleExit(e, '/')}
                            className={styles.link}
                        >
                            トップページへ戻る
                        </Link>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}

export default function RegistrationCompletedPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <RegistrationCompletedContent />
        </Suspense>
    );
}
