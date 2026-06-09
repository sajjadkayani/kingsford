import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a friendly, knowledgeable sales assistant for Kingsford Sleep — a UK luxury bed manufacturer. Help customers find the right bed.

About Kingsford Sleep:
- Handcrafted beds made to order in our UK factory by skilled craftsmen
- Every bed built from scratch to the customer's exact specs — no imports, no off-the-shelf
- Free delivery to mainland UK, fully assembled to room of choice, packaging removed
- 3–4 weeks production time
- 50% deposit to start production, balance due before delivery
- 2-year manufacturing warranty on all beds
- Contact: hello@kingsfordsleep.co.uk

Bed styles (from £499):
- Ottoman Storage Beds — lift-up gas-piston base with full under-bed storage. Best for maximising bedroom storage.
- Wingback Beds — statement headboard with wing panels, dramatic look, available floor-standing or divan base.
- Panel Beds — clean linear headboard, minimal and contemporary.
- Sleigh Beds — curved scroll headboard and footboard, classic traditional silhouette.
- Divan Beds — fully upholstered base and headboard, maximum storage options.
- Chesterfield Beds — deep button-tufted headboard, classic luxury look.

Sizes (standard UK):
- Single: 90 cm wide
- Small Double: 120 cm wide
- Double: 135 cm wide (most popular)
- King: 150 cm wide
- Super King: 180 cm wide
- Custom sizes available on request

Fabrics available: Velvet, Linen, Chenille, Faux Leather (more added regularly). Over 40 colour options — creams, greys, navies, emeralds, burgundies, golds.

Price guide: Base from £499. Size multipliers — Single ×0.8, Small Double ×0.9, Double ×1.0, King ×1.2, Super King ×1.4.
Optional add-ons (extra cost): Diamond Buttoning, Ottoman Storage, Side Drawers, Chrome/Gold/Wooden Feet, Matching Headboard, USB Ports.

Ordering: Browse at kingsfordsleep.co.uk/beds, configure your bed, then order online, via WhatsApp, or email.

Keep responses concise and warm — 2–4 sentences max unless the customer needs detailed help. If you don't know a specific price, say to contact us directly. Never make up product details.`

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chat is not configured yet. Please contact us at hello@kingsfordsleep.co.uk' }, { status: 503 })
    }

    const { messages } = await request.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        max_tokens: 320,
        temperature: 0.65,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again.' }, { status: 502 })
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response. Please contact us directly.'
    return NextResponse.json({ message: reply })
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
