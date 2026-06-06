'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BedCard from '../../components/ui/BedCard'
import styles from '../../components/Css/Categorypage.module.css'

const ease = [0.22, 1, 0.36, 1]

export default function CategoryPageClient({ cat }) {
  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}>Home</Link>
            <span className={styles.bcSep}>/</span>
            <Link href="/beds" className={styles.bcLink}>Collection</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcCurrent}>{cat.category}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.heroBgText} aria-hidden="true">{cat.category}</span>
        <div className="container--narrow" style={{ position: 'relative', zIndex: 1 }}>

          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            {cat.category}
          </motion.span>

          <div className="gold-line" style={{ margin: '0.75rem auto' }} />

          <motion.h1
            className={`display-heading ${styles.title}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
          >
            {cat.category}
          </motion.h1>

          <motion.p
            className={styles.intro}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            {cat.description}
          </motion.p>

          <motion.p
            className={styles.count}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease }}
          >
            {cat.products.length} beds available · All made to order · Free UK delivery
          </motion.p>

        </div>
      </div>

      {/* Grid */}
      <div className={`section ${styles.gridSection}`}>
        <div className="container">
          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          >
            {cat.products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 36 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                }}
              >
                <BedCard
                  bed={{ ...product, categorySlug: cat.slug }}
                  size="md"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  )
}
