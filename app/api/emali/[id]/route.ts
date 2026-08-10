import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ActionSchema = z.object({ action: z.enum(['confirm', 'reject']) })
const IdSchema = z.string().uuid()

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idParsed = IdSchema.safeParse(id)
  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = ActionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const status = parsed.data.action === 'confirm' ? 'confirmed' : 'rejected'
  const { data, error } = await supabase
    .from('payment_references')
    .update({ status, confirmed_at: new Date().toISOString(), confirmed_by: user.id })
    .eq('id', idParsed.data)
    .eq('status', 'pending')
    .select('id')

  if (error) {
    console.error('payment_references update failed:', error)
    return NextResponse.json({ error: 'Could not update reference' }, { status: 500 })
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Reference not found or already decided' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
