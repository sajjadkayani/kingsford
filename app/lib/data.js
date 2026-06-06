import connectDB from './mongodb'
import Category from '../models/Category'
import Product from '../models/Product'
import Review from '../models/Review'

function toProduct(p, reviewStats = {}) {
  const stats = reviewStats[p.slug] || { count: 0, avg: 0 }
  return {
    id: p._id.toString(),
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    images: p.images || [],
    basePrice: p.basePrice,
    badge: p.badge || null,
    colours: p.colours || [],
    fabrics: p.fabrics || [],
    sizes: p.sizes || [],
    addons: p.addons || [],
    addonPrices: p.addonPrices instanceof Map
      ? Object.fromEntries(p.addonPrices)
      : (p.addonPrices || {}),
    fabricColours: p.fabricColours || {},
    fabricImages:  p.fabricImages  || {},
    categorySlug: p.categorySlug,
    reviewCount: stats.count,
    avgRating: stats.avg,
  }
}

function toCategory(cat, products = [], reviewStats = {}) {
  return {
    id: cat._id.toString(),
    _id: cat._id.toString(),
    category: cat.name,
    slug: cat.slug,
    description: cat.description,
    products: products.map(p => toProduct(p, reviewStats)),
  }
}

async function getReviewStats(productSlugs) {
  if (!productSlugs.length) return {}
  const agg = await Review.aggregate([
    { $match: { status: 'approved', productSlug: { $in: productSlugs } } },
    { $group: { _id: '$productSlug', count: { $sum: 1 }, avg: { $avg: '$rating' } } },
  ])
  return Object.fromEntries(agg.map(r => [r._id, { count: r.count, avg: Math.round(r.avg * 10) / 10 }]))
}

export async function getAllCategories() {
  await connectDB()
  const cats = await Category.find().sort({ createdAt: 1 }).lean()
  const allProducts = await Product.find({ category: { $in: cats.map(c => c._id) } }).sort({ createdAt: 1 }).lean()
  const slugs = allProducts.map(p => p.slug)
  const reviewStats = await getReviewStats(slugs)

  const productsByCategory = {}
  for (const p of allProducts) {
    const key = p.category.toString()
    if (!productsByCategory[key]) productsByCategory[key] = []
    productsByCategory[key].push(p)
  }

  return cats.map(cat => toCategory(cat, productsByCategory[cat._id.toString()] || [], reviewStats))
}

export async function getCategoryBySlug(slug) {
  await connectDB()
  const cat = await Category.findOne({ slug }).lean()
  if (!cat) return null
  const products = await Product.find({ category: cat._id }).sort({ createdAt: 1 }).lean()
  const reviewStats = await getReviewStats(products.map(p => p.slug))
  return toCategory(cat, products, reviewStats)
}

export async function getProductBySlug(categorySlug, productSlug) {
  await connectDB()
  const cat = await Category.findOne({ slug: categorySlug }).lean()
  if (!cat) return { cat: null, prod: null }
  const prod = await Product.findOne({ categorySlug, slug: productSlug }).lean()
  if (!prod) return { cat: toCategory(cat, []), prod: null }
  const reviewStats = await getReviewStats([productSlug])
  return { cat: toCategory(cat, []), prod: toProduct(prod, reviewStats) }
}

export async function getProductReviews(productSlug) {
  await connectDB()
  const reviews = await Review.find({ productSlug, status: 'approved' }).sort({ createdAt: -1 }).lean()
  return reviews.map(r => ({
    id: r._id.toString(),
    name: r.name,
    location: r.location,
    rating: r.rating,
    review: r.review,
    verified: r.verified,
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  }))
}

export async function getAllCategorySlugs() {
  await connectDB()
  const cats = await Category.find({}, 'slug').lean()
  return cats.map(c => c.slug)
}

export async function getAllProductSlugs() {
  await connectDB()
  const products = await Product.find({}, 'slug categorySlug').lean()
  return products.map(p => ({ category: p.categorySlug, product: p.slug }))
}
