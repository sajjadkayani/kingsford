import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Category from '@/app/models/Category'
import Product from '@/app/models/Product'

export async function GET(_req, { params }) {
  try {
    await connectDB()
    const { slug } = await params
    const cat = await Category.findOne({ slug }).lean()
    if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

    const products = await Product.find({ category: cat._id }).sort({ createdAt: 1 }).lean()
    return NextResponse.json({
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      products: products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        images: p.images,
        basePrice: p.basePrice,
        badge: p.badge,
        colours: p.colours,
        fabrics: p.fabrics,
        sizes: p.sizes,
        addons: p.addons,
        categorySlug: p.categorySlug,
      })),
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { slug } = await params
    const body = await request.json()
    const cat = await Category.findOneAndUpdate({ slug }, body, { new: true })
    if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    return NextResponse.json({ id: cat._id.toString(), name: cat.name, slug: cat.slug, description: cat.description })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB()
    const { slug } = await params
    const cat = await Category.findOneAndDelete({ slug })
    if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    await Product.deleteMany({ category: cat._id })
    return NextResponse.json({ message: 'Category and its products deleted' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
