import Link from 'next/link'

export const metadata = { title: 'Terms of Engagement — BRT Inc.' }

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-32">
      <Link href="/" className="font-mono text-xs uppercase tracking-widest mb-12 block" style={{ color: 'var(--text-subtle)' }}>
        ← BRT Inc.
      </Link>
      <h1 className="text-4xl font-semibold mb-10">Terms of Engagement</h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Scope of work</h2>
          <p>All engagements begin with a written service agreement defining deliverables, timelines, payment schedule, and acceptance criteria. Work outside that scope is quoted separately before it begins.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Payments</h2>
          <p>Fixed-price projects require a 50% deposit before work begins, with the remainder due on delivery. Retainer engagements are invoiced monthly in advance. All prices are in South African Rand (ZAR) unless otherwise agreed. Late payments accrue interest at 2% per month.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Intellectual property</h2>
          <p>On full payment, the client owns the deliverables specific to their project. BRT Inc. retains ownership of reusable libraries, frameworks, and tooling developed independently. Open-source components remain under their respective licences.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Confidentiality</h2>
          <p>All client data, system architecture, and business information shared during an engagement is treated as confidential. NDA available on request before any technical discussion.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Limitation of liability</h2>
          <p>BRT Inc. liability is limited to the total fees paid for the engagement. We are not liable for indirect, consequential, or incidental damages. Security audits identify known vulnerabilities at a point in time — they are not guarantees against future compromise.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Governing law</h2>
          <p>These terms are governed by the laws of the Kingdom of Eswatini. Disputes are resolved by mutual agreement; if unresolved, by arbitration in Manzini.</p>
        </section>

        <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>Last updated: July 2026</p>
      </div>
    </main>
  )
}
