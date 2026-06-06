'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'

const PER_PAGE = 15

export default function ProductsTable({ products, categories }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(null)
  const [page, setPage] = useState(1)

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.category]))

  const totalPages = Math.ceil(products.length / PER_PAGE)
  const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeleting(product.id)
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Badge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#555', padding: '2rem' }}>
                  No products yet.
                </td>
              </tr>
            )}
            {paginated.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 500, color: '#f5f0e8' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#555' }}>{p.slug}</div>
                </td>
                <td style={{ color: '#a09890' }}>{catMap[p.categorySlug] || p.categorySlug}</td>
                <td style={{ color: '#c9a96e', fontWeight: 500 }}>£{p.basePrice}</td>
                <td style={{ fontSize: '0.78rem', color: '#777' }}>{(p.sizes || []).join(', ')}</td>
                <td>{p.badge && <span className={styles.badge}>{p.badge}</span>}</td>
                <td>
                  <div className={styles.btnGroup}>
                    <Link
                      href={`/beds/${p.categorySlug}/${p.slug}`}
                      target="_blank"
                      className={`${styles.btn} ${styles.btnOutline}`}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className={`${styles.btn} ${styles.btnOutline}`}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deleting === p.id}
                      className={`${styles.btn} ${styles.btnDanger}`}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {deleting === p.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#555' }}>
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, products.length)} of {products.length} products
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', opacity: page === 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`${styles.btn} ${n === page ? styles.btnPrimary : styles.btnOutline}`}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', minWidth: '34px' }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
