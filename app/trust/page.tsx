import Link from 'next/link'

export const metadata = { title: 'Trust & Security — BRT Inc.' }

const PRACTICES = [
  {
    title: 'DAL-A safety gates',
    desc: 'Flight-critical code runs through a formal safety governor that validates geometric invariants before any flight control command. AI is advisory only — the governor has final say, always.',
  },
  {
    title: 'No raw SQL concatenation',
    desc: 'All database access uses PDO prepared statements. SQL injection is eliminated by construction, not by sanitisation.',
  },
  {
    title: 'Secrets from environment',
    desc: 'No credentials in source. API keys are loaded once by the authorised process and never passed to subprocesses. Audited with gitleaks before every commit.',
  },
  {
    title: 'TOTP 2FA on privileged roles',
    desc: 'Commander and Operator roles require time-based one-time passwords. Session tokens are IP-bound for the highest privilege tier.',
  },
  {
    title: 'Hash-chained audit logs',
    desc: 'Audit records are append-only and hash-chained. Any tamper attempt — row deletion, timestamp mutation — breaks the chain and fires an alert.',
  },
  {
    title: 'Server-side RBAC',
    desc: 'Role checks live at the API layer, not in the UI. Every endpoint calls the role gate before touching data. Client-side gating is a convenience, not a control.',
  },
  {
    title: 'Dependency hygiene',
    desc: 'composer audit and pip-audit run on every PR. No critical or high advisories merge without a documented exception.',
  },
  {
    title: 'Multi-persona vulnerability scanning',
    desc: 'A 9-persona automated scanner (red team, blue team, supply chain, compliance, insider threat, architecture integrity, trojan horse, goldilocks, cat burglar) runs weekly.',
  },
]

export default function TrustPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-32">
      <Link href="/" className="font-mono text-xs uppercase tracking-widest mb-12 block" style={{ color: 'var(--text-subtle)' }}>
        ← BRT Inc.
      </Link>
      <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Trust & Security</p>
      <h1 className="text-4xl font-semibold mb-4">How we build.</h1>
      <p className="text-base mb-16 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Institutional clients need to know the engineering principles behind the systems they operate. These are the non-negotiable practices applied to every BRT Inc. engagement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRACTICES.map(p => (
          <div
            key={p.title}
            className="p-6 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
          >
            <h2 className="font-semibold mb-2">{p.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 p-6 rounded-xl border" style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          To request a security brief, reference architecture, or formal audit trail for a specific project, email{' '}
          <a href="mailto:charleskris9@gmail.com" style={{ color: 'var(--accent)' }}>charleskris9@gmail.com</a>.
        </p>
      </div>

      <p className="font-mono text-xs mt-12" style={{ color: 'var(--text-subtle)' }}>Last updated: July 2026</p>
    </main>
  )
}
