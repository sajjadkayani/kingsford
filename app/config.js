/* ============================================
   KINGSFORD SLEEP — SITE CONFIG
   Update these once, they apply everywhere.
   ============================================ */

export const SITE_CONFIG = {
  // Your WhatsApp number — UK format, no spaces, no +
  // Example: UK number 07700 900000 becomes 447700900000
  whatsapp: '923174704165',

  // Your email address
  email: 'hello@kingsfordsleep.co.uk',

  // Site details
  siteName: 'Kingsford Sleep',
  siteUrl: 'https://www.kingsfordsleep.co.uk',
  tagline: 'Handcrafted Beds Made in the UK',

  // Social media — add your handles when ready
  instagram: 'https://www.instagram.com/kingsfordsleep',
  facebook: 'https://www.facebook.com/kingsfordsleep',

  // Business details
  address: {
    country: 'GB',
    countryName: 'United Kingdom',
  },

  // Delivery message shown on product pages
  deliveryMessage: 'Free UK delivery · 3-4 weeks lead time',
}

/* Helper — builds a WhatsApp URL with a pre-filled message */
export function buildWhatsAppUrl(message = '') {
  const encoded = encodeURIComponent(message || `Hi Kingsford Sleep! I would like to enquire about a bed.`)
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encoded}`
}