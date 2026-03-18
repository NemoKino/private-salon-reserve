'use client'

import { createCustomer } from '../actions'

import styles from '../customer_form.module.css'

export default function NewCustomerPage() {
  return (
    <div>
      <h1 className={styles.title}>新規顧客登録</h1>
      <form action={createCustomer} className={styles.customerForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>氏名 <span className={styles.required}>*</span></label>
            <input type="text" id="name" name="name" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nameKana" className={styles.label}>ふりがな</label>
            <input type="text" id="nameKana" name="nameKana" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>電話番号</label>
            <input type="tel" id="phone" name="phone" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>メールアドレス</label>
            <input type="email" id="email" name="email" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lineName" className={styles.label}>LINE名</label>
            <input type="text" id="lineName" name="lineName" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="instagramName" className={styles.label}>Instagram名</label>
            <input type="text" id="instagramName" name="instagramName" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="birthday" className={styles.label}>生年月日</label>
            <input type="date" id="birthday" name="birthday" className={styles.input} />
          </div>
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor="notes" className={styles.label}>注意事項メモ</label>
            <textarea id="notes" name="notes" rows={4} className={styles.textarea} />
          </div>
        </div>
        <div className={styles.formActions}>
          <a href="/admin/customers" className={styles.cancelButton}>キャンセル</a>
          <button type="submit" className={styles.submitButton}>登録</button>
        </div>
      </form>
    </div>
  )
}

