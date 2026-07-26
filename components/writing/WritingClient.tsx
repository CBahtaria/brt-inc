'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { ContentMeta } from '@/lib/content'

const CAT_CONFIG: Record<string, { label: string; color: string; glyph: string }> = {
  all:      { label: 'All',      color: '#6366f1', glyph: '◈' },
  science:  { label: 'Science',  color: '#2dd4bf', glyph: '⬡' },
  research: { label: 'Research', color: '#a78bfa', glyph: '⬢' },
  security: { label: 'Security', color: '#f87171', glyph: '⬣' },
}

const WORDS_PER_MINUTE = 220
const NEW_THRESHOLD_DAYS = 14

function estimateReadTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / WORDS_PER_MINUTE))
}

function isNew(dateStr: string) {
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && (Date.now() - d.getTime()) / 86_400_000 < NEW_THRESHOLD_DAYS
}

/* ─── Particle canvas ─── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = []
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.15 + 0.05,
      })
    }

    let frame = 0
    let animId: number
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        const pulse = Math.sin(frame * s.speed + s.x) * 0.3 + s.o
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(165,180,252,${pulse})`
        ctx.fill()
      }
      frame++
      animId = requestAnimationFrame(tick)
    }
    tick()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  )
}

/* ─── Cursor glow ─── */
function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return (
    <div
      className="pointer-events-none fixed z-0"
      style={{
        left: pos.x - 200, top: pos.y - 200,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        transition: 'left 0.08s, top 0.08s',
      }}
    />
  )
}

/* ─── 3-D tilt card ─── */
function ArticleCard({ post, index, featured }: { post: ContentMeta; index: number; featured?: boolean }) {
  const ref  = useRef<HTMLDivElement>(null)
  const mx   = useMotionValue(0)
  const my   = useMotionValue(0)
  const sx   = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy   = useSpring(my, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const shine = useTransform(sx, [-0.5, 0.5], ['rgba(99,102,241,0)', 'rgba(99,102,241,0.06)'])

  const cfg   = CAT_CONFIG[post.category] ?? CAT_CONFIG.all
  const mins  = estimateReadTime((post.summary ?? '') + (post.title ?? ''))
  const fresh = isNew(post.date)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className={featured ? 'col-span-full' : ''}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.012 }}
        transition={{ scale: { type: 'spring', stiffness: 300, damping: 22 } }}
      >
        <Link href={`/writing/${post.category}/${post.slug}`} className="block focus:outline-none">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(10,12,20,0.88)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.055)',
              padding: featured ? '2rem' : '1.4rem',
            }}
          >
            {/* Animated border highlight */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{ boxShadow: `inset 0 0 0 1px ${cfg.color}40` }}
            />

            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${cfg.color}60 50%, transparent 100%)` }} />

            {/* Shine follow */}
            <motion.div className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: shine }} />

            {/* Nebula glow */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-48 h-48 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${cfg.color}12 0%, transparent 70%)` }}
            />

            {/* Meta row */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                <span>{cfg.glyph}</span>
                {cfg.label}
              </span>
              {post.premium && (
                <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.22)' }}>
                  ★ Premium
                </span>
              )}
              {fresh && (
                <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.22)' }}>
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"
                    animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />
                  New
                </span>
              )}
              <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                {post.date} · {mins} min read
              </span>
            </div>

            {/* Title */}
            <h2
              className="relative z-10 font-bold mb-2 group-hover:text-white transition-colors"
              style={{ color: 'var(--text)', fontSize: featured ? '1.35rem' : '1.05rem', lineHeight: 1.3 }}
            >
              {post.title || post.slug}
            </h2>

            {/* Summary */}
            {post.summary && (
              <p className="relative z-10 text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
                {post.summary}
              </p>
            )}

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-1.5">
                {(post.tags ?? []).slice(0, 3).map(tag => (
                  <span key={tag} className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--accent)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <motion.span
                className="font-mono text-xs"
                style={{ color: cfg.color }}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Read →
              </motion.span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

/* ─── Category filter ─── */
function CategoryFilter({ active, onChange, counts }: {
  active: string
  onChange: (c: string) => void
  counts: Record<string, number>
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {Object.entries(CAT_CONFIG).map(([key, cfg]) => {
        const isActive = active === key
        const count = key === 'all' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[key] ?? 0)
        return (
          <motion.button
            key={key}
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative font-mono text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: isActive ? `${cfg.color}20` : 'rgba(255,255,255,0.04)',
              color: isActive ? cfg.color : 'var(--text-subtle)',
              border: isActive ? `1px solid ${cfg.color}50` : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: `${cfg.color}15` }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative">
              {cfg.glyph} {cfg.label}
              <span className="ml-1 opacity-50">({count})</span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

/* ─── Main export ─── */
export default function WritingClient({ posts }: { posts: ContentMeta[] }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter)

  const counts: Record<string, number> = {}
  for (const p of posts) {
    counts[p.category] = (counts[p.category] ?? 0) + 1
  }

  const [featured, ...rest] = filtered

  return (
    <>
      <CursorGlow />
      <main className="relative min-h-screen py-24 px-6 overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Starfield */}
        <div className="absolute inset-0 z-0">
          <StarField />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
              Field notes
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-none"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, rgba(99,102,241,0.9) 60%, rgba(45,212,191,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Writing
            </h1>
            <p className="text-base mb-10 max-w-xl" style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
              Technical articles on security, physics, and what I build.
              Free to read — premium tier unlocks annotated source + Q&amp;A on{' '}
              <a href="https://brtinc.substack.com" className="underline decoration-dotted"
                style={{ color: 'var(--accent-2)' }}>
                Substack
              </a>
              {' '}(R 150/mo).
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <CategoryFilter active={filter} onChange={setFilter} counts={counts} />
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-mono text-sm"
                style={{ color: 'var(--text-subtle)' }}
              >
                No articles in this category yet.
              </motion.p>
            ) : (
              <motion.div key={filter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured && <ArticleCard post={featured} index={0} featured />}
                {rest.map((p, i) => <ArticleCard key={p.slug} post={p} index={i + 1} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 p-6 rounded-2xl text-center"
            style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>More coming every week</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Security research, SADC engineering case studies, physics explainers with worked examples.
            </p>
            <a
              href="https://brtinc.substack.com"
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              Subscribe on Substack
            </a>
          </motion.div>
        </div>
      </main>
    </>
  )
}
