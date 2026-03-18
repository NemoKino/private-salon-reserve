export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

import styles from '../customer_detail.module.css'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      reservations: {
        include: { menu: true },
        orderBy: { startAt: 'desc' },
        take: 10,
      },
      visitHistories: {
        orderBy: { visitedAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!customer) notFound()

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/customers" className={styles.backLink}>← 顧客一覧</Link>
          <h1 className={styles.title}>{customer.name}</h1>
          {customer.nameKana && <p className={styles.kana}>{customer.nameKana}</p>}
        </div>
        <Link href={`/admin/customers/${id}/edit`} className={styles.primaryButton}>
          編集
        </Link>
      </div>

      <div className={styles.detailGrid}>
        {/* 基本情報 */}
        <section className={styles.card}>
          <h2>基本情報</h2>
          <dl className={styles.dl}>
            <div><dt className={styles.dt}>電話番号</dt><dd className={styles.dd}>{customer.phone || '—'}</dd></div>
            <div><dt className={styles.dt}>メールアドレス</dt><dd className={styles.dd}>{customer.email || '—'}</dd></div>
            <div><dt className={styles.dt}>LINE名</dt><dd className={styles.dd}>{customer.lineName || '—'}</dd></div>
            <div><dt className={styles.dt}>Instagram</dt><dd className={styles.dd}>{customer.instagramName || '—'}</dd></div>
            <div><dt className={styles.dt}>生年月日</dt><dd className={styles.dd}>{customer.birthday ? new Date(customer.birthday).toLocaleDateString('ja-JP') : '—'}</dd></div>
            <div><dt className={styles.dt}>初回来店</dt><dd className={styles.dd}>{customer.firstVisitAt ? new Date(customer.firstVisitAt).toLocaleDateString('ja-JP') : '—'}</dd></div>
            <div><dt className={styles.dt}>最終来店</dt><dd className={styles.dd}>{customer.lastVisitAt ? new Date(customer.lastVisitAt).toLocaleDateString('ja-JP') : '—'}</dd></div>
            <div><dt className={styles.dt}>来店回数</dt><dd className={styles.dd}>{customer.visitCount}回</dd></div>
          </dl>
        </section>

        {/* 注意事項 */}
        <section className={styles.card}>
          <h2>スタッフメモ・注意事項</h2>
          <p className={styles.notes}>{customer.notes || 'なし'}</p>
        </section>
      </div>

      {/* 予約履歴 */}
      <section className={`${styles.card} ${styles.cardMt}`}>
        <h2>予約履歴</h2>
        {customer.reservations.length === 0 ? (
          <p className={styles.empty}>予約履歴がありません</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>日時</th>
                <th>メニュー</th>
                <th>ステータス</th>
                <th>メモ</th>
              </tr>
            </thead>
            <tbody>
              {customer.reservations.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.startAt).toLocaleString('ja-JP')}</td>
                  <td>{r.menu.name}</td>
                  <td>
                    <span className={`${styles.status} ${
                      r.status === 'reserved' ? styles.statusReserved :
                      r.status === 'visited' ? styles.statusVisited :
                      r.status === 'cancelled' ? styles.statusCancelled :
                      styles.statusNoShow
                    }`}>{r.status}</span>
                  </td>
                  <td>{r.memo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

