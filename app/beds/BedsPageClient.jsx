'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BedCard from '../components/ui/BedCard'
import styles from '../components/Css/Bedspage.module.css'

const ease = [0.22, 1, 0.36, 1]

export default function BedsPageClient({ categories }) {
  const totalProducts = categories.reduce((s, c) => s + c.products.length, 0)

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container--narrow">
          <motion.span
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            Our Collection
          </motion.span>

          <div className="gold-line" style={{ margin: '0.75rem auto' }} />

          <motion.h1
            className={`display-heading ${styles.title}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
          >
            Handcrafted beds for <em>every home</em>
          </motion.h1>

          <motion.p
            className={styles.intro}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            Every bed built to order in our UK factory. Browse by style below.
          </motion.p>

          <motion.div
            className={styles.heroStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            <span><span className={styles.heroStatValue}>{categories.length}</span> styles</span>
            <span className={styles.heroStatDivider} />
            <span><span className={styles.heroStatValue}>{totalProducts}</span> beds</span>
            <span className={styles.heroStatDivider} />
            <span>Free UK delivery</span>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.categories}>
            {categories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                className={styles.categoryRow}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease }}
              >
                {/* Background number */}
                <span className={styles.rowBgNumber} aria-hidden="true">
                  {String(catIndex + 1).padStart(2, '0')}
                </span>

                {/* Row header */}
                <div className={styles.rowHeader}>
                  <div className={styles.rowHeaderLeft}>
                    <span className={styles.rowIndex}>
                      {String(catIndex + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                    </span>
                    <h2 className={`display-heading ${styles.categoryName}`}>
                      {category.category}
                    </h2>
                    <p className={styles.categoryDesc}>{category.description}</p>
                  </div>
                  <Link href={`/beds/${category.slug}`} className={styles.viewAll}>
                    View all
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                {/* Product cards — staggered */}
                <motion.div
                  className={styles.productRow}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
                >
                  {category.products.map((product) => (
                    <motion.div
                      key={product.id}
                      className={styles.cardWrap}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                      }}
                    >
                      <BedCard
                        bed={{ ...product, categorySlug: category.slug }}
                        size="sm"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
