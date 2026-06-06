import Link from 'next/link'
import { getProductReviews } from '../../../lib/data'
import styles from './ProductReviews.module.css'

function Stars({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? styles.starOn : styles.starOff}>★</span>
      ))}
    </div>
  )
}

export default async function ProductReviews({ productSlug, productName, categorySlug }) {
  const reviews = await getProductReviews(productSlug)

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className={styles.aggregate}>
              <Stars count={Math.round(avgRating)} />
              <span className={styles.aggregateText}>
                {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        <Link
          href={`/reviews?product=${productSlug}&name=${encodeURIComponent(productName)}`}
          className={styles.writeBtn}
        >
          Write a review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No reviews yet for this bed.</p>
          <p className={styles.emptySubText}>Be the first to share your experience.</p>
          <Link
            href={`/reviews?product=${productSlug}&name=${encodeURIComponent(productName)}`}
            className={styles.emptyBtn}
          >
            Leave the first review →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {reviews.map(r => (
            <article key={r.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Stars count={r.rating} />
                {r.verified && <span className={styles.verified}>✓ Verified</span>}
              </div>
              <p className={styles.reviewText}>&ldquo;{r.review}&rdquo;</p>
              <div className={styles.cardBottom}>
                <div className={styles.avatar}>{r.name.charAt(0)}</div>
                <div>
                  <span className={styles.name}>{r.name}</span>
                  <span className={styles.meta}>{r.location}{r.location && ' · '}{r.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
