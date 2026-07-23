'use client'
import { motion } from 'framer-motion'
import { ScrollScene } from './ScrollScene'

const TIERS = [
  {
    name: 'Audit',
    price: 'From R 8,000',
    timeline: '2–5 business days',
    desc: 'Security audit of an existing codebase. Static analysis, auth review, CSP, and a written findings report.',
    features: ['Static analysis', 'Auth & session audit', 'CSP & headers review', 'Written findings report', 'Patch guidance'],
    highlight: false,
    popular: false,
  },
  {
    name: 'Project',
    price: 'Fixed price',
    timeline: '4–16 weeks',
    desc: 'Full project delivery. Scoped, priced, and delivered on time with a service agreement.',
    features: ['Full requirements session', 'Service agreement', 'Weekly check-ins', 'Test suite included', 'Deployment & runbooks'],
    highlight: true,
    popular: true,
  },
  {
    name: 'Retainer',
    price: 'Monthly',
    timeline: 'Ongoing',
    desc: 'Ongoing engineering support. Feature development, maintenance, security reviews, and ops.',
    features: ['40–80 hours/month', 'Priority response', 'Security monitoring', 'Monthly reporting', 'Flexible scope'],
    highlight: false,
    popular: false,
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
              className="relative p-6 rounded-xl border flex flex-col"
              style={{
                background: t.highlight ? 'rgba(99,102,241,0.06)' : 'var(--surface-1)',
                borderColor: t.highlight ? 'rgba(99,102,241,0.3)' : 'var(--border)',
              }}
            >
              {t.popular && (
                <div
                  className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  Most popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{t.name}</h3>
                <p className="font-mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>{t.price}</p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-subtle)' }}>{t.timeline}</p>
                {t.popular && (
                  <p className="font-mono text-[10px] mt-2" style={{ color: 'var(--text-subtle)' }}>50% deposit · balance on delivery</p>
                )}
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
              <motion.a
                href="/onboarding"
                className="mt-6 text-center py-2.5 rounded-md text-sm font-medium transition-colors border"
                style={t.highlight
                  ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
                  : { borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                whileHover={{ scale: 1.02 }}
              >
                Get started
              </motion.a>
            </div>
          ))}
        </div>
        <p className="text-center font-mono text-xs mt-8" style={{ color: 'var(--text-subtle)' }}>
          All engagements begin with a written service agreement. Scope is fixed before any work starts.
        </p>
      </section>
    </ScrollScene>
  )
}
