'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartCount, toggleCart } from '../../store/cartSlice'
import styles from '../Css/Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartCount)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.open : ''}`}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Kingsford Sleep — Home">
          <span className={styles.logoText}>Kingsford</span>
          <span className={styles.logoSub}>Sleep</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/beds" className={styles.link}>Collection</Link>
          <Link href="/configure" className={styles.link}>Build Your Bed</Link>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Cart icon */}
          <button
            className={styles.cartBtn}
            onClick={() => dispatch(toggleCart())}
            aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>

          <Link href="/configure" className={`btn btn--primary ${styles.cta}`}>
            Get a Quote
          </Link>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobile}>
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <Link href="/beds" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Collection</Link>
            <Link href="/configure" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Build Your Bed</Link>
            <Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</Link>
            <button className={styles.mobileLink} onClick={() => { dispatch(toggleCart()); setMenuOpen(false) }} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
            <Link href="/configure" className="btn btn--primary" onClick={() => setMenuOpen(false)}>Get a Quote</Link>
          </nav>
        </div>
      )}

    </header>
  )
}
