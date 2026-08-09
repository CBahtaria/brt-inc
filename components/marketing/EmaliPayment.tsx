'use client'
import { useState } from 'react'

const EMALI_NUMBER = '+26879657744'

const inputClass = "w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-colors"
const inputStyle = { background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }

export function EmaliPayment() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = new FormData(e.currentTarget)
    const amountRand = Number(form.get('amount'))
    try {
      const res = await fetch('/api/emali/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: String(form.get('service')),
          amountCents: Math.round(amountRand * 100),
          payerName: String(form.get('name')),
          payerContact: String(form.get('contact')),
          emaliReference: String(form.get('reference')),
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="emali-payment" className="py-20 max-w-2xl mx-auto px-6">
      <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
        Pay via eMali
      </p>
      <h2 className="text-3xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
        Already paid? Submit your reference.
      </h2>

      {status === 'done' ? (
        <div className="border rounded-xl p-8 text-center" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
          <p className="font-mono text-sm" style={{ color: 'var(--accent)' }}>
            Reference received — we&apos;ll confirm shortly.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Send payment to <span style={{ color: 'var(--text)' }}>{EMALI_NUMBER}</span> via the eMali app, then enter your details below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="service" placeholder="Service (e.g. consultation)" required className={inputClass} style={inputStyle} />
            <input name="amount" type="number" step="0.01" min="0" placeholder="Amount (SZL)" required className={inputClass} style={inputStyle} />
            <input name="name" placeholder="Your name" required className={inputClass} style={inputStyle} />
            <input name="contact" placeholder="Your phone or email" required className={inputClass} style={inputStyle} />
            <input name="reference" placeholder="eMali transaction reference" required className={inputClass} style={inputStyle} />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 rounded-md text-white font-medium transition-colors disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit reference'}
            </button>
            {status === 'error' && (
              <p role="alert" className="text-red-400 text-sm text-center">
                Something went wrong — try again.
              </p>
            )}
          </form>
        </>
      )}
    </section>
  )
}
