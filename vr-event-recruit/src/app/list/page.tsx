import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventListContainer from '@/components/events/EventListContainer';
import events from '@/data/events.json';
import { Event } from '@/types';

export const metadata = {
    title: 'イベント一覧 | VR Event Recruit',
    description: '現在キャスト募集中のVRChatイベント一覧',
};

export default function ListPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 className="title" style={{ marginBottom: '1rem' }}>イベントを探す</h1>
                    <p className="subtitle">あなたにぴったりのイベントを見つけよう</p>
                </div>

                <EventListContainer events={events as Event[]} />
            </main>
            <Footer />
        </>
    );
}
