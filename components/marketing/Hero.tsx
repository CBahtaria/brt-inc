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
      style={{ background: '#000' }}
    >
      {/* Layer 0: particles */}
      <ParticleField />

      {/* Layer 1: Three.js scene */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <Hero3D />
      </div>

      {/* Layer 2: radial vignette — keeps 3D legible */}
      <div
        className="absolute inset-0 z-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Layer 3: cinematic mission statement */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-[0.25em] mb-8"
          style={{ color: 'var(--accent-2)' }}
        >
          BRT Inc. · Manzini, Eswatini
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-none mb-4"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
            color: 'var(--white-100)',
          }}
        >
          Sovereign Technology
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-none mb-10"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
            background: 'linear-gradient(135deg, var(--white-100) 0%, var(--accent-2) 55%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          for Southern Africa.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-lg mb-10 max-w-[520px] leading-relaxed"
          style={{ color: 'var(--white-60)' }}
        >
          Defence-grade autonomous systems, secure platforms, and infrastructure software for SADC national institutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <a
            href="#portfolio"
            className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}
          >
            View Our Work
          </a>
          <a
            href="#about"
            className="px-7 py-3 rounded-full text-sm font-semibold transition-all hover:bg-white/10"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--white-80)',
            }}
          >
            Mission Brief
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { label: 'DAL-A compliant', icon: '⬡' },
            { label: 'Ed25519 signed', icon: '◆' },
            { label: 'SADC-focused', icon: '◎' },
            { label: '4+ years delivered', icon: '✦' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-[10px]" style={{ color: 'var(--accent-2)' }}>{item.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--white-30)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Cinematic scroll line */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)' }}
          animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000, transparent)' }}
      />
    </section>
  )
}
