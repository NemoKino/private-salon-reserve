import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import EventCard from '@/components/events/EventCard';
import Button from '@/components/ui/Button';
import events from '@/data/events.json';
import { Event } from '@/types';

// Featured events
const featuredEvents = events.filter((e) => e.isFeaturedTop);

export default function Home() {
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
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event as Event} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
