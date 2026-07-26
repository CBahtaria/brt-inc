import Image from 'next/image'

interface Spec {
  value: string
  label: string
}

interface Cta {
  label: string
  href: string
}

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

export function ProductSection({
  eyebrow,
  title,
  imageSrc,
  imageAlt,
  primaryCta,
  secondaryCta,
  specs,
  textPosition = 'bottom',
  id,
}: ProductSectionProps) {
  const isBottom = textPosition === 'bottom'

  return (
    <section id={id} style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          fill
          src={imageSrc}
          alt={imageAlt}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
        }}
      />

      {/* Text block */}
      <div
        style={{
          position: 'absolute',
          ...(isBottom ? { bottom: specs ? 120 : 80 } : { top: 120 }),
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <p
          style={{
            color: 'var(--white-60)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            margin: '0 0 8px',
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            color: 'var(--white-100)',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            margin: '0 0 24px',
          }}
        >
          {title}
        </h2>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={primaryCta.href}
            style={{
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'var(--white-100)',
              padding: '10px 28px',
              fontSize: 13,
              letterSpacing: '0.15em',
              fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            {primaryCta.label}
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--white-60)',
                padding: '10px 28px',
                fontSize: 13,
                letterSpacing: '0.15em',
                fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>

      {/* Specs bar */}
      {specs && specs.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            padding: '0 24px',
            flexWrap: 'wrap',
          }}
        >
          {specs.map(spec => (
            <div key={spec.label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  color: 'var(--white-100)',
                  fontSize: 20,
                  fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                  fontWeight: 700,
                  margin: '0 0 2px',
                  lineHeight: 1,
                }}
              >
                {spec.value}
              </p>
              <p
                style={{
                  color: 'var(--white-40)',
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                  margin: 0,
                }}
              >
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
