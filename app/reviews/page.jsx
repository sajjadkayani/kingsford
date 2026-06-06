import { Suspense } from 'react'
import ReviewsPageClient from './ReviewsPageClient'
import connectDB from '../lib/mongodb'
import Review from '../models/Review'
import Product from '../models/Product'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Customer Reviews | Verified Bed Reviews | Kingsford Sleep',
  description: 'Read verified customer reviews for Kingsford Sleep handcrafted beds. 5-star rated UK bed manufacturer. See what our customers say about quality, delivery and service.',
  alternates: { canonical: '/reviews' },
}

export default async function ReviewsPage({ searchParams }) {
  const { product: productSlug } = await searchParams

  await connectDB()

  const [raw, rawProduct] = await Promise.all([
    Review.find({ status: 'approved' }).sort({ createdAt: -1 }).lean(),
    productSlug ? Product.findOne({ slug: productSlug }).lean() : null,
  ])

  const reviews = raw.map(r => ({
    id: r._id.toString(),
    name: r.name,
    location: r.location,
    rating: r.rating,
    bed: r.bed,
    review: r.review,
    verified: r.verified,
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  }))

  const product = rawProduct ? {
    id: rawProduct._id.toString(),
    name: rawProduct.name,
    slug: rawProduct.slug,
    categorySlug: rawProduct.categorySlug,
    tagline: rawProduct.tagline,
    image: rawProduct.images?.[0] || null,
    basePrice: rawProduct.basePrice,
  } : null

  return (
    <Suspense>
      <ReviewsPageClient reviews={reviews} product={product} />
    </Suspense>
  )
}
