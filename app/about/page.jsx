import Link from 'next/link'
import styles from '../components/Css/About.module.css'

export const metadata = {
  title: 'About Us | UK Bed Manufacturer | Kingsford Sleep',
  description:
    'Kingsford Sleep is a UK bed manufacturer specialising in handcrafted, made to order beds. Learn about our factory, our craft and our commitment to quality.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container--narrow">
          <span className="section-label">Our Story</span>
          <div className="gold-line" />
          <h1 className={`display-heading ${styles.title}`}>
            Built by hand. <em>Built to last.</em>
          </h1>
          <p className={styles.intro}>
            Kingsford Sleep was built on a simple belief — that a bed should be made properly.
            Not assembled from flat packs, not shipped from overseas, not built to a price point.
            Built by skilled hands, in a real factory, with materials that last.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className={`section section--dark ${styles.story}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <div className={styles.imagePlaceholder}>
                <span>Factory Photo</span>
                <span className={styles.imageSub}>Coming soon</span>
              </div>
            </div>
            <div className={styles.storyContent}>
              <span className="section-label">The Factory</span>
              <div className="gold-line gold-line--left" />
              <h2 className={`display-heading ${styles.storyTitle}`}>
                Made in the <em>United Kingdom</em>
              </h2>
              <p className={styles.storyText}>
                Every bed that carries the Kingsford Sleep name is made in our UK factory
                by a team of skilled craftsmen who take real pride in their work.
                We do not outsource, we do not import, we do not cut corners.
              </p>
              <p className={styles.storyText}>
                When you order from us, your bed does not exist yet. It is built for you,
                to your specifications, from the fabric you chose to the size you need.
                That is what made to order really means.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className={`section ${styles.values}`}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <span className="section-label">What We Stand For</span>
            <div className="gold-line" />
            <h2 className={`display-heading ${styles.valuesTitle}`}>
              Our <em>commitments</em>
            </h2>
          </div>
          <div className={styles.valuesGrid}>
            {[
              { title: 'Honest Pricing', text: 'No inflated RRPs. No fake discounts. Factory direct means you pay what a bed is actually worth.' },
              { title: 'Real Craftsmanship', text: 'Every joint, every stitch, every finish is done by hand by people who know what they are doing.' },
              { title: 'Your Specification', text: 'Your size. Your fabric. Your colour. We do not sell beds off a shelf. We build them to order.' },
              { title: 'Personal Service', text: 'You will speak to a real person. WhatsApp us, email us, call us. We are here throughout.' },
            ].map((value) => (
              <div key={value.title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`section ${styles.cta}`}>
        <div className="container--narrow">
          <h2 className={`display-heading ${styles.ctaTitle}`}>
            Ready to build your <em>perfect bed?</em>
          </h2>
          <div className={styles.ctaButtons}>
            <Link href="/configure" className="btn btn--primary">Build Your Bed</Link>
            <Link href="/contact" className="btn btn--outline">Get in Touch</Link>
          </div>
        </div>
      </div>

    </div>
  )
}