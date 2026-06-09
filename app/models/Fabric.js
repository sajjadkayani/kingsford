import mongoose from 'mongoose'

const FabricSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: '' },
  },
  { timestamps: true }
)

if (mongoose.models.Fabric) delete mongoose.models.Fabric
export default mongoose.model('Fabric', FabricSchema)
