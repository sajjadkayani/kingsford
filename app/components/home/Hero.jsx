'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '../Css/Hero.module.css'

const ease = [0.22, 1, 0.36, 1]

const slides = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #2a1a0e 0%, #1a0f08 40%, #0f0e0c 100%)',
    accent: '#C9A96E',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #0a1520 0%, #0f1a2a 40%, #0f0e0c 100%)',
    accent: '#8BA5B8',
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #1a1a0e 0%, #252510 40%, #0f0e0c 100%)',
    accent: '#B8B88A',
  },
  {
    id: 4,
    bg: 'linear-gradient(135deg, #1a0e14 0%, #2a1020 40%, #0f0e0c 100%)',
    accent: '#B88AA0',
  },
]

const slideLabels = [
  'Ottoman Storage Bed',
  'Wingback Bed Frame',
  'Panel Bed Frame',
  'Bespoke Collection',
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  return (
    <section className={styles.hero} aria-label="Kingsford Sleep — Handcrafted British Beds">

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === current ? styles.slideActive : ''} ${index === prev ? styles.slidePrev : ''}`}
          style={{ background: slide.bg }}
          aria-hidden={index !== current}
        >
          <div className={styles.silhouette}>
            <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.silhouetteSvg}>
              <rect x="100" y="80" width="600" height="180" rx="8" fill={slide.accent} fillOpacity="0.06"/>
              <rect x="100" y="80" width="600" height="20" rx="4" fill={slide.accent} fillOpacity="0.12"/>
              <rect x="80" y="240" width="640" height="80" rx="6" fill={slide.accent} fillOpacity="0.08"/>
              <rect x="100" y="310" width="600" height="40" rx="4" fill={slide.accent} fillOpacity="0.1"/>
              <rect x="110" y="348" width="20" height="30" rx="3" fill={slide.accent} fillOpacity="0.15"/>
              <rect x="670" y="348" width="20" height="30" rx="3" fill={slide.accent} fillOpacity="0.15"/>
              <rect x="160" y="170" width="180" height="60" rx="30" fill={slide.accent} fillOpacity="0.1"/>
              <rect x="460" y="170" width="180" height="60" rx="30" fill={slide.accent} fillOpacity="0.1"/>
            </svg>
          </div>
        </div>
      ))}

      <div className={styles.overlay} style={{ transform: `translateY(${scrollY * 0.15}px)` }} />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      <div className={styles.content}>
        <motion.span
          className={`section-label ${styles.label}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          British Craftsmanship · Factory Direct
        </motion.span>

        <h1 className={styles.headline}>
          {['Sleep in', 'something', 'beautiful'].map((word, i) => (
            <motion.span
              key={word}
              className={`${styles.line} ${i === 1 ? styles.lineItalic : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease }}
        >
          Handcrafted beds made in our UK factory. Custom sizes, fabrics &amp; finishes.
          Built to order. Delivered across Britain.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.88, ease }}
        >
          <Link href="/beds" className={`btn btn--primary ${styles.ctaPrimary}`}>
            View Collection
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/configure" className="btn btn--outline">
            Build Your Bed
          </Link>
        </motion.div>

        <motion.div
          className={styles.trust}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
        >
          <div className={styles.trustItem}><span className={styles.trustDot} /><span>UK Manufactured</span></div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}><span className={styles.trustDot} /><span>Custom Made to Order</span></div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}><span className={styles.trustDot} /><span>Free UK Delivery</span></div>
        </motion.div>
      </div>

      <div className={styles.indicators} aria-hidden="true">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === current ? styles.indicatorActive : ''}`}
            onClick={() => { setPrev(current); setCurrent(index) }}
            aria-label={slideLabels[index]}
          />
        ))}
      </div>

      <div className={styles.slideLabel} aria-hidden="true">
        <span key={current} className={styles.slideLabelText}>
          {slideLabels[current]}
        </span>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>

    </section>
  )
}