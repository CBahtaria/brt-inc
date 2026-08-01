import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { runCrew } from '@/lib/agents/crew'
import type { GitHubNotification } from '@/lib/agents/types'

// ---------------------------------------------------------------------------
// HMAC-SHA256 signature verification
// ---------------------------------------------------------------------------

async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) return false
  if (!signature) return false

  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
  try {
    return timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'))
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Crash/error keywords for issue_comment filtering
// ---------------------------------------------------------------------------

const CRASH_KEYWORDS = ['crash', 'error', 'broken', '500', 'exception']

function containsCrashKeyword(text: string): boolean {
  const lower = text.toLowerCase()
  return CRASH_KEYWORDS.some((kw) => lower.includes(kw))
}

// ---------------------------------------------------------------------------
// Payload shape helpers
// ---------------------------------------------------------------------------

interface IssuesPayload {
  action: string
  issue: {
    number: number
    title: string
    body: string
    html_url: string
    state: string
    labels: Array<{ name: string }>
    user: { login: string }
    created_at: string
    url: string
  }
  repository: {
    full_name: string
    html_url: string
  }
}

interface IssueCommentPayload {
  action: string
  comment: { body: string }
  issue: IssuesPayload['issue']
  repository: IssuesPayload['repository']
}

function buildNotificationFromIssuesPayload(payload: IssuesPayload): GitHubNotification {
  return {
    id: `webhook-issue-${payload.issue.number}-${Date.now()}`,
    reason: 'webhook',
    subject: {
      title: payload.issue.title,
      url: payload.issue.url,
      type: 'Issue',
    },
    repository: {
      full_name: payload.repository.full_name,
      html_url: payload.repository.html_url,
    },
    updated_at: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'GITHUB_WEBHOOK_SECRET not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')
  const valid = await verifySignature(rawBody, signature)

  if (!valid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const event = request.headers.get('x-github-event') ?? ''

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const action = payload.action as string | undefined

  if (event === 'issues' && (action === 'opened' || action === 'reopened')) {
    const typed = payload as unknown as IssuesPayload
    const notification = buildNotificationFromIssuesPayload(typed)
    const result = await runCrew(notification)
    return NextResponse.json({
      ok: true,
      result: { classification: result.classification, commentPosted: result.commentPosted },
    })
  }

  if (event === 'issue_comment' && action === 'created') {
    const typed = payload as unknown as IssueCommentPayload
    if (containsCrashKeyword(typed.comment.body)) {
      const notification = buildNotificationFromIssuesPayload({
        action: typed.action,
        issue: typed.issue,
        repository: typed.repository,
      })
      const result = await runCrew(notification)
      return NextResponse.json({
        ok: true,
        result: { classification: result.classification, commentPosted: result.commentPosted },
      })
    }
  }

  return NextResponse.json({ ok: true, skipped: true })
}
