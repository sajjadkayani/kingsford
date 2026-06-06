import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '../../lib/data'
import CategoryPageClient from './CategoryPageClient'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: `${cat.category} | Handcrafted in the UK | Kingsford Sleep`,
    description: `Browse our full range of handcrafted ${cat.category.toLowerCase()}. ${cat.description} Made to order in our UK factory. Free UK delivery.`,
    alternates: { canonical: `/beds/${category}` },
  }
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()
  return <CategoryPageClient cat={cat} />
}
