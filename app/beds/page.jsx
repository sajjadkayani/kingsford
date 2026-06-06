import { getAllCategories } from '../lib/data'
import BedsPageClient from './BedsPageClient'

export const revalidate = 3600

export const metadata = {
  title: 'Handcrafted Beds Collection | UK Factory Direct | Kingsford Sleep',
  description: 'Browse our full collection of handcrafted beds. Ottoman, Wingback, Panel, Sleigh, Divan and more. All made to order in our UK factory.',
  alternates: { canonical: '/beds' },
}

export default async function BedsPage() {
  const categories = await getAllCategories()
  return <BedsPageClient categories={categories} />
}
