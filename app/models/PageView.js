import mongoose from 'mongoose'

const PageViewSchema = new mongoose.Schema({
  path:        { type: String, required: true },
  device:      { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
  country:     { type: String, default: 'Unknown' },
  countryCode: { type: String, default: '' },
  referrer:    { type: String, default: '' },
}, { timestamps: true })

PageViewSchema.index({ createdAt: -1 })
PageViewSchema.index({ path: 1 })

if (mongoose.models.PageView) delete mongoose.models.PageView
export default mongoose.model('PageView', PageViewSchema)
