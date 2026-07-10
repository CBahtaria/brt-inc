'use client'
import { useEffect, useRef } from 'react'
import { ScrollScene } from './ScrollScene'

const STATS = [
  { label: 'Projects shipped', value: 11, suffix: '' },
  { label: 'Security findings patched', value: 9, suffix: '' },
  { label: 'UAV tests passing', value: 783, suffix: '+' },
  { label: 'SADC institutions served', value: 6, suffix: '' },
]

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let tween: { kill?: () => void } | undefined
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        const proxy = { val: 0 }
        tween = gsap.to(proxy, {
          val: value,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            if (el) el.textContent = Math.round(proxy.val) + suffix
          },
        }) as typeof tween
      })
    })
    return () => tween?.kill?.()
  }, [value, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export function Impact() {
  return (
    <ScrollScene>
      <section id="impact" className="py-24 border-y" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-5xl font-bold font-mono mb-2" style={{ color: 'var(--accent)' }}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
