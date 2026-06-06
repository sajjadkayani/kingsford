'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '../Css/CategorySpotlight.module.css'

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }
const slideLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }
const slideRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }

const ease = [0.22, 1, 0.36, 1]

export default function CategorySpotlight({ category, reversed = false, index = 0 }) {
  if (!category) return null

  const products = category.products.slice(0, 4)
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.basePrice)) : null

  const textVariant = reversed ? slideRight : slideLeft
  const gridVariant = reversed ? slideLeft : slideRight

  return (
    <section className={`${styles.section} ${reversed ? styles.reversed : ''}`}>
      <span className={styles.bgNumber} aria-hidden="true">0{index + 1}</span>
      <div className="container">
        <div className={styles.inner}>

          {/* Text column */}
          <motion.div
            className={styles.textCol}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={textVariant}
            transition={{ duration: 0.7, ease }}
          >
            <span className={styles.label}>{category.category}</span>
            <div className={styles.goldLine} />
            <h2 className={styles.title}>
              {categoryHeadings[category.slug]?.title || category.category}
            </h2>
            <p className={styles.description}>
              {categoryHeadings[category.slug]?.desc || category.description}
            </p>
            <div className={styles.meta}>
              <span className={styles.metaCount}>{category.products.length} beds</span>
              {minPrice && (
                <>
                  <span className={styles.metaDivider} />
                  <span className={styles.priceFrom}>From <strong>£{minPrice}</strong></span>
                </>
              )}
            </div>
            <Link href={`/beds/${category.slug}`} className={styles.viewAll}>
              View all {category.category}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          {/* Product grid */}
          <motion.div
            className={styles.gridCol}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                transition={{ duration: 0.55, ease }}
              >
                <Link href={`/beds/${category.slug}/${product.slug}`} className={styles.card}>
                  <div className={styles.cardImgWrap}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className={styles.cardImg} />
                    ) : (
                      <div className={styles.cardImgPlaceholder}>
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                          <path d="M6 38V18L24 8L42 18V38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          <path d="M16 38V28H32V38" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                    {product.badge && <span className={styles.cardBadge}>{product.badge}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardName}>{product.name}</p>
                    <p className={styles.cardTagline}>{product.tagline}</p>
                    <p className={styles.cardPrice}>From £{product.basePrice}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

const categoryHeadings = {
  ottoman: {
    title: <>Lift-up storage, <em>beautifully made</em></>,
    desc: 'Our bestselling Ottoman beds combine generous under-bed storage with handcrafted upholstered frames. Maximum space, zero compromise on style.',
  },
  wingback: {
    title: <>Make a <em>statement</em></>,
    desc: 'The wingback headboard commands any bedroom. Tall, dramatic, and unmistakably British. Available in velvet, linen, chenille and faux leather.',
  },
  divan: {
    title: <>Classic comfort, <em>reimagined</em></>,
    desc: 'Traditional divan bases with modern upholstery. Side drawers or Ottoman lift — all the storage you need, all the style you deserve.',
  },
  panel: {
    title: <>Clean lines, <em>timeless design</em></>,
    desc: 'Panel beds for the modern home. Structured headboards, clean silhouettes, available in every size and fabric we offer.',
  },
  sleigh: {
    title: <>Curves that <em>captivate</em></>,
    desc: 'Sweeping curves and a classic silhouette. The Sleigh bed has graced bedrooms for centuries — our handcrafted version brings it into the present.',
  },
  chesterfield: {
    title: <>Deep buttoning, <em>pure luxury</em></>,
    desc: 'Diamond buttoning, rolled arms, padded grandeur. The Chesterfield is the most opulent bed in our collection — made entirely by hand.',
  },
  'low-profile': {
    title: <>Modern, minimal, <em>considered</em></>,
    desc: 'Low to the ground, high on style. For contemporary bedrooms that value clean architecture over decoration.',
  },
}
