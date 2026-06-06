import styles from '../components/Css/LegalPage.module.css'

export const metadata = {
  title: 'Privacy Policy | Kingsford Sleep',
  description: 'Privacy policy for Kingsford Sleep. How we collect, use and protect your personal data in compliance with UK GDPR.',
  alternates: { canonical: '/privacy' },
}

const sections = [
  { id: 'intro',      title: 'Introduction' },
  { id: 'collect',    title: 'Data We Collect' },
  { id: 'use',        title: 'How We Use Your Data' },
  { id: 'sharing',    title: 'Data Sharing' },
  { id: 'retention',  title: 'Data Retention' },
  { id: 'rights',     title: 'Your Rights' },
  { id: 'cookies',    title: 'Cookies' },
  { id: 'contact',    title: 'Contact' },
]

export default function PrivacyPage() {
  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className="container--narrow">
          <span className={styles.heroLabel}>Legal</span>
          <div className={styles.goldLine} />
          <h1 className={styles.heroTitle}>Privacy <em>Policy</em></h1>
          <p className={styles.heroSubtitle}>How we collect, use and protect your personal information.</p>
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
                  <p>Kingsford Sleep (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data and respecting your privacy. This policy explains how we collect and use your personal information when you visit our website or place an order with us.</p>
                  <p>We process personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
                  <p>Our website address is: <strong>www.kingsfordsleep.co.uk</strong></p>
                </div>
              </div>

              <div id="collect" className={styles.section}>
                <h2 className={styles.sectionTitle}>Data We Collect</h2>
                <div className={styles.sectionBody}>
                  <h4>Information you provide directly</h4>
                  <ul>
                    <li>Name, email address and phone number when placing an order or making an enquiry</li>
                    <li>Delivery address for order fulfilment</li>
                    <li>Order details including bed specifications, sizes and fabric choices</li>
                    <li>Messages and communications you send us via contact forms or WhatsApp</li>
                    <li>Reviews you submit on our website</li>
                  </ul>
                  <h4>Information collected automatically</h4>
                  <ul>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on the site</li>
                    <li>Referring website or search terms</li>
                    <li>Device and screen information</li>
                  </ul>
                </div>
              </div>

              <div id="use" className={styles.section}>
                <h2 className={styles.sectionTitle}>How We Use Your Data</h2>
                <div className={styles.sectionBody}>
                  <p>We use your personal data for the following purposes:</p>
                  <ul>
                    <li><strong>Order fulfilment:</strong> Processing and delivering your order, communicating about your order status</li>
                    <li><strong>Customer service:</strong> Responding to enquiries, resolving complaints</li>
                    <li><strong>Improving our service:</strong> Analysing how our website is used to improve the customer experience</li>
                    <li><strong>Legal obligations:</strong> Keeping financial records as required by law</li>
                    <li><strong>Marketing:</strong> With your consent only, sending information about new products or promotions</li>
                  </ul>
                  <p>We will never sell your personal data to third parties or use it for purposes not listed above without your explicit consent.</p>
                </div>
              </div>

              <div id="sharing" className={styles.section}>
                <h2 className={styles.sectionTitle}>Data Sharing</h2>
                <div className={styles.sectionBody}>
                  <p>We share your data with third parties only where necessary:</p>
                  <ul>
                    <li><strong>Delivery partners:</strong> Your name and delivery address are shared with our delivery team to complete your order</li>
                    <li><strong>Payment processors:</strong> Payment data is handled securely by our payment provider and never stored on our servers</li>
                    <li><strong>Email service providers:</strong> To send order confirmations and communications</li>
                    <li><strong>Analytics providers:</strong> Anonymised data to understand website performance</li>
                  </ul>
                  <p>All third parties are required to maintain appropriate security measures and may only process your data on our instructions.</p>
                </div>
              </div>

              <div id="retention" className={styles.section}>
                <h2 className={styles.sectionTitle}>Data Retention</h2>
                <div className={styles.sectionBody}>
                  <p>We retain your personal data for as long as necessary to fulfil the purposes it was collected for:</p>
                  <ul>
                    <li>Order data is retained for 7 years to comply with legal and tax obligations</li>
                    <li>Customer enquiries are retained for 2 years</li>
                    <li>Marketing preferences are retained until you withdraw consent</li>
                    <li>Website analytics data is retained for 26 months</li>
                  </ul>
                </div>
              </div>

              <div id="rights" className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Rights</h2>
                <div className={styles.sectionBody}>
                  <p>Under UK GDPR, you have the following rights:</p>
                  <ul>
                    <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
                    <li><strong>Right to erasure:</strong> Request deletion of your personal data in certain circumstances</li>
                    <li><strong>Right to restriction:</strong> Request we limit how we use your data</li>
                    <li><strong>Right to portability:</strong> Request your data in a portable format</li>
                    <li><strong>Right to object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
                  </ul>
                  <p>To exercise any of these rights, contact us at <a href="mailto:hello@kingsfordsleep.co.uk" style={{ color: '#c9a96e' }}>hello@kingsfordsleep.co.uk</a>. We will respond within 30 days.</p>
                  <p>If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.</p>
                </div>
              </div>

              <div id="cookies" className={styles.section}>
                <h2 className={styles.sectionTitle}>Cookies</h2>
                <div className={styles.sectionBody}>
                  <p>Our website uses cookies to enhance your experience. Cookies are small text files stored on your device.</p>
                  <h4>Essential cookies</h4>
                  <p>Required for the website to function. These cannot be disabled and do not collect personal data.</p>
                  <h4>Analytics cookies</h4>
                  <p>Help us understand how visitors use our website. All data is anonymised. You can opt out via your browser settings.</p>
                  <p>You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.</p>
                </div>
              </div>

              <div id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <div className={styles.sectionBody}>
                  <div className={styles.contactBox}>
                    <h4>Data enquiries</h4>
                    <p>For any questions about this policy or to exercise your rights:</p>
                    <a href="mailto:hello@kingsfordsleep.co.uk">hello@kingsfordsleep.co.uk</a>
                    <p style={{ fontSize: '0.82rem', color: '#555', margin: 0 }}>We aim to respond within 5 business days.</p>
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
