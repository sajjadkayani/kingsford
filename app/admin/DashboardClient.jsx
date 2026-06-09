'use client'
import Link from 'next/link'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import styles from './dashboard.module.css'

const COLORS = ['#c9a96e', '#8BA5B8', '#B8B88A', '#B88AA0', '#7a9e7a']

const STATUS_COLORS = {
  new: '#c9a96e',
  confirmed: '#8BA5B8',
  'in-production': '#B8B88A',
  dispatched: '#7a9e7a',
  delivered: '#55c077',
  cancelled: '#e05555',
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '🌍'
  try {
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)))
  } catch {
    return '🌍'
  }
}

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#141310', border: '1px solid #2a2820', borderRadius: 6, padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'Jost, sans-serif' }}>
      <div style={{ color: '#888', marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#c9a96e', fontWeight: 600 }}>{payload[0].value} {payload[0].name === 'count' ? 'views' : ''}</div>
    </div>
  )
}

function EmptyState({ text = 'No data yet — visits will appear here soon' }) {
  return <p style={{ color: '#444', fontSize: '0.78rem', padding: '1.5rem 0', textAlign: 'center', fontFamily: 'Jost, sans-serif' }}>{text}</p>
}

function KPICard({ label, value, icon, color, sub, href }) {
  const inner = (
    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon} style={{ color }}>{icon}</div>
      <div className={styles.kpiValue} style={{ color }}>{value ?? 0}</div>
      <div className={styles.kpiLabel}>{label}</div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  )
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
  return inner
}

export default function DashboardClient({ stats }) {
  const {
    todayCount, weekCount, totalOrders, pendingOrders,
    pendingReviews, totalProducts,
    dailyViews, topPages, devices, topCountries, recentOrders,
  } = stats

  const hasVisitorData = dailyViews.some(d => d.count > 0)

  return (
    <div className={styles.dashboard}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            <span className={styles.liveDot} />
            Live store analytics
          </p>
        </div>
        <Link href="/admin/products/new" className={styles.addBtn}>+ Add Product</Link>
      </div>

      {/* ── KPI cards ── */}
      <div className={styles.kpiGrid}>
        <KPICard label="Visitors Today"   value={todayCount} icon="👁"  color="#c9a96e" />
        <KPICard label="This Week"        value={weekCount}  icon="📈"  color="#8BA5B8" />
        <KPICard label="Total Orders"     value={totalOrders} icon="📦" color="#B8B88A" sub={pendingOrders > 0 ? `${pendingOrders} awaiting` : 'All up to date'} href="/admin/orders" />
        <KPICard label="Pending Reviews"  value={pendingReviews} icon="⭐" color="#B88AA0" href="/admin/reviews" />
        <KPICard label="Products Listed"  value={totalProducts} icon="🛏" color="#7a9e7a" href="/admin/products" />
      </div>

      {/* ── Row 1: Trend + Devices ── */}
      <div className={styles.chartsRow}>

        {/* Visitor trend */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            Visitor Trend <span>(last 14 days)</span>
          </h3>
          {!hasVisitorData ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyViews} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1c18" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10, fontFamily: 'Jost, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'Jost, sans-serif' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Line
                  type="monotone" dataKey="count" name="count"
                  stroke="#c9a96e" strokeWidth={2}
                  dot={false} activeDot={{ r: 4, fill: '#c9a96e', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Device donut */}
        <div className={styles.chartCard} style={{ maxWidth: 240, flexShrink: 0 }}>
          <h3 className={styles.chartTitle}>Devices</h3>
          {devices.every(d => d.value === 0) ? (
            <EmptyState text="No device data yet" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={devices} cx="50%" cy="50%"
                    innerRadius={46} outerRadius={66}
                    paddingAngle={3} dataKey="value"
                    strokeWidth={0}
                  >
                    {devices.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {devices.filter(d => d.value > 0).map((d, i) => (
                  <div key={d.name} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: COLORS[i] }} />
                    <span>{d.name}</span>
                    <span className={styles.legendVal}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Row 2: Top Pages + Countries + Orders ── */}
      <div className={styles.chartsRow2}>

        {/* Top pages */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Most Visited Pages</h3>
          {topPages.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, topPages.length * 28)}>
              <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <XAxis type="number" tick={{ fill: '#555', fontSize: 10, fontFamily: 'Jost, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" width={110} tick={{ fill: '#888', fontSize: 10, fontFamily: 'Jost, sans-serif' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="count" name="count" fill="#c9a96e" radius={[0, 3, 3, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Countries */}
        <div className={styles.chartCard} style={{ maxWidth: 220, flexShrink: 0 }}>
          <h3 className={styles.chartTitle}>Top Countries</h3>
          {topCountries.length === 0 ? (
            <EmptyState text="Visitor countries appear here" />
          ) : (
            <div className={styles.countryList}>
              {topCountries.map((c, i) => (
                <div key={c.country} className={styles.countryRow}>
                  <span className={styles.countryRank}>{i + 1}</span>
                  <span className={styles.countryFlag}>{countryFlag(c.code)}</span>
                  <span className={styles.countryName}>{c.country}</span>
                  <span className={styles.countryCount}>{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            Recent Orders
            <Link href="/admin/orders" className={styles.viewAll}>View all →</Link>
          </h3>
          {recentOrders.length === 0 ? (
            <EmptyState text="No orders yet" />
          ) : (
            <div className={styles.orderList}>
              {recentOrders.map(o => (
                <div key={o.orderRef} className={styles.orderRow}>
                  <div>
                    <span className={styles.orderRef}>{o.orderRef}</span>
                    <span className={styles.orderName}>{o.name}</span>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.orderAmount}>£{o.total}</span>
                    <span className={styles.orderStatus} style={{ color: STATUS_COLORS[o.status] || '#888' }}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
