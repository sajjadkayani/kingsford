import connectDB from '../../lib/mongodb'
import Fabric from '../../models/Fabric'
import FabricsClient from './FabricsClient'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Fabrics | Admin' }

export default async function FabricsPage() {
  await connectDB()
  const raw = await Fabric.find().sort({ name: 1 }).lean()
  const fabrics = raw.map(f => ({ id: f._id.toString(), name: f.name, image: f.image || '' }))

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Fabric Catalogue</h1>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
          Add fabrics here first, then select them when creating or editing products.
        </p>
      </div>
      <FabricsClient initialFabrics={fabrics} />
    </>
  )
}
