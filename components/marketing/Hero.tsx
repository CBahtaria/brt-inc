'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ParticleField } from './ParticleField'

const Hero3D = dynamic(
  () => import('./Hero3D').then(m => ({ default: m.Hero3D })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 65%)',
      }} />
    ),
  }
)

const HEADLINE_WORDS = ['Safety-Critical', 'Software', 'for', 'SADC', 'Institutions.']

function OrbitRing() {
  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
        style={{ border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <motion.div
          className="w-1 h-1.5 rounded-full"
          style={{ background: 'var(--accent-2)' }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
        Scroll
      </p>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--surface-0)' }}
    >
      {/* Nebula backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 100% 60% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 65%)',
            'radial-gradient(ellipse 60% 40% at 80% 70%, rgba(45,212,191,0.07) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 30% at 10% 80%, rgba(76,29,149,0.08) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Layer 0: particles */}
      <ParticleField />

      {/* Layer 1: Three.js scene */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <Hero3D />
      </div>

      {/* Layer 2: gradient vignette */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(5,7,15,0.6) 100%)',
        }}
      />

      {/* Layer 3: content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--accent-2)', animationDuration: '2s' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            BRT Inc. · Manzini, Eswatini · Est. 2021
          </span>
        </motion.div>

        <h1 className="text-6xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word + i}
              className="inline-block mr-4"
              initial={{ y: 80, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                delay: 0.3 + i * 0.09,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word === 'Software' ? (
                <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {word}
                </span>
              ) : word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Defence-grade engineering for governments, defence forces, and civic institutions across southern Africa.
          Every commit signed. Every deployment hardened.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
        >
          <a
            href="/onboarding"
            className="relative px-7 py-3.5 rounded-lg text-white font-semibold text-sm overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 8px 32px rgba(99,102,241,0.3)',
            }}
          >
            Start a project
          </a>
          <a
            href="#portfolio"
            className="px-7 py-3.5 rounded-lg font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              backdropFilter: 'blur(8px)',
            }}
          >
            View work
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {[
            { label: 'DAL-A compliant', icon: '⬡' },
            { label: 'Ed25519 signed', icon: '◆' },
            { label: 'SADC-focused', icon: '◎' },
            { label: '4+ years delivered', icon: '✦' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-[10px]" style={{ color: 'var(--accent-2)' }}>{item.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <OrbitRing />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
      />
    </section>
  )
}
