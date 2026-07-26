import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SADC Sovereign Marketplace — BRT Inc.',
  description: 'B2B procurement platform connecting verified technology suppliers across Southern Africa.',
}

const CATEGORIES = [
  { slug: 'defence-security',           label: 'Defence & Security' },
  { slug: 'agricultural-intelligence',  label: 'Agricultural Intelligence' },
  { slug: 'infrastructure-energy',      label: 'Infrastructure & Energy' },
  { slug: 'civic-government',           label: 'Civic & Government' },
  { slug: 'autonomous-aerial',          label: 'Autonomous & Aerial' },
  { slug: 'healthcare-biomedical',      label: 'Healthcare & Biomedical' },
]

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'rgba(240,240,250,1)' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.96)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Main nav */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: 'rgba(240,240,250,1)', textDecoration: 'none' }}>
            BRT <span style={{ color: '#2dd4bf' }}>INC.</span>
          </Link>
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link href="/marketplace/suppliers" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.6)', textDecoration: 'none' }}>Suppliers</Link>
            <Link href="/marketplace/rfq" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.6)', textDecoration: 'none' }}>Post RFQ</Link>
            <Link href="/#contact" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2dd4bf', textDecoration: 'none', border: '1px solid rgba(45,212,191,0.4)', padding: '6px 16px' }}>Get Access</Link>
          </nav>
        </div>

        {/* Category sub-nav */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', overflowX: 'auto' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
            <Link href="/marketplace" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', textDecoration: 'none', padding: '10px 16px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              All Categories
            </Link>
            {CATEGORIES.map(c => (
              <Link
                key={c.slug}
                href={`/marketplace/categories/${c.slug}`}
                style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', textDecoration: 'none', padding: '10px 16px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {children}

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px', marginTop: 80 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.3)', fontFamily: 'monospace' }}>
            © {new Date().getFullYear()} BRT Inc. — SADC Sovereign Marketplace · Coming 2026
          </p>
          <Link href="/" style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', textDecoration: 'none' }}>
            Back to BRT Inc.
          </Link>
        </div>
      </footer>
    </div>
  )
}
