import Link from 'next/link'
import styles from '../Css/Bedcard.module.css'

export default function BedCard({
  bed,
  size = 'md',
  configureUrl,
  viewUrl,
  showColours = true,
  showTagline = true,
  showActions = true,
}) {
  if (!bed) return null

  const colours = bed.colours || []
  const slug = bed.slug || ''
  const categorySlug = bed.categorySlug || ''

  const resolvedViewUrl = viewUrl || (categorySlug
    ? `/beds/${categorySlug}/${slug}`
    : `/beds/${slug}`)

  const resolvedConfigureUrl = configureUrl || (categorySlug
    ? `/configure?category=${categorySlug}&product=${slug}`
    : `/configure?bed=${slug}`)

  return (
    <article className={`${styles.card} ${styles[size]}`}>

      {/* Ambient glow */}
      <div className={styles.glow} />

      {/* Badge — always visible */}
      {bed.badge && (
        <span className={styles.badge}>{bed.badge}</span>
      )}

      {/* Full image — fills entire card */}
      <div className={styles.imageWrap}>
        {(bed.images?.[0] || bed.image) ? (
          <img src={bed.images?.[0] || bed.image} alt={bed.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" className={styles.placeholderIcon}>
              <path d="M6 38V18L24 8L42 18V38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 38V28H32V38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 26H42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Static bottom bar — always visible */}
      <div className={styles.staticBar}>
        <div>
          <span className={styles.staticName}>{bed.name}</span>
          {bed.reviewCount > 0 && (
            <div className={styles.staticRating}>
              <span className={styles.staticStars}>{'★'.repeat(Math.round(bed.avgRating))}</span>
              <span className={styles.staticRatingCount}>({bed.reviewCount})</span>
            </div>
          )}
        </div>
        <span className={styles.staticPrice}>£{bed.basePrice}</span>
      </div>

      {/* Hover drawer — slides up on hover */}
      <div className={styles.drawer}>
        <div className={styles.drawerInner}>

          <div className={styles.drawerTop}>
            <div>
              <h3 className={styles.drawerName}>{bed.name}</h3>
              {showTagline && bed.tagline && (
                <p className={styles.drawerTagline}>{bed.tagline}</p>
              )}
            </div>
            <div className={styles.drawerPrice}>
              <span className={styles.drawerPriceFrom}>From</span>
              <span className={styles.drawerPriceAmount}>£{bed.basePrice}</span>
            </div>
          </div>

          {/* Colour dots */}
          {showColours && colours.length > 0 && (
            <div className={styles.colours}>
              {colours.slice(0, 6).map((colour) => (
                <span
                  key={colour}
                  className={styles.colourDot}
                  title={colour}
                  aria-label={colour}
                />
              ))}
              {colours.length > 6 && (
                <span className={styles.colourMore}>+{colours.length - 6}</span>
              )}
            </div>
          )}

          {/* Action buttons */}
          {showActions && (
            <div className={styles.actions}>
              <Link href={resolvedViewUrl} className={`btn btn--outline ${styles.btnFull}`}>
                View Details
              </Link>
              <Link href={resolvedConfigureUrl} className={`btn btn--primary ${styles.btnFull}`}>
                Customise
              </Link>
            </div>
          )}

        </div>
      </div>

    </article>
  )
}