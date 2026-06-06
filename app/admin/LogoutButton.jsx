'use client'

import { useRouter } from 'next/navigation'
import styles from './admin.module.css'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className={styles.navLink}
      style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#e05555', padding: '0.6rem 0.75rem', width: '100%', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit' }}
    >
      Sign out
    </button>
  )
}
