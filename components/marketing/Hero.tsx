'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ParticleField } from './ParticleField'

const Hero3D = dynamic(
  () => import('./Hero3D').then(m => ({ default: m.Hero3D })),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
      />
    ),
  }
)

const HEADLINE_WORDS = ['Safety-Critical', 'Software', 'for', 'SADC', 'Institutions.']

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Layer 0: particles (canvas, behind everything) */}
      <ParticleField />

      {/* Layer 1: Three.js (absolute, full section) */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <Hero3D />
      </div>

      {/* Layer 2: text content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-widest mb-6"
          style={{ color: 'var(--text-subtle)' }}
        >
          BRT Inc. — Manzini, Eswatini
        </motion.p>

        <h1 className="text-6xl lg:text-8xl font-bold tracking-tight leading-none mb-8">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word + i}
              className="inline-block mr-4"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.35 + i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Defence-grade engineering for government, defence forces, and civic institutions across southern Africa.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <a
            href="/onboarding"
            className="px-6 py-3 rounded-md text-white font-medium transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            Start a project
          </a>
          <a
            href="#portfolio"
            className="px-6 py-3 rounded-md border font-medium transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            View work
          </a>
        </motion.div>
      </div>

      {/* Fade to background at bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
      />
    </section>
  )
}
