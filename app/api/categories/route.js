import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Category from '@/app/models/Category'
import Product from '@/app/models/Product'

export async function GET() {
  try {
    await connectDB()
    const cats = await Category.find().sort({ createdAt: 1 }).lean()
    const result = await Promise.all(
      cats.map(async (cat) => {
        const products = await Product.find({ category: cat._id }).lean()
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          productCount: products.length,
          createdAt: cat.createdAt,
        }
      })
    )
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug || !description) {
      return NextResponse.json({ error: 'name, slug and description are required' }, { status: 400 })
    }

    const category = await Category.create({ name, slug, description })
    return NextResponse.json(
      { id: category._id.toString(), name: category.name, slug: category.slug, description: category.description },
      { status: 201 }
    )
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
