'use client'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface Spec { value: string; label: string }
interface Cta { label: string; href: string }

interface ProductSectionProps {
  eyebrow: string
  title: string
  imageSrc: string
  imageAlt: string
  primaryCta: Cta
  secondaryCta?: Cta
  specs?: Spec[]
  textPosition?: 'bottom' | 'top'
  id?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

export function ProductSection({
  eyebrow, title, imageSrc, imageAlt, primaryCta, secondaryCta, specs,
  textPosition = 'bottom', id,
}: ProductSectionProps) {
  const isBottom = textPosition === 'bottom'
  const sectionRef = useRef<HTMLElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const inView = useInView(textRef, { once: true, margin: '-15% 0px' })

  useEffect(() => {
    let ctx: { revert: () => void } | undefined
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        if (!sectionRef.current || !imageContainerRef.current) return
        ctx = gsap.context(() => {
          gsap.to(imageContainerRef.current, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }
    )
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id={id} style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={imageContainerRef} style={{ position: 'absolute', inset: '-15% 0', willChange: 'transform' }}>
        <Image
          fill
          src={imageSrc}
          alt={imageAlt}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <div
        ref={textRef}
        style={{
          position: 'absolute',
          ...(isBottom ? { bottom: specs ? 120 : 80 } : { top: 120 }),
          left: 0, right: 0,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <motion.p
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            color: 'var(--white-60)', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            margin: '0 0 8px',
          }}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            color: 'var(--white-100)', fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 0.95, margin: '0 0 24px',
          }}
        >
          {title}
        </motion.h2>

        <motion.div
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a href={primaryCta.href} className="product-cta-primary">{primaryCta.label}</a>
          {secondaryCta && (
            <a href={secondaryCta.href} className="product-cta-secondary">{secondaryCta.label}</a>
          )}
        </motion.div>
      </div>

      {specs && specs.length > 0 && (
        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{
            position: 'absolute', bottom: 32, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 48, padding: '0 24px', flexWrap: 'wrap',
          }}
        >
          {specs.map(spec => (
            <div key={spec.label} style={{ textAlign: 'center' }}>
              <p style={{
                color: 'var(--white-100)', fontSize: 20,
                fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                fontWeight: 700, margin: '0 0 2px', lineHeight: 1,
              }}>{spec.value}</p>
              <p style={{
                color: 'var(--white-40)', fontSize: 10, letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                margin: 0,
              }}>{spec.label}</p>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
