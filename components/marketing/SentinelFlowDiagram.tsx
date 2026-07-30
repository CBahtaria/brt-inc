'use client'
import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion'

const NODES = [
  { id: 'op',   label: 'OPERATOR',   sub: 'TOTP 2FA',     x: 40,  y: 70, color: '#60a5fa' },
  { id: 'auth', label: 'AUTH GATE',  sub: 'RBAC check',   x: 160, y: 70, color: '#818cf8' },
  { id: 'rule', label: 'RULE ENGINE',sub: 'Jurisdiction', x: 280, y: 70, color: '#a78bfa' },
  { id: 'bus',  label: 'COMMAND BUS',sub: 'Signed cmd',   x: 400, y: 70, color: '#c084fc' },
  { id: 'uav',  label: 'UAV',        sub: 'Execute',      x: 520, y: 70, color: '#f0abfc' },
]

const PATHS = [
  { x1: 80,  y1: 70, x2: 120, y2: 70, delay: 0.3  },
  { x1: 200, y1: 70, x2: 240, y2: 70, delay: 0.55 },
  { x1: 320, y1: 70, x2: 360, y2: 70, delay: 0.8  },
  { x1: 440, y1: 70, x2: 480, y2: 70, delay: 1.05 },
]

export function SentinelFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        background: '#07090f',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <motion.div
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            color: 'rgba(99,102,241,0.9)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          COMMAND & CONTROL — AUTH CHAIN
        </motion.p>
        <motion.h3
          variants={fadeUp}
          style={{
            color: '#f1f5f9',
            fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 48,
          }}
        >
          Zero-Trust Operator Pipeline
        </motion.h3>

        <motion.div variants={fadeUp} style={{ overflowX: 'auto' }}>
          <svg viewBox="0 0 580 180" style={{ width: '100%', maxWidth: 680, display: 'block', margin: '0 auto' }}>
            {/* Track lines (dim) */}
            {PATHS.map((p, i) => (
              <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
            ))}

            {/* Animated connection lines */}
            {PATHS.map((p, i) => (
              <motion.line
                key={i}
                x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                stroke={NODES[i + 1].color}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.25, delay: p.delay }}
              />
            ))}

            {/* ABORT branch from RULE ENGINE downward */}
            <motion.path
              d="M 280 110 L 280 148 L 370 148"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.8 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            <motion.text
              x="376" y="152"
              fill="#ef4444"
              fontSize="8"
              letterSpacing="0.1em"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.8 } : {}}
              transition={{ delay: 1.3 }}
            >
              JURISDICTION FAIL → ABORT
            </motion.text>

            {/* Nodes */}
            {NODES.map((n, i) => (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.18 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <rect
                  x={n.x - 36} y={n.y - 32}
                  width={72} height={64}
                  rx={6}
                  fill="#0f172a"
                  stroke={n.color}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                />
                <motion.rect
                  x={n.x - 36} y={n.y - 32}
                  width={72} height={64}
                  rx={6}
                  fill={n.color}
                  fillOpacity={0}
                  initial={{ fillOpacity: 0 }}
                  animate={inView ? { fillOpacity: [0, 0.12, 0.04] } : {}}
                  transition={{ delay: i * 0.18 + 0.3, duration: 0.6 }}
                />
                <text
                  x={n.x} y={n.y - 6}
                  textAnchor="middle"
                  fill={n.color}
                  fontSize="8"
                  fontWeight="700"
                  letterSpacing="0.08em"
                  fontFamily="monospace"
                >
                  {n.label}
                </text>
                <text
                  x={n.x} y={n.y + 10}
                  textAnchor="middle"
                  fill="rgba(148,163,184,0.55)"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  {n.sub}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            marginTop: 32,
            color: 'rgba(148,163,184,0.5)',
            fontSize: 11,
            letterSpacing: '0.08em',
          }}
        >
          Every command is signed, jurisdiction-checked, and audited before reaching the UAV.
        </motion.p>
      </motion.div>
    </section>
  )
}
