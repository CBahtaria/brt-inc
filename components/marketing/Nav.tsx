'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const LINKS = [
  { href: '#about',    label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio',label: 'Work' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#contact',  label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(9,9,11,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          BRT <span style={{ color: 'var(--accent)' }}>INC.</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <li key={l.href}>
              <motion.a
                href={l.href}
                className="relative text-sm hover:text-text transition-colors"
                style={{ color: 'var(--text-muted)' }}
                whileHover="hover"
              >
                {l.label}
                <motion.span
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left"
                  style={{ background: 'var(--accent)' }}
                  variants={{ hover: { scaleX: 1 }, initial: { scaleX: 0 } }}
                  initial="initial"
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </motion.a>
            </li>
          ))}
        </ul>
        <a
          href="/onboarding"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          Start a project
        </a>
      </nav>
    </header>
  )
}
