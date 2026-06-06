'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import BedCard from '../ui/BedCard'
import styles from '../Css/Featuredbeds.module.css'

const ease = [0.22, 1, 0.36, 1]

export default function FeaturedBeds({ categories = [] }) {
  const allBeds = categories.flatMap(cat =>
    cat.products.map(product => ({ ...product, categorySlug: cat.slug }))
  )

  const [index, setIndex] = useState(0)
  const total = allBeds.length
  const visible = 4
  const maxIndex = Math.max(0, total - visible)

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  if (total === 0) return null

  return (
    <section className={`section ${styles.featured}`} aria-labelledby="featured-heading">
      <div className="container">

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className={styles.headerLeft}>
            <span className="section-label">Our Collection</span>
            <div className="gold-line gold-line--left" />
            <h2 id="featured-heading" className={`display-heading ${styles.title}`}>
              Handcrafted for <em>every bedroom</em>
            </h2>
          </div>
          <div className={styles.headerRight}>
            <Link href="/beds" className="btn btn--outline">View All</Link>
            <button
              className={`${styles.arrow} ${index === 0 ? styles.arrowDisabled : ''}`}
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className={`${styles.arrow} ${index >= maxIndex ? styles.arrowDisabled : ''}`}
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </motion.div>

        <div className={styles.carouselWrap}>
          <div
            className={styles.track}
            style={{ transform: `translateX(calc(-${index} * (100% / ${visible} + 4px)))` }}
          >
            {allBeds.map((bed) => (
              <div key={`${bed.categorySlug}-${bed.id}`} className={styles.cardWrap}>
                <BedCard bed={bed} size="md" />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className={styles.progress}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          style={{ transformOrigin: 'left' }}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${((index + visible) / total) * 100}%` }}
          />
        </motion.div>

      </div>
    </section>
  )
}
