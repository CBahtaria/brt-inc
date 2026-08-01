import type { NodeFn, RouteFn, TriageState, Classification } from './types'
import { fetchIssue, postComment, markNotificationRead } from './github'
import { fetchErrorLogs } from './vercel-logs'

// ---------------------------------------------------------------------------
// Minimal LangGraph-style state machine
// ---------------------------------------------------------------------------

export class StateGraph {
  private nodes = new Map<string, NodeFn>()
  private edges = new Map<string, string | RouteFn>()

  addNode(name: string, fn: NodeFn): this {
    this.nodes.set(name, fn)
    return this
  }

  addEdge(from: string, to: string): this {
    this.edges.set(from, to)
    return this
  }

  addConditionalEdge(from: string, routeFn: RouteFn): this {
    this.edges.set(from, routeFn)
    return this
  }

  async invoke(initialState: TriageState): Promise<TriageState> {
    let state: TriageState = { ...initialState }
    let current = 'START'

    while (current !== 'END') {
      const next = this.edges.get(current)
      if (next === undefined) break

      const nextName = typeof next === 'function' ? next(state) : next
      if (nextName === 'END') break

      const nodeFn = this.nodes.get(nextName)
      if (!nodeFn) {
        throw new Error(`StateGraph: node "${nextName}" is not registered`)
      }

      const patch = await nodeFn(state)
      state = { ...state, ...patch }

      current = nextName
    }

    return state
  }
}

// ---------------------------------------------------------------------------
// Anthropic raw-fetch helpers
// ---------------------------------------------------------------------------

interface AnthropicMessage {
  content: Array<{ type: string; text: string }>
}

async function callAnthropic(
  model: string,
  systemPrompt: string,
  userContent: string,
  maxTokens = 1024
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is not set')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${errText}`)
  }

  const data = (await res.json()) as AnthropicMessage
  const block = data.content.find((b) => b.type === 'text')
  return block?.text ?? ''
}

// ---------------------------------------------------------------------------
// Node implementations
// ---------------------------------------------------------------------------

const CLASSIFY_SYSTEM = `You are a GitHub issue triage specialist.
Classify the given issue into exactly one of: crash, bug, feature, pr, spam, other.
Respond with JSON only, no markdown fences:
{"classification":"<value>","confidence":<0-100>,"keywords":["<word>",...]}`

async function classifyNode(state: TriageState): Promise<Partial<TriageState>> {
  try {
    const { notification, issue } = state
    if (!process.env.ANTHROPIC_API_KEY) {
      return { error: 'ANTHROPIC_API_KEY is not set — classify node skipped' }
    }

    const title = issue?.title ?? notification.subject.title
    const body = issue?.body ?? ''
    const userContent = `Title: ${title}\n\nBody:\n${body}`

    const raw = await callAnthropic(
      'claude-haiku-4-5-20251001',
      CLASSIFY_SYSTEM,
      userContent,
      256
    )

    let parsed: { classification: Classification; confidence: number; keywords: string[] }
    try {
      parsed = JSON.parse(raw) as typeof parsed
    } catch {
      // Fallback: treat the whole response as classification text
      return {
        classification: 'other',
        analysis: raw,
        error: null,
      }
    }

    return {
      classification: parsed.classification,
      analysis: JSON.stringify({ confidence: parsed.confidence, keywords: parsed.keywords }),
      error: null,
    }
  } catch (err) {
    return { error: `classify: ${String(err)}` }
  }
}

async function fetchLogsNode(state: TriageState): Promise<Partial<TriageState>> {
  try {
    if (!process.env.VERCEL_TOKEN) {
      return { logs: [], error: 'VERCEL_TOKEN is not set — fetchLogs node skipped' }
    }
    const logs = await fetchErrorLogs()
    return { logs, error: null }
  } catch (err) {
    return { logs: [], error: `fetchLogs: ${String(err)}` }
  }
}

const ANALYZE_SYSTEM = `You are a senior production diagnostics engineer.
Given a GitHub issue and Vercel error logs, provide a concise plain-text analysis:
1. Root cause
2. File/line likely affected (if determinable)
3. User impact`

async function analyzeNode(state: TriageState): Promise<Partial<TriageState>> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { error: 'ANTHROPIC_API_KEY is not set — analyze node skipped' }
    }

    const { issue, notification, logs } = state
    const title = issue?.title ?? notification.subject.title
    const body = issue?.body ?? ''
    const recentLogs = logs.slice(0, 20)
    const logText =
      recentLogs.length > 0
        ? recentLogs.map((l) => `[${new Date(l.timestamp).toISOString()}] ${l.message}`).join('\n')
        : 'No error logs available.'

    const userContent = `Issue Title: ${title}\n\nIssue Body:\n${body}\n\nError Logs:\n${logText}`
    const analysis = await callAnthropic(
      'claude-sonnet-4-6',
      ANALYZE_SYSTEM,
      userContent,
      1024
    )
    return { analysis, error: null }
  } catch (err) {
    return { error: `analyze: ${String(err)}` }
  }
}

const FIX_SYSTEM = `You are a senior software engineer.
Given a production issue analysis, respond with:
## Diagnosis
<markdown summary>

## Suggested Fix
<concrete code suggestion or action steps>

## Complexity
trivial | minor | major`

async function generateFixNode(state: TriageState): Promise<Partial<TriageState>> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { error: 'ANTHROPIC_API_KEY is not set — generateFix node skipped' }
    }

    const { analysis } = state
    const userContent = `Analysis:\n${analysis ?? 'No analysis available.'}`
    const fix = await callAnthropic('claude-sonnet-4-6', FIX_SYSTEM, userContent, 1024)
    return { fix, error: null }
  } catch (err) {
    return { error: `generateFix: ${String(err)}` }
  }
}

function buildComment(state: TriageState): string {
  // Extract confidence from analysis JSON stored during classify
  let confidenceLine = ''
  try {
    const meta = JSON.parse(state.analysis ?? '{}') as { confidence?: number }
    if (typeof meta.confidence === 'number') {
      confidenceLine = `**Confidence:** ${meta.confidence}%`
    }
  } catch {
    // analysis is plain text from later nodes — use as-is
  }

  const analysisText = state.analysis ?? '_No analysis available._'
  const fixText = state.fix ?? '_No fix generated._'

  return [
    '## 🤖 BRT Agent Triage',
    '',
    `**Classification:** ${state.classification ?? 'unknown'}  `,
    confidenceLine ? `${confidenceLine}  ` : '',
    '',
    '### Analysis',
    analysisText,
    '',
    '### Suggested Fix',
    fixText,
    '',
    '---',
    '*Automated triage by BRT Inc. agent system · [brtinc.dev/ecosystem](https://brtinc.dev/ecosystem)*',
  ]
    .filter((line) => line !== undefined)
    .join('\n')
}

async function reportNode(state: TriageState): Promise<Partial<TriageState>> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return { commentPosted: false, error: 'GITHUB_TOKEN is not set — report node skipped' }
    }

    const { notification, issue } = state
    if (!issue) {
      return { commentPosted: false, error: 'report: no issue to comment on' }
    }

    const comment = buildComment(state)
    await postComment(notification.repository.full_name, issue.number, comment)
    // Best-effort — synthetic notification IDs (manual triggers) return 404; don't fail the node
    try { await markNotificationRead(notification.id) } catch { /* ignored */ }
    return { commentPosted: true, error: null }
  } catch (err) {
    return { commentPosted: false, error: `report: ${String(err)}` }
  }
}

// ---------------------------------------------------------------------------
// Graph factory
// ---------------------------------------------------------------------------

export function buildTriageGraph(): StateGraph {
  const graph = new StateGraph()

  graph.addNode('classify', classifyNode)
  graph.addNode('fetchLogs', fetchLogsNode)
  graph.addNode('analyze', analyzeNode)
  graph.addNode('generateFix', generateFixNode)
  graph.addNode('report', reportNode)

  // START → classify (unconditional first step)
  graph.addEdge('START', 'classify')

  // classify → fetchLogs if crash/bug, else → report
  graph.addConditionalEdge('classify', (state) => {
    const cls = state.classification
    if (cls === 'crash' || cls === 'bug') return 'fetchLogs'
    return 'report'
  })

  graph.addEdge('fetchLogs', 'analyze')
  graph.addEdge('analyze', 'generateFix')
  graph.addEdge('generateFix', 'report')
  graph.addEdge('report', 'END')

  return graph
}

// ---------------------------------------------------------------------------
// Pre-graph issue hydration helper (not a node — called before invoke)
// ---------------------------------------------------------------------------

export async function hydrateIssue(state: TriageState): Promise<TriageState> {
  try {
    const issue = await fetchIssue(state.notification.subject.url)
    return { ...state, issue }
  } catch (err) {
    return { ...state, error: `hydrateIssue: ${String(err)}` }
  }
}
