import type { VercelLog } from './types'

const VERCEL_API = 'https://api.vercel.com'

function getCredentials(): { token: string; projectId: string } {
  const token = process.env.VERCEL_TOKEN
  if (!token) throw new Error('VERCEL_TOKEN environment variable is not set')
  const projectId =
    process.env.VERCEL_PROJECT_ID ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID
  if (!projectId) throw new Error('VERCEL_PROJECT_ID environment variable is not set')
  return { token, projectId }
}

interface VercelDeployment {
  uid: string
  url: string
  state: string
}

interface VercelDeploymentsResponse {
  deployments: VercelDeployment[]
}

interface VercelEventPayload {
  id: string
  text: string
  date: number
  level?: 'error' | 'warning' | 'info' | 'debug'
}

interface VercelEvent {
  type: string
  payload: VercelEventPayload
}

export async function fetchRecentDeployment(): Promise<{
  id: string
  url: string
  state: string
} | null> {
  const { token, projectId } = getCredentials()
  const url = `${VERCEL_API}/v6/deployments?projectId=${encodeURIComponent(projectId)}&limit=1&target=production`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`Vercel fetchRecentDeployment failed: ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as VercelDeploymentsResponse
  const deployment = data.deployments[0]
  if (!deployment) return null
  return { id: deployment.uid, url: deployment.url, state: deployment.state }
}

export async function fetchDeploymentLogs(deploymentId: string): Promise<VercelLog[]> {
  const { token } = getCredentials()
  const url = `${VERCEL_API}/v3/deployments/${encodeURIComponent(deploymentId)}/events?limit=100`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`Vercel fetchDeploymentLogs failed: ${res.status} ${res.statusText}`)
  }
  const events = (await res.json()) as VercelEvent[]
  return events
    .filter((e) => e.payload?.level === 'error')
    .map((e) => ({
      id: e.payload.id,
      message: e.payload.text,
      level: 'error' as const,
      timestamp: e.payload.date,
      deploymentId,
    }))
}

export async function fetchErrorLogs(): Promise<VercelLog[]> {
  const deployment = await fetchRecentDeployment()
  if (!deployment) return []
  const logs = await fetchDeploymentLogs(deployment.id)
  return logs.filter((l) => l.level === 'error')
}
