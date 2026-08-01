export type Classification = 'crash' | 'bug' | 'feature' | 'pr' | 'spam' | 'other'

export interface GitHubNotification {
  id: string
  reason: string          // 'mention' | 'assign' | 'subscribed' | etc
  subject: {
    title: string
    url: string           // API URL e.g. .../issues/42
    type: 'Issue' | 'PullRequest' | 'Commit'
  }
  repository: {
    full_name: string     // e.g. 'CBahtaria/brt-inc'
    html_url: string
  }
  updated_at: string
}

export interface GitHubIssue {
  number: number
  title: string
  body: string
  html_url: string
  state: string
  labels: Array<{ name: string }>
  user: { login: string }
  created_at: string
}

export interface VercelLog {
  id: string
  message: string
  level: 'error' | 'warning' | 'info' | 'debug'
  timestamp: number
  deploymentId?: string
}

export interface TriageState {
  notification: GitHubNotification
  issue: GitHubIssue | null
  classification: Classification | null
  logs: VercelLog[]
  analysis: string | null
  fix: string | null
  commentPosted: boolean
  error: string | null
}

// LangGraph-style graph types
export type NodeFn = (state: TriageState) => Promise<Partial<TriageState>>
export type RouteFn = (state: TriageState) => string

export interface GraphNode {
  name: string
  fn: NodeFn
}

export interface GraphEdge {
  from: string
  to: string | RouteFn   // string = unconditional, RouteFn = conditional
}

// CrewAI-style agent type
export interface AgentDef {
  role: string
  goal: string
  tools: string[]
  model: 'claude-haiku-4-5-20251001' | 'claude-sonnet-4-6'
}
