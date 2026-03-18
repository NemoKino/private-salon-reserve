export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { startOfDay, format } from 'date-fns'
import BookingForm from '@/components/BookingForm'
import styles from './booking.module.css'

export default async function BookingPage() {
  const menus = await prisma.menu.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'asc' },
  })

  // Fetch closed weekdays
  const businessHours = await prisma.businessHour.findMany()
  const closedWeekdays = businessHours.filter(bh => bh.isClosed).map(bh => bh.weekday)

  // Fetch holidays from today onwards
  const holidaysInfo = await prisma.holiday.findMany({
    where: {
      holidayDate: { gte: startOfDay(new Date()) }
    }
  })
  const holidays = holidaysInfo.map(h => format(h.holidayDate, 'yyyy-MM-dd'))

  return (
    <div className={styles.container}>
      <header className={styles.bookingHeader}>
        <h1>e-Sugar</h1>
        <p>ご予約フォーム</p>
      </header>

      <main className={styles.bookingMain}>
        <BookingForm
          menus={menus}
          closedWeekdays={closedWeekdays}
          holidays={holidays}
          maxDays={60}
        />
      </main>

      <footer className={styles.bookingFooter}>
        <p>© 2026 e-Sugar. All rights reserved.</p>
      </footer>
    </div>
  )
}
