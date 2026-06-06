'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'

function Stars({ count }) {
  return (
    <span style={{ color: '#c9a96e', fontSize: '0.85rem' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

export default function ReviewsAdmin({ reviews: initial }) {
  const router = useRouter()
  const [reviews, setReviews] = useState(initial)
  const [loading, setLoading] = useState(null)
  const [tab, setTab] = useState('pending')

  const filtered = reviews.filter(r => r.status === tab)

  async function approve(id) {
    setLoading(id + '-approve')
    await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', verified: true }),
    })
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', verified: true } : r))
    setLoading(null)
  }

  async function remove(id) {
    if (!confirm('Delete this review?')) return
    setLoading(id + '-delete')
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
    setLoading(null)
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['pending', 'approved'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`${styles.btn} ${tab === t ? styles.btnPrimary : styles.btnOutline}`}
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.82rem', textTransform: 'capitalize' }}
          >
            {t} ({reviews.filter(r => r.status === t).length})
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Bed</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#555', padding: '2rem' }}>No {tab} reviews.</td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 500, color: '#f5f0e8' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{r.location}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', color: '#a09890' }}>{r.bed || r.productName || '—'}</div>
                  {r.productSlug && <div style={{ fontSize: '0.7rem', color: '#555' }}>{r.productSlug}</div>}
                </td>
                <td><Stars count={r.rating} /></td>
                <td style={{ maxWidth: '260px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#a09890', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {r.review}
                  </p>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#666' }}>{r.date}</td>
                <td>
                  <div className={styles.btnGroup}>
                    {r.status === 'pending' && (
                      <button onClick={() => approve(r.id)} disabled={loading === r.id + '-approve'}
                        className={`${styles.btn} ${styles.btnOutline}`}
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: '#55c077', borderColor: '#1a6030' }}
                      >
                        {loading === r.id + '-approve' ? '…' : 'Approve'}
                      </button>
                    )}
                    <button onClick={() => remove(r.id)} disabled={loading === r.id + '-delete'}
                      className={`${styles.btn} ${styles.btnDanger}`}
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      {loading === r.id + '-delete' ? '…' : 'Delete'}
                    </button>
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
