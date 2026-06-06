'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoriesClient({ categories }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStatus({ type: 'success', message: 'Category created!' })
      setForm({ name: '', slug: '', description: '' })
      router.refresh()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td style={{ color: '#f5f0e8', fontWeight: 500 }}>{c.category}</td>
                <td><code style={{ color: '#c9a96e', fontSize: '0.8rem' }}>{c.slug}</code></td>
                <td>{c.products.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add category form */}
      <form onSubmit={handleCreate} className={styles.formCard} style={{ padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 600, color: '#f5f0e8' }}>Add Category</h2>
        {status && (
          <div className={`${styles.alert} ${status.type === 'error' ? styles.alertError : styles.alertSuccess}`}>
            {status.message}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input value={form.name} onChange={(e) => { set('name', e.target.value); if (!form.slug) set('slug', slugify(e.target.value)) }} required placeholder="Ottoman Beds" />
          </div>
          <div className={styles.formGroup}>
            <label>Slug *</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="ottoman" />
          </div>
          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="Short description shown on the collections page." />
          </div>
          <button type="submit" disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '0.25rem' }}>
            {loading ? 'Creating…' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  )
}
