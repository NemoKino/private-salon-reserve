'use client'

import { deleteMenu } from '../app/admin/menus/actions'
import styles from '../app/admin/menus/menus.module.css'

export default function DeleteMenuButton({ id }: { id: string }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (confirm('削除しますか?')) {
      await deleteMenu(id)
    }
  }

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className={styles.deleteBtn}>
        削除
      </button>
    </form>
  )
}
