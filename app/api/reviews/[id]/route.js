import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Review from '@/app/models/Review'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const review = await Review.findByIdAndUpdate(id, body, { new: true })
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    return NextResponse.json({ id: review._id.toString(), status: review.status })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const review = await Review.findByIdAndDelete(id)
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    return NextResponse.json({ message: 'Review deleted' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
