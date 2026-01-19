import Link from 'next/link';
import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import Button from '@/components/ui/Button';
import { getEvents } from '@/utils/events'; // Use dynamic fetch
import { Event } from '@/types';

export const revalidate = 0; // Disable cache for immediate updates

export default async function Home() {
  const events = await getEvents();
  const featuredEvents = events.filter(e => e.isFeaturedTop);
  // If no featured events, just show recent 3
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : events.slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="container" style={{ padding: '4rem 1rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 className="title">Featured Events</h2>
              <p className="subtitle">注目の募集イベント</p>
            </div>
            <Button href="/list" variant="ghost">すべて見る &rarr;</Button>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event as Event} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
