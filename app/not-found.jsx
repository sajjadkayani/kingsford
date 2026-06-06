import Link from 'next/link'
import styles from './components/Css/Notfound.module.css'

export const metadata = {
  title: 'Page Not Found | Kingsford Sleep',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className="section-label">404</span>
        <div className="gold-line" />
        <h1 className={`display-heading ${styles.title}`}>
          Page not <em>found</em>
        </h1>
        <p className={styles.text}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className={styles.buttons}>
          <Link href="/" className="btn btn--primary">Back to Home</Link>
          <Link href="/beds" className="btn btn--outline">View Collection</Link>
        </div>
      </div>
    </div>
  )
}