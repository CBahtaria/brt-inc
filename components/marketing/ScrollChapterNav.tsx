'use client'
import { useEffect, useState } from 'react'

const CHAPTERS = [
  { id: 'hero',        label: 'INTRO' },
  { id: 'sentinel',    label: 'SENTINEL V5' },
  { id: 'uav',         label: 'UAV STACK' },
  { id: 'marketplace', label: 'MARKETPLACE' },
  { id: 'mahlanya',    label: 'MAHLANYA RPG' },
  { id: 'maize',       label: 'MAIZE AI' },
  { id: 'impact',      label: 'IMPACT' },
  { id: 'contact',     label: 'CONTACT' },
]

export function ScrollChapterNav() {
  const [active, setActive] = useState('hero')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.35 }
    )
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  return (
    <nav aria-label="Page sections" className="scroll-chapter-nav">
      <div className="scroll-chapter-track">
        <div className="scroll-chapter-fill" style={{ height: `${progress * 100}%` }} />
      </div>
      {CHAPTERS.map(({ id, label }) => {
        const isActive = active === id
        return (
          <a
            key={id}
            href={`#${id}`}
            className="scroll-chapter-item"
            aria-current={isActive ? 'true' : undefined}
          >
            <span className={`scroll-chapter-label${isActive ? ' scroll-chapter-label-active' : ''}`}>
              {label}
            </span>
            <div className={`scroll-chapter-dot${isActive ? ' scroll-chapter-dot-active' : ''}`} />
          </a>
        )
      })}
    </nav>
  )
}
