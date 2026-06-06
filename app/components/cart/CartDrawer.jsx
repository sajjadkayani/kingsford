'use client'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartItems, selectCartOpen, selectCartTotal, selectCartCount,
  closeCart, removeItem, clearCart,
} from '../../store/cartSlice'
import styles from '../Css/CartDrawer.module.css'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const open = useSelector(selectCartOpen)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)

  const [phase, setPhase] = useState('cart') // 'cart' | 'checkout' | 'success'
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function handleClose() {
    dispatch(closeCart())
    setPhase('cart')
    setError('')
  }

  async function handleCheckout() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit order')
      dispatch(clearCart())
      setPhase('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.drawer} role="dialog" aria-label="Shopping cart">

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Your Cart
            {count > 0 && <span className={styles.count}>({count} {count === 1 ? 'item' : 'items'})</span>}
          </h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Success state */}
        {phase === 'success' && (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Order Received!</h3>
            <p className={styles.successText}>
              Thank you {form.name}. We&apos;ll confirm your order within 24 hours.
            </p>
            <button className={styles.successClose} onClick={handleClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {/* Empty cart */}
        {phase === 'cart' && items.length === 0 && (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M6 38V18L24 8L42 18V38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <path d="M16 38V28H32V38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>Browse our collection and add beds you love</p>
          </div>
        )}

        {/* Cart items */}
        {phase === 'cart' && items.length > 0 && (
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.cartId} className={styles.item}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                ) : (
                  <div className={styles.itemImgPlaceholder}>No image</div>
                )}
                <div className={styles.itemBody}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>
                    {item.size} · {item.fabric} · {item.colour}
                    {item.addons?.length > 0 && <><br />{item.addons.join(', ')}</>}
                  </p>
                  <div className={styles.itemFooter}>
                    <span className={styles.itemPrice}>£{item.price}</span>
                    <button className={styles.removeBtn} onClick={() => dispatch(removeItem(item.cartId))}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart footer */}
        {phase === 'cart' && items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Total</span>
              <span className={styles.subtotalAmount}>£{total}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={() => setPhase('checkout')}>
              Proceed to Checkout
            </button>
            <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
              Clear cart
            </button>
          </div>
        )}

        {/* Checkout form */}
        {phase === 'checkout' && (
          <div className={styles.items}>
            <div className={styles.checkoutForm}>
              <h3 className={styles.formTitle}>Your Details</h3>
              {error && <div className={styles.alertError}>{error}</div>}
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith" />
              </div>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+44 7700 000000" />
              </div>
              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special requirements..." />
              </div>
              <div className={styles.formBtns}>
                <button className={styles.submitBtn} onClick={handleCheckout} disabled={!form.name || !form.email || submitting}>
                  {submitting ? 'Sending…' : `Place Order — £${total}`}
                </button>
                <button className={styles.backBtn} onClick={() => setPhase('cart')}>Back</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
