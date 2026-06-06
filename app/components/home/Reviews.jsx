'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import styles from '../Css/Reviews.module.css'

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

export default function Reviews({ reviews = [] }) {
  const [isPaused, setIsPaused] = useState(false)
  const doubled = [...reviews, ...reviews]

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kingsford Sleep',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(reviews.length),
      bestRating: '5',
      worstRating: '1',
    },
  }

  if (reviews.length === 0) return null

  return (
    <section className={`section ${styles.reviews}`} aria-labelledby="reviews-heading">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <div className={styles.header}>
        <span className="section-label">Customer Reviews</span>
        <div className="gold-line" />
        <h2 id="reviews-heading" className={`display-heading ${styles.title}`}>
          What our customers <em>say</em>
        </h2>
        <div className={styles.aggregate}>
          <Stars count={5} />
          <span className={styles.aggregateText}>5.0 · {reviews.length} verified reviews</span>
        </div>
      </div>

      <div
        className={styles.carousel}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`${styles.track} ${isPaused ? styles.trackPaused : ''}`}>
          {doubled.map((review, index) => (
            <div key={`${review.id}-${index}`} className={styles.card}>
              <div className={styles.cardTop}>
                <Stars count={review.rating} />
                {review.verified && <span className={styles.verified}>✓ Verified</span>}
              </div>
              <p className={styles.reviewText}>{review.review}</p>
              <div className={styles.cardBottom}>
                <div className={styles.avatar}>{review.name.charAt(0)}</div>
                <div className={styles.customerInfo}>
                  <span className={styles.customerName}>{review.name}</span>
                  <span className={styles.customerMeta}>{review.location} · {review.date}</span>
                  <span className={styles.bedTag}>{review.bed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cta}>
        <Link href="/reviews" className="btn btn--outline">Read All Reviews</Link>
      </div>

    </section>
  )
}
