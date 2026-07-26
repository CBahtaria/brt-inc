'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

type BillingCycle = 'monthly' | 'annual'

const LAYERED_PLANS = [
  {
    name: 'Individual',
    monthly: 'R 99',
    annual: 'R 890',
    annualNote: 'Save R 298',
    priceKeyMonthly: 'layered-individual-monthly',
    priceKeyAnnual:  'layered-individual-annual',
    features: ['All privacy shields', 'OSINT scanner', 'Identity generator', 'Vault (25 credentials)', 'Extension + iOS app'],
    highlight: false,
  },
  {
    name: 'Professional',
    monthly: 'R 299',
    annual: 'R 2,690',
    annualNote: 'Save R 898',
    priceKeyMonthly: 'layered-pro-monthly',
    priceKeyAnnual:  'layered-pro-annual',
    features: ['Everything in Individual', 'Unlimited vault', 'Advanced OSINT reports', 'API access', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Institutional',
    monthly: 'R 2,499',
    annual: 'R 22,490',
    annualNote: 'Save R 7,498',
    priceKeyMonthly: 'layered-institutional-monthly',
    priceKeyAnnual:  'layered-institutional-annual',
    features: ['Up to 25 seats', 'Central admin console', 'Audit log export', 'SLA support', 'Custom domain filter'],
    highlight: false,
  },
]

function CheckoutBtn({
  priceKey, highlight, children,
}: { priceKey: string; highlight: boolean; children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const handle = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceKey }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }
  return (
    <button
      onClick={handle}
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60"
      style={highlight
        ? { background: 'var(--accent)', color: '#fff', cursor: loading ? 'wait' : 'pointer' }
        : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)', cursor: loading ? 'wait' : 'pointer' }
      }
    >
      {loading ? 'Redirecting…' : children}
    </button>
  )
}

export function Products() {
  const [cycle, setCycle] = useState<BillingCycle>('annual')

  return (
    <section id="products" className="py-32 px-6" style={{ background: '#000' }}>
      <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent-2)' }}>
          Flagship Systems
        </p>
        <h2
          className="font-display mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', color: 'var(--white-100)' }}
        >
          Layered — Privacy Intelligence
        </h2>
        <p className="text-base max-w-2xl mb-8" style={{ color: 'var(--white-50)', lineHeight: 1.75 }}>
          On-device privacy shields, OSINT scanner, encrypted credential vault, and fake identity generator.
          Available as a Chrome extension and iOS app. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex rounded-lg p-0.5 mb-12" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['monthly', 'annual'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className="px-5 py-1.5 rounded-md text-sm font-medium transition-all"
              style={cycle === c
                ? { background: 'rgba(99,102,241,0.2)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)' }
                : { color: 'var(--text-subtle)', border: '1px solid transparent' }
              }
            >
              {c === 'monthly' ? 'Monthly' : 'Annual'}{c === 'annual' && ' · Best value'}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LAYERED_PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative flex flex-col rounded-xl p-6"
            style={{
              background: plan.highlight ? 'rgba(99,102,241,0.06)' : 'var(--surface-1)',
              border: plan.highlight ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: plan.highlight ? '0 0 40px rgba(99,102,241,0.1)' : 'none',
            }}
          >
            {plan.highlight && (
              <div
                className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                Most popular
              </div>
            )}

            <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--white-90)' }}>{plan.name}</h3>

            <div className="mb-1">
              <span className="font-mono font-bold text-3xl" style={{ color: 'var(--accent)' }}>
                {cycle === 'monthly' ? plan.monthly : plan.annual}
              </span>
              <span className="font-mono text-xs ml-1" style={{ color: 'var(--white-30)' }}>
                /{cycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            {cycle === 'annual' && (
              <p className="font-mono text-[10px] mb-5" style={{ color: 'var(--accent-2)' }}>{plan.annualNote}</p>
            )}
            {cycle === 'monthly' && <div className="mb-5" />}

            <ul className="space-y-2 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--white-50)' }}>
                  <span style={{ color: 'var(--accent-2)' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <CheckoutBtn
                priceKey={cycle === 'monthly' ? plan.priceKeyMonthly : plan.priceKeyAnnual}
                highlight={plan.highlight}
              >
                {plan.name === 'Institutional' ? 'Contact for procurement' : 'Start free trial'}
              </CheckoutBtn>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center font-mono text-xs mt-8" style={{ color: 'var(--text-subtle)' }}>
        7-day free trial · No credit card required to start · Cancel anytime · ZAR billing via Stripe
      </p>

      {/* Course teaser */}
      <motion.div
        className="mt-20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
              Course · R 2,500
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--white-90)' }}>
            Security for SADC Engineers
          </h3>
          <p className="text-sm max-w-lg" style={{ color: 'var(--white-50)', lineHeight: '1.65' }}>
            Practical security engineering for government IT staff and developers in southern Africa.
            Covers threat modelling, secure-by-default architecture, auth hardening, CSP, audit logging,
            and SADC compliance context. Self-paced. Lifetime access.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-w-[180px]">
          <a
            href="https://brtinc.gumroad.com/l/sadc-security"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center py-2.5 px-6 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}
          >
            Enroll — R 2,500
          </a>
          <p className="text-center font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>
            Lemon Squeezy · ZAR + mobile money
          </p>
        </div>
      </motion.div>
      </div>
    </section>
  )
}
