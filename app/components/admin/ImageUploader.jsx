'use client'
import { useState, useRef } from 'react'

async function uploadFile(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  onProgress(true)
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data.url
  } finally {
    onProgress(false)
  }
}

/* ── Single image uploader (for fabric images etc.) ── */
export function SingleImageUploader({ value, onChange, placeholder = 'Fabric image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [urlInput, setUrlInput]   = useState('')
  const [dragging, setDragging]   = useState(false)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setError('')
    try {
      const url = await uploadFile(file, setUploading)
      onChange(url)
    } catch (e) {
      setError(e.message)
    }
  }

  function applyUrl() {
    const u = urlInput.trim()
    if (u) { onChange(u); setUrlInput('') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {value ? (
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <img
            src={value}
            alt="fabric"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #2a2820', display: 'block' }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: -6, right: -6, width: 20, height: 20,
              borderRadius: '50%', background: '#e05555', border: 'none',
              color: '#fff', fontSize: 12, cursor: 'pointer', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => inputRef.current?.click()}
          style={{
            width: 80, height: 80, borderRadius: 6, cursor: 'pointer',
            border: `1.5px dashed ${dragging ? '#c9a96e' : '#3a3830'}`,
            background: dragging ? '#1e1c18' : '#0f0e0c',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, transition: 'all 0.15s',
          }}
        >
          {uploading ? (
            <span style={{ fontSize: 11, color: '#c9a96e' }}>Uploading…</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span style={{ fontSize: 9, color: '#555', textAlign: 'center', lineHeight: 1.3 }}>Drop or<br/>click</span>
            </>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])} />

      {/* URL fallback */}
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          type="text"
          placeholder="or paste URL"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl() } }}
          style={{
            flex: 1, background: '#0f0e0c', border: '1px solid #2a2820', borderRadius: 4,
            color: '#888', padding: '3px 7px', fontSize: '0.72rem',
          }}
        />
        <button type="button" onClick={applyUrl}
          style={{ padding: '3px 8px', background: '#2a2820', border: 'none', borderRadius: 4, color: '#888', fontSize: '0.72rem', cursor: 'pointer' }}>
          Use
        </button>
      </div>

      {error && <span style={{ fontSize: '0.72rem', color: '#e05555' }}>{error}</span>}
    </div>
  )
}

/* ── Multi image uploader (for product images) ── */
export function MultiImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [urlInput, setUrlInput]   = useState('')
  const [dragging, setDragging]   = useState(false)
  const inputRef = useRef(null)

  async function handleFiles(files) {
    if (!files?.length) return
    setError('')
    const uploaded = []
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, () => {})
        uploaded.push(url)
      }
      onChange([...value, ...uploaded])
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  function addUrl() {
    const u = urlInput.trim()
    if (u && !value.includes(u)) { onChange([...value, u]); setUrlInput('') }
  }

  function remove(idx) {
    onChange(value.filter((_, i) => i !== idx))
  }

  function move(idx, dir) {
    const arr = [...value]
    const swap = idx + dir
    if (swap < 0 || swap >= arr.length) return
    ;[arr[idx], arr[swap]] = [arr[swap], arr[idx]]
    onChange(arr)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Existing images */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map((url, i) => (
            <div key={url + i} style={{ position: 'relative', width: 80, height: 80 }}>
              <img
                src={url}
                alt={`img ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #2a2820', display: 'block' }}
              />
              {/* Remove */}
              <button type="button" onClick={() => remove(i)}
                style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#e05555', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
              {/* Order badge */}
              <span style={{ position: 'absolute', bottom: 2, left: 4, fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                {i + 1}
              </span>
              {/* Move arrows */}
              <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', gap: 1 }}>
                {i > 0 && (
                  <button type="button" onClick={() => move(i, -1)}
                    style={{ width: 16, height: 16, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 9, cursor: 'pointer', borderRadius: '2px 0 0 0' }}>
                    ‹
                  </button>
                )}
                {i < value.length - 1 && (
                  <button type="button" onClick={() => move(i, 1)}
                    style={{ width: 16, height: 16, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 9, cursor: 'pointer', borderRadius: '0 2px 0 0' }}>
                    ›
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? '#c9a96e' : '#3a3830'}`,
          borderRadius: 6, padding: '18px 12px', cursor: 'pointer',
          background: dragging ? '#1e1c18' : '#0f0e0c',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 6, transition: 'all 0.15s',
        }}
      >
        {uploading ? (
          <span style={{ fontSize: 13, color: '#c9a96e' }}>Uploading…</span>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span style={{ fontSize: 12, color: '#555' }}>
              Drag &amp; drop images here, or <span style={{ color: '#c9a96e' }}>browse</span>
            </span>
            <span style={{ fontSize: 11, color: '#333' }}>JPG, PNG, WebP — max 8MB each</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />

      {/* URL input */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          placeholder="Or paste an image URL and press Add"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }}
          style={{
            flex: 1, background: '#141310', border: '1px solid #2a2820', borderRadius: 5,
            color: '#f5f0e8', padding: '0.5rem 0.75rem', fontSize: '0.85rem',
          }}
        />
        <button type="button" onClick={addUrl}
          style={{ padding: '0.5rem 1rem', background: '#2a2820', border: 'none', borderRadius: 5, color: '#b0a898', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Add URL
        </button>
      </div>

      {error && <span style={{ fontSize: '0.78rem', color: '#e05555' }}>{error}</span>}
    </div>
  )
}
