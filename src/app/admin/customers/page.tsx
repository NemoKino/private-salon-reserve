export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './customers_list.module.css'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { nameKana: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>顧客管理</h1>
        <Link href="/admin/customers/new" className={styles.primaryButton}>
          ＋ 顧客追加
        </Link>
      </div>

      <div className={styles.searchBar}>
        <form method="GET">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="名前・電話番号・メールアドレスで検索..."
          />
          <button type="submit">検索</button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>氏名</th>
              <th>ふりがな</th>
              <th>電話番号</th>
              <th>メールアドレス</th>
              <th>来店回数</th>
              <th>最終来店</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  {q ? `"${q}" に一致する顧客が見つかりません` : '顧客がまだいません'}
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.nameKana || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.visitCount}回</td>
                  <td>
                    {c.lastVisitAt
                      ? new Date(c.lastVisitAt).toLocaleDateString('ja-JP')
                      : '—'}
                  </td>
                  <td>
                    <Link href={`/admin/customers/${c.id}`} className={styles.actionLink}>
                      詳細
                    </Link>
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
