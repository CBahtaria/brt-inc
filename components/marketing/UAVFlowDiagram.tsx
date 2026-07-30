'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion'

const NODES = [
  { id: 'sensor',   label: 'SENSOR',   sub: 'IMU · GPS · Lidar',      x: 60,  y: 80 },
  { id: 'governor', label: 'GOVERNOR', sub: 'DAL-A certified',         x: 220, y: 80 },
  { id: 'decision', label: 'DECISION', sub: 'Formal rules + AI hint',  x: 380, y: 80 },
  { id: 'actuator', label: 'ACTUATOR', sub: 'Motor · Servo',           x: 540, y: 80 },
]

const PATHS = [
  { d: 'M 100 80 L 180 80', delay: 0.2 },
  { d: 'M 260 80 L 340 80', delay: 0.5 },
  { d: 'M 420 80 L 500 80', delay: 0.8 },
]

const ABORT_PATH = { d: 'M 260 80 C 260 130 380 130 380 80', delay: 0.5 }

export function UAVFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        background: '#060a0f',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <motion.div
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            color: 'rgba(245,158,11,0.8)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          AUTONOMOUS SYSTEMS — COMMAND FLOW
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
          Sensor-to-Actuator Pipeline
        </motion.h3>

        <motion.div variants={fadeUp} style={{ overflowX: 'auto' }}>
          <svg
            viewBox="0 0 600 180"
            style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'block' }}
          >
            {/* Connection paths */}
            {PATHS.map((p, i) => (
              <g key={i}>
                <path d={p.d} stroke="rgba(255,255,255,0.08)" strokeWidth={2} fill="none" />
                <motion.path
                  d={p.d}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: p.delay, ease: 'easeOut' }}
                />
                {/* Arrowhead */}
                <motion.polygon
                  points={`${p.d.split('L ')[1].split(' ')[0]},${80 - 5} ${p.d.split('L ')[1].split(' ')[0] + 10},80 ${p.d.split('L ')[1].split(' ')[0]},${80 + 5}`}
                  fill="#f59e0b"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: p.delay + 0.35 }}
                />
              </g>
            ))}

            {/* ABORT arc from GOVERNOR → DECISION (red, rule fail) */}
            <path d={ABORT_PATH.d} stroke="rgba(239,68,68,0.12)" strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
            <motion.path
              d={ABORT_PATH.d}
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="none"
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            />
            <motion.text
              x="318" y="152"
              textAnchor="middle"
              fill="#ef4444"
              fontSize="9"
              letterSpacing="0.12em"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.8 } : {}}
              transition={{ delay: 1.1 }}
            >
              RULE FAIL → ABORT
            </motion.text>

            {/* Nodes */}
            {NODES.map((n, i) => (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.18 + 0.05, type: 'spring', stiffness: 200, damping: 18 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              >
                <circle cx={n.x} cy={n.y} r={32} fill="#0f172a" stroke="rgba(245,158,11,0.35)" strokeWidth={1.5} />
                <circle cx={n.x} cy={n.y} r={29} fill="rgba(245,158,11,0.04)" />
                <text
                  x={n.x} y={n.y - 5}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="9"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  fontFamily="monospace"
                >
                  {n.label}
                </text>
                <text
                  x={n.x} y={n.y + 10}
                  textAnchor="middle"
                  fill="rgba(148,163,184,0.7)"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  {n.sub.split('·')[0].trim()}
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
          AI is advisory only. The governor has final say on every command.
        </motion.p>
      </motion.div>
    </section>
  )
}
