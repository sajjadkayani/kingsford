'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'
import { COLOUR_HEX, ALL_COLOURS } from '@/app/components/data/colours'
import { SingleImageUploader, MultiImageUploader } from '@/app/components/admin/ImageUploader'

const ALL_SIZES = ['Single', 'Small Double', 'Double', 'King', 'Super King']

const FABRIC_SUGGESTIONS = ['Velvet', 'Linen', 'Chenille', 'Faux Leather', 'Boucle', 'Plush', 'Suede', 'Cotton', 'Wool']

const ALL_ADDONS = [
  'Diamond Buttoning', 'Chrome Feet', 'Gold Feet', 'Wooden Feet',
  'Matching Headboard', 'USB Ports', 'Ottoman Storage', 'Side Drawers',
]

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildInitialFabricColours(initialData) {
  if (initialData?.fabricColours && Object.keys(initialData.fabricColours).length > 0) {
    return initialData.fabricColours
  }
  // Migrate old format: assign all colours to each existing fabric
  if (initialData?.fabrics?.length > 0) {
    const result = {}
    for (const f of initialData.fabrics) {
      result[f] = initialData.colours || []
    }
    return result
  }
  return {}
}

export default function ProductForm({ categories, initialData = null }) {
  const router  = useRouter()
  const editing = !!initialData
  const topRef  = useRef(null)

  const [form, setForm] = useState({
    name:          initialData?.name || '',
    slug:          initialData?.slug || '',
    tagline:       initialData?.tagline || '',
    description:   initialData?.description || '',
    basePrice:     initialData?.basePrice || '',
    badge:         initialData?.badge || '',
    categorySlug:  initialData?.categorySlug || categories[0]?.slug || '',
    images:        initialData?.images || [],
    fabricColours: buildInitialFabricColours(initialData),
    fabricImages:  initialData?.fabricImages || {},
    sizes:         initialData?.sizes || [],
    addons:        initialData?.addons || [],
    addonPrices:   initialData?.addonPrices || {},
  })

  const [newFabricName, setNewFabricName] = useState('')
  const [slugLocked, setSlugLocked]       = useState(editing)
  const [errors, setErrors]               = useState({})
  const [status, setStatus]               = useState(null)
  const [loading, setLoading]             = useState(false)

  useEffect(() => {
    if (!slugLocked && form.name) {
      setForm(f => ({ ...f, slug: slugify(f.name) }))
    }
  }, [form.name, slugLocked])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function toggle(field, value) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter(v => v !== value) : [...f[field], value],
    }))
  }

  function setAddonPrice(addon, price) {
    setForm(f => ({ ...f, addonPrices: { ...f.addonPrices, [addon]: price } }))
  }

  // Fabric & colour handlers
  function addFabric() {
    const name = newFabricName.trim()
    if (!name || form.fabricColours[name] !== undefined) return
    setForm(f => ({ ...f, fabricColours: { ...f.fabricColours, [name]: [] } }))
    setNewFabricName('')
  }

  function removeFabric(fabric) {
    setForm(f => {
      const updatedColours = { ...f.fabricColours }
      const updatedImages  = { ...f.fabricImages }
      delete updatedColours[fabric]
      delete updatedImages[fabric]
      return { ...f, fabricColours: updatedColours, fabricImages: updatedImages }
    })
  }

  function setFabricImage(fabric, url) {
    setForm(f => ({ ...f, fabricImages: { ...f.fabricImages, [fabric]: url } }))
  }

  function toggleFabricColour(fabric, colour) {
    setForm(f => {
      const existing = f.fabricColours[fabric] || []
      const updated = existing.includes(colour)
        ? existing.filter(c => c !== colour)
        : [...existing, colour]
      return { ...f, fabricColours: { ...f.fabricColours, [fabric]: updated } }
    })
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name        = 'Required'
    if (!form.slug.trim())        e.slug        = 'Required'
    if (!form.tagline.trim())     e.tagline     = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.basePrice || Number(form.basePrice) <= 0) e.basePrice = 'Enter a price greater than 0'
    if (!form.categorySlug)       e.categorySlug = 'Select a category'
    for (const addon of form.addons) {
      const price = form.addonPrices[addon]
      if (!price || Number(price) <= 0) {
        e[`addon_${addon}`] = `Enter a price for "${addon}"`
      }
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setStatus({ type: 'error', message: 'Fix the errors below before saving.' })
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setLoading(true)
    setStatus(null)
    setErrors({})

    // Derive flat arrays from fabricColours for backward compat
    const fabrics = Object.keys(form.fabricColours)
    const colours = [...new Set(Object.values(form.fabricColours).flat())]

    const cleanAddonPrices = {}
    for (const addon of form.addons) {
      cleanAddonPrices[addon] = Number(form.addonPrices[addon])
    }

    const payload = {
      name:         form.name.trim(),
      slug:         form.slug.trim(),
      tagline:      form.tagline.trim(),
      description:  form.description.trim(),
      basePrice:    Number(form.basePrice),
      badge:        form.badge.trim() || null,
      categorySlug: form.categorySlug,
      images:       form.images,
      fabricColours: form.fabricColours,
      fabricImages:  form.fabricImages,
      fabrics,
      colours,
      sizes:        form.sizes,
      addons:       form.addons,
      addonPrices:  cleanAddonPrices,
    }

    const url    = editing ? `/api/products/${initialData.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'

    try {
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
      setStatus({ type: 'success', message: editing ? 'Product updated!' : 'Product created!' })
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (!editing) setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } finally {
      setLoading(false)
    }
  }

  const fabricList = Object.keys(form.fabricColours)

  return (
    <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
      <div ref={topRef} />

      {status && (
        <div className={`${styles.alert} ${status.type === 'error' ? styles.alertError : styles.alertSuccess}`}
          style={{ fontSize: '0.9rem', padding: '0.9rem 1rem', fontWeight: 500 }}>
          {status.type === 'error' ? '✗ ' : '✓ '}{status.message}
        </div>
      )}

      <div className={styles.formGrid}>

        {/* Name */}
        <div className={styles.formGroup}>
          <label>Product Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Classic Ottoman"
            style={{ borderColor: errors.name ? '#e05555' : undefined }} />
          {errors.name && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.name}</span>}
        </div>

        {/* Slug */}
        <div className={styles.formGroup}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Slug *</span>
            {!editing && (
              <button type="button" onClick={() => setSlugLocked(l => !l)}
                style={{ fontSize: '0.68rem', color: slugLocked ? '#c9a96e' : '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {slugLocked ? '🔒 Manual' : '✦ Auto'}
              </button>
            )}
          </label>
          <input value={form.slug} onChange={e => { setSlugLocked(true); set('slug', e.target.value) }}
            placeholder="classic-ottoman" style={{ borderColor: errors.slug ? '#e05555' : undefined }} />
          {errors.slug && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.slug}</span>}
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label>Category *</label>
          <select value={form.categorySlug} onChange={e => set('categorySlug', e.target.value)}
            style={{ borderColor: errors.categorySlug ? '#e05555' : undefined }}>
            <option value="">— Select category —</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.category}</option>)}
          </select>
          {errors.categorySlug && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.categorySlug}</span>}
        </div>

        {/* Base Price */}
        <div className={styles.formGroup}>
          <label>Base Price (£) *</label>
          <input type="number" min="1" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} placeholder="599"
            style={{ borderColor: errors.basePrice ? '#e05555' : undefined }} />
          {errors.basePrice && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.basePrice}</span>}
        </div>

        {/* Tagline */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label>Tagline *</label>
          <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Clean lines, generous storage."
            style={{ borderColor: errors.tagline ? '#e05555' : undefined }} />
          {errors.tagline && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.tagline}</span>}
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label>Description *</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full product description..."
            style={{ borderColor: errors.description ? '#e05555' : undefined }} />
          {errors.description && <span style={{ fontSize: '0.73rem', color: '#e05555' }}>{errors.description}</span>}
        </div>

        {/* Badge */}
        <div className={styles.formGroup}>
          <label>Badge (optional)</label>
          <input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="Best Seller / New / Popular" />
        </div>

        {/* Images */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label>Product Images</label>
          <MultiImageUploader
            value={form.images}
            onChange={v => set('images', v)}
          />
        </div>

        {/* Sizes */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label>Available Sizes</label>
          <div className={styles.checkGroup}>
            {ALL_SIZES.map(s => (
              <label key={s} className={styles.checkLabel}>
                <input type="checkbox" checked={form.sizes.includes(s)} onChange={() => toggle('sizes', s)} />{s}
              </label>
            ))}
          </div>
        </div>

        {/* ── Fabrics & Colours ── */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label style={{ marginBottom: '0.5rem', display: 'block' }}>
            Fabrics &amp; Colours
            <span style={{ color: '#555', fontWeight: 400, fontSize: '0.75rem', marginLeft: 8 }}>
              — each fabric has its own colour palette
            </span>
          </label>

          <div style={{ border: '1px solid #2a2820', borderRadius: 6, overflow: 'hidden' }}>
            {fabricList.length === 0 && (
              <p style={{ padding: '1rem', color: '#555', fontSize: '0.85rem', margin: 0 }}>
                No fabrics added yet. Add one below.
              </p>
            )}

            {fabricList.map((fabric, idx) => {
              const selectedColours = form.fabricColours[fabric] || []
              return (
                <div key={fabric} style={{ borderBottom: idx < fabricList.length - 1 ? '1px solid #2a2820' : 'none' }}>
                  {/* Fabric header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 1rem', background: '#1a1814', gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      {/* Fabric image preview / URL input */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, color: '#c9a96e', fontSize: '0.9rem' }}>{fabric}</span>
                          <span style={{ fontSize: '0.72rem', color: '#555' }}>
                            {selectedColours.length} colour{selectedColours.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <SingleImageUploader
                          value={form.fabricImages[fabric] || ''}
                          onChange={url => setFabricImage(fabric, url)}
                          placeholder={`${fabric} texture image`}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFabric(fabric)}
                      style={{ color: '#e05555', background: 'none', border: '1px solid #e05555', borderRadius: 4, cursor: 'pointer', fontSize: '0.72rem', padding: '2px 8px', flexShrink: 0 }}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Colour checkboxes */}
                  <div style={{
                    padding: '0.75rem 1rem', background: '#0f0e0c',
                    display: 'flex', flexWrap: 'wrap', gap: '0.4rem 0.6rem',
                  }}>
                    {ALL_COLOURS.map(colour => {
                      const checked = selectedColours.includes(colour)
                      return (
                        <label
                          key={colour}
                          onClick={() => toggleFabricColour(fabric, colour)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                            border: checked ? '1px solid #c9a96e' : '1px solid #2a2820',
                            background: checked ? '#1e1c18' : 'transparent',
                            fontSize: '0.78rem', color: checked ? '#f5f0e8' : '#888',
                            transition: 'all 0.12s', userSelect: 'none',
                          }}
                        >
                          <span style={{
                            width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                            background: COLOUR_HEX[colour] || '#888',
                            border: '1px solid rgba(255,255,255,0.12)',
                            display: 'inline-block',
                          }} />
                          {colour}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Add fabric row */}
            <div style={{
              padding: '0.65rem 1rem', background: '#0a0908',
              borderTop: fabricList.length > 0 ? '1px solid #2a2820' : 'none',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
            }}>
              <input
                type="text"
                list="fabric-suggestions"
                placeholder="Type fabric name (e.g. Velvet) then press Add"
                value={newFabricName}
                onChange={e => setNewFabricName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFabric() } }}
                style={{
                  flex: 1, background: '#141310', border: '1px solid #2a2820',
                  borderRadius: 4, color: '#f5f0e8', padding: '0.45rem 0.75rem', fontSize: '0.85rem',
                }}
              />
              <datalist id="fabric-suggestions">
                {FABRIC_SUGGESTIONS.filter(f => !form.fabricColours[f]).map(f => <option key={f} value={f} />)}
              </datalist>
              <button
                type="button"
                onClick={addFabric}
                disabled={!newFabricName.trim() || form.fabricColours[newFabricName.trim()] !== undefined}
                style={{
                  padding: '0.45rem 1rem', background: '#c9a96e', color: '#0f0e0c',
                  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600, whiteSpace: 'nowrap', opacity: (!newFabricName.trim() || form.fabricColours[newFabricName.trim()] !== undefined) ? 0.4 : 1,
                }}
              >
                + Add Fabric
              </button>
            </div>
          </div>
        </div>

        {/* Add-ons with prices */}
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label>Add-ons &amp; Prices <span style={{ color: '#555', fontWeight: 400, fontSize: '0.75rem' }}>— only selected add-ons appear on the product page</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#141310', border: '1px solid #2a2820', borderRadius: '6px', padding: '0.75rem' }}>
            {ALL_ADDONS.map(a => {
              const checked = form.addons.includes(a)
              const errKey  = `addon_${a}`
              return (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label className={styles.checkLabel} style={{ minWidth: '180px', flexShrink: 0 }}>
                    <input type="checkbox" checked={checked} onChange={() => {
                      toggle('addons', a)
                      if (!checked && !form.addonPrices[a]) setAddonPrice(a, '')
                    }} />
                    {a}
                  </label>
                  {checked && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                      <span style={{ color: '#555', fontSize: '0.8rem' }}>£</span>
                      <input
                        type="number" min="1"
                        value={form.addonPrices[a] || ''}
                        onChange={e => setAddonPrice(a, e.target.value)}
                        placeholder="e.g. 80"
                        style={{
                          background: '#0f0e0c', border: `1px solid ${errors[errKey] ? '#e05555' : '#2a2820'}`,
                          borderRadius: '5px', color: '#f5f0e8', padding: '0.35rem 0.6rem',
                          fontSize: '0.85rem', width: '100px',
                        }}
                      />
                      {errors[errKey] && <span style={{ fontSize: '0.72rem', color: '#e05555' }}>{errors[errKey]}</span>}
                    </div>
                  )}
                  {!checked && <span style={{ fontSize: '0.75rem', color: '#333', fontStyle: 'italic' }}>not offered</span>}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      <div className={styles.formActions}>
        <button type="submit" disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`} style={{ minWidth: '160px', justifyContent: 'center' }}>
          {loading ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className={`${styles.btn} ${styles.btnOutline}`}>Cancel</button>
        {loading && <span style={{ fontSize: '0.8rem', color: '#888', alignSelf: 'center' }}>Saving to database…</span>}
      </div>
    </form>
  )
}
