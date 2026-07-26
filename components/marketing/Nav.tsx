'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const LINKS = [
  { href: '#sentinel',    label: 'CAPABILITIES' },
  { href: '/marketplace', label: 'MARKETPLACE', isPage: true },
  { href: '#uav',         label: 'WORK' },
  { href: '/ecosystem',   label: 'ECOSYSTEM',   isPage: true },
  { href: '/writing',     label: 'WRITING',      isPage: true },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          zIndex: 50,
          background: scrolled ? 'rgba(0,0,0,0.90)' : 'rgba(0,0,0,0)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <nav
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display"
            style={{
              color: 'var(--white-100)',
              fontSize: 16,
              textDecoration: 'none',
              letterSpacing: '0.08em',
              fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
              fontWeight: 700,
            }}
          >
            BRT INC.
          </Link>

          {/* Desktop links */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            className="hidden md:flex"
          >
            {LINKS.map(l => (
              <li key={l.href}>
                {l.isPage ? (
                  <Link
                    href={l.href}
                    style={{
                      color: 'var(--white-60)',
                      textDecoration: 'none',
                      fontSize: 12,
                      letterSpacing: '0.15em',
                      fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                      fontWeight: 600,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white-100)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white-60)' }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    style={{
                      color: 'var(--white-60)',
                      textDecoration: 'none',
                      fontSize: 12,
                      letterSpacing: '0.15em',
                      fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                      fontWeight: 600,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white-100)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white-60)' }}
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--white-100)',
              fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
              fontSize: 12,
              letterSpacing: '0.15em',
              fontWeight: 600,
            }}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {LINKS.map(l => (
            l.isPage ? (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'var(--white-100)',
                  textDecoration: 'none',
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'var(--white-100)',
                  textDecoration: 'none',
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  fontFamily: "var(--font-barlow-condensed), 'Arial Narrow', Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                {l.label}
              </a>
            )
          ))}
        </div>
      )}
    </>
  )
}
