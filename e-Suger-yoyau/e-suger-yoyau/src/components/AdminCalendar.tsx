'use client'

import { useState } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'ja': ja,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // 月曜始まり
  getDay,
  locales,
})

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  status: string
  resource?: unknown
}

interface AdminCalendarProps {
  initialEvents: CalendarEvent[]
}

import styles from './AdminCalendar.module.css'

export default function AdminCalendar({ initialEvents }: AdminCalendarProps) {
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const events = initialEvents.map(ev => ({
    ...ev,
    start: new Date(ev.start),
    end: new Date(ev.end)
  }))

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6' // default blue (reserved)

    if (event.status === 'visited') backgroundColor = '#059669' // green success
    if (event.status === 'cancelled') backgroundColor = '#ef4444' // red error
    if (event.status === 'no_show') backgroundColor = '#6b7280' // gray

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.95,
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'block'
      }
    }
  }

  const handleNewReservation = () => {
    alert('新規予約の登録機能は準備中です。現在は顧客向けの予約ページ（/booking）をご利用ください。')
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h2>予約カレンダー</h2>
        <div className={styles.calendarActions}>
          <button className={styles.primaryButton} onClick={handleNewReservation}>
            ＋ 新規予約
          </button>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          onView={(newView) => setView(newView)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="ja"
          views={['month', 'week', 'day']}
          eventPropGetter={eventStyleGetter}
          messages={{
            allDay: '終日',
            previous: '前へ',
            next: '次へ',
            today: '今日',
            month: '月',
            week: '週',
            day: '日',
            agenda: '予定',
            date: '日付',
            time: '時間',
            event: 'イベント',
            noEventsInRange: 'この期間に予定はありません',
            showMore: total => `+ 他 ${total} 件`
          }}
          onSelectEvent={(event) => {
            setSelectedEvent(event)
          }}
        />
      </div>

      {selectedEvent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>予約詳細</h3>
              <button className={styles.closeButton} onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>お客様名</span>
                <span className={styles.detailValue}>
                  {(selectedEvent.resource as any)?.customer?.name || selectedEvent.title.split(' - ')[0]}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>電話番号</span>
                <span className={styles.detailValue}>
                  {(selectedEvent.resource as any)?.customer?.phone || '未設定'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>メニュー</span>
                <span className={styles.detailValue}>{selectedEvent.title.split(' - ').slice(1).join(' - ') || selectedEvent.title}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>日時</span>
                <span className={styles.detailValue}>
                  {format(selectedEvent.start, 'yyyy年M月d日')} {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>ステータス</span>
                <span className={styles.detailValue}>
                  {selectedEvent.status === 'visited' ? '来店済み' : 
                   selectedEvent.status === 'cancelled' ? 'キャンセル' : 
                   selectedEvent.status === 'reserved' ? '予約中' : selectedEvent.status}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>メモ</span>
                <span className={styles.detailValue}>
                  {(selectedEvent.resource as any)?.memo || 'なし'}
                </span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton} onClick={() => setSelectedEvent(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
