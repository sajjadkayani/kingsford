import { getAllCategories } from '../../lib/data'
import CategoriesClient from './CategoriesClient'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Categories | Admin' }

export default async function CategoriesPage() {
  const categories = await getAllCategories()
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories</h1>
      </div>
      <CategoriesClient categories={categories} />
    </>
  )
}
