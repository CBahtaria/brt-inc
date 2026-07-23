'use client'
import { useEffect, useRef, useState } from 'react'

const CLUSTERS = [
  {
    name: 'UAV & Autonomous',
    color: '#2dd4bf',
    systems: ['Agentic UAV Stack', 'Sentinel v5', 'BARTARIAN'],
    metric: '1,128+ tests · SRL-6',
    status: 'live' as const,
  },
  {
    name: 'Intelligence',
    color: '#10b981',
    systems: ['Second Brain', 'NATS JetStream'],
    metric: '17 autonomous tasks · 8 streams',
    status: 'production' as const,
  },
  {
    name: 'Platform',
    color: '#6366f1',
    systems: ['Lets Connect Eswatini', 'Likhona Lami'],
    metric: '5-layer security · MTN MoMo',
    status: 'building' as const,
  },
  {
    name: 'Gaming',
    color: '#f59e0b',
    systems: ['MahlanyaRPG'],
    metric: '338 tests · Phase 11 · VR + PWA',
    status: 'phase11' as const,
  },
  {
    name: 'ML / Edge',
    color: '#f43f5e',
    systems: ['Maize Classifier', 'Zig Bridge'],
    metric: '94.2% accuracy · AES-GCM-256',
    status: 'production' as const,
  },
  {
    name: 'Institutional',
    color: '#64748b',
    systems: ['CivisGrid', 'BRT Portfolio'],
    metric: 'National scale · 21 pages',
    status: 'production' as const,
  },
]

const STATUS_DOT: Record<string, string> = {
  live: '#10b981',
  production: '#10b981',
  building: '#f59e0b',
  phase11: '#2dd4bf',
}
const STATUS_LABEL: Record<string, string> = {
  live: 'LIVE',
  production: 'Production',
  building: 'Building',
  phase11: 'Phase 11',
}

const METRICS = ['13 systems', '8 NATS streams', '1,466+ tests', 'SRL-6']

export function EcosystemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (pref.matches) { setVisible(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 border-y" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Ecosystem</p>
          <h2 className="text-4xl lg:text-5xl font-semibold">The BRT Ecosystem.<br /><span style={{ color: 'var(--text-muted)', fontSize: '0.7em' }}>13 interconnected systems.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {CLUSTERS.map((c, i) => {
            const dotColor = STATUS_DOT[c.status]
            return (
              <div
                key={c.name}
                className="rounded-xl border overflow-hidden transition-all duration-500"
                style={{
                  background: 'var(--background)',
                  borderColor: visible ? c.color + '33' : 'var(--border)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {/* Colored top bar */}
                <div style={{ height: 4, background: c.color }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">{c.name}</h3>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest" style={{ color: dotColor }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dotColor }} />
                      {STATUS_LABEL[c.status]}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.systems.map(s => (
                      <span key={s} className="font-mono text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: c.color + '40', color: c.color, background: c.color + '10' }}>{s}</span>
                    ))}
                  </div>
                  <p className="font-mono text-[11px]" style={{ color: 'var(--text-subtle)' }}>{c.metric}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {METRICS.map(m => (
            <span key={m} className="font-mono text-[11px] px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(99,102,241,0.08)' }}>{m}</span>
          ))}
        </div>

        <a href="/ecosystem" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent-2)' }}>
          Explore full 3D map →
        </a>
      </div>
    </section>
  )
}
