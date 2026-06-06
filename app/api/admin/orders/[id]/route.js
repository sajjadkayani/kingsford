import connectDB from '@/app/lib/mongodb'
import Order from '@/app/models/Order'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const { status } = await request.json()

    const validStatuses = ['new', 'confirmed', 'in-production', 'dispatched', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })

    return Response.json(order)
  } catch (error) {
    console.error('Failed to update order:', error)
    return Response.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
