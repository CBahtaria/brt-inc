import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch'

export const metadata: Metadata = {
  title: 'SADC Sovereign Marketplace — B2B Procurement for Southern Africa',
  description: 'Verified B2B procurement platform for SADC institutions. Defence & Security, Agricultural Intelligence, Infrastructure & Energy, Civic & Government Tech, Autonomous & Aerial, Healthcare & Biomedical.',
  keywords: [
    'SADC B2B marketplace',
    'African government procurement',
    'defence procurement Africa',
    'B2B platform southern Africa',
    'SADC verified suppliers',
    'government supplier Africa',
    'procurement platform Eswatini',
    'agricultural technology Africa',
  ],
  openGraph: {
    title: 'SADC Sovereign Marketplace — B2B Procurement for Southern Africa',
    description: 'Verified B2B procurement for SADC institutions across 6 strategic categories.',
    url: 'https://brtinc.dev/marketplace',
  },
  alternates: { canonical: 'https://brtinc.dev/marketplace' },
}

const CATEGORIES = [
  { slug: 'defence-security',          label: 'Defence & Security',        count: 48, icon: '🛡️', accent: '#f87171', gradient: 'linear-gradient(135deg, rgba(248,113,113,0.18) 0%, rgba(248,113,113,0.04) 100%)' },
  { slug: 'agricultural-intelligence', label: 'Agricultural Intelligence',  count: 31, icon: '🌾', accent: '#4ade80', gradient: 'linear-gradient(135deg, rgba(74,222,128,0.18) 0%, rgba(74,222,128,0.04) 100%)' },
  { slug: 'infrastructure-energy',     label: 'Infrastructure & Energy',    count: 55, icon: '⚡', accent: '#fbbf24', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.04) 100%)' },
  { slug: 'civic-government',          label: 'Civic & Government Tech',    count: 27, icon: '🏛️', accent: '#818cf8', gradient: 'linear-gradient(135deg, rgba(129,140,248,0.18) 0%, rgba(129,140,248,0.04) 100%)' },
  { slug: 'autonomous-aerial',         label: 'Autonomous & Aerial',        count: 19, icon: '🚁', accent: '#2dd4bf', gradient: 'linear-gradient(135deg, rgba(45,212,191,0.18) 0%, rgba(45,212,191,0.04) 100%)' },
  { slug: 'healthcare-biomedical',     label: 'Healthcare & Biomedical',    count: 22, icon: '🧬', accent: '#c084fc', gradient: 'linear-gradient(135deg, rgba(192,132,252,0.18) 0%, rgba(192,132,252,0.04) 100%)' },
]

const FEATURED_SUPPLIERS = [
  { name: 'AeroSystems SA',  flag: '🇿🇦', country: 'South Africa', verified: true, products: 12, rating: 4.9, focus: 'UAV + Avionics',       accent: '#2dd4bf' },
  { name: 'SecureNet SWZ',   flag: '🇸🇿', country: 'Eswatini',     verified: true, products: 7,  rating: 4.8, focus: 'Cybersecurity',         accent: '#f87171' },
  { name: 'AgriSense ZW',    flag: '🇿🇼', country: 'Zimbabwe',     verified: true, products: 15, rating: 4.7, focus: 'Precision Agriculture',  accent: '#4ade80' },
  { name: 'CivicTech BW',    flag: '🇧🇼', country: 'Botswana',     verified: true, products: 9,  rating: 4.8, focus: 'e-Government',           accent: '#818cf8' },
  { name: 'GridTech MZ',     flag: '🇲🇿', country: 'Mozambique',   verified: true, products: 11, rating: 4.6, focus: 'Power Infrastructure',   accent: '#fbbf24' },
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
      <span style={{ color: 'rgba(240,240,250,0.15)' }}>{'★'.repeat(5 - Math.floor(rating))}</span>
      <span style={{ color: 'rgba(240,240,250,0.4)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

// Fetch SADC country flags — free, no API key
const SADC_CODES = ['sz','za','bw','mz','zw','ls','na','mw','zm','tz','ug','cd','sc','mg','mu']

export default async function MarketplacePage() {
  const countriesRes = await fetch(
    `https://restcountries.com/v3.1/alpha?codes=${SADC_CODES.join(',')}&fields=name,flags,cca2`,
    { next: { revalidate: 86400 } }
  ).catch(() => null)
  const sadcCountries: Array<{ name: { common: string }; flags: { svg: string }; cca2: string }> =
    countriesRes?.ok ? await countriesRes.json() : []

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 0 64px', textAlign: 'center' }}>
        <p className="mk-chapter" style={{ justifyContent: 'center' }}>
          Coming 2026 · Early Access Open
        </p>
        <h1 className="font-display" style={{
          fontSize: 'clamp(2.2rem, 6vw, 5rem)',
          color: 'rgba(240,240,250,1)',
          margin: '0 0 20px',
          lineHeight: 1,
        }}>
          SADC SOVEREIGN<br />MARKETPLACE
        </h1>
        <p style={{
          fontSize: 14,
          color: 'rgba(240,240,250,0.45)',
          margin: '0 auto 48px',
          maxWidth: 460,
          lineHeight: 1.75,
        }}>
          B2B procurement connecting 200+ verified technology suppliers with SADC national institutions
        </p>
        <MarketplaceSearch />
      </div>

      {/* ── SADC flag strip ──────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', marginBottom: 64, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mk-marquee-inner">
          {[...SADC, ...SADC].map(({ flag, name }, i) => (
            <div key={`${name}-${i}`} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 18px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              gap: 4,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 20 }}>{flag}</span>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.35)', whiteSpace: 'nowrap' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── REST Countries SVG flag strip ───────────────────────── */}
      {sadcCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-center py-4">
          {sadcCountries.map(c => (
            <img key={c.cca2} src={c.flags.svg} alt={c.name.common} title={c.name.common}
                 className="h-6 w-9 object-cover rounded shadow-sm opacity-80 hover:opacity-100 transition-opacity" />
          ))}
        </div>
      )}

      {/* ── App-shell: sidebar + main ────────────────────────────── */}
      <div className="mk-app-shell">

        {/* Left sidebar — desktop only */}
        <aside className="mk-sidebar">
          <p style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(240,240,250,0.3)',
            margin: '0 0 12px',
            paddingBottom: 12,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            Browse
          </p>

          <Link href="/marketplace" className="mk-cat-link mk-cat-link-active">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>All Categories</span>
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(240,240,250,0.3)' }}>202</span>
          </Link>

          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/marketplace/categories/${cat.slug}`}
              className="mk-cat-link"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{cat.icon}</span>
                <span style={{ lineHeight: 1.4 }}>{cat.label}</span>
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(240,240,250,0.3)', flexShrink: 0 }}>
                {cat.count}
              </span>
            </Link>
          ))}

          {/* Mini RFQ CTA */}
          <div style={{
            marginTop: 28,
            padding: '16px',
            background: 'rgba(45,212,191,0.04)',
            border: '1px solid rgba(45,212,191,0.12)',
            borderRadius: 8,
          }}>
            <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.55)', margin: '0 0 12px', lineHeight: 1.6 }}>
              Let verified suppliers compete for your contract
            </p>
            <Link
              href="/marketplace/rfq"
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#2dd4bf',
                color: '#000',
                padding: '9px 0',
                fontSize: 10,
                fontFamily: 'var(--font-barlow-condensed), Arial',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              POST RFQ
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Stats bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 56,
          }}>
            {[
              { value: '200+', label: 'Verified Suppliers' },
              { value: '6',    label: 'Categories' },
              { value: '16',   label: 'SADC Nations' },
              { value: '2026', label: 'Launch Year' },
            ].map(s => (
              <div key={s.label} style={{ padding: '18px 16px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-display" style={{ fontSize: 26, color: 'rgba(240,240,250,1)', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '4px 0 0' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Category grid */}
          <section style={{ marginBottom: 64 }}>
            <p className="mk-chapter">Browse by Category</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {CATEGORIES.map((cat, i) => (
                <Link key={cat.slug} href={`/marketplace/categories/${cat.slug}`} className="mk-cat-card anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div style={{ background: cat.gradient, padding: '24px 20px 18px', borderBottom: `1px solid ${cat.accent}22` }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{cat.icon}</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(240,240,250,0.95)', margin: 0, letterSpacing: '-0.01em' }}>
                      {cat.label}
                    </p>
                  </div>
                  <div style={{ padding: '13px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)' }}>{cat.count} suppliers</span>
                    <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: cat.accent, fontWeight: 600 }}>
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured suppliers */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p className="mk-chapter" style={{ margin: 0 }}>Featured Suppliers</p>
              <Link href="/marketplace/suppliers" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2dd4bf', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
              {FEATURED_SUPPLIERS.map((s, i) => (
                <div key={s.name} className="mk-supplier-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{ height: 3, background: s.accent }} />
                  <div style={{ padding: '16px 16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>{s.flag}</span>
                      {s.verified && (
                        <span style={{
                          fontSize: 9,
                          background: 'rgba(45,212,191,0.08)',
                          border: '1px solid rgba(45,212,191,0.25)',
                          color: '#2dd4bf',
                          padding: '2px 6px',
                          letterSpacing: '0.1em',
                          borderRadius: 3,
                        }}>
                          ✓ VERIFIED
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,240,250,0.95)', margin: '0 0 2px' }}>{s.name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)', margin: '0 0 4px' }}>{s.country}</p>
                    <p style={{ fontSize: 11, color: s.accent, margin: '0 0 10px', fontWeight: 500 }}>{s.focus}</p>
                    <Stars rating={s.rating} accent={s.accent} />
                    <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.25)', margin: '8px 0 0' }}>
                      {s.products} products listed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ── RFQ Banner (full width) ──────────────────────────────── */}
      <section style={{
        marginTop: 64,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '40px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        background: 'linear-gradient(135deg, rgba(45,212,191,0.05) 0%, transparent 60%)',
      }}>
        <div style={{ flex: '1 1 220px' }}>
          <p className="mk-chapter">For Institutions</p>
          <h3 className="font-display" style={{ fontSize: 28, color: 'rgba(240,240,250,0.9)', margin: '0 0 10px', letterSpacing: '0.02em' }}>
            POST A BUYING REQUEST
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(240,240,250,0.5)', margin: 0, maxWidth: 400, lineHeight: 1.65 }}>
            Let 200+ verified SADC suppliers compete for your contract. Government-standard RFQ with audit trails.
          </p>
        </div>
        <Link
          href="/marketplace/rfq"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.45)',
            color: 'rgba(240,240,250,1)',
            padding: '14px 40px',
            fontSize: 12,
            fontFamily: 'var(--font-barlow-condensed), Arial',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            borderRadius: 6,
            flexShrink: 0,
            display: 'inline-block',
          }}
        >
          START RFQ
        </Link>
      </section>
    </main>
  )
}
