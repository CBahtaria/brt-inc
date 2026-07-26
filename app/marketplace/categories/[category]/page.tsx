import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

const CATEGORY_DATA: Record<string, {
  label: string
  description: string
  accent: string
  suppliers: Array<{ name: string; country: string; flag: string; products: number; rating: number; focus: string }>
}> = {
  'defence-security': {
    label: 'Defence & Security Technology',
    description: 'Sovereign-grade cybersecurity, C2 platforms, surveillance, threat detection, and physical security for SADC defence forces and national security institutions.',
    accent: '#f87171',
    suppliers: [
      { name: 'SecureNet SWZ',    country: 'Eswatini',     flag: '🇸🇿', products: 7,  rating: 4.8, focus: 'Cybersecurity & SOC' },
      { name: 'DefendTech ZA',    country: 'South Africa', flag: '🇿🇦', products: 14, rating: 4.7, focus: 'Physical Security Systems' },
      { name: 'SentinelPro BW',   country: 'Botswana',     flag: '🇧🇼', products: 9,  rating: 4.6, focus: 'Threat Intelligence' },
      { name: 'CipherSys NA',     country: 'Namibia',      flag: '🇳🇦', products: 6,  rating: 4.5, focus: 'Comms Encryption' },
      { name: 'GuardNet ZW',      country: 'Zimbabwe',     flag: '🇿🇼', products: 11, rating: 4.6, focus: 'Border Surveillance' },
      { name: 'SADC Shield MZ',   country: 'Mozambique',   flag: '🇲🇿', products: 8,  rating: 4.4, focus: 'OPSEC Consulting' },
    ],
  },
  'agricultural-intelligence': {
    label: 'Agricultural Intelligence Systems',
    description: 'Precision agriculture, crop disease detection, satellite analytics, IoT soil sensors, and AI-driven yield forecasting for SADC smallholder and commercial farmers.',
    accent: '#4ade80',
    suppliers: [
      { name: 'AgriSense ZW',     country: 'Zimbabwe',     flag: '🇿🇼', products: 15, rating: 4.7, focus: 'Precision Agriculture' },
      { name: 'CropAI ZA',        country: 'South Africa', flag: '🇿🇦', products: 12, rating: 4.8, focus: 'Disease Detection ML' },
      { name: 'SoilTech ZM',      country: 'Zambia',       flag: '🇿🇲', products: 8,  rating: 4.5, focus: 'IoT Soil Sensors' },
      { name: 'FarmSat MW',       country: 'Malawi',       flag: '🇲🇼', products: 6,  rating: 4.4, focus: 'Satellite Imagery' },
      { name: 'YieldBot SWZ',     country: 'Eswatini',     flag: '🇸🇿', products: 5,  rating: 4.6, focus: 'AI Yield Forecast' },
    ],
  },
  'infrastructure-energy': {
    label: 'Infrastructure & Energy',
    description: 'Power grid management, renewable energy systems, water treatment, road infrastructure monitoring, and SCADA systems for SADC infrastructure operators.',
    accent: '#fbbf24',
    suppliers: [
      { name: 'GridTech MZ',      country: 'Mozambique',   flag: '🇲🇿', products: 11, rating: 4.6, focus: 'Power Grid SCADA' },
      { name: 'SolarNet ZA',      country: 'South Africa', flag: '🇿🇦', products: 18, rating: 4.9, focus: 'Solar Farm Management' },
      { name: 'AquaSys NA',       country: 'Namibia',      flag: '🇳🇦', products: 7,  rating: 4.5, focus: 'Water Treatment IoT' },
      { name: 'RoadSense BW',     country: 'Botswana',     flag: '🇧🇼', products: 9,  rating: 4.4, focus: 'Road Infrastructure' },
      { name: 'EnergyCo ZM',      country: 'Zambia',       flag: '🇿🇲', products: 13, rating: 4.7, focus: 'Renewable Systems' },
      { name: 'GridMonitor SWZ',  country: 'Eswatini',     flag: '🇸🇿', products: 5,  rating: 4.5, focus: 'Load Balancing' },
    ],
  },
  'civic-government': {
    label: 'Civic & Government Tech',
    description: 'e-Government platforms, national registry systems, digital ID, tax collection software, and citizen services portals for SADC government ministries.',
    accent: '#818cf8',
    suppliers: [
      { name: 'CivicTech BW',     country: 'Botswana',     flag: '🇧🇼', products: 9,  rating: 4.8, focus: 'e-Government Portals' },
      { name: 'GovSys ZA',        country: 'South Africa', flag: '🇿🇦', products: 21, rating: 4.7, focus: 'Digital Identity' },
      { name: 'eServe SWZ',       country: 'Eswatini',     flag: '🇸🇿', products: 6,  rating: 4.6, focus: 'Citizen Services' },
      { name: 'TaxTech ZW',       country: 'Zimbabwe',     flag: '🇿🇼', products: 8,  rating: 4.5, focus: 'Revenue Collection' },
    ],
  },
  'autonomous-aerial': {
    label: 'Autonomous & Aerial Systems',
    description: 'Commercial UAV platforms, DAL-A certified flight systems, aerial surveillance, precision delivery drones, and autonomous inspection systems.',
    accent: '#2dd4bf',
    suppliers: [
      { name: 'AeroSystems SA',   country: 'South Africa', flag: '🇿🇦', products: 12, rating: 4.9, focus: 'UAV + Avionics' },
      { name: 'DroneNet ZA',      country: 'South Africa', flag: '🇿🇦', products: 8,  rating: 4.7, focus: 'Surveillance UAVs' },
      { name: 'FlyTech BW',       country: 'Botswana',     flag: '🇧🇼', products: 5,  rating: 4.6, focus: 'Delivery Drones' },
      { name: 'SkyOps SWZ',       country: 'Eswatini',     flag: '🇸🇿', products: 4,  rating: 4.8, focus: 'DAL-A Safety Systems' },
    ],
  },
  'healthcare-biomedical': {
    label: 'Healthcare & Biomedical',
    description: 'Medical device software, patient management systems, disease surveillance platforms, telemedicine infrastructure, and laboratory information systems.',
    accent: '#c084fc',
    suppliers: [
      { name: 'MedTech ZA',       country: 'South Africa', flag: '🇿🇦', products: 16, rating: 4.8, focus: 'Medical Device SW' },
      { name: 'HealthNet MW',     country: 'Malawi',       flag: '🇲🇼', products: 7,  rating: 4.5, focus: 'Patient Management' },
      { name: 'TelemED ZM',       country: 'Zambia',       flag: '🇿🇲', products: 9,  rating: 4.6, focus: 'Telemedicine' },
      { name: 'LabSys MZ',        country: 'Mozambique',   flag: '🇲🇿', products: 5,  rating: 4.4, focus: 'Lab Information' },
      { name: 'BioSurv BW',       country: 'Botswana',     flag: '🇧🇼', products: 8,  rating: 4.7, focus: 'Disease Surveillance' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map(category => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const data = CATEGORY_DATA[category]
  if (!data) return {}
  return {
    title: `${data.label} — SADC Marketplace`,
    description: data.description,
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: 11 }}>
      {'★'.repeat(Math.floor(rating))}
      <span style={{ color: 'rgba(240,240,250,0.3)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const data = CATEGORY_DATA[category]
  if (!data) notFound()

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Category hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 40px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: data.accent, margin: '0 0 12px' }}>
          Category
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'rgba(240,240,250,1)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
          {data.label.toUpperCase()}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', maxWidth: 600, margin: '0 0 24px', lineHeight: 1.6 }}>
          {data.description}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/marketplace/rfq" style={{ background: data.accent, color: '#000', padding: '10px 24px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
            POST RFQ
          </Link>
          <Link href="/marketplace/suppliers" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(240,240,250,0.7)', padding: '10px 24px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ALL SUPPLIERS
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, paddingTop: 40 }}>
        {/* Sidebar filters */}
        <aside>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', marginBottom: 16 }}>Filter</p>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.6)', marginBottom: 12 }}>By Country</p>
            {['🇸🇿 Eswatini', '🇿🇦 South Africa', '🇧🇼 Botswana', '🇿🇼 Zimbabwe', '🇲🇿 Mozambique', '🇳🇦 Namibia', '🇿🇲 Zambia', '🇲🇼 Malawi'].map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#2dd4bf' }} />
                <span style={{ fontSize: 12, color: 'rgba(240,240,250,0.6)' }}>{c}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.6)', marginBottom: 12 }}>By Rating</p>
            {['4.5+', '4.0+', '3.5+'].map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                <input type="radio" name="rating" style={{ accentColor: '#2dd4bf' }} />
                <span style={{ fontSize: 12, color: 'rgba(240,240,250,0.6)' }}>★ {r}</span>
              </label>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.6)', marginBottom: 12 }}>Verification</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#2dd4bf' }} />
              <span style={{ fontSize: 12, color: '#2dd4bf' }}>✓ SADC Verified only</span>
            </label>
          </div>
        </aside>

        {/* Supplier grid */}
        <div>
          <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.4)', marginBottom: 20 }}>
            {data.suppliers.length} verified suppliers in this category
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
            {data.suppliers.map(s => (
              <div key={s.name} style={{ background: '#000', padding: '24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.flag}</span>
                  <span style={{ fontSize: 9, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', color: '#2dd4bf', padding: '2px 6px', letterSpacing: '0.1em' }}>
                    ✓ VERIFIED
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,240,250,0.9)', margin: '0 0 4px' }}>{s.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)', margin: '0 0 4px' }}>{s.country}</p>
                <p style={{ fontSize: 11, color: 'rgba(240,240,250,0.5)', margin: '0 0 12px' }}>{s.focus}</p>
                <Stars rating={s.rating} />
                <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.3)', margin: '8px 0 16px' }}>{s.products} products</p>
                <Link href="/marketplace/rfq" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: data.accent, textDecoration: 'none', border: `1px solid ${data.accent}40`, padding: '6px 14px' }}>
                  Request Quote
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', gap: 1, marginTop: 24 }}>
            {[1, 2, 3].map(p => (
              <button key={p} style={{ width: 36, height: 36, background: p === 1 ? 'rgba(255,255,255,0.1)' : '#000', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,250,0.7)', fontSize: 12, cursor: 'pointer' }}>
                {p}
              </button>
            ))}
            <button style={{ padding: '0 16px', height: 36, background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,240,250,0.5)', fontSize: 12, cursor: 'pointer' }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
