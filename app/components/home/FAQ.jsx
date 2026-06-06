'use client'

import { useState } from 'react'
import styles from '../Css/Faq.module.css'
import { homepageFaqs as faqs } from '../data/faqs'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  /* JSON-LD FAQ schema — huge for SEO, gets you rich results in Google */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className={`section ${styles.faq}`} aria-labelledby="faq-heading">

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container--narrow">

        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">FAQ</span>
          <div className="gold-line" />
          <h2 id="faq-heading" className={`display-heading ${styles.title}`}>
            Questions &amp; <em>answers</em>
          </h2>
        </div>

        {/* Questions */}
        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <div key={index} className={`${styles.item} ${openIndex === index ? styles.itemOpen : ''}`}>
              <button
                className={styles.question}
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}