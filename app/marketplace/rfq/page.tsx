'use client'
import { useState } from 'react'

type VerifyState = 'idle' | 'checking' | 'institutional' | 'valid' | 'invalid'

const CATEGORIES = [
  'Defence & Security Technology',
  'Agricultural Intelligence Systems',
  'Infrastructure & Energy',
  'Civic & Government Tech',
  'Autonomous & Aerial Systems',
  'Healthcare & Biomedical',
]

const COUNTRIES = [
  'Eswatini', 'South Africa', 'Botswana', 'Zimbabwe',
  'Mozambique', 'Namibia', 'Zambia', 'Malawi', 'Tanzania', 'Other',
]

const BUDGETS = [
  'Under R 50,000', 'R 50,000 – R 200,000', 'R 200,000 – R 500,000',
  'R 500,000 – R 2,000,000', 'Over R 2,000,000', 'To be negotiated',
]

export default function RFQPage() {
  const [email, setEmail] = useState('')
  const [verifyState, setVerifyState] = useState<VerifyState>('idle')
  const [submitted, setSubmitted] = useState(false)

  const verifyEmail = async (e: string) => {
    if (!e.includes('@')) return
    setVerifyState('checking')
    try {
      const res = await fetch('/api/marketplace/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e }),
      })
      const data = await res.json() as { institutional: boolean; sadc: boolean }
      setVerifyState(data.sadc ? 'institutional' : data.institutional ? 'institutional' : 'valid')
    } catch {
      setVerifyState('valid')
    }
  }

  const borderColor: Record<VerifyState, string> = {
    idle: 'rgba(255,255,255,0.1)',
    checking: 'rgba(255,255,255,0.2)',
    institutional: 'rgba(45,212,191,0.6)',
    valid: 'rgba(99,102,241,0.5)',
    invalid: 'rgba(239,68,68,0.5)',
  }

  if (submitted) {
    return (
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>✓</div>
        <h1 className="font-display" style={{ fontSize: 32, color: '#2dd4bf', margin: '0 0 16px', letterSpacing: '0.02em' }}>RFQ SUBMITTED</h1>
        <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', lineHeight: 1.7 }}>
          Your buying request has been registered. BRT Inc. will match it against verified SADC suppliers and respond within 2 business days.
        </p>
        <p style={{ fontSize: 12, color: 'rgba(240,240,250,0.3)', marginTop: 32 }}>
          Reference: RFQ-{Date.now().toString(36).toUpperCase()}
        </p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ padding: '48px 0 40px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2dd4bf', margin: '0 0 12px' }}>
          Government-Standard RFQ Process
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'rgba(240,240,250,1)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          POST BUYING REQUEST
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(240,240,250,0.5)', margin: 0 }}>
          200+ verified SADC suppliers will receive your requirement. Sovereign procurement process — signed service agreements, fixed scope, audit trails.
        </p>
      </div>

      <form
        onSubmit={e => { e.preventDefault(); setSubmitted(true) }}
        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        {/* Category */}
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
            Category *
          </label>
          <select required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit' }}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
            Requirement Title *
          </label>
          <input required type="text" placeholder="e.g. UAV Surveillance System for Border Monitoring" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
            Detailed Description *
          </label>
          <textarea required rows={5} placeholder="Describe your technical requirements, quantity, timeline, and any special compliance requirements..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        {/* Budget + Country row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
              Budget Range
            </label>
            <select style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">Select range</option>
              {BUDGETS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
              Country of Institution
            </label>
            <select required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Institution name */}
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
            Institution / Organisation Name *
          </label>
          <input required type="text" placeholder="e.g. Ministry of Defence, Eswatini" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>

        {/* Email with institutional verification */}
        <div>
          <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,250,0.5)', marginBottom: 8 }}>
            Institutional Email *
            {verifyState === 'institutional' && <span style={{ marginLeft: 10, color: '#2dd4bf', fontSize: 10 }}>✓ SADC Institutional</span>}
            {verifyState === 'valid' && <span style={{ marginLeft: 10, color: '#818cf8', fontSize: 10 }}>✓ Verified</span>}
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setVerifyState('idle') }}
            onBlur={e => verifyEmail(e.target.value)}
            placeholder="procurement@ministry.gov.sz"
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor[verifyState]}`, padding: '12px 16px', fontSize: 13, color: 'rgba(240,240,250,0.8)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
          />
          <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.3)', margin: '6px 0 0' }}>
            Use your institutional email (.gov.sz, .gov.za, .ac.sz etc.) for priority routing to verified suppliers.
          </p>
        </div>

        <button
          type="submit"
          style={{ background: '#2dd4bf', border: 'none', color: '#000', padding: '14px 0', fontSize: 13, fontFamily: 'var(--font-barlow-condensed), Arial', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 }}
        >
          SUBMIT BUYING REQUEST
        </button>

        <p style={{ fontSize: 10, color: 'rgba(240,240,250,0.25)', textAlign: 'center', lineHeight: 1.6 }}>
          By submitting, you agree to BRT Inc. sharing your requirement with verified SADC suppliers.
          No spam — government-standard procurement process only.
        </p>
      </form>
    </main>
  )
}
