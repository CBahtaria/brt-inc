'use client'

import { useState } from 'react'
import { ScrollScene } from './ScrollScene'

const CATEGORIES = [
  { label: 'Languages', color: '#6366f1', items: ['TypeScript', 'Python', 'PHP 8', 'Zig', 'C++', 'SQL', 'Bash'] },
  { label: 'Frontend', color: '#2dd4bf', items: ['React 19', 'Next.js', 'Expo 54', 'Three.js', 'GSAP', 'framer-motion'] },
  { label: 'Backend', color: '#10b981', items: ['NestJS 11', 'FastAPI', 'Node.js', 'UE5 GAS'] },
  { label: 'Data', color: '#f59e0b', items: ['PostgreSQL', 'PostGIS', 'Redis', 'Supabase', 'Qdrant', 'NATS JetStream'] },
  { label: 'ML / Edge', color: '#f43f5e', items: ['TFLite', 'ONNX', 'scikit-learn', 'Prophet'] },
  { label: 'Infra', color: '#64748b', items: ['Docker', 'Vercel', 'GitHub Actions', 'Nginx'] },
  { label: 'Security', color: '#8b5cf6', items: ['AES-GCM-256', 'RBAC', 'TOTP', 'MAVLink 2'] },
  { label: 'Game / XR', color: '#f97316', items: ['UE5 C++', 'Steam SDK', 'OpenXR', 'Nanite', 'Lumen'] },
]

const ROW1_CATEGORIES = CATEGORIES.slice(0, 4)
const ROW2_CATEGORIES = CATEGORIES.slice(4)

function buildRow(cats: typeof CATEGORIES) {
  return cats.flatMap(c => c.items.map(item => ({ item, color: c.color })))
}

const ROW1_ITEMS = buildRow(ROW1_CATEGORIES)
const ROW2_ITEMS = buildRow(ROW2_CATEGORIES)

export function StackStrip() {
  const [hovered, setHovered] = useState(false)

  return (
    <ScrollScene>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <section
        className="py-16 border-y overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p className="text-center font-mono text-xs uppercase tracking-widest mb-8" style={{ color: 'var(--text-subtle)' }}>
          Stack
        </p>

        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden mb-3">
          <div
            className="flex gap-4 w-max"
            style={{
              animation: 'marquee-left 30s linear infinite',
              animationPlayState: hovered ? 'paused' : 'running',
            }}
          >
            {[...ROW1_ITEMS, ...ROW1_ITEMS].map(({ item, color }, i) => (
              <span
                key={i}
                className="font-mono text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-1)' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden mb-8">
          <div
            className="flex gap-4 w-max"
            style={{
              animation: 'marquee-right 25s linear infinite',
              animationPlayState: hovered ? 'paused' : 'running',
            }}
          >
            {[...ROW2_ITEMS, ...ROW2_ITEMS].map(({ item, color }, i) => (
              <span
                key={i}
                className="font-mono text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-1)' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-3 justify-center px-6">
          {CATEGORIES.map(c => (
            <span
              key={c.label}
              className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: c.color + '40', color: c.color, background: c.color + '10' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
              {c.label}
            </span>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
