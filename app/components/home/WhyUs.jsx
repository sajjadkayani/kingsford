'use client'
import { motion } from 'framer-motion'
import styles from '../Css/Whyus.module.css'

const ease = [0.22, 1, 0.36, 1]

const reasons = [
  {
    number: '01',
    title: 'UK Factory Direct',
    text: 'We manufacture every bed ourselves. No middlemen, no markups. Factory prices, showroom quality delivered to your door.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M3 24V10L14 3L25 10V24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 24V17H18V24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 14H25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Made to Order',
    text: 'Every bed is built when you order it. Your size, your fabric, your colour. Nothing sat in a warehouse — made for you.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L17.5 10.5L25 11.5L19.5 17L21 24.5L14 20.5L7 24.5L8.5 17L3 11.5L10.5 10.5L14 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Free UK Delivery',
    text: 'White glove delivery across the UK. We bring it to your room, assemble it, and take the packaging away.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M3 18H25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="3" y="18" width="22" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 18V13C7 10 9 7 14 7C19 7 21 10 21 13V18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="24.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="20" cy="24.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Personal Service',
    text: 'Real people, not bots. WhatsApp us, call us, email us. We are here before, during and after your order.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C7.925 3 3 7.925 3 14C3 16.2 3.65 18.25 4.775 19.975L3 25L8.025 23.225C9.75 24.35 11.8 25 14 25C20.075 25 25 20.075 25 14C25 7.925 20.075 3 14 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 15.5C10 15.5 11.5 17.5 14 17.5C16.5 17.5 18 15.5 18 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10.5" cy="12" r="1" fill="currentColor"/>
        <circle cx="17.5" cy="12" r="1" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function WhyUs() {
  return (
    <section className={`section ${styles.whyUs}`} aria-labelledby="whyus-heading">
      <div className="container">

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="section-label">Why Kingsford Sleep</span>
          <div className="gold-line" />
          <h2 id="whyus-heading" className={`display-heading ${styles.title}`}>
            Beds built the way they <em>used to be</em>
          </h2>
          <p className={styles.subtitle}>
            Every bed that leaves our factory is handcrafted by skilled British craftsmen.
            No flat packs. No shortcuts.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.number}
              className={styles.card}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>{reason.icon}</div>
                <span className={styles.cardNumber}>{reason.number}</span>
              </div>
              <h3 className={styles.cardTitle}>{reason.title}</h3>
              <p className={styles.cardText}>{reason.text}</p>
              <div className={styles.cardLine} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
