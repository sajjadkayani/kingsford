import Link from 'next/link'
import { getAllCategories } from '../lib/data'
import connectDB from '../lib/mongodb'
import Product from '../models/Product'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await connectDB()
  const categories = await getAllCategories()
  const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0)

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + Add Product
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.category}</td>
                <td><code style={{ color: '#c9a96e', fontSize: '0.8rem' }}>{cat.slug}</code></td>
                <td>{cat.products.length}</td>
                <td>
                  <div className={styles.btnGroup}>
                    <Link href={`/admin/products?category=${cat.slug}`} className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}>
                      View products
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
