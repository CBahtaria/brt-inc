import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['proposal', 'invoice', 'agreement', 'notification'] as const

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

  // Allow unauthenticated 'notification' type (used by public onboarding form)
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = body.type as string
  const requiresAuth = type !== 'notification'

  if (requiresAuth) {
    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
    }
    // Verify token with Supabase (uses service role key — server-side only)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
  }

  const { to, subject, html } = body

  if (!to || !subject || !html) {
    return NextResponse.json(
      { error: 'Missing required fields: to, subject, html' },
      { status: 400 }
    )
  }

  if (!ALLOWED_TYPES.includes(type as typeof ALLOWED_TYPES[number])) {
    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: 'BRT Inc. <charles@brtinc.dev>',
    to: [String(to)],
    subject: String(subject),
    html: String(html),
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id })
}
