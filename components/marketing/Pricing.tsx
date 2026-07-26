'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

type PriceKey =
  | 'audit-lite' | 'audit-standard' | 'audit-premium'
  | 'retainer-essential' | 'retainer-professional'

interface Tier {
  name: string
  highlight: boolean
  badge?: string
  options: { label: string; price: string; priceKey: PriceKey; desc: string }[]
  features: string[]
  cta: string
  ctaHref?: string
  priceKey?: PriceKey
}

const TIERS: Tier[] = [
  {
    name: 'Security Audit',
    highlight: false,
    options: [
      { label: 'Lite',     price: 'R 8,000',  priceKey: 'audit-lite',     desc: '2 days — static analysis + auth review + written report' },
      { label: 'Standard', price: 'R 15,000', priceKey: 'audit-standard', desc: '5 days — full audit + pen test + patch guidance' },
      { label: 'Premium',  price: 'R 25,000', priceKey: 'audit-premium',  desc: '8 days — pentest + remediation + re-test + cert' },
    ],
    features: ['Static analysis', 'Auth & session audit', 'CSP & headers', 'Written findings report', 'Patch guidance'],
    cta: 'Book audit',
  },
  {
    name: 'Fixed Project',
    highlight: true,
    badge: 'Most common',
    options: [],
    features: ['Full requirements session', 'Signed service agreement', 'Weekly check-ins', 'Test suite included', 'Deployment & runbooks'],
    cta: 'Scope project',
    ctaHref: '/onboarding',
  },
  {
    name: 'Retainer',
    highlight: false,
    options: [
      { label: 'Essential',     price: 'R 12,000/mo', priceKey: 'retainer-essential',     desc: '40 hrs/month — maintenance, reviews, ops' },
      { label: 'Professional',  price: 'R 22,000/mo', priceKey: 'retainer-professional',  desc: '80 hrs/month + priority response + security monitoring' },
    ],
    features: ['Priority response', 'Security monitoring', 'Monthly reporting', 'Flexible scope', 'Cancel anytime'],
    cta: 'Start retainer',
  },
]

function CheckoutButton({ priceKey, children }: { priceKey: PriceKey; children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceKey }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) window.location.href = data.url
    } catch {
      // fail silently — let user try again
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
      style={{ background: 'var(--accent)', color: '#fff', cursor: loading ? 'wait' : 'pointer' }}
    >
      {loading ? 'Redirecting…' : children}
    </button>
  )
}

export function Pricing() {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({
    'Security Audit': 0,
    'Retainer': 0,
  })

  return (
    <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 relative">
      {/* Nebula glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Pricing</p>
        <h2 className="text-4xl lg:text-5xl font-bold mb-3">Transparent rates.</h2>
        <p className="text-base max-w-xl mb-14" style={{ color: 'var(--text-muted)' }}>
          No retainers without a scope. No projects without a service agreement. Pay online or via invoice.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier, ti) => {
          const sel = selectedOptions[tier.name] ?? 0
          const opt = tier.options[sel]

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: ti * 0.1, duration: 0.6 }}
              className="relative flex flex-col rounded-2xl p-6"
              style={{
                background: tier.highlight ? 'rgba(99,102,241,0.07)' : 'rgba(13,17,23,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: tier.highlight ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.055)',
                boxShadow: tier.highlight ? '0 0 0 1px rgba(99,102,241,0.15), 0 24px 48px rgba(99,102,241,0.1)' : 'none',
              }}
            >
              {tier.badge && (
                <div
                  className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
                >
                  {tier.badge}
                </div>
              )}

              <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>{tier.name}</h3>

              {tier.options.length > 0 ? (
                <>
                  {/* Option picker */}
                  <div className="flex gap-1.5 mb-4">
                    {tier.options.map((o, oi) => (
                      <button
                        key={o.label}
                        onClick={() => setSelectedOptions(s => ({ ...s, [tier.name]: oi }))}
                        className="flex-1 py-1 rounded-md font-mono text-[10px] uppercase tracking-widest transition-all"
                        style={{
                          background: sel === oi ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                          color: sel === oi ? 'var(--accent)' : 'var(--text-subtle)',
                          border: sel === oi ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                        }}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <p
                    className="font-mono font-bold text-2xl mb-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    {opt?.price}
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {opt?.desc}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono font-bold text-2xl mb-1" style={{ color: 'var(--accent)' }}>
                    Fixed price
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Scoped and priced upfront. 50% deposit, balance on delivery.
                  </p>
                </>
              )}

              <ul className="space-y-2 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-2)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {tier.ctaHref ? (
                  <a
                    href={tier.ctaHref}
                    className="block text-center w-full py-2.5 rounded-lg text-sm font-medium"
                    style={{
                      background: 'var(--accent)',
                      color: '#fff',
                    }}
                  >
                    {tier.cta}
                  </a>
                ) : opt?.priceKey ? (
                  <CheckoutButton priceKey={opt.priceKey}>{tier.cta}</CheckoutButton>
                ) : null}
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-center font-mono text-xs mt-10" style={{ color: 'var(--text-subtle)' }}>
        All engagements begin with a signed service agreement. Scope is fixed before any work starts. · ZAR pricing · Stripe-secured
      </p>
    </section>
  )
}
