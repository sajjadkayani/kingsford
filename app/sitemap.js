import { getAllCategorySlugs, getAllProductSlugs } from './lib/data'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://www.kingsfordsleep.co.uk'

  const staticPages = [
    { url: baseUrl,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/beds`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/configure`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/reviews`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
  ]

  const [categorySlugs, productSlugs] = await Promise.all([
    getAllCategorySlugs(),
    getAllProductSlugs(),
  ])

  const categoryPages = categorySlugs.map(slug => ({
    url: `${baseUrl}/beds/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productPages = productSlugs.map(({ category, product }) => ({
    url: `${baseUrl}/beds/${category}/${product}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
