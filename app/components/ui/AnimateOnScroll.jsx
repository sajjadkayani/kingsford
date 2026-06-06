'use client'
import { motion } from 'framer-motion'

const variants = {
  fadeUp:    { hidden: { opacity: 0, y: 48 },      visible: { opacity: 1, y: 0 } },
  fadeIn:    { hidden: { opacity: 0 },              visible: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -60 },     visible: { opacity: 1, x: 0 } },
  slideRight:{ hidden: { opacity: 0, x: 60 },      visible: { opacity: 1, x: 0 } },
  scaleUp:   { hidden: { opacity: 0, scale: 0.92 },visible: { opacity: 1, scale: 1 } },
}

export default function AnimateOnScroll({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.65,
  className,
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function AnimateStagger({ children, stagger = 0.1, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export function AnimateChild({ children, variant = 'fadeUp', duration = 0.6, className }) {
  return (
    <motion.div className={className} variants={variants[variant]} transition={{ duration, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
