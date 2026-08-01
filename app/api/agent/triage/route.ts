import { NextRequest, NextResponse } from 'next/server'
import { runCrew } from '@/lib/agents/crew'
import { fetchNotifications, fetchIssue } from '@/lib/agents/github'
import type { GitHubNotification, TriageState } from '@/lib/agents/types'

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

function isAuthorized(request: NextRequest): boolean {
  const agentKey = process.env.AGENT_API_KEY
  if (!agentKey) return false
  return request.headers.get('x-agent-key') === agentKey
}

// ---------------------------------------------------------------------------
// Safe TriageState subset for API responses (no raw token values)
// ---------------------------------------------------------------------------

type SafeTriageState = Omit<TriageState, 'notification'> & {
  notificationId: string
  repoFullName: string
  issueTitle: string
}

function toSafeState(state: TriageState): SafeTriageState {
  const { notification, ...rest } = state
  return {
    ...rest,
    notificationId: notification.id,
    repoFullName: notification.repository.full_name,
    issueTitle: notification.subject.title,
  }
}

// ---------------------------------------------------------------------------
// GET — poll all unread notifications and triage each
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let notifications: GitHubNotification[]
  try {
    notifications = await fetchNotifications()
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  const results: SafeTriageState[] = []
  for (const notification of notifications) {
    const state = await runCrew(notification)
    results.push(toSafeState(state))
  }

  return NextResponse.json({ ok: true, processed: results.length, results })
}

// ---------------------------------------------------------------------------
// POST — triage a specific notification or issue
// ---------------------------------------------------------------------------

interface TriagePostBody {
  notificationId?: string
  repoFullName?: string
  issueNumber?: number
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: TriagePostBody
  try {
    body = (await request.json()) as TriagePostBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { repoFullName, issueNumber } = body

  // Build a synthetic notification from repoFullName + issueNumber
  if (repoFullName && issueNumber !== undefined) {
    const apiUrl = `https://api.github.com/repos/${repoFullName}/issues/${issueNumber}`
    let issue: Awaited<ReturnType<typeof fetchIssue>>
    try {
      issue = await fetchIssue(apiUrl)
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }

    const notification: GitHubNotification = {
      id: `manual-${repoFullName}-${issueNumber}-${Date.now()}`,
      reason: 'manual',
      subject: {
        title: issue.title,
        url: apiUrl,
        type: 'Issue',
      },
      repository: {
        full_name: repoFullName,
        html_url: `https://github.com/${repoFullName}`,
      },
      updated_at: new Date().toISOString(),
    }

    const state = await runCrew(notification)
    return NextResponse.json({ ok: true, result: toSafeState(state) })
  }

  // Fall back: look up by notificationId from the live notifications list
  if (body.notificationId) {
    let notifications: GitHubNotification[]
    try {
      notifications = await fetchNotifications()
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }

    const notification = notifications.find((n) => n.id === body.notificationId)
    if (!notification) {
      return NextResponse.json(
        { error: `Notification ${body.notificationId} not found` },
        { status: 404 }
      )
    }

    const state = await runCrew(notification)
    return NextResponse.json({ ok: true, result: toSafeState(state) })
  }

  return NextResponse.json(
    { error: 'Provide notificationId or both repoFullName and issueNumber' },
    { status: 400 }
  )
}
