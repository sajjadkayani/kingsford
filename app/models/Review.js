import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  location:     { type: String, default: '' },
  rating:       { type: Number, required: true, min: 1, max: 5, default: 5 },
  bed:          { type: String, default: '' },
  review:       { type: String, required: true },
  verified:     { type: Boolean, default: false },
  status:       { type: String, enum: ['pending', 'approved'], default: 'pending' },
  // Product-specific fields (optional)
  productSlug:  { type: String, default: null },
  categorySlug: { type: String, default: null },
  productName:  { type: String, default: null },
}, { timestamps: true })

ReviewSchema.index({ productSlug: 1, status: 1 })

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
