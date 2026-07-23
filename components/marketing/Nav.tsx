'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const LINKS = [
  { href: '#about',     label: 'About' },
  { href: '#services',  label: 'Services' },
  { href: '#portfolio', label: 'Work' },
  { href: '#pricing',   label: 'Pricing' },
  { href: '#contact',   label: 'Contact' },
  { href: '/ecosystem', label: 'Ecosystem', isPage: true },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20)
      if (menuOpen && window.scrollY > 100) setMenuOpen(false)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [menuOpen])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? 'rgba(9,9,11,0.82)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(16px) saturate(160%)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="BRT Inc."
            width={36}
            height={36}
            className="transition-opacity group-hover:opacity-80"
            priority
          />
          <span className="font-mono text-sm font-semibold tracking-tight">
            BRT <span style={{ color: 'var(--accent)' }}>INC.</span>
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <li key={l.href}>
              {l.isPage ? (
                <Link
                  href={l.href}
                  className="relative text-sm font-mono text-xs uppercase tracking-widest transition-colors hover:text-text"
                  style={{ color: 'var(--accent-2)' }}
                >
                  {l.label}
                </Link>
              ) : (
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
              )}
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
        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>
      </nav>
      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden w-full"
            style={{
              background: 'rgba(9,9,11,0.96)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <ul className="flex flex-col">
              {LINKS.map(l => (
                <li key={l.href}>
                  {l.isPage ? (
                    <Link
                      href={l.href}
                      className="block py-4 px-6 text-base font-mono uppercase tracking-widest transition-colors hover:text-white"
                      style={{ color: 'var(--accent-2)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="block py-4 px-6 text-base transition-colors hover:text-white"
                      style={{ color: 'var(--text-muted)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <a
                href="/onboarding"
                className="flex items-center justify-center w-full px-4 py-3 rounded-md text-sm font-medium text-white transition-colors"
                style={{ background: 'var(--accent)' }}
                onClick={() => setMenuOpen(false)}
              >
                Start a project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
