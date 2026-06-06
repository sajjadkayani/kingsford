import connectDB from '../../lib/mongodb'
import Review from '../../models/Review'
import ReviewsAdmin from './ReviewsAdmin'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Reviews | Admin' }

export default async function AdminReviewsPage() {
  await connectDB()
  const raw = await Review.find().sort({ createdAt: -1 }).lean()
  const reviews = raw.map(r => ({
    id: r._id.toString(),
    name: r.name,
    location: r.location,
    rating: r.rating,
    bed: r.bed,
    review: r.review,
    verified: r.verified,
    status: r.status,
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  }))

  const pending  = reviews.filter(r => r.status === 'pending')
  const approved = reviews.filter(r => r.status === 'approved')

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reviews</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#e8a030', background: '#2a1f0a', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
            {pending.length} pending
          </span>
          <span style={{ fontSize: '0.85rem', color: '#55c077', background: '#0d2010', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
            {approved.length} approved
          </span>
        </div>
      </div>
      <ReviewsAdmin reviews={reviews} />
    </>
  )
}
