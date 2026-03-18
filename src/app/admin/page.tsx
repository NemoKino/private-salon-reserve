export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import styles from './page.module.css'

export default async function AdminDashboard() {
  const cookie = (await cookies()).get('session')?.value
  const session = cookie ? await decrypt(cookie).catch(() => null) : null

  return (
    <div className={styles.dashboard}>
      <header className={styles['page-header']}>
        <h1>ダッシュボード</h1>
        <p>ようこそ、{session?.username || '管理者'}さん</p>
      </header>

      <section className={styles['dashboard-content']}>
        <div className={styles.card}>
          <h3>本日の予約</h3>
          <p className={styles['placeholder-text']}>本日の予約データがここに表示されます</p>
        </div>

        <div className={styles.card}>
          <h3>最近の活動</h3>
          <p className={styles['placeholder-text']}>最近の更新内容がここに表示されます</p>
        </div>
      </section>
    </div>
  )
}
