'use client'
import { motion } from 'framer-motion'

const SERVICES = [
  {
    title: 'Security Audit & Hardening',
    desc: 'Static analysis, penetration testing, auth hardening, CSP configuration, and hash-chained audit logging for high-trust systems.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: '#2dd4bf',
    glow: 'rgba(45,212,191,0.18)',
    priceHint: 'From R 8,000',
    tag: 'security',
  },
  {
    title: 'Command & Control Systems',
    desc: 'Real-time C2 platforms for defence and security operations. WebSocket telemetry, RBAC, TOTP 2FA, and AES-GCM encrypted comms.',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.18)',
    priceHint: 'Fixed scope',
    tag: 'systems',
  },
  {
    title: 'AI / ML Pipelines',
    desc: 'On-device inference, RAG knowledge retrieval, macroeconomic forecasting, and biometric systems — accuracy and latency first.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.18)',
    priceHint: 'Fixed scope',
    tag: 'ai',
  },
  {
    title: 'Autonomous Systems',
    desc: 'DAL-A compliant autopilots with formal safety governors. AI feeds a validator that checks geometric invariants before flight control.',
    icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    priceHint: 'Fixed scope',
    tag: 'drones',
  },
  {
    title: 'Social & Marketplace Platforms',
    desc: 'Full-stack platforms with edge compression, RAG-backed search, escrow payments, anti-spam ML, and adaptive self-improving pipelines.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.18)',
    priceHint: 'Fixed scope',
    tag: 'platform',
  },
  {
    title: 'Institutional Platforms',
    desc: 'National-scale infrastructure for libraries, resilience agencies, and civic institutions across southern Africa.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.15)',
    priceHint: 'Fixed scope',
    tag: 'institutional',
  },
  {
    title: 'Game Development',
    desc: 'Unreal Engine 5 C++ with hardware-adaptive scalers, historically accurate content pipelines, and Steam integration.',
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    priceHint: 'Fixed scope',
    tag: 'game',
  },
]

export function Services() {
  return (
    <section id="services" className="py-32 px-6" style={{ background: '#000' }}>
      <div className="max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent-2)' }}>
          Capabilities
        </p>
        <h2
          className="font-display mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', color: 'var(--white-100)' }}
        >
          Mission Capabilities
        </h2>
        <p className="text-base max-w-xl mb-14" style={{ color: 'var(--white-50)', lineHeight: 1.75 }}>
          Every engagement runs under a signed service agreement. Scope is fixed before any work starts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative p-6 rounded-xl flex flex-col cursor-default"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(99,102,241,0.4)'
              el.style.boxShadow = '0 8px 32px rgba(99,102,241,0.12)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(255,255,255,0.08)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Icon */}
            <div className="mb-5 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,250,0.35)" strokeWidth="1.5" width="22" height="22">
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>

            <h3 className="font-semibold text-base mb-2.5" style={{ color: 'var(--white-90)' }}>{s.title}</h3>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--white-50)', lineHeight: '1.65' }}>{s.desc}</p>

            <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: 'var(--white-30)' }}
              >
                {s.tag}
              </span>
              {s.priceHint && (
                <span className="font-mono text-[10px]" style={{ color: 'var(--white-30)' }}>{s.priceHint}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
