'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const SLIDES = [
  {
    title: 'Agentic UAV Stack — DAL-A Flight Governor',
    src: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1200&q=80',
    alt: 'Autonomous drone in flight',
  },
  {
    title: 'Sentinel V5.0 — Real-Time C2 Dashboard',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Command and control operations center',
  },
  {
    title: 'SADC Sovereign Marketplace — B2B Procurement',
    src: 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=1200&q=80',
    alt: 'African trade and commerce hub',
  },
  {
    title: 'MahlanyaRPG — Eswatini 19th Century Recreation',
    src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    alt: 'African landscape — Eswatini highlands',
  },
  {
    title: 'Maize Leaf Classifier — Edge-First Inference',
    src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Agricultural AI — maize field',
  },
]

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
}

export function DemoCarousel() {
  const [[active, dir], setSlide] = useState([0, 0])

  const go = useCallback((next: number) => {
    setSlide(([cur]) => {
      const bounded = (next + SLIDES.length) % SLIDES.length
      return [bounded, next > cur || (cur === SLIDES.length - 1 && next === 0) ? 1 : -1]
    })
  }, [])

  return (
    <section style={{ background: 'var(--surface-1)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 40 }}>
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--surface-3)',
              border: '1px solid var(--border-bright)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text)' }}>
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>

          <h2 style={{ color: 'var(--text)', fontWeight: 600, fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', textAlign: 'center', margin: 0 }}>
            Experience BRT Systems
          </h2>

          <button
            onClick={() => go(active + 1)}
            aria-label="Next"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--surface-3)',
              border: '1px solid var(--border-bright)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text)' }}>
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </div>

        {/* Slide */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, aspectRatio: '16/7' }}>
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={active}
              custom={dir}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={SLIDES[active].src}
                alt={SLIDES[active].alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '2rem',
                }}
              >
                <p
                  style={{
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    margin: 0,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-barlow-condensed), sans-serif',
                  }}
                >
                  {SLIDES[active].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === active ? 'var(--accent)' : 'var(--border-bright)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
