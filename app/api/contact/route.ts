import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

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

function field(val: unknown, maxLen: number): string | null {
  if (!val) return null
  const s = String(val).trim()
  return s.length === 0 ? null : s.slice(0, maxLen)
}

function sanitise(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function redactEmail(email: string): string {
  return email.replace(/^(.{2})(.*)(@.*)$/, (_, a, _b, c) => `${a}***${c}`)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests — please try again in 15 minutes.' },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — if filled, silently accept (spambot)
  if (body._gotcha) {
    return NextResponse.json({ ok: true })
  }

  const name    = field(body.name, 200)
  const email   = field(body.email, 254)
  const message = field(body.message, 5000)
  const subject = field(body.subject, 200)

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const safeEmail   = sanitise(email)
  const safeName    = sanitise(name)
  const safeMessage = sanitise(message).replace(/\n/g, '<br>')
  const safeService = subject ? sanitise(subject) : null
  const emailSubject = subject
    ? `[Enquiry] ${subject} — ${name}`
    : `[Enquiry] New message from ${name}`

  const html = `
<h2 style="font-family:sans-serif;margin:0 0 8px">New enquiry — BRT Inc.</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="padding:6px 0;font-weight:600;color:#555;width:120px;vertical-align:top">From</td><td>${safeName}</td></tr>
  <tr><td style="padding:6px 0;font-weight:600;color:#555;vertical-align:top">Reply-to</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
  ${safeService ? `<tr><td style="padding:6px 0;font-weight:600;color:#555;vertical-align:top">Service</td><td>${safeService}</td></tr>` : ''}
</table>
<hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5">
<div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#222">${safeMessage}</div>`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'BRT Inc. Contact <noreply@brtinc.dev>',
    to: 'charleskris9@gmail.com',
    reply_to: email,
    subject: emailSubject.slice(0, 300),
    html,
  })

  if (error) {
    console.error(JSON.stringify({
      event: 'contact_form_error',
      error: String(error),
      email: redactEmail(email),
      ts: new Date().toISOString(),
    }))
    return NextResponse.json(
      { error: 'Failed to send — please try again or email charleskris9@gmail.com directly.' },
      { status: 500 }
    )
  }

  console.log(JSON.stringify({
    event: 'contact_form_sent',
    email: redactEmail(email),
    service: subject ?? null,
    ts: new Date().toISOString(),
  }))

  return NextResponse.json({ ok: true })
}
