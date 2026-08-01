import type { GitHubNotification, GitHubIssue } from './types'

const GITHUB_API = 'https://api.github.com'

function getToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set')
  return token
}

function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

export async function fetchNotifications(): Promise<GitHubNotification[]> {
  const token = getToken()
  const res = await fetch(
    `${GITHUB_API}/notifications?participating=true&all=false`,
    { headers: githubHeaders(token) }
  )
  if (!res.ok) {
    throw new Error(`GitHub fetchNotifications failed: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as GitHubNotification[]
  return data.filter((n) => n.subject.type === 'Issue')
}

export async function fetchIssue(apiUrl: string): Promise<GitHubIssue> {
  const token = getToken()
  const res = await fetch(apiUrl, { headers: githubHeaders(token) })
  if (!res.ok) {
    throw new Error(`GitHub fetchIssue failed for ${apiUrl}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<GitHubIssue>
}

export async function postComment(
  repoFullName: string,
  issueNumber: number,
  body: string
): Promise<void> {
  const token = getToken()
  const url = `${GITHUB_API}/repos/${repoFullName}/issues/${issueNumber}/comments`
  const res = await fetch(url, {
    method: 'POST',
    headers: githubHeaders(token),
    body: JSON.stringify({ body }),
  })
  if (!res.ok) {
    throw new Error(`GitHub postComment failed: ${res.status} ${res.statusText}`)
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const token = getToken()
  const url = `${GITHUB_API}/notifications/threads/${notificationId}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: githubHeaders(token),
  })
  // 205 Reset Content is the success response for this endpoint
  if (!res.ok && res.status !== 205) {
    throw new Error(`GitHub markNotificationRead failed: ${res.status} ${res.statusText}`)
  }
}
