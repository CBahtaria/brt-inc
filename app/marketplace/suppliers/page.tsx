import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verified Suppliers — SADC Marketplace',
  description: '200+ SADC-verified technology suppliers across 10 countries and 6 categories.',
}

const SUPPLIERS = [
  { id: 'aerosystems-sa',   name: 'AeroSystems SA',     flag: '🇿🇦', country: 'South Africa', products: 12, rating: 4.9, focus: 'UAV + Avionics',           category: 'Autonomous & Aerial',         tier: 'Premium' },
  { id: 'securenet-swz',    name: 'SecureNet SWZ',      flag: '🇸🇿', country: 'Eswatini',     products: 7,  rating: 4.8, focus: 'Cybersecurity',             category: 'Defence & Security',          tier: 'Verified' },
  { id: 'agrisense-zw',     name: 'AgriSense ZW',       flag: '🇿🇼', country: 'Zimbabwe',     products: 15, rating: 4.7, focus: 'Precision Agriculture',      category: 'Agricultural Intelligence',   tier: 'Verified' },
  { id: 'civictech-bw',     name: 'CivicTech BW',       flag: '🇧🇼', country: 'Botswana',     products: 9,  rating: 4.8, focus: 'e-Government',              category: 'Civic & Government',          tier: 'Premium' },
  { id: 'gridtech-mz',      name: 'GridTech MZ',        flag: '🇲🇿', country: 'Mozambique',   products: 11, rating: 4.6, focus: 'Power Grid SCADA',          category: 'Infrastructure & Energy',     tier: 'Verified' },
  { id: 'medtech-za',       name: 'MedTech ZA',         flag: '🇿🇦', country: 'South Africa', products: 16, rating: 4.8, focus: 'Medical Device SW',          category: 'Healthcare & Biomedical',     tier: 'Premium' },
  { id: 'solarnet-za',      name: 'SolarNet ZA',        flag: '🇿🇦', country: 'South Africa', products: 18, rating: 4.9, focus: 'Solar Farm Management',      category: 'Infrastructure & Energy',     tier: 'Premium' },
  { id: 'cropai-za',        name: 'CropAI ZA',          flag: '🇿🇦', country: 'South Africa', products: 12, rating: 4.8, focus: 'Disease Detection ML',       category: 'Agricultural Intelligence',   tier: 'Verified' },
  { id: 'defendtech-za',    name: 'DefendTech ZA',      flag: '🇿🇦', country: 'South Africa', products: 14, rating: 4.7, focus: 'Physical Security',          category: 'Defence & Security',          tier: 'Verified' },
  { id: 'govsy-za',         name: 'GovSys ZA',          flag: '🇿🇦', country: 'South Africa', products: 21, rating: 4.7, focus: 'Digital Identity',           category: 'Civic & Government',          tier: 'Premium' },
  { id: 'telemed-zm',       name: 'TelemED ZM',         flag: '🇿🇲', country: 'Zambia',       products: 9,  rating: 4.6, focus: 'Telemedicine',              category: 'Healthcare & Biomedical',     tier: 'Verified' },
  { id: 'skyops-swz',       name: 'SkyOps SWZ',         flag: '🇸🇿', country: 'Eswatini',     products: 4,  rating: 4.8, focus: 'DAL-A Safety Systems',      category: 'Autonomous & Aerial',         tier: 'Verified' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: 11 }}>
      {'★'.repeat(Math.floor(rating))}
      <span style={{ color: 'rgba(240,240,250,0.3)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

const COUNTRIES = ['All', 'Eswatini', 'South Africa', 'Botswana', 'Zimbabwe', 'Mozambique', 'Namibia', 'Zambia', 'Malawi']
const CATEGORIES = ['All Categories', 'Defence & Security', 'Agricultural Intelligence', 'Infrastructure & Energy', 'Civic & Government', 'Autonomous & Aerial', 'Healthcare & Biomedical']

export default function SuppliersPage() {
  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '48px 0 32px' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'rgba(240,240,250,1)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          VERIFIED SUPPLIER DIRECTORY
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(240,240,250,0.5)', margin: 0 }}>
          200+ SADC-verified technology suppliers — defence, agriculture, infrastructure, government
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {COUNTRIES.map(c => (
          <button key={c} style={{ fontSize: 11, padding: '6px 14px', background: c === 'All' ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,240,250,0.7)', cursor: 'pointer', letterSpacing: '0.05em' }}>
            {c}
          </button>
        ))}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', margin: '0 8px' }} />
        <select style={{ fontSize: 11, padding: '6px 14px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,240,250,0.7)', cursor: 'pointer' }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Supplier list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.04)' }}>
        {SUPPLIERS.map(s => (
          <div key={s.id} style={{ background: '#000', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 20, alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{s.flag}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(240,240,250,0.9)', margin: 0 }}>{s.name}</p>
                  <span style={{ fontSize: 9, background: s.tier === 'Premium' ? 'rgba(99,102,241,0.15)' : 'rgba(45,212,191,0.1)', border: `1px solid ${s.tier === 'Premium' ? 'rgba(99,102,241,0.4)' : 'rgba(45,212,191,0.3)'}`, color: s.tier === 'Premium' ? '#818cf8' : '#2dd4bf', padding: '2px 8px', letterSpacing: '0.1em' }}>
                    {s.tier === 'Premium' ? '★ PREMIUM' : '✓ VERIFIED'}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.4)', margin: '0 0 4px' }}>{s.country} · {s.focus}</p>
                <Stars rating={s.rating} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)', whiteSpace: 'nowrap' }}>{s.category}</p>
              <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.3)' }}>{s.products} products</p>
            </div>
            <Link href="/marketplace/rfq" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.9)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', whiteSpace: 'nowrap' }}>
              Request Quote
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: 1, marginTop: 32 }}>
        {[1,2,3,'...',18].map((p, i) => (
          <button key={i} style={{ padding: '0 14px', height: 36, background: p === 1 ? 'rgba(255,255,255,0.1)' : '#000', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,250,0.6)', fontSize: 12, cursor: 'pointer' }}>
            {p}
          </button>
        ))}
        <button style={{ padding: '0 16px', height: 36, background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,250,0.5)', fontSize: 12, cursor: 'pointer' }}>
          Next →
        </button>
      </div>
    </main>
  )
}
