'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CELLS = [
  {
    icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    label: 'Autonomous\nAerial Systems',
    sub: 'DAL-A · SRL-3 · 942 tests',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.3)',
    stroke: '#6366f1',
  },
  {
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
    label: 'Sentinel\nCommand & Control',
    sub: '200 operators · 4-role RBAC',
    bg: 'rgba(45,212,191,0.10)',
    border: 'rgba(45,212,191,0.28)',
    stroke: '#2dd4bf',
  },
  {
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    label: 'SADC Sovereign\nMarketplace',
    sub: '200+ suppliers · 14 nations',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.28)',
    stroke: '#f59e0b',
  },
  {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    label: 'Agricultural\nAI Inference',
    sub: 'MobileNetV2 · SSA smallholders',
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.28)',
    stroke: '#10b981',
  },
]

const CORNER_STYLES: React.CSSProperties[] = [
  { top: -4, left: -4, borderTop: '3px solid var(--accent-2)', borderLeft: '3px solid var(--accent-2)' },
  { top: -4, right: -4, borderTop: '3px solid var(--accent-2)', borderRight: '3px solid var(--accent-2)' },
  { bottom: -4, left: -4, borderBottom: '3px solid var(--accent-2)', borderLeft: '3px solid var(--accent-2)' },
  { bottom: -4, right: -4, borderBottom: '3px solid var(--accent-2)', borderRight: '3px solid var(--accent-2)' },
]

export function KeyCapabilities() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section style={{ background: 'var(--surface-0)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div
          ref={ref}
          style={{
            position: 'relative',
            border: '1px solid var(--border-bright)',
            borderRadius: 16,
            padding: '2.5rem 2rem 2rem',
            background: 'linear-gradient(145deg, #1c2233 0%, #0d1117 100%)',
          }}
        >
          {CORNER_STYLES.map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 24, height: 24, ...s }} />
          ))}

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center',
              color: 'var(--text)',
              fontWeight: 300,
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              margin: '0 0 2.5rem',
            }}
          >
            Key Capabilities
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative' }}>
            {/* Horizontal gradient divider */}
            <svg
              aria-hidden
              style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient id="kc-h">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="url(#kc-h)" strokeWidth="1" />
            </svg>

            {/* Vertical gradient divider */}
            <svg
              aria-hidden
              style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient id="kc-v" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="url(#kc-v)" strokeWidth="1" />
            </svg>

            {/* Glowing center dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.35, type: 'spring', stiffness: 280 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 13,
                height: 13,
                borderRadius: '50%',
                background: 'var(--accent-2)',
                boxShadow: '0 0 16px 5px var(--accent-2-glow)',
                zIndex: 2,
              }}
            />

            {CELLS.map((cell, i) => (
              <motion.div
                key={cell.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 + 0.11 * i, duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', gap: 14 }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: cell.bg,
                    border: `1px solid ${cell.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={cell.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={cell.icon} />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.95rem', margin: '0 0 5px', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                    {cell.label}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{cell.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
