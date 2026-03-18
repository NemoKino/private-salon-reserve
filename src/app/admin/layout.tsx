'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from './login/actions'
import styles from './layout.module.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className={styles['admin-layout']}>
      <aside className={styles.sidebar}>
        <div className={styles['sidebar-header']}>
          <h2>Private Salon</h2>
          <p>Admin Control</p>
        </div>
        <nav className={styles['nav-menu']}>
          <Link href="/admin" className={pathname === '/admin' ? styles['nav-link-active'] : styles['nav-link']}>
            ダッシュボード
          </Link>
          <Link href="/admin/calendar" className={pathname.startsWith('/admin/calendar') ? styles['nav-link-active'] : styles['nav-link']}>
            予約カレンダー
          </Link>
          <Link href="/admin/customers" className={pathname.startsWith('/admin/customers') ? styles['nav-link-active'] : styles['nav-link']}>
            顧客管理
          </Link>
          <Link href="/admin/menus" className={pathname.startsWith('/admin/menus') ? styles['nav-link-active'] : styles['nav-link']}>
            メニュー管理
          </Link>
          <Link href="/admin/settings" className={pathname.startsWith('/admin/settings') ? styles['nav-link-active'] : styles['nav-link']}>
            営業設定
          </Link>
        </nav>
        <div className={styles['sidebar-footer']}>
          <button onClick={() => logout()} className={styles['logout-button']}>ログアウト</button>
        </div>
      </aside>

      <main className={styles['main-content']}>
        {children}
      </main>
    </div>
  )
}
