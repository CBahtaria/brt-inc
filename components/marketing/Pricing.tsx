import { ScrollScene } from './ScrollScene'

const TIERS = [
  {
    name: 'Audit',
    price: 'From R 8,000',
    desc: 'Security audit of an existing codebase. Static analysis, auth review, CSP, and a written findings report.',
    features: ['Static analysis', 'Auth & session audit', 'CSP & headers review', 'Written findings report', 'Patch guidance'],
  },
  {
    name: 'Project',
    price: 'Fixed price',
    desc: 'Full project delivery. Scoped, priced, and delivered on time with a service agreement.',
    features: ['Full requirements session', 'Service agreement', 'Weekly check-ins', 'Test suite included', 'Deployment & runbooks'],
    highlight: true,
  },
  {
    name: 'Retainer',
    price: 'Monthly',
    desc: 'Ongoing engineering support. Feature development, maintenance, security reviews, and ops.',
    features: ['40–80 hours/month', 'Priority response', 'Security monitoring', 'Monthly reporting', 'Flexible scope'],
  },
]

export function Pricing() {
  return (
    <ScrollScene>
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Pricing</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-12">Transparent rates.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map(t => (
            <div
              key={t.name}
              className="p-6 rounded-xl border flex flex-col"
              style={{
                background: t.highlight ? 'rgba(99,102,241,0.06)' : 'var(--surface-1)',
                borderColor: t.highlight ? 'rgba(99,102,241,0.3)' : 'var(--border)',
              }}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                <p className="font-mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>{t.price}</p>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
              <ul className="space-y-2 mt-auto">
                {t.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-2)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/onboarding"
                className="mt-6 text-center py-2.5 rounded-md text-sm font-medium transition-colors border"
                style={t.highlight
                  ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                  : { borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
