'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject: 'newsletter', message: 'Newsletter signup' }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
          Field notes
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          What I build, how I build it.
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
          Deep technical writing on DAL-A safety governors, privacy vault patterns, SADC institutional contracts,
          and autonomous systems. Free on Substack. Premium tier (R 150/mo) for annotated source + Q&amp;A access.
        </p>

        {status === 'done' ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl"
            style={{ background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.25)' }}
          >
            <span style={{ color: 'var(--accent-2)' }}>✓</span>
            <span className="text-sm font-medium" style={{ color: 'var(--accent-2)' }}>You're on the list.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg px-4 py-2.5 text-sm"
              style={{
                background: 'rgba(13,17,23,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 mt-8">
          <a
            href="https://brtinc.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-subtle)' }}
          >
            <span>Read on Substack →</span>
          </a>
          <span style={{ color: 'var(--text-subtle)', fontSize: 10 }}>·</span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>
            Premium: R 150/mo · annotated source + Q&amp;A
          </span>
        </div>
      </motion.div>
    </section>
  )
}
