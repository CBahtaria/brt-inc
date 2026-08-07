'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

const STATS = [
  { label: 'systems',     value: 31, suffix: '',     color: 'var(--accent-2)' },
  { label: 'NATS streams',value: 8,  suffix: '',     color: 'var(--accent)' },
  { label: 'tests',       value: 1466, suffix: '+',  color: '#10b981' },
  { label: 'SRL target',  value: 6,  suffix: '',     color: 'var(--accent-game)' },
]

export function EcosystemHeader() {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    STATS.forEach((stat, i) => {
      const el = refs.current[i]
      if (!el) return
      const obj = { val: 0 }
      gsap.to(obj, {
        val: stat.value,
        duration: 1.2,
        delay: 0.2 + i * 0.15,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = `${Math.round(obj.val)}${stat.suffix} ${stat.label}`
        },
      })
    })
  }, [])

  return (
    <div
      className="flex items-center justify-between px-4 md:px-6 h-16 border-b shrink-0"
      style={{ borderColor: 'var(--border)', background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-white anim-fade-up"
          style={{ color: 'var(--text-subtle)' }}
        >
          ← BRT Inc.
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
          Ecosystem
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-4 md:gap-6">
        {STATS.map((s, i) => (
          <span
            key={s.label}
            ref={el => { refs.current[i] = el }}
            className="font-mono text-[10px] anim-fade-up"
            style={{ color: s.color, animationDelay: `${i * 0.1}s` }}
          >
            {s.value}{s.suffix} {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
