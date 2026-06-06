import styles from '../components/Css/LegalPage.module.css'

export const metadata = {
  title: 'Terms & Conditions | Kingsford Sleep',
  description: 'Terms and conditions for purchasing from Kingsford Sleep. Made-to-order bed manufacturer based in the UK.',
  alternates: { canonical: '/terms' },
}

const sections = [
  { id: 'intro',    title: 'Introduction' },
  { id: 'orders',   title: 'Orders & Payment' },
  { id: 'made',     title: 'Made-to-Order' },
  { id: 'delivery', title: 'Delivery' },
  { id: 'returns',  title: 'Returns & Cancellations' },
  { id: 'warranty', title: 'Warranty' },
  { id: 'liability',title: 'Liability' },
  { id: 'general',  title: 'General' },
]

export default function TermsPage() {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className="container--narrow">
          <span className={styles.heroLabel}>Legal</span>
          <div className={styles.goldLine} />
          <h1 className={styles.heroTitle}>Terms &amp; <em>Conditions</em></h1>
          <p className={styles.heroSubtitle}>Please read these terms carefully before placing your order.</p>
          <p className={styles.heroMeta}>Last updated: January 2025</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className="container">
          <div className={styles.layout}>

            <nav className={styles.sideNav} aria-label="Page sections">
              <p className={styles.sideNavTitle}>Contents</p>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className={styles.sideNavLink}>{s.title}</a>
              ))}
            </nav>

            <div className={styles.body}>

              <div id="intro" className={styles.section}>
                <h2 className={styles.sectionTitle}>Introduction</h2>
                <div className={styles.sectionBody}>
                  <p>These terms and conditions govern your purchase of products from Kingsford Sleep (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By placing an order, you agree to be bound by these terms.</p>
                  <p>Kingsford Sleep is a UK-based bed manufacturer. Our contact email is <a href="mailto:hello@kingsfordsleep.co.uk" style={{ color: '#c9a96e' }}>hello@kingsfordsleep.co.uk</a>.</p>
                </div>
              </div>

              <div id="orders" className={styles.section}>
                <h2 className={styles.sectionTitle}>Orders &amp; Payment</h2>
                <div className={styles.sectionBody}>
                  <h4>Placing an order</h4>
                  <p>An order is confirmed when we have received your order details and deposit payment. You will receive a written confirmation via email. Until this point, no contract exists between us.</p>
                  <h4>Pricing</h4>
                  <p>All prices are quoted in Great British Pounds (£) and are inclusive of VAT where applicable. Prices are subject to change but any change will not affect an order that has already been confirmed.</p>
                  <h4>Payment terms</h4>
                  <ul>
                    <li>A 50% deposit is required to begin production of your order</li>
                    <li>The remaining 50% balance is due before delivery</li>
                    <li>We accept bank transfer and major debit/credit cards</li>
                    <li>Failure to pay the balance before your delivery date may result in your delivery being rescheduled</li>
                  </ul>
                </div>
              </div>

              <div id="made" className={styles.section}>
                <h2 className={styles.sectionTitle}>Made-to-Order</h2>
                <div className={styles.sectionBody}>
                  <div className={styles.highlight}>
                    Every Kingsford Sleep bed is manufactured specifically for you. Your order enters production immediately upon receipt of your deposit. Please ensure all specifications are correct before confirming your order.
                  </div>
                  <p>We will make every effort to match the fabric and colour to your selection. Due to the nature of handcrafted upholstery and the variation between screens, minor colour differences between product images and the finished bed may occur. We strongly recommend requesting fabric samples before ordering.</p>
                  <p>Dimensions quoted on our website are approximate. Actual dimensions may vary by up to ±2cm. If precise sizing is critical, please contact us before ordering.</p>
                </div>
              </div>

              <div id="delivery" className={styles.section}>
                <h2 className={styles.sectionTitle}>Delivery</h2>
                <div className={styles.sectionBody}>
                  <p>Lead times are estimates and not guaranteed. While we aim to deliver within 3–4 weeks, delays can occur due to material availability, production capacity or unforeseen circumstances. We will communicate any delays as early as possible.</p>
                  <p>You are responsible for ensuring adequate access to your property for delivery. If our team is unable to deliver due to access issues that were not communicated in advance, a redelivery charge may apply.</p>
                  <p>Risk of loss or damage passes to you upon delivery. Please inspect your bed upon delivery and report any damage immediately.</p>
                </div>
              </div>

              <div id="returns" className={styles.section}>
                <h2 className={styles.sectionTitle}>Returns &amp; Cancellations</h2>
                <div className={styles.sectionBody}>
                  <h4>Cancellations before production begins</h4>
                  <p>If you cancel within 48 hours of placing your order and before production has begun, we will refund your deposit in full.</p>
                  <h4>Cancellations after production begins</h4>
                  <p>Once your bed has entered production, cancellations are not accepted and your deposit is non-refundable, as materials will have been cut and work begun specifically for your order.</p>
                  <h4>Returns</h4>
                  <p>Because every bed is made to your exact specification, we are unable to accept returns of made-to-order products unless they are faulty. This does not affect your statutory rights.</p>
                  <h4>Faulty goods</h4>
                  <p>If your bed arrives damaged or faulty, contact us within 48 hours of delivery with photographs. We will arrange repair, replacement or a full refund as appropriate. Your statutory rights are not affected.</p>
                </div>
              </div>

              <div id="warranty" className={styles.section}>
                <h2 className={styles.sectionTitle}>Warranty</h2>
                <div className={styles.sectionBody}>
                  <p>All Kingsford Sleep beds are covered by a 2-year manufacturing warranty from the date of delivery.</p>
                  <p>The warranty covers defects in materials and workmanship under normal domestic use. It does not cover:</p>
                  <ul>
                    <li>Normal wear and tear of upholstery fabrics</li>
                    <li>Damage caused by misuse, accident or improper care</li>
                    <li>Discolouration from sunlight exposure</li>
                    <li>Damage caused by pets</li>
                    <li>Commercial use</li>
                  </ul>
                  <p>To make a warranty claim, contact us at <a href="mailto:hello@kingsfordsleep.co.uk" style={{ color: '#c9a96e' }}>hello@kingsfordsleep.co.uk</a> with your order details and a description of the issue.</p>
                </div>
              </div>

              <div id="liability" className={styles.section}>
                <h2 className={styles.sectionTitle}>Liability</h2>
                <div className={styles.sectionBody}>
                  <p>Our total liability to you in respect of any losses arising from your order will not exceed the total price paid for that order.</p>
                  <p>We are not liable for indirect or consequential losses, including but not limited to loss of income, loss of profits, or loss of anticipated savings.</p>
                  <p>Nothing in these terms limits our liability for death or personal injury caused by our negligence, fraud, or any other matter that cannot be excluded by law.</p>
                </div>
              </div>

              <div id="general" className={styles.section}>
                <h2 className={styles.sectionTitle}>General</h2>
                <div className={styles.sectionBody}>
                  <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
                  <p>We reserve the right to update these terms at any time. The terms applicable to your order are those in effect at the time your order was confirmed.</p>
                  <p>If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
