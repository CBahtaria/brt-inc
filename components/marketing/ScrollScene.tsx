'use client'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export function ScrollScene({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return
    let ctx: { revert: () => void } | undefined
    const el = ref.current
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        ctx = gsap.context(() => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 60%',
              scrub: false,
              once: true,
            },
          })
        }, el)
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
