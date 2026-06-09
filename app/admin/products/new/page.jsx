import Link from 'next/link'
import { getAllCategories } from '../../../lib/data'
import connectDB from '../../../lib/mongodb'
import Fabric from '../../../models/Fabric'
import ProductForm from '../ProductForm'
import styles from '../../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Add Product | Admin' }

export default async function NewProductPage() {
  await connectDB()
  const [categories, rawFabrics] = await Promise.all([
    getAllCategories(),
    Fabric.find().sort({ name: 1 }).lean(),
  ])
  const availableFabrics = rawFabrics.map(f => ({ id: f._id.toString(), name: f.name, image: f.image || '' }))

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Product</h1>
      </div>

      {categories.length === 0 ? (
        <div style={{ background: '#1a1915', border: '1px solid #2a2820', borderRadius: '10px', padding: '2rem', maxWidth: '500px' }}>
          <p style={{ color: '#e8a030', margin: '0 0 1rem', fontSize: '0.9rem' }}>
            ⚠ No categories found. You need to create at least one category before adding products.
          </p>
          <Link href="/admin/categories" className={`${styles.btn} ${styles.btnPrimary}`}>
            Go to Categories →
          </Link>
        </div>
      ) : (
        <ProductForm categories={categories} availableFabrics={availableFabrics} />
      )}
    </>
  )
}
