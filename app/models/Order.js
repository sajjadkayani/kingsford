import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  name: String,
  slug: String,
  categorySlug: String,
  size: String,
  fabric: String,
  colour: String,
  addons: [String],
  price: Number,
  badge: String,
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  orderRef: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  notes: String,
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['new', 'confirmed', 'in-production', 'dispatched', 'delivered', 'cancelled'],
    default: 'new',
  },
}, { timestamps: true })

// Auto-generate a short order reference before saving
// Mongoose 9: async pre-hooks must NOT call next() — just return the promise
OrderSchema.pre('save', async function () {
  if (!this.orderRef) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderRef = `KS-${String(count + 1).padStart(4, '0')}`
  }
})

// Delete cached model on hot-reload so schema changes (including hooks) take effect
if (mongoose.models.Order) delete mongoose.models.Order
export default mongoose.model('Order', OrderSchema)
