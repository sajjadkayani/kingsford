import Link from 'next/link'
import { getAllCategories } from '../../lib/data'
import ProductsTable from './ProductsTable'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({ searchParams }) {
  const { category: categoryFilter } = await searchParams
  const categories = await getAllCategories()

  const products = categoryFilter
    ? categories.find((c) => c.slug === categoryFilter)?.products || []
    : categories.flatMap((c) => c.products.map((p) => ({ ...p, categoryName: c.category })))

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Products {categoryFilter && <span style={{ color: '#c9a96e', fontWeight: 400, fontSize: '1rem' }}>— {categoryFilter}</span>}
        </h1>
        <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + Add Product
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <Link
          href="/admin/products"
          className={`${styles.btn} ${!categoryFilter ? styles.btnPrimary : styles.btnOutline}`}
          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/products?category=${cat.slug}`}
            className={`${styles.btn} ${categoryFilter === cat.slug ? styles.btnPrimary : styles.btnOutline}`}
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
          >
            {cat.category}
          </Link>
        ))}
      </div>

      <ProductsTable products={products} categories={categories} />
    </>
  )
}
