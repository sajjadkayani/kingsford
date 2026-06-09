'use client'
import { useState } from 'react'
import { SingleImageUploader } from '@/app/components/admin/ImageUploader'
import styles from '../admin.module.css'

export default function FabricsClient({ initialFabrics }) {
  const [fabrics, setFabrics]     = useState(initialFabrics)
  const [newName, setNewName]     = useState('')
  const [newImage, setNewImage]   = useState('')
  const [adding, setAdding]       = useState(false)
  const [addError, setAddError]   = useState('')
  const [editId, setEditId]       = useState(null)
  const [editName, setEditName]   = useState('')
  const [editImage, setEditImage] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleAdd() {
    if (!newName.trim()) { setAddError('Enter a fabric name'); return }
    setAdding(true)
    setAddError('')
    try {
      const res  = await fetch('/api/fabrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), image: newImage }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add fabric')
      setFabrics(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewImage('')
    } catch (err) {
      setAddError(err.message)
    } finally {
      setAdding(false)
    }
  }

  function startEdit(fabric) {
    setEditId(fabric.id)
    setEditName(fabric.name)
    setEditImage(fabric.image)
    setSaveError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditName('')
    setEditImage('')
    setSaveError('')
  }

  async function handleSave() {
    if (!editName.trim()) { setSaveError('Name is required'); return }
    setSaving(true)
    setSaveError('')
    try {
      const res  = await fetch(`/api/fabrics/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), image: editImage }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setFabrics(prev =>
        prev.map(f => f.id === editId ? data : f).sort((a, b) => a.name.localeCompare(b.name))
      )
      cancelEdit()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This will not affect products already using it.`)) return
    try {
      const res = await fetch(`/api/fabrics/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to delete') }
      setFabrics(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>

      {/* ── Add new fabric ── */}
      <div style={{
        background: '#141310', border: '1px solid #2a2820', borderRadius: 8,
        padding: '1.25rem', marginBottom: '1.5rem',
      }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#c9a96e', fontWeight: 600 }}>
          Add New Fabric
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginBottom: 4 }}>
              Fabric Name *
            </label>
            <input
              value={newName}
              onChange={e => { setNewName(e.target.value); setAddError('') }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Velvet, Chenille, Boucle"
              style={{
                width: '100%', background: '#0f0e0c', border: `1px solid ${addError ? '#e05555' : '#2a2820'}`,
                borderRadius: 5, color: '#f5f0e8', padding: '0.5rem 0.75rem', fontSize: '0.88rem',
                boxSizing: 'border-box',
              }}
            />
            {addError && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{addError}</span>}
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginBottom: 4 }}>
              Texture Image
            </label>
            <SingleImageUploader
              value={newImage}
              onChange={url => setNewImage(url)}
              placeholder="Upload fabric texture"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ alignSelf: 'flex-start', opacity: adding ? 0.6 : 1 }}
          >
            {adding ? 'Adding…' : '+ Add Fabric'}
          </button>
        </div>
      </div>

      {/* ── Fabric list ── */}
      {fabrics.length === 0 ? (
        <p style={{ color: '#555', fontSize: '0.85rem' }}>No fabrics yet. Add one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fabrics.map(fabric => (
            <div
              key={fabric.id}
              style={{
                background: '#141310', border: '1px solid #2a2820', borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {editId === fabric.id ? (
                /* ── Edit mode ── */
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginBottom: 4 }}>
                      Name *
                    </label>
                    <input
                      value={editName}
                      onChange={e => { setEditName(e.target.value); setSaveError('') }}
                      style={{
                        width: '100%', background: '#0f0e0c', border: `1px solid ${saveError ? '#e05555' : '#2a2820'}`,
                        borderRadius: 5, color: '#f5f0e8', padding: '0.45rem 0.7rem', fontSize: '0.88rem',
                        boxSizing: 'border-box',
                      }}
                    />
                    {saveError && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{saveError}</span>}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#888', display: 'block', marginBottom: 4 }}>
                      Texture Image
                    </label>
                    <SingleImageUploader
                      value={editImage}
                      onChange={url => setEditImage(url)}
                      placeholder="Upload fabric texture"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      style={{ opacity: saving ? 0.6 : 1 }}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} className={styles.btn} style={{ color: '#888' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem' }}>
                  {fabric.image ? (
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 5, border: '1px solid #2a2820', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 52, height: 52, borderRadius: 5, border: '1px dashed #2a2820',
                      background: '#0f0e0c', flexShrink: 0, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.65rem', color: '#444',
                    }}>
                      No img
                    </div>
                  )}
                  <span style={{ flex: 1, fontWeight: 600, color: '#f5f0e8', fontSize: '0.95rem' }}>
                    {fabric.name}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => startEdit(fabric)}
                      className={styles.btn}
                      style={{ fontSize: '0.78rem', padding: '4px 12px', color: '#c9a96e', border: '1px solid #c9a96e' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fabric.id, fabric.name)}
                      className={styles.btn}
                      style={{ fontSize: '0.78rem', padding: '4px 12px', color: '#e05555', border: '1px solid #e05555' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
