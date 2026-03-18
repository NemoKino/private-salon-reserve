'use client'

import { useState } from 'react'
import { login } from './actions'
import styles from './login.module.css'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className={styles['login-container']}>
      <main className={styles['login-card']}>
        <h1>Private Salon Admin</h1>
        <p>管理者としてログインしてください</p>

        {error && <div className={styles['error-message']}>{error}</div>}

        <form action={handleSubmit} className={styles['login-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className={styles['login-button']}>ログイン</button>
        </form>
      </main>
    </div>
  )
}
