import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import PageView from '../../../models/PageView'

const COUNTRY_NAMES = {
  GB: 'United Kingdom', US: 'United States', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', IN: 'India', PK: 'Pakistan', AE: 'UAE',
  IE: 'Ireland', NZ: 'New Zealand', ZA: 'South Africa', SG: 'Singapore',
  NL: 'Netherlands', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
  IT: 'Italy', ES: 'Spain', PT: 'Portugal', PL: 'Poland',
  CH: 'Switzerland', AT: 'Austria', BE: 'Belgium', MY: 'Malaysia',
  BD: 'Bangladesh', NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana',
  QA: 'Qatar', SA: 'Saudi Arabia', KW: 'Kuwait', BH: 'Bahrain',
}

function getDevice(ua = '') {
  const u = ua.toLowerCase()
  if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(u)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(u)) return 'mobile'
  return 'desktop'
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const ua = request.headers.get('user-agent') || ''

    // Skip obvious bots
    if (/bot|crawl|spider|scraper|headless/i.test(ua)) {
      return NextResponse.json({ ok: true })
    }

    const code =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      ''

    const country = COUNTRY_NAMES[code] || (code && code !== 'XX' ? code : 'Unknown')

    await connectDB()
    await PageView.create({
      path:        body.path || '/',
      device:      getDevice(ua),
      country,
      countryCode: code,
      referrer:    body.referrer || '',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
