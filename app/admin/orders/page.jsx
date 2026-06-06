import connectDB from '@/app/lib/mongodb'
import Order from '@/app/models/Order'
import OrdersClient from './OrdersClient'

export const metadata = { title: 'Orders | Kingsford Sleep Admin' }
export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  await connectDB()
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
  const serialised = JSON.parse(JSON.stringify(orders))

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProduction: orders.filter(o => o.status === 'in-production').length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Orders</h1>
        <p style={{ color: '#888', fontSize: 14 }}>All customer orders — click a row to view details and update status</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total Orders', value: stats.total },
          { label: 'New', value: stats.new, highlight: stats.new > 0 },
          { label: 'In Production', value: stats.inProduction },
          { label: 'Total Revenue', value: `£${stats.revenue.toLocaleString()}` },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#1a1915',
            border: stat.highlight ? '1px solid #c9a96e' : '1px solid #2a2820',
            borderRadius: 8,
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#c9a96e' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <OrdersClient initialOrders={serialised} />
    </div>
  )
}
