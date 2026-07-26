import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// Price IDs from env — set these in Vercel dashboard
// STRIPE_PRICE_AUDIT_LITE, STRIPE_PRICE_AUDIT_STANDARD, STRIPE_PRICE_AUDIT_PREMIUM
// STRIPE_PRICE_RETAINER_ESSENTIAL, STRIPE_PRICE_RETAINER_PROFESSIONAL
const PRICE_MAP: Record<string, string | undefined> = {
  'audit-lite':              process.env.STRIPE_PRICE_AUDIT_LITE,
  'audit-standard':          process.env.STRIPE_PRICE_AUDIT_STANDARD,
  'audit-premium':           process.env.STRIPE_PRICE_AUDIT_PREMIUM,
  'retainer-essential':      process.env.STRIPE_PRICE_RETAINER_ESSENTIAL,
  'retainer-professional':   process.env.STRIPE_PRICE_RETAINER_PROFESSIONAL,
  'consultation':            process.env.STRIPE_PRICE_CONSULTATION,
}

export async function POST(req: NextRequest) {
  try {
    const { priceId: priceKey, email } = await req.json() as { priceId: string; email?: string }

    const priceId = PRICE_MAP[priceKey]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const isSubscription = priceKey.startsWith('retainer-')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://brt-inc.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      metadata: { priceKey },
      allow_promotion_codes: true,
      ...(isSubscription ? {
        subscription_data: {
          metadata: { priceKey },
          trial_period_days: 0,
        },
      } : {}),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
