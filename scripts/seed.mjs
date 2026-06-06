/**
 * Seed script — imports categories.json into MongoDB
 * Usage: node scripts/seed.mjs
 * Requires MONGODB_URI in .env.local
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS — bypasses router DNS that doesn't support SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = join(__dirname, "../.env.local");
try {
  const env = readFileSync(envPath, "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  console.error("Could not read .env.local — set MONGODB_URI manually");
}

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI:", MONGODB_URI);
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local");
  process.exit(1);
}

// Schemas (inline to avoid transpilation issues)
const CategorySchema = new mongoose.Schema(
  { name: String, slug: String, description: String },
  { timestamps: true },
);
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    tagline: String,
    description: String,
    images: [String],
    basePrice: Number,
    badge: String,
    colours: [String],
    fabrics: [String],
    sizes: [String],
    addons: [String],
    category: mongoose.Schema.Types.ObjectId,
    categorySlug: String,
  },
  { timestamps: true },
);

const ReviewSchema = new mongoose.Schema(
  { name: String, location: String, rating: Number, bed: String, review: String, verified: Boolean, status: String },
  { timestamps: true }
)

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product  = mongoose.models.Product  || mongoose.model("Product",  ProductSchema);
const Review   = mongoose.models.Review   || mongoose.model("Review",   ReviewSchema);

const data = JSON.parse(readFileSync(join(__dirname, "../app/components/data/categories.json"), "utf-8"));
const reviewsData = JSON.parse(readFileSync(join(__dirname, "../app/components/data/reviews.json"), "utf-8"));

async function seed() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  // Clear existing
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Review.deleteMany({});
  console.log("Cleared existing data.");

  let totalProducts = 0;

  for (const cat of data) {
    const savedCat = await Category.create({
      name: cat.category,
      slug: cat.slug,
      description: cat.description,
    });
    console.log(
      `  Category: ${cat.category} (${cat.products.length} products)`,
    );

    for (const prod of cat.products) {
      await Product.create({
        name: prod.name,
        slug: prod.slug,
        tagline: prod.tagline,
        description: prod.description,
        images: prod.images || [],
        basePrice: prod.basePrice,
        badge: prod.badge || null,
        colours: prod.colours || [],
        fabrics: prod.fabrics || [],
        sizes: prod.sizes || [],
        addons: prod.addons || [],
        category: savedCat._id,
        categorySlug: cat.slug,
      });
      totalProducts++;
    }
  }

  // Seed reviews
  for (const r of reviewsData) {
    await Review.create({
      name: r.name, location: r.location, rating: r.rating,
      bed: r.bed, review: r.review, verified: r.verified,
      status: "approved",
      createdAt: new Date(r.date || Date.now()),
    });
  }
  console.log(`  Reviews: ${reviewsData.length} seeded`);

  console.log(`\nDone! Seeded ${data.length} categories, ${totalProducts} products, ${reviewsData.length} reviews.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
