'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfDay } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { getAvailableTimes, createReservation } from '@/app/booking/actions'

type Menu = {
  id: string
  name: string
  price: number
  durationMinutes: number
  description: string | null
}

interface BookingFormProps {
  menus: Menu[]
  closedWeekdays: number[]
  holidays: string[]
  maxDays: number
}

import styles from './BookingForm.module.css'

export default function BookingForm({ menus, closedWeekdays, holidays, maxDays }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any>(null)

  // Customer info state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [memo, setMemo] = useState('')
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)

  const TOTAL_STEPS = 6

  // Fetch available times when date changes
  useEffect(() => {
    if (selectedDate && selectedMenu) {
      setLoading(true)
      getAvailableTimes(selectedDate, selectedMenu.id)
        .then(times => {
          setAvailableTimes(times)
          setLoading(false)
        })
        .catch(() => {
          setError('時間枠の取得に失敗しました')
          setLoading(false)
        })
    }
  }, [selectedDate, selectedMenu])

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setStep(2)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    setStep(3)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleGoToConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !email) return
    setStep(5)
  }

  const handleBookingSubmit = async () => {
    if (!selectedMenu || !selectedDate || !selectedTime || !agreedToPolicy) return

    setLoading(true)
    setError(null)

    try {
      const startAt = `${selectedDate}T${selectedTime}:00`
      const res = await createReservation({
        menuId: selectedMenu.id,
        startAt: startAt,
        name,
        phone,
        email,
        memo,
      })

      if (res.error) {
        setError(res.error)
        setStep(4) // Go back to form if error
      } else {
        setSuccessData(res)
        setStep(6)
      }
    } catch (e) {
      setError('予約に失敗しました。時間をおいて再度お試しください。')
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  const stepLabels: Record<number, string> = {
    1: 'メニュー選択',
    2: '日付選択',
    3: '時間選択',
    4: 'お客様情報',
    5: '予約確認',
    6: '予約完了',
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    const d = new Date(selectedDate + 'T00:00:00')
    return format(d, 'yyyy年M月d日(E)', { locale: ja })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.stepTitle}>{stepLabels[step]}</div>
        <div className={styles.stepIndicator}>Step {step} / {TOTAL_STEPS}</div>
      </header>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className={styles.content}>
        {/* Step 1: Menu Selection */}
        {step === 1 && (
          <div className={styles.menuGrid}>
            {menus.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                現在公開中のメニューはありません
              </p>
            ) : (
              menus.map(menu => (
                <button
                  key={menu.id}
                  className={`${styles.menuItem} ${selectedMenu?.id === menu.id ? styles.menuItemSelected : ''}`}
                  onClick={() => handleMenuSelect(menu)}
                >
                  <div className={styles.menuName}>{menu.name}</div>
                  <div className={styles.menuMeta}>
                    <span>¥{menu.price.toLocaleString()}</span>
                    <span>{menu.durationMinutes}分</span>
                  </div>
                  {menu.description && <p className={styles.menuDesc}>{menu.description}</p>}
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div>
            <div className={styles.dateNav}>
              <button
                className={styles.dateNavBtn}
                disabled={weekOffset === 0}
                onClick={() => setWeekOffset(prev => prev - 1)}
              >
                ← 1週間戻る
              </button>
              <div className={styles.currentMonth}>
                {format(addDays(startOfDay(new Date()), weekOffset * 7 + 1), 'yyyy年M月', { locale: ja })}
              </div>
              <button
                className={styles.dateNavBtn}
                disabled={(weekOffset + 2) * 7 >= maxDays}
                onClick={() => setWeekOffset(prev => prev + 1)}
              >
                1週間進む →
              </button>
            </div>
            <div className={styles.dateGrid}>
              {Array.from({ length: 14 }).map((_, i) => {
                const dayIndex = weekOffset * 7 + i
                if (dayIndex >= maxDays) return <div key={i} /> // Hide if exceeds maxDays

                const date = addDays(startOfDay(new Date()), dayIndex + 1)
                const dateStr = format(date, 'yyyy-MM-dd')
                const weekday = date.getDay()
                
                const isClosed = closedWeekdays.includes(weekday) || holidays.includes(dateStr)

                return (
                  <button
                    key={dateStr}
                    className={`${styles.dateButton} ${selectedDate === dateStr ? styles.dateButtonSelected : ''} ${isClosed ? styles.dateButtonDisabled : ''}`}
                    disabled={isClosed}
                    onClick={() => !isClosed && handleDateSelect(dateStr)}
                  >
                    <span className={styles.dayOfWeek}>{format(date, 'E', { locale: ja })}</span>
                    <span className={styles.dayNumber}>{format(date, 'd')}</span>
                    {isClosed && <span className={styles.closedBadge}>休</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>空き時間を確認中...</span>
              </div>
            ) : availableTimes.length === 0 ? (
              <div className={styles.error}>申し訳ありません。この日は予約がいっぱいです。</div>
            ) : (
              <div className={styles.timeGrid}>
                {availableTimes.map(time => (
                  <button
                    key={time}
                    className={`${styles.timeButton} ${selectedTime === time ? styles.timeButtonSelected : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Customer Info */}
        {step === 4 && (
          <div>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleGoToConfirm} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>お名前 *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className={styles.input}
                  placeholder="山田 太郎"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>電話番号 *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={styles.input}
                  placeholder="090-0000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>メールアドレス *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={styles.input}
                  placeholder="mail@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>ご要望・メモ</label>
                <textarea
                  name="memo"
                  rows={3}
                  className={styles.textarea}
                  placeholder="伝えたいことがあればご記入ください"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                />
              </div>
              <div className={styles.footer} style={{ padding: '1rem 0', borderTop: 'none' }}>
                <button type="button" className={styles.backButton} onClick={() => setStep(3)}>戻る</button>
                <button type="submit" className={styles.nextButton}>確認画面へ</button>
              </div>
            </form>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className={styles.confirmSection}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.confirmCard}>
              <div className={styles.confirmTitle}>ご予約内容</div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>メニュー</span>
                <span className={styles.confirmValue}>{selectedMenu?.name}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>料金</span>
                <span className={styles.confirmValue}>¥{selectedMenu?.price.toLocaleString()}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>所要時間</span>
                <span className={styles.confirmValue}>{selectedMenu?.durationMinutes}分</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>日時</span>
                <span className={styles.confirmValue}>{formatSelectedDate()} {selectedTime}</span>
              </div>
            </div>

            <div className={styles.confirmCard}>
              <div className={styles.confirmTitle}>お客様情報</div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>お名前</span>
                <span className={styles.confirmValue}>{name}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>電話番号</span>
                <span className={styles.confirmValue}>{phone}</span>
              </div>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>メールアドレス</span>
                <span className={styles.confirmValue}>{email}</span>
              </div>
              {memo && (
                <div className={styles.confirmRow}>
                  <span className={styles.confirmLabel}>ご要望</span>
                  <span className={styles.confirmValue}>{memo}</span>
                </div>
              )}
            </div>

            {/* Policy Agreement */}
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="policy"
                className={styles.checkbox}
                checked={agreedToPolicy}
                onChange={e => setAgreedToPolicy(e.target.checked)}
              />
              <label htmlFor="policy" className={styles.checkboxLabel}>
                当日のキャンセル・無断キャンセルはキャンセル料が発生する場合がございます。
                予約内容に誤りがないことを確認し、<span className={styles.policyLink}>キャンセルポリシー</span>に同意します。
              </label>
            </div>

            <div className={styles.footer} style={{ padding: '1rem 0', borderTop: 'none' }}>
              <button type="button" className={styles.backButton} onClick={() => setStep(4)}>修正する</button>
              <button
                type="button"
                className={styles.nextButton}
                disabled={!agreedToPolicy || loading}
                onClick={handleBookingSubmit}
              >
                {loading ? '送信中...' : '予約を確定する'}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h2>予約が完了しました</h2>
            <p>
              ご予約ありがとうございます。<br />
              確認メールが送信されました。<br />
              当日お待ちしております。
            </p>
            <a href="/" className={styles.homeButton}>トップページへ戻る</a>
          </div>
        )}
      </div>

      {/* Footer navigation for steps 1-3 */}
      {step < 4 && step > 0 && (
        <footer className={styles.footer}>
          <button
            className={styles.backButton}
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            戻る
          </button>
          <div style={{ flex: 1 }}></div>
        </footer>
      )}
    </div>
  )
}
