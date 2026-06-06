import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

// Build URIs for all 3 replica set nodes from the base host in MONGODB_URI
function getNodeUris() {
  const url = new URL(MONGODB_URI)
  const auth = `${url.username}:${encodeURIComponent(decodeURIComponent(url.password))}`
  const db = url.pathname || '/kingsfordsleep'
  const base = url.hostname // e.g. cluster0-shard-00-00.uf3lp.mongodb.net

  return [0, 1, 2].map(i => {
    const host = base.replace(/shard-00-0\d/, `shard-00-0${i}`)
    return `mongodb://${auth}@${host}:27017${db}?tls=true&authSource=admin&directConnection=true`
  })
}

// Test all 3 nodes in parallel — return first one that is writable primary
async function findPrimaryUri() {
  const uris = getNodeUris()

  const results = await Promise.allSettled(
    uris.map(async (uri) => {
      const client = new mongoose.mongo.MongoClient(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000,
      })
      try {
        await client.connect()
        const info = await client.db('admin').command({ hello: 1 })
        await client.close()
        if (info.isWritablePrimary || info.ismaster) return uri
        throw new Error('secondary')
      } catch (e) {
        await client.close().catch(() => {})
        throw e
      }
    })
  )

  const winner = results.find(r => r.status === 'fulfilled')
  if (winner) return winner.value

  // Fallback — node-00 on the correct port (reads work, writes may fail if secondary)
  return uris[0]
}

let cached = global.mongoose
if (!cached) cached = global.mongoose = { conn: null, promise: null }

export default async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = findPrimaryUri().then(uri =>
      mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
    )
  }

  cached.conn = await cached.promise
  return cached.conn
}
