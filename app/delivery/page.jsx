import Link from 'next/link'
import styles from '../components/Css/LegalPage.module.css'

export const metadata = {
  title: 'Delivery Information | Free UK Delivery | Kingsford Sleep',
  description: 'Free white-glove delivery across mainland UK. 3–4 week lead time. We deliver to your room, assemble your bed and remove all packaging.',
  alternates: { canonical: '/delivery' },
}

const sections = [
  { id: 'overview',    title: 'Delivery Overview' },
  { id: 'timescales',  title: 'Timescales' },
  { id: 'coverage',    title: 'Coverage Areas' },
  { id: 'process',     title: 'The Delivery Process' },
  { id: 'preparation', title: 'Preparing for Delivery' },
  { id: 'contact',     title: 'Contact Us' },
]

export default function DeliveryPage() {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className="container--narrow">
          <span className={styles.heroLabel}>Delivery Information</span>
          <div className={styles.goldLine} />
          <h1 className={styles.heroTitle}>Free UK <em>Delivery</em></h1>
          <p className={styles.heroSubtitle}>
            White-glove delivery included with every order. We bring it to your room, build it, and take the packaging away.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className="container">
          <div className={styles.layout}>

            {/* Sticky sidebar */}
            <nav className={styles.sideNav} aria-label="Page sections">
              <p className={styles.sideNavTitle}>Contents</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className={styles.sideNavLink}>{s.title}</a>
              ))}
            </nav>

            {/* Body */}
            <div className={styles.body}>

              <div id="overview" className={styles.section}>
                <h2 className={styles.sectionTitle}>Delivery Overview</h2>
                <div className={styles.sectionBody}>
                  <div className={styles.highlight}>
                    Free white-glove delivery is included with every Kingsford Sleep order to all mainland UK addresses. No hidden charges, no surcharges for large items.
                  </div>
                  <p>Every bed we make is handcrafted in our UK factory specifically for you. Because of this, delivery is not an off-the-shelf courier service — it is a dedicated two-person team that handles your bed from our factory floor to your bedroom.</p>
                  <p>We do not use third-party couriers for bed deliveries. Our own experienced delivery team handles every order, ensuring your bed arrives in perfect condition.</p>
                </div>
              </div>

              <div id="timescales" className={styles.section}>
                <h2 className={styles.sectionTitle}>Timescales</h2>
                <div className={styles.sectionBody}>
                  <h4>Standard lead time: 3–4 weeks</h4>
                  <p>From the moment your order is confirmed and your deposit received, your bed enters our production schedule. Most orders are completed and delivered within 3 to 4 weeks.</p>
                  <ul>
                    <li><strong>Week 1–2:</strong> Frame construction and upholstery</li>
                    <li><strong>Week 2–3:</strong> Quality inspection and finishing</li>
                    <li><strong>Week 3–4:</strong> Delivery scheduling and dispatch</li>
                  </ul>
                  <p>During busy periods (typically October–December) lead times may extend to 5–6 weeks. We will always communicate any delays as early as possible.</p>
                  <h4>Rush orders</h4>
                  <p>If you need your bed by a specific date, contact us before ordering and we will do our best to accommodate. Rush orders may carry an additional charge depending on current capacity.</p>
                </div>
              </div>

              <div id="coverage" className={styles.section}>
                <h2 className={styles.sectionTitle}>Coverage Areas</h2>
                <div className={styles.sectionBody}>
                  <h4>Mainland England and Wales — Free</h4>
                  <p>Free delivery is included for all addresses in mainland England and Wales. This covers all major cities and rural areas.</p>
                  <h4>Scotland — Free (most areas)</h4>
                  <p>We deliver free to most Scottish addresses including Edinburgh, Glasgow, Aberdeen and Inverness. For remote Highland and Island locations, please contact us before ordering to confirm availability and any surcharges.</p>
                  <h4>Northern Ireland</h4>
                  <p>We deliver to Northern Ireland. Please contact us before ordering for a delivery quote as additional costs may apply.</p>
                  <h4>Channel Islands and Isle of Man</h4>
                  <p>Deliveries to the Channel Islands and Isle of Man are available — please contact us for a bespoke quote.</p>
                  <h4>International</h4>
                  <p>We currently only deliver within the UK. If you are based outside the UK and interested in an order, please get in touch and we will explore options.</p>
                </div>
              </div>

              <div id="process" className={styles.section}>
                <h2 className={styles.sectionTitle}>The Delivery Process</h2>
                <div className={styles.sectionBody}>
                  <p>We believe delivery should be as smooth as receiving the bed is exciting. Here is what to expect:</p>
                  <ul>
                    <li><strong>Dispatch notification:</strong> You will receive a message when your bed leaves our factory with an estimated delivery window.</li>
                    <li><strong>Delivery confirmation:</strong> Our team will contact you 24–48 hours before delivery to confirm the exact time slot.</li>
                    <li><strong>Room of choice:</strong> Our two-person team will carry your bed to any room in your home, including up stairs.</li>
                    <li><strong>Full assembly:</strong> We will fully assemble your bed in position. This takes approximately 20–30 minutes.</li>
                    <li><strong>Packaging removal:</strong> All packaging and protective materials are taken away with us. You are left with nothing to deal with.</li>
                    <li><strong>Final check:</strong> We will run through the bed with you and answer any questions before we leave.</li>
                  </ul>
                </div>
              </div>

              <div id="preparation" className={styles.section}>
                <h2 className={styles.sectionTitle}>Preparing for Delivery</h2>
                <div className={styles.sectionBody}>
                  <p>To ensure a smooth delivery, please consider the following before your delivery date:</p>
                  <ul>
                    <li>Measure your bedroom doorway, hallway and staircase to confirm access for your chosen bed size.</li>
                    <li>Clear a path from your front door to your bedroom — we need approximately 1 metre of clearance.</li>
                    <li>Remove any existing bed or furniture if replacing. We can assist with moving existing furniture within the room at no extra charge.</li>
                    <li>Note: we are unable to dispose of old beds or mattresses. Please arrange collection separately.</li>
                    <li>If you live in a flat with lift access, please ensure the lift is large enough for your bed size before ordering.</li>
                  </ul>
                  <p>If you have any access concerns, please contact us before your delivery date — we would rather know in advance and plan accordingly.</p>
                </div>
              </div>

              <div id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <div className={styles.sectionBody}>
                  <div className={styles.contactBox}>
                    <h4>Questions about your delivery?</h4>
                    <p>Our team is available 7 days a week.</p>
                    <a href="https://wa.me/923174704165">WhatsApp: Chat with us →</a>
                    <a href="mailto:hello@kingsfordsleep.co.uk">hello@kingsfordsleep.co.uk</a>
                    <Link href="/contact" style={{ color: '#c9a96e', fontSize: '0.85rem', textDecoration: 'none' }}>Use our contact form →</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
