import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Review from '@/app/models/Review'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'approved'
    const limit = parseInt(searchParams.get('limit') || '100')
    const productSlug = searchParams.get('productSlug')

    const query = { status }
    if (productSlug) query.productSlug = productSlug

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(limit).lean()

    return NextResponse.json(
      reviews.map(r => ({
        id: r._id.toString(),
        name: r.name,
        location: r.location,
        rating: r.rating,
        bed: r.bed,
        review: r.review,
        verified: r.verified,
        status: r.status,
        date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        createdAt: r.createdAt,
      }))
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const { name, location, rating, bed, review, productSlug, productName } = await request.json()

    if (!name || !review) {
      return NextResponse.json({ error: 'name and review are required' }, { status: 400 })
    }

    await Review.create({
      name, location, rating: Number(rating) || 5, bed, review,
      verified: false, status: 'pending',
      productSlug: productSlug || null,
      productName: productName || null,
      categorySlug: null,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
