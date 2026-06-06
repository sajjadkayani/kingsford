import Hero from './components/home/Hero'
import WhyUs from './components/home/WhyUs'
import HowItWorks from './components/home/HowItWorks'
import FeaturedBeds from './components/home/FeaturedBeds'
import CategorySpotlight from './components/home/CategorySpotlight'
import FAQ from './components/home/FAQ'
import CTABanner from './components/home/CTABanner'
import Reviews from './components/home/Reviews'
import { getAllCategories } from './lib/data'
import connectDB from './lib/mongodb'
import Review from './models/Review'

export const revalidate = 3600

export const metadata = {
  title: 'Handcrafted Beds Made in the UK | Factory Direct Prices',
  description:
    'Kingsford Sleep crafts luxury beds in our UK factory. Choose your size, fabric and colour. Ottoman storage beds, divan beds and bespoke frames. Free UK delivery. Get an instant quote today.',
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [categories, rawReviews] = await Promise.all([
    getAllCategories(),
    (async () => {
      await connectDB()
      return Review.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(20).lean()
    })(),
  ])

  const reviews = rawReviews.map(r => ({
    id: r._id.toString(),
    name: r.name,
    location: r.location,
    rating: r.rating,
    bed: r.bed,
    review: r.review,
    verified: r.verified,
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  }))

  const ottoman    = categories.find(c => c.slug === 'ottoman')
  const wingback   = categories.find(c => c.slug === 'wingback')
  const divan      = categories.find(c => c.slug === 'divan')

  return (
    <>
      <Hero />
      <WhyUs />

      {/* Listing 1 — Ottoman Beds */}
      <CategorySpotlight category={ottoman} index={0} />

      <HowItWorks />

      {/* Listing 2 — Wingback Beds */}
      <CategorySpotlight category={wingback} reversed index={1} />

      {/* Full carousel — all beds */}
      <FeaturedBeds categories={categories} />

      {/* Listing 3 — Divan Beds */}
      <CategorySpotlight category={divan} index={2} />

      <Reviews reviews={reviews} />
      <FAQ />
      <CTABanner />
    </>
  )
}
