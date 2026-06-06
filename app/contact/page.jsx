import ContactPageClient from './ContactPageClient'

export const metadata = {
  title: 'Contact Us | Get in Touch | Kingsford Sleep',
  description: 'Contact Kingsford Sleep about custom bed sizes, fabric samples, delivery or orders. WhatsApp, email or contact form — we reply within 24 hours.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactPageClient />
}
