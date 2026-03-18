'use client'

import { createMenu } from '../actions'

import styles from '../menus.module.css'

export default function NewMenuPage() {
  return (
    <div>
      <h1 className={styles.title}>新規メニュー登録</h1>
      <form action={createMenu} className={styles.menuForm}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor="name" className={styles.label}>メニュー名 <span className={styles.required}>*</span></label>
            <input type="text" id="name" name="name" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>料金 (円) <span className={styles.required}>*</span></label>
            <input type="number" id="price" name="price" min="0" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="durationMinutes" className={styles.label}>所要時間 (分) <span className={styles.required}>*</span></label>
            <input type="number" id="durationMinutes" name="durationMinutes" min="15" step="15" defaultValue={60} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="targetType" className={styles.label}>対象客</label>
            <select id="targetType" name="targetType" className={styles.select}>
              <option value="all">全員</option>
              <option value="new">新規のみ</option>
              <option value="repeat">再来のみ</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="isPublic" className={styles.label}>公開設定</label>
            <select id="isPublic" name="isPublic" className={styles.select}>
              <option value="true">公開</option>
              <option value="false">非公開</option>
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor="description" className={styles.label}>説明</label>
            <textarea id="description" name="description" rows={3} className={styles.textarea} />
          </div>
        </div>
        <div className={styles.formActions}>
          <a href="/admin/menus" className={styles.cancelButton}>キャンセル</a>
          <button type="submit" className={styles.submitButton}>登録</button>
        </div>
      </form>
    </div>
  )
}

