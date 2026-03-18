export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { updateBusinessHours, addHoliday, deleteHoliday } from './actions'

const WEEKDAYS = [
  '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
]

import styles from './settings.module.css'

export default async function SettingsPage() {
  const businessHours = await prisma.businessHour.findMany({
    orderBy: { weekday: 'asc' }
  })
  const holidays = await prisma.holiday.findMany({
    orderBy: { holidayDate: 'desc' }
  })

  // Map settings by day for easy access
  const hoursMap = Object.fromEntries(businessHours.map(bh => [bh.weekday, bh]))

  return (
    <div>
      <h1 className={styles.title}>営業設定</h1>

      <div className={styles.settingsGrid}>
        {/* 営業時間設定 */}
        <section className={styles.card}>
          <h2>基本営業時間</h2>
          <form action={updateBusinessHours} className={styles.hoursForm}>
            <div className={styles.hoursList}>
              {WEEKDAYS.map((name, i) => {
                const setting = hoursMap[i] || { openTime: '10:00', closeTime: '19:00', isClosed: false }
                return (
                  <div key={i} className={`${styles.hourRow} ${setting.isClosed ? styles.isClosed : ''}`}>
                    <div className={styles.dayName}>{name}</div>
                    <div className={styles.controls}>
                      <input type="time" name={`openTime_${i}`} defaultValue={setting.openTime} disabled={setting.isClosed} className={styles.input} />
                      <span>〜</span>
                      <input type="time" name={`closeTime_${i}`} defaultValue={setting.closeTime} disabled={setting.isClosed} className={styles.input} />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" name={`isClosed_${i}`} defaultChecked={setting.isClosed} />
                      定休日
                    </label>
                  </div>
                )
              })}
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>保存</button>
            </div>
          </form>
        </section>

        {/* 特定日の特別設定（臨時休業・特別営業時間） */}
        <section className={styles.card}>
          <h2>特定日の特別設定（臨時休業・特別営業時間）</h2>
          <form action={addHoliday} className={styles.holidayForm}>
            <div className={styles.formInline}>
              <input type="date" name="holidayDate" required className={styles.input} />
              <input type="text" name="note" placeholder="理由 (任意)" className={styles.input} />
            </div>
            <div className={styles.formInline} style={{ marginTop: '0.75rem' }}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="isClosed" defaultChecked />
                終日休業にする
              </label>
              <div className={styles.controls} style={{ marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.85rem' }}>（営業する場合）</span>
                <input type="time" name="openTime" defaultValue="13:00" className={styles.input} />
                <span>〜</span>
                <input type="time" name="closeTime" defaultValue="19:00" className={styles.input} />
              </div>
              <button type="submit" className={styles.secondaryButton} style={{ marginLeft: 'auto' }}>追加</button>
            </div>
          </form>

          <div className={styles.holidayList}>
            {holidays.length === 0 ? (
              <p className={styles.empty}>設定された休業日はありません</p>
            ) : (
              <ul>
                {holidays.map(h => (
                  <li key={h.id}>
                    <span className={styles.holidayDate}>{new Date(h.holidayDate).toLocaleDateString('ja-JP')}</span>
                    <span className={styles.note}>
                      {h.isClosed ? <span style={{ color: 'var(--error)' }}>休業</span> : <span style={{ color: 'var(--accent-light)' }}>{h.openTime} 〜 {h.closeTime}</span>}
                      {h.note ? ` - ${h.note}` : ''}
                    </span>
                    <form action={deleteHoliday.bind(null, h.id)}>
                      <button type="submit" className={styles.deleteBtn}>削除</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

