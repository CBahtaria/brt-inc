'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'defence-security',          label: 'Defence & Security',        count: 48, icon: '🛡', accent: '#f87171' },
  { slug: 'agricultural-intelligence', label: 'Agricultural Intelligence',  count: 31, icon: '🌾', accent: '#4ade80' },
  { slug: 'infrastructure-energy',     label: 'Infrastructure & Energy',    count: 55, icon: '⚡', accent: '#fbbf24' },
  { slug: 'civic-government',          label: 'Civic & Government Tech',    count: 27, icon: '🏛', accent: '#818cf8' },
  { slug: 'autonomous-aerial',         label: 'Autonomous & Aerial',        count: 19, icon: '🚁', accent: '#2dd4bf' },
  { slug: 'healthcare-biomedical',     label: 'Healthcare & Biomedical',    count: 22, icon: '🧬', accent: '#c084fc' },
]

const FEATURED_SUPPLIERS = [
  { name: 'AeroSystems SA',   country: '🇿🇦 South Africa', verified: true, products: 12, rating: 4.9, focus: 'UAV + Avionics',     category: 'autonomous-aerial' },
  { name: 'SecureNet SWZ',    country: '🇸🇿 Eswatini',     verified: true, products: 7,  rating: 4.8, focus: 'Cybersecurity',      category: 'defence-security' },
  { name: 'AgriSense ZW',     country: '🇿🇼 Zimbabwe',     verified: true, products: 15, rating: 4.7, focus: 'Precision Agri',     category: 'agricultural-intelligence' },
  { name: 'CivicTech BW',     country: '🇧🇼 Botswana',     verified: true, products: 9,  rating: 4.8, focus: 'e-Government',       category: 'civic-government' },
  { name: 'GridTech MZ',      country: '🇲🇿 Mozambique',   verified: true, products: 11, rating: 4.6, focus: 'Power Infrastructure', category: 'infrastructure-energy' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: 11 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'rgba(240,240,250,0.4)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default function MarketplacePage() {
  const [query, setQuery] = useState('')

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Hero search */}
      <div style={{ padding: '64px 0 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', padding: '4px 14px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2dd4bf', marginBottom: 20 }}>
          Coming 2026 · Early Access Open
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'rgba(240,240,250,1)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          SADC SOVEREIGN MARKETPLACE
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', margin: '0 0 40px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          B2B procurement connecting 200+ verified technology suppliers with SADC national institutions
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', maxWidth: 640, margin: '0 auto', gap: 0 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find SADC-Verified Suppliers, Services, Technology..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRight: 'none',
              padding: '14px 20px',
              fontSize: 13,
              color: 'rgba(240,240,250,0.9)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(45,212,191,0.5)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
          <button style={{
            background: '#2dd4bf',
            border: 'none',
            padding: '14px 28px',
            fontSize: 12,
            fontFamily: 'var(--font-barlow-condensed), Arial',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#000',
            cursor: 'pointer',
          }}>
            SEARCH
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 56 }}>
        {[
          { value: '200+', label: 'Verified Suppliers' },
          { value: '6',    label: 'Categories' },
          { value: '10',   label: 'SADC Countries' },
          { value: '2026', label: 'Launch Year' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: '20px 0', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="font-display" style={{ fontSize: 28, color: 'rgba(240,240,250,1)', margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <section style={{ marginBottom: 64 }}>
        <h2 className="font-display" style={{ fontSize: 22, color: 'rgba(240,240,250,0.9)', margin: '0 0 24px', letterSpacing: '0.05em' }}>
          BROWSE BY CATEGORY
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/marketplace/categories/${cat.slug}`}
              style={{ textDecoration: 'none', background: '#000', padding: '28px 24px', display: 'block', transition: 'background 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0a0a0a' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#000' }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{cat.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,240,250,0.9)', margin: '0 0 4px' }}>{cat.label}</p>
              <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.4)', margin: '0 0 12px' }}>{cat.count} suppliers</p>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.accent }}>View all →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured suppliers */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: 'rgba(240,240,250,0.9)', margin: 0, letterSpacing: '0.05em' }}>
            FEATURED SUPPLIERS
          </h2>
          <Link href="/marketplace/suppliers" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2dd4bf', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
          {FEATURED_SUPPLIERS.map(s => (
            <div key={s.name} style={{ background: '#000', padding: '20px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{s.country.split(' ')[0]}</span>
                {s.verified && (
                  <span style={{ fontSize: 9, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', color: '#2dd4bf', padding: '2px 6px', letterSpacing: '0.1em' }}>
                    ✓ VERIFIED
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,240,250,0.9)', margin: '0 0 4px' }}>{s.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)', margin: '0 0 8px' }}>{s.focus}</p>
              <Stars rating={s.rating} />
              <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.3)', margin: '8px 0 0' }}>{s.products} products</p>
            </div>
          ))}
        </div>
      </section>

      {/* RFQ banner */}
      <section style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div>
          <h3 className="font-display" style={{ fontSize: 26, color: 'rgba(240,240,250,0.9)', margin: '0 0 8px', letterSpacing: '0.02em' }}>
            POST A BUYING REQUEST
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(240,240,250,0.5)', margin: 0, maxWidth: 400 }}>
            Let 200+ verified SADC suppliers compete for your contract. Government-standard RFQ process.
          </p>
        </div>
        <Link
          href="/marketplace/rfq"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'rgba(240,240,250,1)', padding: '12px 32px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          START RFQ
        </Link>
      </section>
    </main>
  )
}
