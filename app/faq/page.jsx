'use client'

import { useState } from 'react'
import Link from 'next/link'
import { faqs } from '../components/data/faqs'
import styles from '../components/Css/LegalPage.module.css'
import faqStyles from '../components/Css/Faq.module.css'

export default function FAQPage() {
  const [openKey, setOpenKey] = useState(null)

  const toggle = (key) => setOpenKey(openKey === key ? null : key)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap(cat => cat.items).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className={styles.page}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className="container--narrow">
            <span className={styles.heroLabel}>Help Centre</span>
            <div className={styles.goldLine} />
            <h1 className={styles.heroTitle}>Frequently Asked <em>Questions</em></h1>
            <p className={styles.heroSubtitle}>
              Everything you need to know about ordering, delivery and our beds.
              Can&apos;t find your answer?{' '}
              <Link href="/contact" style={{ color: '#c9a96e' }}>Get in touch</Link>.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.content}>
          <div className="container--narrow">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {faqs.map((cat) => (
                <div key={cat.category}>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    color: '#c9a96e',
                    margin: '0 0 1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #1e1c18',
                  }}>
                    {cat.category}
                  </h2>
                  <div className={faqStyles.list}>
                    {cat.items.map((faq, i) => {
                      const key = `${cat.category}-${i}`
                      const isOpen = openKey === key
                      return (
                        <div key={key} className={`${faqStyles.item} ${isOpen ? faqStyles.itemOpen : ''}`}>
                          <button className={faqStyles.question} onClick={() => toggle(key)} aria-expanded={isOpen}>
                            <span>{faq.question}</span>
                            <span className={faqStyles.icon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                          </button>
                          {isOpen && (
                            <div className={faqStyles.answer}>
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.contactBox} style={{ marginTop: '3rem' }}>
              <h4>Still have questions?</h4>
              <p>Our team is available 7 days a week via WhatsApp, email or phone.</p>
              <a href="https://wa.me/923174704165">WhatsApp us →</a>
              <a href="mailto:hello@kingsfordsleep.co.uk">hello@kingsfordsleep.co.uk</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
