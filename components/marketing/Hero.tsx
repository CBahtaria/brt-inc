'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          fill
          src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1920&q=80"
          alt="UAV at dusk"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content — bottom-center, SpaceX layout */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <p
          style={{
            color: 'var(--white-40)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            marginBottom: 8,
            margin: '0 0 8px',
          }}
        >
          BRT INC. · MANZINI, ESWATINI
        </p>

        <h1
          className="font-display"
          style={{
            color: 'var(--white-100)',
            fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            margin: '0 0 8px',
          }}
        >
          SOVEREIGN TECHNOLOGY
        </h1>
        <h1
          className="font-display"
          style={{
            color: 'var(--white-100)',
            fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
            fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            margin: '0 0 32px',
          }}
        >
          FOR SOUTHERN AFRICA.
        </h1>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#sentinel"
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
              transition: 'background 0.15s ease',
              background: 'rgba(255,255,255,0.05)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)' }}
          >
            LEARN MORE
          </a>
          <a
            href="#uav"
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
              transition: 'color 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--white-100)'
              el.style.borderColor = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--white-60)'
              el.style.borderColor = 'rgba(255,255,255,0.2)'
            }}
          >
            WATCH LIVESTREAM
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator — thin vertical line + animated dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background: 'rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 16,
              background: 'rgba(255,255,255,0.6)',
            }}
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
