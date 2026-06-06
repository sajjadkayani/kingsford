import nodemailer from 'nodemailer'
import connectDB from '@/app/lib/mongodb'
import Order from '@/app/models/Order'

async function sendOrderEmail(orderData) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  const { name, email, phone, notes, items, total, orderRef } = orderData

  const itemsHtml = items.map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#f9f9f9' : '#fff'}">
      <td style="padding:8px">${item.name}</td>
      <td style="padding:8px">${item.size}</td>
      <td style="padding:8px">${item.fabric} / ${item.colour}</td>
      <td style="padding:8px">${item.addons?.join(', ') || 'None'}</td>
      <td style="padding:8px;color:#c9a96e;font-weight:bold">£${item.price}</td>
    </tr>`).join('')

  await transporter.sendMail({
    from: `"Kingsford Sleep Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || 'hello@kingsfordsleep.co.uk',
    replyTo: email,
    subject: `NEW ORDER ${orderRef}: ${items.length} item${items.length > 1 ? 's' : ''} — £${total} — ${name}`,
    html: `
      <h2 style="color:#c9a96e">NEW ORDER — Kingsford Sleep</h2>
      <p><strong>Order Ref:</strong> ${orderRef}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <hr/>
      <h3>Items Ordered</h3>
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr style="background:#eee">
            <th style="padding:8px;text-align:left">Bed</th>
            <th style="padding:8px;text-align:left">Size</th>
            <th style="padding:8px;text-align:left">Fabric / Colour</th>
            <th style="padding:8px;text-align:left">Extras</th>
            <th style="padding:8px;text-align:left">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="padding:8px;font-weight:bold;text-align:right">Total</td>
            <td style="padding:8px;color:#c9a96e;font-size:1.2em;font-weight:bold">£${total}</td>
          </tr>
        </tfoot>
      </table>
      ${notes ? `<hr/><p><strong>Notes:</strong> ${notes}</p>` : ''}
      <hr/>
      <p style="color:#888;font-size:0.85em">View in admin panel: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders</p>
    `,
  })
}

export async function POST(request) {
  try {
    const body = await request.json()

    let items = []
    let name, email, phone, notes, total

    if (body.cartItems) {
      // Cart checkout — multiple items
      ;({ name, email, phone, notes } = body)
      if (!name || !email || !body.cartItems?.length) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
      }
      items = body.cartItems.map(i => ({
        name: i.name,
        slug: i.slug,
        categorySlug: i.categorySlug,
        size: i.size,
        fabric: i.fabric,
        colour: i.colour,
        addons: i.addons || [],
        price: i.price,
        badge: i.badge,
      }))
      total = items.reduce((sum, i) => sum + i.price, 0)
    } else {
      // Single product order
      ;({ name, email, phone, notes } = body)
      if (!name || !email || !body.product) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
      }
      items = [{
        name: body.product,
        slug: body.slug || '',
        categorySlug: body.category || '',
        size: body.size,
        fabric: body.fabric,
        colour: body.colour,
        addons: body.addons || [],
        price: body.price,
      }]
      total = body.price
    }

    // Save to database first — this is the source of truth
    await connectDB()
    const order = await Order.create({ name, email, phone, notes, items, total })

    // Send email notification — non-blocking, failure doesn't affect the order
    sendOrderEmail({ name, email, phone, notes, items, total, orderRef: order.orderRef })
      .catch(err => console.error('Order email failed (order was saved):', err))

    return Response.json({ success: true, orderRef: order.orderRef })
  } catch (error) {
    console.error('Order submission error:', error)
    return Response.json(
      { error: 'Failed to submit order', detail: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}
