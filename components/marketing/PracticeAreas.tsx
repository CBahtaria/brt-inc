'use client'
import { useEffect, useRef } from 'react'

const AREAS = [
  { title: 'Defence & Security', desc: 'C2 systems, audit hardening, auth gates. PDO-only, TOTP 2FA, hash-chained audit logs.' },
  { title: 'Autonomous Systems', desc: 'DAL-A autopilots, formal safety governors, hardware-in-loop test suites.' },
  { title: 'Civic Infrastructure', desc: 'National dashboards, asset management, resilience tracking for government.' },
  { title: 'Applied AI / ML', desc: 'On-device inference, RAG pipelines, macro forecasting, time-series models.' },
  { title: 'Game Development', desc: 'UE5 C++ historical RPG with hardware-adaptive scaler and Steam integration.' },
  { title: 'Operator Tooling', desc: 'CRM, proposals, invoicing, runbooks — internal ops tools for high-trust teams.' },
]

export function PracticeAreas() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return
    let ctx: ReturnType<typeof import('gsap').gsap.context> | undefined
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        ctx = gsap.context(() => {
          gsap.to(trackRef.current, {
            x: () => -(trackRef.current!.scrollWidth - window.innerWidth + 48) + 'px',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,
              scrub: 1,
              end: () => `+=${trackRef.current!.scrollWidth}`,
            },
          })
        })
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={containerRef} className="overflow-hidden">
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Practice Areas</p>
      </div>
      <div ref={trackRef} className="flex gap-6 px-6 pb-16">
        {AREAS.map(area => (
          <div
            key={area.title}
            className="flex-shrink-0 w-80 p-6 rounded-xl border"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
          >
            <h3 className="text-lg font-semibold mb-3">{area.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{area.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
