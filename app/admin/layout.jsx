import Link from 'next/link'
import LogoutButton from './LogoutButton'
import styles from './admin.module.css'

export const metadata = {
  title: 'Admin | Kingsford Sleep',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>KS</span>
          <p>Admin</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Dashboard</Link>
          <Link href="/admin/products" className={styles.navLink}>Products</Link>
          <Link href="/admin/products/new" className={`${styles.navLink} ${styles.navNew}`}>+ Add Product</Link>
          <Link href="/admin/categories" className={styles.navLink}>Categories</Link>
          <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
          <Link href="/admin/reviews" className={styles.navLink}>Reviews</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink}>← Back to site</Link>
          <LogoutButton />
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
