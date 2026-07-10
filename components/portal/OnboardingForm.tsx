'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

const schema = z.object({
  company:       z.string().min(1, 'Company required'),
  contact_name:  z.string().min(1, 'Name required'),
  email:         z.string().email('Valid email required'),
  phone:         z.string().optional(),
  project_type:  z.string().min(1, 'Select a project type'),
  budget_range:  z.string().optional(),
  timeline:      z.string().optional(),
  how_found:     z.string().optional(),
  notes:         z.string().optional(),
})
type FormValues = z.infer<typeof schema>

const inputClass = "w-full px-4 py-3 rounded-md text-sm focus:outline-none"
const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }
const labelStyle = { color: 'var(--text-subtle)', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 4 }

export function OnboardingForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setStatus('submitting')
    const supabase = createClient()
    const { error } = await supabase.from('onboarding_submissions').insert(data)
    if (error) { setStatus('error'); return }

    // Best-effort email notification — don't block on failure
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'charleskris9@gmail.com',
        subject: `[Onboarding] ${data.company} — ${data.project_type}`,
        html: `<p>New brief from <strong>${data.contact_name}</strong> at ${data.company}.<br>Email: ${data.email}<br>Type: ${data.project_type}<br>Budget: ${data.budget_range ?? '—'}</p>`,
        type: 'notification',
      }),
    }).catch(() => null)

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="border rounded-xl p-8 text-center" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
        <h2 className="font-mono text-sm mb-2" style={{ color: 'var(--accent)' }}>Brief Received</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>I&apos;ll reply with a fixed-price quote within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <div>
        <label style={labelStyle}>Company *</label>
        <input {...register('company')} placeholder="BRT Inc." className={inputClass} style={inputStyle} />
        {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Contact Name *</label>
          <input {...register('contact_name')} placeholder="Charles Bartaria" className={inputClass} style={inputStyle} />
          {errors.contact_name && <p className="text-red-400 text-xs mt-1">{errors.contact_name.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} style={inputStyle} />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label style={labelStyle}>Phone</label>
        <input {...register('phone')} type="tel" placeholder="+268 7000 0000" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Project Type *</label>
        <select {...register('project_type')} className={inputClass} style={inputStyle}>
          <option value="">Select…</option>
          {['Web App', 'Mobile App', 'Security Audit', 'Data Science / AI', 'DevOps / Infrastructure', 'Business Software', 'C2 / Defence System', 'Other'].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.project_type && <p className="text-red-400 text-xs mt-1">{errors.project_type.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Budget Range</label>
          <select {...register('budget_range')} className={inputClass} style={inputStyle}>
            <option value="">Select…</option>
            {['Under R5,000', 'R5,000–R15,000', 'R15,000–R50,000', 'R50,000+', 'Prefer to discuss'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>How did you find us?</label>
          <select {...register('how_found')} className={inputClass} style={inputStyle}>
            <option value="">Select…</option>
            {['LinkedIn', 'WhatsApp referral', 'GitHub', 'Google', 'Word of mouth', 'Other'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Timeline</label>
        <input {...register('timeline')} placeholder="e.g. 3 months, ASAP, by end of Q3" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Additional Notes</label>
        <textarea {...register('notes')} placeholder="Any special requirements…" rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 rounded-md text-white font-medium transition-colors disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Brief'}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-red-400 text-sm text-center">
          Submission failed — please email charleskris9@gmail.com directly.
        </p>
      )}
    </form>
  )
}
