import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

const SUPPLIERS: Record<string, {
  name: string; flag: string; country: string; focus: string; category: string
  rating: number; products: number; tier: string; founded: string; employees: string
  about: string
  services: Array<{ title: string; description: string; price: string }>
}> = {
  'aerosystems-sa': {
    name: 'AeroSystems SA', flag: '🇿🇦', country: 'South Africa', focus: 'UAV + Avionics',
    category: 'Autonomous & Aerial', rating: 4.9, products: 12, tier: 'Premium',
    founded: '2019', employees: '45–80',
    about: 'AeroSystems SA designs and manufactures commercial UAV platforms and avionics for SADC defence forces and infrastructure operators. All systems comply with SACAA UAV regulations and MAVLink 2 protocol. Partners with BRT Inc. on DAL-A compliant flight stack integration.',
    services: [
      { title: 'Commercial UAV Platform', description: 'Fixed-wing and multirotor UAV platforms, payload up to 5kg, 45-min flight time', price: 'From R 280,000' },
      { title: 'Avionics Integration', description: 'MAVLink 2 avionics suite, autopilot integration, ground station software', price: 'From R 45,000' },
      { title: 'Fleet Management System', description: 'Multi-UAV fleet monitoring, mission planning, telemetry logging', price: 'R 8,500/mo' },
    ],
  },
  'securenet-swz': {
    name: 'SecureNet SWZ', flag: '🇸🇿', country: 'Eswatini', focus: 'Cybersecurity',
    category: 'Defence & Security', rating: 4.8, products: 7, tier: 'Verified',
    founded: '2021', employees: '12–25',
    about: 'SecureNet SWZ provides cybersecurity operations for SADC government institutions. Services include SOC-as-a-service, penetration testing, and security hardening for PHP/MySQL government portals. Based in Manzini, Eswatini — sovereign jurisdiction, sovereign hosting.',
    services: [
      { title: 'SOC-as-a-Service', description: '24/7 security operations centre, threat detection, incident response', price: 'From R 15,000/mo' },
      { title: 'Penetration Testing', description: 'Web application, API, network — CVSS-scored report, remediation guidance', price: 'From R 8,000' },
      { title: 'Security Hardening', description: 'Government portal hardening: CSP, RBAC, 2FA, audit logging', price: 'From R 5,500' },
    ],
  },
  'civictech-bw': {
    name: 'CivicTech BW', flag: '🇧🇼', country: 'Botswana', focus: 'e-Government',
    category: 'Civic & Government', rating: 4.8, products: 9, tier: 'Premium',
    founded: '2018', employees: '30–60',
    about: 'CivicTech BW builds e-government platforms for SADC ministries — digital citizen services, national registry systems, tax collection, and public procurement portals. Deployed in Botswana, Zimbabwe, and Zambia. Sovereign cloud hosting, GDPR-aligned data governance.',
    services: [
      { title: 'Citizen Services Portal', description: 'Multi-ministry portal: applications, payments, document requests, status tracking', price: 'From R 120,000' },
      { title: 'National Registry System', description: 'Birth, death, marriage, property registry with audit trail and digital signatures', price: 'From R 85,000' },
      { title: 'Procurement Platform', description: 'Public procurement management, supplier verification, e-tender system', price: 'From R 60,000' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(SUPPLIERS).map(id => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const s = SUPPLIERS[id]
  if (!s) return {}
  return {
    title: `${s.name} — SADC Marketplace`,
    description: s.about.slice(0, 160),
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: 13 }}>
      {'★'.repeat(Math.floor(rating))}
      <span style={{ color: 'rgba(240,240,250,0.4)', marginLeft: 6, fontSize: 12 }}>{rating} / 5.0</span>
    </span>
  )
}

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = SUPPLIERS[id]
  if (!s) notFound()

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Supplier hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 40 }}>{s.flag}</span>
            <span style={{ fontSize: 9, background: s.tier === 'Premium' ? 'rgba(99,102,241,0.15)' : 'rgba(45,212,191,0.1)', border: `1px solid ${s.tier === 'Premium' ? 'rgba(99,102,241,0.4)' : 'rgba(45,212,191,0.3)'}`, color: s.tier === 'Premium' ? '#818cf8' : '#2dd4bf', padding: '4px 12px', letterSpacing: '0.15em' }}>
              {s.tier === 'Premium' ? '★ PREMIUM VERIFIED' : '✓ SADC VERIFIED'}
            </span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'rgba(240,240,250,1)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            {s.name.toUpperCase()}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', margin: '0 0 16px' }}>
            {s.country} · {s.focus} · {s.category}
          </p>
          <Stars rating={s.rating} />
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            <div>
              <p style={{ fontSize: 20, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, color: 'rgba(240,240,250,0.9)', margin: 0 }}>{s.products}</p>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '2px 0 0' }}>Products</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, color: 'rgba(240,240,250,0.9)', margin: 0 }}>{s.founded}</p>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '2px 0 0' }}>Founded</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, color: 'rgba(240,240,250,0.9)', margin: 0 }}>{s.employees}</p>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', margin: '2px 0 0' }}>Employees</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/marketplace/rfq" style={{ background: '#2dd4bf', color: '#000', padding: '12px 32px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}>
            REQUEST QUOTE
          </Link>
          <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(240,240,250,0.7)', padding: '12px 32px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
            CONTACT SUPPLIER
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, paddingTop: 40 }}>
        <div>
          {/* About */}
          <section style={{ marginBottom: 48 }}>
            <h2 className="font-display" style={{ fontSize: 18, color: 'rgba(240,240,250,0.7)', margin: '0 0 16px', letterSpacing: '0.05em' }}>ABOUT</h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.6)', lineHeight: 1.7, margin: 0 }}>{s.about}</p>
          </section>

          {/* Services */}
          <section>
            <h2 className="font-display" style={{ fontSize: 18, color: 'rgba(240,240,250,0.7)', margin: '0 0 20px', letterSpacing: '0.05em' }}>PRODUCTS & SERVICES</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.04)' }}>
              {s.services.map(svc => (
                <div key={svc.title} style={{ background: '#000', padding: '24px 20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(240,240,250,0.9)', margin: '0 0 6px' }}>{svc.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.5)', margin: 0, lineHeight: 1.5 }}>{svc.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2dd4bf', margin: '0 0 8px', whiteSpace: 'nowrap' }}>{svc.price}</p>
                    <Link href="/marketplace/rfq" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.6)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 12px', whiteSpace: 'nowrap' }}>
                      Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside>
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '24px' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.4)', marginBottom: 20 }}>Supplier Details</p>
            {[
              { label: 'Country', value: `${s.flag} ${s.country}` },
              { label: 'Category', value: s.category },
              { label: 'Specialisation', value: s.focus },
              { label: 'Founded', value: s.founded },
              { label: 'Team Size', value: s.employees },
              { label: 'Products Listed', value: s.products.toString() },
              { label: 'Verification', value: s.tier },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 11, color: 'rgba(240,240,250,0.4)' }}>{row.label}</span>
                <span style={{ fontSize: 11, color: 'rgba(240,240,250,0.8)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <Link href="/marketplace/rfq" style={{ display: 'block', background: '#2dd4bf', color: '#000', padding: '14px', fontSize: 12, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', marginTop: 16 }}>
            POST RFQ TO THIS SUPPLIER
          </Link>
        </aside>
      </div>
    </main>
  )
}
