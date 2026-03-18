import Link from 'next/link'
import styles from './home.module.css'

export default function Home() {
  return (
    <div className={styles.landing}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Private Salon</h1>
          <span className={styles.salonName}>DEMO</span>
          <div className={styles.heroSeparator}></div>
          <p>あなただけの、特別な時間と空間を。</p>
          <div className={styles.heroActions}>
            <Link href="/booking" className={`${styles.btn} ${styles.btnPrimary}`}>
              ご予約はこちら
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>完全予約制</h3>
          <p>他のお客様と重なることのない、完全プライベートな空間です。</p>
        </div>
        <div className={styles.feature}>
          <h3>マンツーマン</h3>
          <p>カウンセリングから仕上げまで、一人のスタイリストが担当します。</p>
        </div>
        <div className={styles.feature}>
          <h3>24時間受付</h3>
          <p>いつでもお好きなタイミングで、スマートフォンからご予約いただけます。</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/admin">管理者ログイン</Link>
        </div>
        <p>© 2026 DEMO. All rights reserved.</p>
      </footer>
    </div>
  )
}
