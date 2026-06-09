import Link from 'next/link'
import styles from '../components/Css/LegalPage.module.css'

export const metadata = {
  title: 'Returns & After-Care | Kingsford Sleep',
  description: 'Kingsford Sleep returns policy and after-care guidance for your handcrafted bed.',
  alternates: { canonical: '/returns' },
}

const sections = [
  { id: 'returns',   title: 'Returns Policy' },
  { id: 'faults',    title: 'Damaged on Arrival' },
  { id: 'aftercare', title: 'After-Care Guidance' },
  { id: 'contact',   title: 'Contact Us' },
]

export default function ReturnsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container--narrow">
          <span className="section-label">Returns &amp; After-Care</span>
          <div className="gold-line" />
          <h1 className={`display-heading ${styles.title}`}>
            Returns &amp; <em>After-Care</em>
          </h1>
          <p className={styles.intro}>
            Every Kingsford Sleep bed is handcrafted to your exact specification. Here is everything
            you need to know about our returns process and how to care for your bed.
          </p>
        </div>
      </div>

      <div className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.layout}>

            {/* Sidebar nav */}
            <nav className={styles.sidebar}>
              <p className={styles.sidebarLabel}>On this page</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className={styles.sidebarLink}>{s.title}</a>
              ))}
            </nav>

            {/* Body */}
            <div className={styles.body}>

              <section id="returns" className={styles.section}>
                <h2 className={styles.sectionTitle}>Returns Policy</h2>
                <p>Because every Kingsford Sleep bed is <strong>handcrafted to your exact specification</strong> — your chosen size, fabric and colour — we are unable to accept returns for change of mind.</p>
                <p>Made-to-order products are exempt from standard distance-selling return rights under the Consumer Contracts Regulations 2013 (Regulation 28(1)(b)), which permits exclusion of the right to cancel for goods clearly personalised or made to the consumer&apos;s specification.</p>
                <p>We strongly recommend:</p>
                <ul className={styles.list}>
                  <li>Requesting free fabric swatches before ordering — email us at <a href="mailto:hello@kingsfordsleep.co.uk" className={styles.link}>hello@kingsfordsleep.co.uk</a></li>
                  <li>Confirming your room measurements before selecting a size</li>
                  <li>Contacting us with any questions before placing your order</li>
                </ul>
              </section>

              <section id="faults" className={styles.section}>
                <h2 className={styles.sectionTitle}>Damaged on Arrival</h2>
                <p>If your bed arrives with a manufacturing defect or was damaged in transit, we will repair or replace it at no cost to you.</p>
                <p><strong>What to do if your bed arrives damaged:</strong></p>
                <ol className={styles.list}>
                  <li>Note the damage on the delivery paperwork before the team leaves</li>
                  <li>Take clear photographs of the damage</li>
                  <li>Email <a href="mailto:hello@kingsfordsleep.co.uk" className={styles.link}>hello@kingsfordsleep.co.uk</a> within 48 hours of delivery with your photos and order number</li>
                  <li>We will arrange repair or replacement as quickly as possible</li>
                </ol>
                <p>We aim to respond to all reports within 1 working day.</p>
              </section>

              <section id="aftercare" className={styles.section}>
                <h2 className={styles.sectionTitle}>After-Care Guidance</h2>
                <p>Your bed will last many years with simple care. Follow these guidelines to keep it looking its best:</p>

                <h3 className={styles.subTitle}>All Upholstered Beds</h3>
                <ul className={styles.list}>
                  <li>Vacuum the upholstery regularly using the soft brush attachment</li>
                  <li>Spot clean with a dry, clean cloth — blot, do not rub</li>
                  <li>Avoid prolonged direct sunlight, which can cause colour fading</li>
                  <li>Keep away from direct heat sources (radiators, heaters)</li>
                </ul>

                <h3 className={styles.subTitle}>Velvet</h3>
                <ul className={styles.list}>
                  <li>Brush velvet with a soft clothes brush in one direction to maintain the pile</li>
                  <li>Use a barely damp cloth for liquid spills — allow to air dry completely</li>
                  <li>Avoid pressing firmly on the pile as this can crush the fabric</li>
                </ul>

                <h3 className={styles.subTitle}>Faux Leather</h3>
                <ul className={styles.list}>
                  <li>Wipe with a lightly damp cloth — mild soap solution for stubborn marks</li>
                  <li>Avoid abrasive cleaners which can damage the surface</li>
                </ul>

                <h3 className={styles.subTitle}>Ottoman Storage Base</h3>
                <ul className={styles.list}>
                  <li>Do not exceed the recommended weight limit inside the storage area</li>
                  <li>Lift the base using the handle — do not force it open</li>
                  <li>Lubricate the gas pistons annually with a small amount of silicone spray</li>
                </ul>
              </section>

              <section id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <p>Have a question about your order or need advice on care?</p>
                <p>
                  Email: <a href="mailto:hello@kingsfordsleep.co.uk" className={styles.link}>hello@kingsfordsleep.co.uk</a><br />
                  We aim to respond within 1 working day.
                </p>
                <p>
                  <Link href="/contact" className={styles.link}>Visit our contact page →</Link>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
