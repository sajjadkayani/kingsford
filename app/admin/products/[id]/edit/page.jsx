import { notFound } from 'next/navigation'
import { getAllCategories } from '../../../../lib/data'
import connectDB from '../../../../lib/mongodb'
import Product from '../../../../models/Product'
import Fabric from '../../../../models/Fabric'
import ProductForm from '../../ProductForm'
import styles from '../../../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }) {
  const { id } = await params
  await connectDB()

  const [raw, rawFabrics, categories] = await Promise.all([
    Product.findById(id).lean(),
    Fabric.find().sort({ name: 1 }).lean(),
    getAllCategories(),
  ])
  if (!raw) notFound()

  const availableFabrics = rawFabrics.map(f => ({ id: f._id.toString(), name: f.name, image: f.image || '' }))

  const product = {
    id: raw._id.toString(),
    name: raw.name,
    slug: raw.slug,
    tagline: raw.tagline,
    description: raw.description,
    images: raw.images || [],
    basePrice: raw.basePrice,
    badge: raw.badge || '',
    colours: raw.colours || [],
    fabrics: raw.fabrics || [],
    sizes: raw.sizes || [],
    addons: raw.addons || [],
    addonPrices: raw.addonPrices instanceof Map
      ? Object.fromEntries(raw.addonPrices)
      : (raw.addonPrices || {}),
    fabricColours: raw.fabricColours || {},
    fabricImages:  raw.fabricImages  || {},
    categorySlug: raw.categorySlug,
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit — {product.name}</h1>
      </div>
      <ProductForm categories={categories} availableFabrics={availableFabrics} initialData={product} />
    </>
  )
}
