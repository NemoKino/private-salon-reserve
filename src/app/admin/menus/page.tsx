export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteMenu, toggleMenuPublic } from './actions'
import DeleteMenuButton from '@/components/DeleteMenuButton'

import styles from './menus.module.css'

export default async function MenusPage() {
  const menus = await prisma.menu.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>メニュー管理</h1>
        <Link href="/admin/menus/new" className={styles.primaryButton}>＋ メニュー追加</Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>メニュー名</th>
              <th>料金</th>
              <th>所要時間</th>
              <th>対象</th>
              <th>公開</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr><td colSpan={6} className={styles.empty}>メニューがありません</td></tr>
            ) : (
              menus.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className={styles.menuName}>{m.name}</div>
                    {m.description && <div className={styles.menuDesc}>{m.description}</div>}
                  </td>
                  <td>¥{m.price.toLocaleString()}</td>
                  <td>{m.durationMinutes}分</td>
                  <td>{m.targetType === 'all' ? '全員' : m.targetType === 'new' ? '新規' : '再来'}</td>
                  <td>
                    <form action={toggleMenuPublic.bind(null, m.id, !m.isPublic)}>
                      <button type="submit" className={`${styles.toggle} ${m.isPublic ? styles.toggleOn : styles.toggleOff}`}>
                        {m.isPublic ? '公開' : '非公開'}
                      </button>
                    </form>
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/admin/menus/${m.id}/edit`} className={styles.actionLink}>編集</Link>
                    <DeleteMenuButton id={m.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

