'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '../Css/Howitworks.module.css'

const ease = [0.22, 1, 0.36, 1]

const steps = [
  {
    number: '01',
    title: 'Choose Your Bed',
    text: 'Browse our collection and pick the style that suits your bedroom and budget.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M3 20V8L13 3L23 8V20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 20V14H17V20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 12H23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Customise It',
    text: 'Select your size, fabric, colour and addons. See your price update instantly.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M13 8V13L16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Your Quote',
    text: 'Instant price. No sign up, no waiting, no sales calls. Just your number.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="3" y="4" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 9H23" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 14L11 17L18 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'We Deliver',
    text: 'Your bed is handcrafted in our UK factory and delivered free to your door.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M3 16H23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="3" y="16" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 16V12C7 9.5 8.5 7 13 7C17.5 7 19 9.5 19 12V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="7.5" cy="21.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="18.5" cy="21.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className={`section ${styles.how}`} aria-labelledby="how-heading">
      <div className="container">

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-label">The Process</span>
          <div className="gold-line" />
          <h2 id="how-heading" className={`display-heading ${styles.title}`}>
            Your perfect bed in <em>four steps</em>
          </h2>
          <p className={styles.subtitle}>
            From choosing your bed to delivery at your door — simple, transparent, personal.
          </p>
        </motion.div>

        <motion.div
          className={styles.steps}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={styles.step}
              variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.65, ease }}
            >
              <div className={styles.stepTop}>
                <div className={styles.numberWrap}>
                  <div className={styles.numberRing} />
                  <span className={styles.number}>{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={styles.connector}>
                    <div className={styles.connectorLine} />
                    <div className={styles.connectorDot} />
                  </div>
                )}
              </div>
              <div className={styles.card}>
                <div className={styles.cardGlow} />
                <div className={styles.iconWrap}>{step.icon}</div>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <Link href="/configure" className="btn btn--primary">
            Start Building Now
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
