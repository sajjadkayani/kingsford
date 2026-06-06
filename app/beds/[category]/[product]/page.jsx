import { notFound } from 'next/navigation'
import { getProductBySlug } from '../../../lib/data'
import ProductPageClient from './ProductPageClient'
import ProductReviews from './ProductReviews'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { category, product } = await params
  const { cat, prod } = await getProductBySlug(category, product)
  if (!cat || !prod) return {}
  return {
    title: `${prod.name} | ${cat.category} | Kingsford Sleep`,
    description: `${prod.tagline} Made to order in our UK factory. Available in multiple sizes and fabrics. From £${prod.basePrice}. Free UK delivery.`,
    alternates: { canonical: `/beds/${category}/${product}` },
    openGraph: {
      title: `${prod.name} — Kingsford Sleep`,
      description: `${prod.tagline} From £${prod.basePrice}. Handcrafted in the UK.`,
      ...(prod.images?.[0] && {
        images: [{ url: prod.images[0], width: 800, height: 600, alt: prod.name }],
      }),
    },
  }
}

export default async function ProductPage({ params }) {
  const { category, product } = await params
  const { cat, prod } = await getProductBySlug(category, product)
  if (!cat || !prod) notFound()

  const BASE_URL = 'https://www.kingsfordsleep.co.uk'

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: prod.name,
    description: prod.description,
    brand: { '@type': 'Brand', name: 'Kingsford Sleep' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: prod.basePrice,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Kingsford Sleep' },
    },
    ...(prod.images?.[0] && { image: prod.images[0] }),
    ...(prod.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: prod.avgRating,
        reviewCount: prod.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Beds',         item: `${BASE_URL}/beds` },
      { '@type': 'ListItem', position: 3, name: cat.category,   item: `${BASE_URL}/beds/${cat.slug}` },
      { '@type': 'ListItem', position: 4, name: prod.name,      item: `${BASE_URL}/beds/${cat.slug}/${prod.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPageClient cat={cat} prod={prod} />
      <div className="container-1" style={{ paddingBottom: '4rem' }}>
        <ProductReviews
          productSlug={prod.slug}
          productName={prod.name}
          categorySlug={cat.slug}
        />
      </div>
    </>
  )
}
