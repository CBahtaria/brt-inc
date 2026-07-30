'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion'

// Neuron positions per layer: [input, conv1, conv2, output]
const LAYERS: { label: string; nodes: { x: number; y: number }[] }[] = [
  {
    label: 'IMAGE INPUT',
    nodes: [{ x: 60, y: 60 }, { x: 60, y: 100 }, { x: 60, y: 140 }],
  },
  {
    label: 'CONV LAYER 1',
    nodes: [{ x: 190, y: 50 }, { x: 190, y: 80 }, { x: 190, y: 110 }, { x: 190, y: 140 }, { x: 190, y: 170 }],
  },
  {
    label: 'CONV LAYER 2',
    nodes: [{ x: 320, y: 65 }, { x: 320, y: 100 }, { x: 320, y: 135 }, { x: 320, y: 170 }],
  },
  {
    label: 'OUTPUT',
    nodes: [{ x: 450, y: 90 }, { x: 450, y: 130 }],
  },
]

const OUTPUT_LABELS = ['HEALTHY', 'DISEASED']
const OUTPUT_COLORS = ['#22c55e', '#ef4444']

function buildEdges() {
  const edges: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = []
  let d = 0
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const src = LAYERS[li].nodes
    const dst = LAYERS[li + 1].nodes
    for (const s of src) {
      for (const t of dst) {
        edges.push({ x1: s.x, y1: s.y, x2: t.x, y2: t.y, delay: d * 0.008 + li * 0.15 })
        d++
      }
    }
  }
  return edges
}

const EDGES = buildEdges()

export function MaizeNeuralViz() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        background: '#050d08',
        padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <motion.div
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            color: 'rgba(34,197,94,0.8)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          AGRICULTURAL AI — INFERENCE PATH
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
          MobileNetV2 Classifier
        </motion.h3>

        <motion.div variants={fadeUp} style={{ overflowX: 'auto' }}>
          <svg viewBox="0 0 560 230" style={{ width: '100%', maxWidth: 560, display: 'block', margin: '0 auto' }}>
            {/* Edges */}
            {EDGES.map((e, i) => (
              <motion.line
                key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="rgba(34,197,94,0.12)"
                strokeWidth={0.7}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: e.delay + 0.2, duration: 0.2 }}
              />
            ))}

            {/* Neurons */}
            {LAYERS.map((layer, li) =>
              layer.nodes.map((n, ni) => (
                <motion.circle
                  key={`${li}-${ni}`}
                  cx={n.x} cy={n.y} r={li === 0 ? 10 : li === LAYERS.length - 1 ? 13 : 7}
                  fill={li === LAYERS.length - 1 ? OUTPUT_COLORS[ni] : '#0f172a'}
                  stroke={li === LAYERS.length - 1 ? OUTPUT_COLORS[ni] : 'rgba(34,197,94,0.5)'}
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: li * 0.15 + ni * 0.06,
                    type: 'spring',
                    stiffness: 280,
                    damping: 20,
                  }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              ))
            )}

            {/* Layer labels */}
            {LAYERS.map((layer, li) => (
              <text
                key={li}
                x={layer.nodes[0].x}
                y={206}
                textAnchor="middle"
                fill="rgba(148,163,184,0.4)"
                fontSize="7"
                letterSpacing="0.06em"
                fontFamily="monospace"
              >
                {layer.label}
              </text>
            ))}

            {/* Output labels */}
            {LAYERS[3].nodes.map((n, i) => (
              <text
                key={i}
                x={n.x + 20}
                y={n.y + 4}
                fill={OUTPUT_COLORS[i]}
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.08em"
                fontFamily="monospace"
              >
                {OUTPUT_LABELS[i]}
              </text>
            ))}

            {/* Confidence bar — HEALTHY */}
            <text x={9} y={220} fill="rgba(148,163,184,0.4)" fontSize="7" fontFamily="monospace">CONFIDENCE</text>
            <rect x={80} y={212} width={120} height={8} rx={3} fill="rgba(34,197,94,0.1)" />
            <motion.rect
              x={80} y={212} width={0} height={8} rx={3}
              fill="#22c55e"
              initial={{ width: 0 }}
              animate={inView ? { width: 108 } : {}}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <text x={204} y={220} fill="#22c55e" fontSize="7" fontFamily="monospace">90%</text>
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
          Binary classifier trained on SADC maize leaf imagery — runs on-device, no cloud dependency.
        </motion.p>
      </motion.div>
    </section>
  )
}
