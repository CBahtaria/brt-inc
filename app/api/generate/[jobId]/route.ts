import { NextRequest, NextResponse } from 'next/server'
import { getJob } from '@/lib/higgsfield'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobId } = await params
  if (!jobId || !/^[a-f0-9-]{36}$/i.test(jobId)) {
    return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
  }

  try {
    const job = await getJob(jobId)
    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      url: job.results?.[0]?.rawUrl ?? null,
      thumbnailUrl: job.results?.[0]?.thumbnailUrl ?? null,
      error: job.error ?? null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Poll failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
