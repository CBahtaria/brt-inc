'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'defence-security',          label: 'Defence & Security',        count: 48, icon: '🛡️', accent: '#f87171', gradient: 'linear-gradient(135deg, rgba(248,113,113,0.2) 0%, rgba(248,113,113,0.05) 100%)' },
  { slug: 'agricultural-intelligence', label: 'Agricultural Intelligence',  count: 31, icon: '🌾', accent: '#4ade80', gradient: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 100%)' },
  { slug: 'infrastructure-energy',     label: 'Infrastructure & Energy',    count: 55, icon: '⚡', accent: '#fbbf24', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.05) 100%)' },
  { slug: 'civic-government',          label: 'Civic & Government Tech',    count: 27, icon: '🏛️', accent: '#818cf8', gradient: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(129,140,248,0.05) 100%)' },
  { slug: 'autonomous-aerial',         label: 'Autonomous & Aerial',        count: 19, icon: '🚁', accent: '#2dd4bf', gradient: 'linear-gradient(135deg, rgba(45,212,191,0.2) 0%, rgba(45,212,191,0.05) 100%)' },
  { slug: 'healthcare-biomedical',     label: 'Healthcare & Biomedical',    count: 22, icon: '🧬', accent: '#c084fc', gradient: 'linear-gradient(135deg, rgba(192,132,252,0.2) 0%, rgba(192,132,252,0.05) 100%)' },
]

const FEATURED_SUPPLIERS = [
  { name: 'AeroSystems SA',  flag: '🇿🇦', country: 'South Africa', verified: true, products: 12, rating: 4.9, focus: 'UAV + Avionics',       accent: '#2dd4bf' },
  { name: 'SecureNet SWZ',   flag: '🇸🇿', country: 'Eswatini',     verified: true, products: 7,  rating: 4.8, focus: 'Cybersecurity',         accent: '#f87171' },
  { name: 'AgriSense ZW',    flag: '🇿🇼', country: 'Zimbabwe',     verified: true, products: 15, rating: 4.7, focus: 'Precision Agriculture',  accent: '#4ade80' },
  { name: 'CivicTech BW',    flag: '🇧🇼', country: 'Botswana',     verified: true, products: 9,  rating: 4.8, focus: 'e-Government',           accent: '#818cf8' },
  { name: 'GridTech MZ',     flag: '🇲🇿', country: 'Mozambique',   verified: true, products: 11, rating: 4.6, focus: 'Power Infrastructure',   accent: '#fbbf24' },
]

const TRENDING = [
  'UAV components', 'Solar grid', 'Biometric ID', 'Precision sensors',
  'Encrypted comms', 'Water treatment', 'Agri drones', 'Smart meters',
  'Medical imaging', 'Border surveillance',
]

const SADC = [
  { flag: '🇿🇦', name: 'South Africa' }, { flag: '🇿🇼', name: 'Zimbabwe' },
  { flag: '🇿🇲', name: 'Zambia' },       { flag: '🇧🇼', name: 'Botswana' },
  { flag: '🇸🇿', name: 'Eswatini' },     { flag: '🇲🇿', name: 'Mozambique' },
  { flag: '🇳🇦', name: 'Namibia' },      { flag: '🇹🇿', name: 'Tanzania' },
  { flag: '🇲🇼', name: 'Malawi' },       { flag: '🇱🇸', name: 'Lesotho' },
  { flag: '🇦🇴', name: 'Angola' },       { flag: '🇲🇬', name: 'Madagascar' },
  { flag: '🇲🇺', name: 'Mauritius' },    { flag: '🇸🇨', name: 'Seychelles' },
  { flag: '🇨🇩', name: 'DRC' },          { flag: '🇰🇲', name: 'Comoros' },
]

function Stars({ rating, accent }: { rating: number; accent: string }) {
  return (
    <span style={{ fontSize: 11 }}>
      <span style={{ color: accent }}>{'★'.repeat(Math.floor(rating))}</span>
      <span style={{ color: 'rgba(240,240,250,0.2)' }}>{'★'.repeat(5 - Math.floor(rating))}</span>
      <span style={{ color: 'rgba(240,240,250,0.4)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default function MarketplacePage() {
  const [query, setQuery] = useState('')

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Hero */}
      <div style={{ padding: '64px 0 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', padding: '4px 14px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2dd4bf', marginBottom: 20, borderRadius: 4 }}>
          Coming 2026 · Early Access Open
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'rgba(240,240,250,1)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          SADC SOVEREIGN MARKETPLACE
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', margin: '0 0 40px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          B2B procurement connecting 200+ verified technology suppliers with SADC national institutions
        </p>

        {/* Search */}
        <div style={{ display: 'flex', maxWidth: 640, margin: '0 auto 20px', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find SADC-verified suppliers, services, technology..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: 'none',
              padding: '14px 20px',
              fontSize: 13,
              color: 'rgba(240,240,250,0.9)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
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
            flexShrink: 0,
          }}>
            SEARCH
          </button>
        </div>

        {/* Trending tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 640, margin: '0 auto' }}>
          <span style={{ fontSize: 11, color: 'rgba(240,240,250,0.3)', alignSelf: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trending:</span>
          {TRENDING.map(tag => (
            <button
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                color: 'rgba(240,240,250,0.5)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(45,212,191,0.08)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(45,212,191,0.3)'
                ;(e.currentTarget as HTMLElement).style.color = '#2dd4bf'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(240,240,250,0.5)'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* SADC flag strip */}
      <div style={{ overflowX: 'auto', marginBottom: 48, paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {SADC.map(({ flag, name }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 18px', borderRight: '1px solid rgba(255,255,255,0.06)', gap: 4 }}>
              <span style={{ fontSize: 22 }}>{flag}</span>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.35)', whiteSpace: 'nowrap' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar — wraps on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 56 }}>
        {[
          { value: '200+', label: 'Verified Suppliers' },
          { value: '6',    label: 'Categories' },
          { value: '10',   label: 'SADC Countries' },
          { value: '2026', label: 'Launch Year' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <p className="font-display" style={{ fontSize: 28, color: 'rgba(240,240,250,1)', margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category grid — responsive, Pinterest-style cards */}
      <section style={{ marginBottom: 64 }}>
        <h2 className="font-display" style={{ fontSize: 22, color: 'rgba(240,240,250,0.9)', margin: '0 0 24px', letterSpacing: '0.05em' }}>
          BROWSE BY CATEGORY
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/marketplace/categories/${cat.slug}`}
              style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', transition: 'transform 0.2s, box-shadow 0.2s', background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {/* Colored gradient header */}
              <div style={{ background: cat.gradient, padding: '28px 24px 20px', borderBottom: `1px solid ${cat.accent}20` }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(240,240,250,0.95)', margin: 0, letterSpacing: '-0.01em' }}>{cat.label}</p>
              </div>
              {/* Footer */}
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(240,240,250,0.4)' }}>{cat.count} suppliers</span>
                <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: cat.accent, fontWeight: 600 }}>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured suppliers — responsive cards */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="font-display" style={{ fontSize: 22, color: 'rgba(240,240,250,0.9)', margin: 0, letterSpacing: '0.05em' }}>
            FEATURED SUPPLIERS
          </h2>
          <Link href="/marketplace/suppliers" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2dd4bf', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {FEATURED_SUPPLIERS.map(s => (
            <div
              key={s.name}
              style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              {/* Accent top bar */}
              <div style={{ height: 3, background: s.accent }} />
              <div style={{ padding: '18px 18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.flag}</span>
                  {s.verified && (
                    <span style={{ fontSize: 9, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', color: '#2dd4bf', padding: '2px 6px', letterSpacing: '0.1em', borderRadius: 3 }}>
                      ✓ VERIFIED
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,240,250,0.95)', margin: '0 0 2px', letterSpacing: '-0.01em' }}>{s.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)', margin: '0 0 4px' }}>{s.country}</p>
                <p style={{ fontSize: 11, color: s.accent, margin: '0 0 10px', fontWeight: 500 }}>{s.focus}</p>
                <Stars rating={s.rating} accent={s.accent} />
                <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.25)', margin: '8px 0 0' }}>{s.products} products listed</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RFQ banner — stacks on mobile */}
      <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '40px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24, background: 'linear-gradient(135deg, rgba(45,212,191,0.04) 0%, transparent 60%)' }}>
        <div style={{ flex: '1 1 280px' }}>
          <h3 className="font-display" style={{ fontSize: 26, color: 'rgba(240,240,250,0.9)', margin: '0 0 8px', letterSpacing: '0.02em' }}>
            POST A BUYING REQUEST
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(240,240,250,0.5)', margin: 0, maxWidth: 400 }}>
            Let 200+ verified SADC suppliers compete for your contract. Government-standard RFQ process.
          </p>
        </div>
        <Link
          href="/marketplace/rfq"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'rgba(240,240,250,1)', padding: '14px 36px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', borderRadius: 6, flexShrink: 0, display: 'inline-block' }}
        >
          START RFQ
        </Link>
      </section>
    </main>
  )
}
