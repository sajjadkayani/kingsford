'use client'

import { useState } from 'react'
import styles from '../components/Css/Contact.module.css'

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
    } catch {
      alert('Something went wrong. Please WhatsApp us directly or email hello@kingsfordsleep.co.uk')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <div className={styles.successInner}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Message Sent</h1>
          <p className={styles.successText}>
            Thank you {form.name}. We will be in touch within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className="container--narrow">
          <span className="section-label">Get in Touch</span>
          <div className="gold-line" />
          <h1 className={`display-heading ${styles.title}`}>
            We would love to <em>hear from you</em>
          </h1>
          <p className={styles.intro}>
            Questions about an order, custom sizes, fabric samples or anything else —
            we are here to help. Real people, real answers.
          </p>
        </div>
      </div>

      <div className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.layout}>

            <div className={styles.options}>
              <h2 className={`display-heading ${styles.optionsTitle}`}>
                Other ways to <em>reach us</em>
              </h2>

              <div className={styles.optionCard}>
                <h3 className={styles.optionTitle}>WhatsApp</h3>
                <p className={styles.optionText}>Fastest response. Send us a message and we will reply within hours.</p>
                <a
                  href="https://wa.me/923174704165?text=Hi, I have a question about Kingsford Sleep."
                  className="btn btn--whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open WhatsApp
                </a>
              </div>

              <div className={styles.optionCard}>
                <h3 className={styles.optionTitle}>Email</h3>
                <p className={styles.optionText}>For detailed enquiries or order confirmations.</p>
                <a href="mailto:hello@kingsfordsleep.co.uk" className={styles.optionLink}>
                  hello@kingsfordsleep.co.uk
                </a>
              </div>

              <div className={styles.optionCard}>
                <h3 className={styles.optionTitle}>Response Time</h3>
                <p className={styles.optionText}>We respond to all enquiries within 24 hours, Monday to Saturday.</p>
              </div>
            </div>

            <div className={styles.formWrap}>
              <h2 className={`display-heading ${styles.formTitle}`}>Send a message</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="John Smith"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="+44 7700 000000"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Message *</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className={`btn btn--primary ${styles.submit}`} disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
