/**
 * Resolves the MongoDB SRV URI to a direct connection string
 * and updates .env.local automatically.
 * Usage: node scripts/get-direct-uri.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '../.env.local')

// Load .env.local
const envContent = readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')
const uriLine = envLines.find(l => l.startsWith('MONGODB_URI='))
if (!uriLine) { console.error('MONGODB_URI not found in .env.local'); process.exit(1) }

const srvUri = uriLine.replace('MONGODB_URI=', '').trim()
if (!srvUri.startsWith('mongodb+srv://')) {
  console.log('URI is already a direct connection string. Nothing to do.')
  process.exit(0)
}

const url = new URL(srvUri)
const hostname = url.hostname
const username = url.username
const password = url.password
const dbName = url.pathname.slice(1) || 'kingsfordsleep'

console.log(`Resolving SRV for: ${hostname} via Google DNS...`)

const { promises: dnsPromises } = dns

const srvRecords = await dnsPromises.resolveSrv(`_mongodb._tcp.${hostname}`)
console.log('SRV records found:', srvRecords.map(r => `${r.name}:${r.port}`))

const txtRecords = await dnsPromises.resolveTxt(hostname).catch(() => [])
const txtOptions = txtRecords.flat().join('&')
console.log('TXT options:', txtOptions || '(none)')

const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',')
const directUri = `mongodb://${username}:${password}@${hosts}/${dbName}?ssl=true&authSource=admin&${txtOptions}&retryWrites=true&w=majority`

console.log('\nDirect URI:')
console.log(directUri.replace(password, '****'))

// Update .env.local
const newContent = envContent.replace(uriLine, `MONGODB_URI=${directUri}`)
writeFileSync(envPath, newContent)
console.log('\n✓ .env.local updated with direct connection string.')
console.log('Restart your dev server: npm run dev')
