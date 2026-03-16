import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventListContainer from '@/components/events/EventListContainer';
import { getPaginatedEvents, getPopularTags } from '@/utils/events';
import { Event } from '@/types';

export const revalidate = 0;

export const metadata = {
    title: 'イベント一覧 | VRC Workers',
    description: '現在キャスト募集中のVRChatイベント一覧',
};

export default async function ListPage() {
    const { events, total } = await getPaginatedEvents({
        page: 1,
        limit: 20,
        sort: 'newest'
    });
    const popularTags = await getPopularTags();

    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 className="title" style={{ marginBottom: '1rem' }}>イベントを探す</h1>
                    <p className="subtitle">あなたにぴったりのイベントを見つけよう</p>
                </div>

                <EventListContainer
                    initialEvents={events}
                    initialTotal={total}
                    popularTags={popularTags}
                />
            </main>
            <Footer />
        </>
    );
}
