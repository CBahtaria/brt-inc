'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const BENEFITS = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Formal-verified compliance in real-time',
    color: '#2dd4bf',
  },
  {
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    title: 'Automated audit trails and incident reports',
    color: '#6366f1',
  },
  {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Unified SADC intelligence platform',
    color: '#f59e0b',
  },
  {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'Agricultural ML inference at field scale',
    color: '#10b981',
  },
  {
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    title: 'Security-hardened code patterns for SADC institutions',
    color: '#8b5cf6',
  },
  {
    icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    title: 'AI governance agents with formal safety envelope',
    color: '#6366f1',
  },
]

export function BenefitCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section style={{ background: 'var(--surface-0)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', margin: '0 0 0.75rem' }}>
            What BRT Systems Enable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, maxWidth: 560, marginInline: 'auto' }}>
            Instantly raise the capability floor of your organisation with sovereign-grade AI and engineering.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07 * i, duration: 0.5 }}
              style={{
                background: 'linear-gradient(154deg, #1c2233 0%, #0d1117 100%)',
                borderRadius: 16,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${b.color}22`,
                  border: `1px solid ${b.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={b.icon} />
                </svg>
              </div>
              <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1rem', margin: 0, lineHeight: 1.4 }}>{b.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
