'use client'
import { motion } from 'framer-motion'

const GROUPS = [
  {
    label: 'Foundation',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.12)',
    items: [
      { name: 'Fine-Tuning',       desc: 'Domain-adapted models via Unsloth + LoRA on BRT infra — zero data egress' },
      { name: 'Distillation',      desc: 'Compress large models to efficient deployable targets without accuracy collapse' },
      { name: 'Synthetic Data',    desc: 'Self-generating JSONL pipelines using local models to expand training corpora' },
      { name: 'Cost Optimisation', desc: 'Model routing, quantisation, and batch scheduling to minimise inference spend' },
    ],
  },
  {
    label: 'Agent Architecture',
    color: '#2dd4bf',
    glow: 'rgba(45,212,191,0.12)',
    items: [
      { name: 'Multi-Agent Systems', desc: 'Supervisor / worker hierarchies with defined authority and failure isolation' },
      { name: 'Agentic AI / AR',     desc: 'Persistent agents augmenting real-world workflows via AR overlays and sensors' },
      { name: 'Loop Engineering',    desc: 'OODA-style reasoning loops with deterministic exit conditions and kill switches' },
      { name: 'Tool Use',            desc: 'Structured tool dispatch, schema validation, and safe execution sandboxing' },
      { name: 'Function Calling',    desc: 'OpenAI-compatible and native function schemas for reliable structured outputs' },
    ],
  },
  {
    label: 'Context & Memory',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
    items: [
      { name: 'Context Engineering', desc: 'Systematic prompt construction: roles, few-shot chains, output anchoring' },
      { name: 'RAG 3.0',             desc: 'Hybrid dense + sparse retrieval, re-ranking, and citation-grounded generation' },
      { name: 'Memory Layers',        desc: 'Working, episodic, and semantic memory tiers with TTL and eviction policies' },
      { name: 'Vector DB',            desc: 'Qdrant self-hosted with namespaced collections, metadata filtering, and HNSW tuning' },
      { name: 'RecCloud',             desc: 'Persistent recall layer syncing agent memory across sessions and deployments' },
    ],
  },
  {
    label: 'Knowledge Graphs',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    items: [
      { name: 'Graph Engineering', desc: 'Entity-relation extraction, NDJSON knowledge graphs, cycle detection, and validation' },
      { name: 'MCP',               desc: 'Model Context Protocol servers exposing tools and resources to any compliant client' },
      { name: 'Stateless MCP',     desc: 'Request-scoped MCP adapters with no shared state — safe for multi-tenant deployment' },
    ],
  },
  {
    label: 'Production & Ops',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.10)',
    items: [
      { name: 'Evaluation Frameworks', desc: 'LLM-as-judge pipelines, regression suites, and automated quality gates on every build' },
      { name: 'Guardrails',            desc: 'Input/output classifiers, PII scrubbers, and policy enforcement at the gateway layer' },
      { name: 'Observability',         desc: 'Token-level tracing, latency histograms, and cost dashboards via OpenTelemetry' },
      { name: 'Prompt Optimisation',   desc: 'Automated few-shot selection and chain-of-thought compression via DSPy patterns' },
      { name: 'Gateways',              desc: 'LiteLLM-compatible proxy with model failover, rate limiting, and spend caps' },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function AIEngineeringCapabilities() {
  return (
    <section
      id="ai-engineering"
      className="py-32 px-6"
      style={{ background: '#000' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent-2)' }}>
            Applied AI Engineering
          </p>
          <h2
            className="font-display mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--white-100)', maxWidth: 700 }}
          >
            Full-Stack AI.<br />From Weights to Production.
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'var(--white-50)', lineHeight: 1.75 }}>
            BRT designs, trains, and deploys agentic AI systems end-to-end — on local hardware,
            sovereign infrastructure, and zero external API dependency.
          </p>
        </motion.div>

        <div className="space-y-10">
          {GROUPS.map((group, gi) => (
            <div key={group.label}>
              <motion.p
                custom={gi}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="font-mono text-[10px] uppercase tracking-widest mb-4"
                style={{ color: group.color }}
              >
                {group.label}
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.items.map((item, ii) => (
                  <motion.div
                    key={item.name}
                    custom={gi * 0.3 + ii * 0.08}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="p-4 rounded-xl transition-colors"
                    style={{
                      background: group.glow,
                      border: `1px solid ${group.color}22`,
                    }}
                  >
                    <p
                      className="font-mono text-xs font-semibold mb-2"
                      style={{ color: group.color }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--white-50)' }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
