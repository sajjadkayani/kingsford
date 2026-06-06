import connectDB from '@/app/lib/mongodb'
import Order from '@/app/models/Order'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const query = status && status !== 'all' ? { status } : {}
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean()

    return Response.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
