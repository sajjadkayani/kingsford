'use client'
import { useState } from 'react'

const STATUS_STYLE = {
  new:             { background: '#0d1f3c', color: '#60a5fa', border: '1px solid #1e3a6e' },
  confirmed:       { background: '#2a2010', color: '#c9a96e', border: '1px solid #4a3a1a' },
  'in-production': { background: '#2a1800', color: '#fb923c', border: '1px solid #4a2e00' },
  dispatched:      { background: '#1e1030', color: '#c084fc', border: '1px solid #3b1f5e' },
  delivered:       { background: '#0d2010', color: '#4ade80', border: '1px solid #1a5030' },
  cancelled:       { background: '#2a1010', color: '#f87171', border: '1px solid #5e1f1f' },
}

const STATUS_OPTIONS = ['new', 'confirmed', 'in-production', 'dispatched', 'delivered', 'cancelled']

const card   = { background: '#1a1915', border: '1px solid #2a2820', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }
const rowBg  = { background: '#1a1915' }
const rowAlt = { background: '#141310' }

export default function OrdersClient({ initialOrders }) {
  const [orders, setOrders]     = useState(initialOrders)
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  async function updateStatus(id, status) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: updated.status } : o))
    } catch {
      alert('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map(s => {
          const active = filter === s
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: active ? '1px solid #c9a96e' : '1px solid #2a2820',
                cursor: 'pointer',
                fontWeight: active ? 600 : 400,
                background: active ? '#c9a96e' : '#1a1915',
                color: active ? '#0f0e0c' : '#888',
                fontSize: 12,
                textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}
            >
              {s} ({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#555', padding: '40px 0', textAlign: 'center', fontSize: 14 }}>No orders found.</p>
      )}

      {filtered.map(order => (
        <div key={order._id} style={card}>
          {/* Header row */}
          <div
            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 130px 80px 110px',
              gap: 12,
              padding: '13px 16px',
              cursor: 'pointer',
              background: expanded === order._id ? '#1e1c18' : '#1a1915',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontWeight: 700, color: '#c9a96e', fontSize: 13, fontFamily: 'monospace' }}>
              {order.orderRef}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#f5f0e8' }}>{order.name}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 1 }}>{order.email}</div>
            </div>
            <span style={{ fontSize: 12, color: '#888' }}>
              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span style={{ fontWeight: 700, color: '#f5f0e8', fontSize: 14 }}>£{order.total}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px',
              borderRadius: 20, textTransform: 'capitalize', whiteSpace: 'nowrap',
              display: 'inline-block', textAlign: 'center',
              ...STATUS_STYLE[order.status],
            }}>
              {order.status}
            </span>
          </div>

          {/* Expanded detail */}
          {expanded === order._id && (
            <div style={{ borderTop: '1px solid #2a2820' }}>
              {/* Customer + status update */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '16px 16px 0' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, margin: '0 0 8px' }}>Customer</p>
                  <p style={{ fontWeight: 600, color: '#f5f0e8', margin: '0 0 4px', fontSize: 14 }}>{order.name}</p>
                  <p style={{ fontSize: 13, color: '#888', margin: '0 0 2px' }}>{order.email}</p>
                  <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{order.phone || '—'}</p>
                  {order.notes && (
                    <p style={{ fontSize: 13, color: '#b0a898', marginTop: 10, padding: '8px 10px', background: '#141310', borderRadius: 6, border: '1px solid #2a2820' }}>
                      {order.notes}
                    </p>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, margin: '0 0 8px' }}>Update Status</p>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 6,
                      border: '1px solid #2a2820', fontSize: 13, cursor: 'pointer',
                      background: '#141310', color: '#f5f0e8', fontFamily: 'inherit',
                      opacity: updating === order._id ? 0.5 : 1,
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                    ))}
                  </select>
                  {updating === order._id && (
                    <p style={{ fontSize: 12, color: '#c9a96e', marginTop: 6 }}>Saving…</p>
                  )}
                </div>
              </div>

              {/* Items table */}
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Items</p>
                <div style={{ border: '1px solid #2a2820', borderRadius: 6, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#141310' }}>
                        {['Bed', 'Size', 'Fabric / Colour', 'Extras', 'Price'].map(h => (
                          <th key={h} style={{ padding: '7px 10px', textAlign: h === 'Price' ? 'right' : 'left', color: '#888', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #2a2820' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i} style={i % 2 === 0 ? rowBg : rowAlt}>
                          <td style={{ padding: '8px 10px', color: '#f5f0e8' }}>{item.name}</td>
                          <td style={{ padding: '8px 10px', color: '#b0a898' }}>{item.size}</td>
                          <td style={{ padding: '8px 10px', color: '#b0a898' }}>{item.fabric} / {item.colour}</td>
                          <td style={{ padding: '8px 10px', color: '#888' }}>{item.addons?.join(', ') || '—'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#c9a96e' }}>£{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '1px solid #2a2820' }}>
                        <td colSpan={4} style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 600, color: '#888', fontSize: 12 }}>Total</td>
                        <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, fontSize: 16, color: '#c9a96e' }}>£{order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
