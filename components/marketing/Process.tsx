import { ScrollScene } from './ScrollScene'

const STEPS = [
  { n: '01', title: 'Brief', desc: 'Submit your project brief via the onboarding form. Fixed-price quote within 24 hours.' },
  { n: '02', title: 'Agreement', desc: 'Service agreement with scope, deliverables, timeline, and payment terms. Signed before work begins.' },
  { n: '03', title: 'Build', desc: 'Iterative delivery. Weekly check-ins. All commits signed. Test suites green before every milestone.' },
  { n: '04', title: 'Harden', desc: 'Security review: static analysis, CSP, auth audit, RLS verification, and penetration testing on request.' },
  { n: '05', title: 'Deploy', desc: 'Zero-downtime deployment to your infrastructure or Vercel. Runbooks and ops handover included.' },
]

export function Process() {
  return (
    <ScrollScene>
      <section id="process" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Process</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-12">How I work.</h2>
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="flex gap-8 py-6 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="font-mono text-xs w-8 flex-shrink-0 mt-1" style={{ color: 'var(--text-subtle)' }}>{step.n}</span>
              <div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
