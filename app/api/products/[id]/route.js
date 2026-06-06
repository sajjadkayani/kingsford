import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Product from '@/app/models/Product'
import Category from '@/app/models/Category'

export async function GET(_req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findById(id).lean()
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      tagline: product.tagline,
      description: product.description,
      images: product.images,
      basePrice: product.basePrice,
      badge: product.badge,
      colours: product.colours,
      fabrics: product.fabrics,
      sizes: product.sizes,
      addons: product.addons,
      categorySlug: product.categorySlug,
      category: product.category.toString(),
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    if (body.categorySlug) {
      const category = await Category.findOne({ slug: body.categorySlug })
      if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 })
      body.category = category._id
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      categorySlug: product.categorySlug,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findByIdAndDelete(id)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
