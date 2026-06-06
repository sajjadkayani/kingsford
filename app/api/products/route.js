import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import Product from '@/app/models/Product'
import Category from '@/app/models/Category'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    const query = categorySlug ? { categorySlug } : {}
    const products = await Product.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json(
      products.map((p) => ({
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
        category: p.category.toString(),
        createdAt: p.createdAt,
      }))
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { name, slug, tagline, description, images, basePrice, badge, colours, fabrics, sizes, addons, addonPrices, fabricColours, fabricImages, categorySlug } = body

    if (!name || !slug || !tagline || !description || !basePrice || !categorySlug) {
      return NextResponse.json(
        { error: 'name, slug, tagline, description, basePrice and categorySlug are required' },
        { status: 400 }
      )
    }

    const category = await Category.findOne({ slug: categorySlug })
    if (!category) {
      return NextResponse.json({ error: `Category "${categorySlug}" not found` }, { status: 400 })
    }

    const product = await Product.create({
      name, slug, tagline, description,
      images: images || [],
      basePrice,
      badge: badge || null,
      colours: colours || [],
      fabrics: fabrics || [],
      sizes: sizes || [],
      addons: addons || [],
      addonPrices: addonPrices || {},
      fabricColours: fabricColours || {},
      fabricImages:  fabricImages  || {},
      category: category._id,
      categorySlug,
    })

    return NextResponse.json(
      { id: product._id.toString(), name: product.name, slug: product.slug, categorySlug: product.categorySlug },
      { status: 201 }
    )
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A product with this slug already exists in this category' }, { status: 409 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
