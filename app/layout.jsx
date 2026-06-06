import './globals.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ReduxProvider from './store/ReduxProvider'
import CartDrawer from './components/cart/CartDrawer'
/* ============================================
   SITE METADATA — update these once
   they apply across the whole site
   ============================================ */

export const metadata = {
  metadataBase: new URL('https://www.kingsfordsleep.co.uk'),

  title: {
    default: 'Kingsford Sleep | Handcrafted Beds Made in the UK',
    template: '%s | Kingsford Sleep',
  },

  description:
    'Kingsford Sleep — luxury handcrafted beds made in our UK factory. Custom sizes, fabrics and colours. Ottoman storage beds, divan beds and bespoke frames. Free UK delivery.',

  keywords: [
    'handcrafted beds UK',
    'custom beds UK',
    'ottoman storage beds UK',
    'divan beds factory direct',
    'bespoke beds UK',
    'luxury beds UK',
    'made in UK beds',
    'beds direct from factory',
    'custom bed frames UK',
    'upholstered beds UK',
    'beds online UK',
    'cheap beds UK factory',
  ],

  authors: [{ name: 'Kingsford Sleep', url: 'https://www.kingsfordsleep.co.uk' }],
  creator: 'Kingsford Sleep',
  publisher: 'Kingsford Sleep',

  alternates: {
    canonical: '/',
  },

  /* Open Graph — controls how your site looks when shared on Facebook, WhatsApp etc */
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.kingsfordsleep.co.uk',
    siteName: 'Kingsford Sleep',
    title: 'Kingsford Sleep | Handcrafted Beds Made in the UK',
    description:
      'Luxury handcrafted beds made in our UK factory. Custom sizes, fabrics and finishes. Build your perfect bed and get an instant quote.',
  },

  /* Twitter card */
  twitter: {
    card: 'summary_large_image',
    title: 'Kingsford Sleep | Handcrafted Beds Made in the UK',
    description:
      'Luxury handcrafted beds made in our UK factory. Custom sizes, fabrics and finishes.',
  },

  /* Robots — tells Google to index everything */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  /* Google Search Console: paste your verification code here when you connect it */
  // verification: { google: 'REPLACE_WITH_YOUR_CODE' },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

/* ============================================
   JSON-LD SCHEMA — tells Google who you are
   Shows up as rich results in search
   ============================================ */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kingsford Sleep',
  url: 'https://www.kingsfordsleep.co.uk',
  logo: 'https://www.kingsfordsleep.co.uk/logo.png',
  description:
    'UK manufacturer of handcrafted luxury beds. Made to order in our UK factory. Custom sizes, fabrics and colours. Free UK delivery. Beds from £499.',
  email: 'hello@kingsfordsleep.co.uk',
  // ── Fill in your real address and phone before going live ──────────────────
  // telephone: '+44-XXXX-XXXXXX',
  // address: {
  //   '@type': 'PostalAddress',
  //   streetAddress: 'YOUR STREET',
  //   addressLocality: 'YOUR TOWN',
  //   addressRegion: 'YOUR COUNTY',
  //   postalCode: 'YOUR POSTCODE',
  //   addressCountry: 'GB',
  // },
  // ── Add your social profiles — AI uses these to verify the entity ──────────
  // sameAs: [
  //   'https://www.instagram.com/kingsfordsleep',
  //   'https://www.facebook.com/kingsfordsleep',
  //   'https://www.tiktok.com/@kingsfordsleep',
  // ],
  // ─────────────────────────────────────────────────────────────────────────
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@kingsfordsleep.co.uk',
    availableLanguage: 'English',
    areaServed: 'GB',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Handcrafted Beds',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Ottoman Storage Beds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Wingback Beds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Divan Beds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Panel Beds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sleigh Beds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Chesterfield Beds' } },
    ],
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kingsford Sleep',
  url: 'https://www.kingsfordsleep.co.uk',
}

/* ============================================
   ROOT LAYOUT
   ============================================ */

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Mobile browser theme colour */}
        <meta name="theme-color" content="#0F0E0C" />
      </head>
      <body>
        <ReduxProvider>
          <Navbar />
          <CartDrawer />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  )
}