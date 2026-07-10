'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ScrollScene } from './ScrollScene'

const schema = z.object({
  name:    z.string().min(1, 'Name required'),
  email:   z.string().email('Valid email required'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Please write at least 10 characters'),
  _gotcha: z.string().max(0).optional(),
})
type FormValues = z.infer<typeof schema>

const inputClass = "w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-colors"
const inputStyle = { background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <ScrollScene>
      <section id="contact" className="py-32 max-w-2xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Contact</p>
        <h2 className="text-4xl font-semibold mb-10">Start the conversation.</h2>

        {status === 'success' ? (
          <div className="border rounded-xl p-8 text-center" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
            <p className="font-mono text-sm" style={{ color: 'var(--accent)' }}>
              Message received. I&apos;ll reply within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Honeypot */}
            <input type="text" {...register('_gotcha')} className="hidden" aria-hidden="true" tabIndex={-1} />

            <div>
              <input {...register('name')} placeholder="Name" className={inputClass} style={inputStyle} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email')} type="email" placeholder="Email" className={inputClass} style={inputStyle} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register('subject')} placeholder="Subject (optional)" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <textarea
                {...register('message')}
                placeholder="Message"
                rows={5}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 rounded-md text-white font-medium transition-colors disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
            {status === 'error' && (
              <p role="alert" className="text-red-400 text-sm text-center">
                Failed to send — please email charleskris9@gmail.com directly.
              </p>
            )}
          </form>
        )}
      </section>
    </ScrollScene>
  )
}
