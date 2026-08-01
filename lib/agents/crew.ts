import type { AgentDef, GitHubNotification, TriageState } from './types'
import { buildTriageGraph, hydrateIssue } from './graph'

// ---------------------------------------------------------------------------
// CrewAI-style agent definitions
// ---------------------------------------------------------------------------

const TRIAGE_AGENT: AgentDef = {
  role: 'GitHub Triage Specialist',
  goal: 'Classify incoming GitHub notifications and determine urgency',
  tools: ['github_fetch_issue', 'classify'],
  model: 'claude-haiku-4-5-20251001',
}

const DIAGNOSTICS_AGENT: AgentDef = {
  role: 'Production Diagnostics Engineer',
  goal: 'Analyze Vercel error logs and identify root cause of crashes',
  tools: ['vercel_fetch_logs', 'analyze'],
  model: 'claude-sonnet-4-6',
}

const FIX_AGENT: AgentDef = {
  role: 'Senior Software Engineer',
  goal: 'Generate actionable fixes for identified production issues',
  tools: ['read_codebase', 'generate_fix', 'post_comment'],
  model: 'claude-sonnet-4-6',
}

// ---------------------------------------------------------------------------
// Crew manifest — exported for API consumers
// ---------------------------------------------------------------------------

export const CREW_MANIFEST = {
  agents: [TRIAGE_AGENT, DIAGNOSTICS_AGENT, FIX_AGENT],
}

// ---------------------------------------------------------------------------
// runCrew — entry point; maps crew → graph
// ---------------------------------------------------------------------------

export async function runCrew(notification: GitHubNotification): Promise<TriageState> {
  const initialState: TriageState = {
    notification,
    issue: null,
    classification: null,
    logs: [],
    analysis: null,
    fix: null,
    commentPosted: false,
    error: null,
  }

  // Hydrate issue before entering the graph (TRIAGE_AGENT responsibility)
  const hydratedState = await hydrateIssue(initialState)

  // Run the LangGraph-style state machine (DIAGNOSTICS_AGENT + FIX_AGENT nodes live here)
  const graph = buildTriageGraph()
  return graph.invoke(hydratedState)
}
