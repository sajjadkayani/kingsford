import Link from 'next/link'
import styles from '../Css/Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">

        {/* Top section */}
        <div className={styles.top}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Kingsford</span>
              <span className={styles.logoSub}>Sleep</span>
            </Link>
            <p className={styles.tagline}>
              Handcrafted beds made in our UK factory.
              Custom sizes, fabrics and finishes.
              Built to order. Delivered across Britain.
            </p>
            <a
              href="https://wa.me/923174704165?text=Hi, I would like to enquire about a bed from Kingsford Sleep."
              className={`btn btn--whatsapp ${styles.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Navigation links — important for SEO internal linking */}
          <div className={styles.links}>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Collection</h3>
              <ul className={styles.linkList}>
                <li><Link href="/beds/ottoman-storage-bed" className={styles.link}>Ottoman Storage Bed</Link></li>
                <li><Link href="/beds/panel-bed-frame" className={styles.link}>Panel Bed Frame</Link></li>
                <li><Link href="/beds/wingback-bed-frame" className={styles.link}>Wingback Bed Frame</Link></li>
                <li><Link href="/beds" className={styles.link}>View All Beds</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Company</h3>
              <ul className={styles.linkList}>
                <li><Link href="/about" className={styles.link}>About Us</Link></li>
                <li><Link href="/contact" className={styles.link}>Contact</Link></li>
                <li><Link href="/configure" className={styles.link}>Get a Quote</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Help</h3>
              <ul className={styles.linkList}>
                <li><Link href="/faq" className={styles.link}>FAQ</Link></li>
                <li><Link href="/reviews" className={styles.link}>Reviews</Link></li>
                <li><Link href="/delivery" className={styles.link}>Delivery Info</Link></li>
                <li><Link href="/returns" className={styles.link}>Returns &amp; After-Care</Link></li>
                <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={styles.link}>Terms &amp; Conditions</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {currentYear} Kingsford Sleep. All rights reserved.
          </p>
          <p className={styles.made}>
            Handcrafted in the United Kingdom
          </p>
        </div>

      </div>
    </footer>
  )
}