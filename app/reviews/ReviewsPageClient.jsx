'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../components/Css/Reviewspage.module.css'

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

export default function ReviewsPageClient({ reviews = [], product = null }) {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product')
  const productName = searchParams.get('name') || product?.name || ''

  const [form, setForm] = useState({
    name: '', location: '',
    bed: productName,
    rating: 5, review: '',
    productSlug: productSlug || null,
    productName: productName || null,
  })
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (honeypot) return
    setSubmitting(true)
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className="container--narrow">
          <span className="section-label">Customer Reviews</span>
          <div className="gold-line" />
          <h1 className={`display-heading ${styles.title}`}>
            What our customers <em>say</em>
          </h1>
          <div className={styles.aggregate}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.starFilled}>★</span>
              ))}
            </div>
            <span className={styles.aggregateText}>5.0 average · {reviews.length} reviews</span>
          </div>
        </div>
      </div>

      <div className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.layout}>

            {/* Reviews list */}
            <div className={styles.reviewsList}>
              <h2 className={`display-heading ${styles.sectionTitle}`}>All <em>reviews</em></h2>
              <div className={styles.grid}>
                {reviews.length === 0 && (
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>No approved reviews yet.</p>
                )}
                {reviews.map(review => (
                  <article key={review.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <Stars count={review.rating} />
                      {review.verified && <span className={styles.verified}>✓ Verified Purchase</span>}
                    </div>
                    <p className={styles.reviewText}>&ldquo;{review.review}&rdquo;</p>
                    <div className={styles.cardBottom}>
                      <div className={styles.avatar}>{review.name.charAt(0)}</div>
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{review.name}</span>
                        <span className={styles.customerMeta}>
                          {[review.location, review.bed, review.date].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className={styles.formCol}>
              <div className={styles.formWrap}>
                <h2 className={`display-heading ${styles.formTitle}`}>Leave a <em>review</em></h2>
                <p className={styles.formNote}>Have you ordered from us? We would love to hear from you.</p>

                {/* Product banner — shown when coming from a product page */}
                {product && (
                  <div>
                    <p className={styles.reviewingLabel}>You are reviewing:</p>
                    <Link
                      href={`/beds/${product.categorySlug}/${product.slug}`}
                      className={styles.productBanner}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productBannerImg}
                        />
                      ) : (
                        <div className={styles.productBannerImgPlaceholder}>
                          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                            <path d="M6 38V18L24 8L42 18V38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M16 38V28H32V38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      )}
                      <div className={styles.productBannerInfo}>
                        <span className={styles.productBannerName}>{product.name}</span>
                        <span className={styles.productBannerTagline}>{product.tagline}</span>
                        <span className={styles.productBannerPrice}>From £{product.basePrice}</span>
                      </div>
                      <span className={styles.productBannerArrow}>↗</span>
                    </Link>
                  </div>
                )}

                {submitted ? (
                  <div className={styles.thanks}>
                    <div className={styles.thanksIcon}>✓</div>
                    <h3 className={styles.thanksTitle}>Thank you!</h3>
                    <p className={styles.thanksText}>Your review has been submitted and will appear after approval.</p>
                  </div>
                ) : (
                  <div className={styles.form}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Your Name *</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Sarah Mitchell"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Your Location</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Manchester"
                        value={form.location}
                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      />
                    </div>

                    {/* Only show bed selector if NOT coming from a specific product */}
                    {!product && (
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Which bed did you buy?</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Ottoman Storage Bed"
                          value={form.bed}
                          onChange={e => setForm(p => ({ ...p, bed: e.target.value }))}
                        />
                      </div>
                    )}

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Rating *</label>
                      <div className={styles.ratingPicker}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            className={`${styles.ratingStar} ${star <= form.rating ? styles.ratingStarActive : ''}`}
                            onClick={() => setForm(p => ({ ...p, rating: star }))}
                            aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Your Review *</label>
                      <textarea
                        className={styles.textarea}
                        placeholder={product
                          ? `Tell us about your ${product.name}...`
                          : 'Tell us about your experience...'}
                        value={form.review}
                        onChange={e => setForm(p => ({ ...p, review: e.target.value }))}
                        rows={5}
                      />
                    </div>

                    {/* Honeypot — hidden from real users, catches bots */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={e => setHoneypot(e.target.value)}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    <button
                      className={`btn btn--primary ${styles.submitBtn}`}
                      onClick={handleSubmit}
                      disabled={!form.name || !form.review || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
