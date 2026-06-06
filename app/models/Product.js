import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  slug:         { type: String, required: true, trim: true },
  tagline:      { type: String, required: true },
  description:  { type: String, required: true },
  images:       [{ type: String }],
  basePrice:    { type: Number, required: true, min: 0 },
  badge:        { type: String, default: null },
  colours:      [{ type: String }],
  fabrics:      [{ type: String }],
  sizes:        [{ type: String }],
  addons:       [{ type: String }],
  addonPrices:   { type: Map, of: Number, default: {} },
  fabricColours: { type: mongoose.Schema.Types.Mixed, default: {} },
  fabricImages:  { type: mongoose.Schema.Types.Mixed, default: {} },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categorySlug: { type: String, required: true },
}, { timestamps: true })

ProductSchema.index({ slug: 1, categorySlug: 1 }, { unique: true })

// Always clear the cached model so hot-reload picks up schema changes.
// Without this, Mongoose re-uses the old model (strict mode silently drops
// fields that weren't in the schema at first registration — e.g. fabricImages).
if (mongoose.models.Product) delete mongoose.models.Product
export default mongoose.model('Product', ProductSchema)
