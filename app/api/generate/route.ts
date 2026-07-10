import { NextRequest, NextResponse } from 'next/server'
import { submitJob } from '@/lib/higgsfield'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// Protect credits: 1 generate request per 30s per user
const cooldowns = new Map<string, number>()
const COOLDOWN_MS = 30_000

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = Date.now()
  const last = cooldowns.get(user.id) ?? 0
  if (now - last < COOLDOWN_MS) {
    const retryAfter = Math.ceil((COOLDOWN_MS - (now - last)) / 1000)
    return NextResponse.json(
      { error: `Rate limited. Retry in ${retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { model, params } = body as { model: string; params: Record<string, unknown> }
  if (!model || typeof model !== 'string') {
    return NextResponse.json({ error: 'Missing model' }, { status: 400 })
  }
  if (!params || typeof params !== 'object') {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }
  if (!params.prompt || typeof params.prompt !== 'string' || params.prompt.trim().length < 3) {
    return NextResponse.json({ error: 'Prompt too short' }, { status: 400 })
  }

  const ALLOWED_MODELS = new Set([
    'gpt_image_2',
    'nano_banana_2',
    'nano_banana_2_lite',
    'recraft_v4_1',
    'seedance_2_0',
    'kling3_0',
  ])
  if (!ALLOWED_MODELS.has(model)) {
    return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 400 })
  }

  try {
    const job = await submitJob(model as any, params as any)
    cooldowns.set(user.id, Date.now())
    return NextResponse.json({ jobId: job.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
