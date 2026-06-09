import connectDB from '../lib/mongodb'
import Product from '../models/Product'
import Order from '../models/Order'
import Review from '../models/Review'
import PageView from '../models/PageView'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

function pathToLabel(path) {
  if (path === '/')           return 'Homepage'
  if (path === '/beds')       return 'All Beds'
  if (path === '/configure')  return 'Configurator'
  if (path === '/faq')        return 'FAQ'
  if (path === '/contact')    return 'Contact'
  if (path === '/about')      return 'About Us'
  if (path === '/reviews')    return 'Reviews'
  if (path === '/delivery')   return 'Delivery'
  if (path === '/returns')    return 'Returns'
  if (path === '/terms')      return 'Terms'
  if (path === '/privacy')    return 'Privacy'
  if (path.startsWith('/beds/')) {
    const parts = path.split('/').filter(Boolean)
    const slug = parts[parts.length - 1] || ''
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 22)
  }
  return path.slice(0, 24)
}

export default async function AdminDashboard() {
  await connectDB()

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const sevenDaysAgo   = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    pendingReviews,
    todayCount,
    weekCount,
    dailyRaw,
    topPagesRaw,
    devicesRaw,
    topCountriesRaw,
    recentOrdersRaw,
  ] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'new' }),
    Review.countDocuments({ status: 'pending' }),
    PageView.countDocuments({ createdAt: { $gte: startOfToday } }),
    PageView.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    PageView.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' }, d: { $dayOfMonth: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]),
    PageView.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    PageView.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]),
    PageView.aggregate([
      { $match: { country: { $nin: ['Unknown', ''] } } },
      { $group: { _id: { country: '$country', code: '$countryCode' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  // Fill all 14 days (including zeros)
  const dailyMap = {}
  for (const d of dailyRaw) {
    const key = `${d._id.y}-${String(d._id.m).padStart(2, '0')}-${String(d._id.d).padStart(2, '0')}`
    dailyMap[key] = d.count
  }
  const dailyViews = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    dailyViews.push({
      date: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      count: dailyMap[key] || 0,
    })
  }

  const topPages = topPagesRaw.map(p => ({
    path:  p._id,
    label: pathToLabel(p._id),
    count: p.count,
  }))

  const deviceMap = { mobile: 0, tablet: 0, desktop: 0 }
  for (const d of devicesRaw) {
    if (d._id in deviceMap) deviceMap[d._id] = d.count
  }
  const devices = [
    { name: 'Mobile',  value: deviceMap.mobile  },
    { name: 'Desktop', value: deviceMap.desktop },
    { name: 'Tablet',  value: deviceMap.tablet  },
  ]

  const topCountries = topCountriesRaw.map(c => ({
    country: c._id.country,
    code:    c._id.code,
    count:   c.count,
  }))

  const recentOrders = recentOrdersRaw.map(o => ({
    orderRef: o.orderRef,
    name:     o.name,
    total:    o.total,
    status:   o.status,
  }))

  const stats = {
    todayCount, weekCount, totalOrders, pendingOrders,
    pendingReviews, totalProducts,
    dailyViews, topPages, devices, topCountries, recentOrders,
  }

  return <DashboardClient stats={stats} />
}
