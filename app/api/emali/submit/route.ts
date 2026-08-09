import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory rate limiter — works on Vercel because instances are reused within the TTL
const RATE_MAP = new Map<string, number[]>()
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const prev = (RATE_MAP.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (prev.length >= RATE_MAX) return true
  prev.push(now)
  RATE_MAP.set(ip, prev)
  return false
}

function sanitise(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Ceiling is a sanity bound, not a real pricing limit — E1,000,000 is far above any BRT
// service price, well under Postgres `integer` range (2,147,483,647), and rejects garbage
// input with a clean 400 instead of a DB-level 500.
const MAX_AMOUNT_CENTS = 100_000_000

const SubmitSchema = z.object({
  serviceSlug: z.string().min(1).max(100),
  amountCents: z.number().int().positive().max(MAX_AMOUNT_CENTS),
  payerName: z.string().min(1).max(200),
  payerContact: z.string().min(1).max(200),
  emaliReference: z.string().min(1).max(100),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests — please try again in 15 minutes.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = SubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  const { serviceSlug, amountCents, payerName, payerContact, emaliReference } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('payment_references')
    .insert({
      service_slug: serviceSlug,
      amount_cents: amountCents,
      payer_name: payerName,
      payer_contact: payerContact,
      emali_reference: emaliReference,
    })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Could not record submission' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const safePayerName = sanitise(payerName)
    const safePayerContact = sanitise(payerContact)
    const safeServiceSlug = sanitise(serviceSlug)
    const safeEmaliReference = sanitise(emaliReference)
    await resend.emails.send({
      from: 'BRT Inc. <noreply@brtinc.dev>',
      to: 'charleskris9@gmail.com',
      subject: `New eMali payment reference — ${safeServiceSlug}`,
      html: `<p>${safePayerName} (${safePayerContact}) submitted reference <strong>${safeEmaliReference}</strong> for ${safeServiceSlug}, E${(amountCents / 100).toFixed(2)}. Confirm at /emali in the portal.</p>`,
    })
  } catch {
    // Notification failure must not block the recorded submission — the portal list is authoritative.
  }

  return NextResponse.json({ ok: true, id: data.id })
}
