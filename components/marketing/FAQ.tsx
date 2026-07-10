'use client'
import { useState } from 'react'
import { ScrollScene } from './ScrollScene'

const FAQS = [
  {
    q: 'Do you work with international clients?',
    a: 'Yes. Most of my institutional clients are in Eswatini, but I work with organisations across the SADC region and internationally. Payments in ZAR, USD, or SZL.',
  },
  {
    q: 'How do you price projects?',
    a: 'Fixed price, scoped upfront. I don\'t do time-and-materials for project work — you get a quote before a line of code is written. Audits start from R8,000.',
  },
  {
    q: 'What\'s your delivery timeline?',
    a: 'Typical web projects: 3–6 weeks. Security audits: 1–2 weeks. Autonomous systems or AI pipelines: 6–12 weeks. Exact timeline is in your service agreement.',
  },
  {
    q: 'Can you take on urgent security work?',
    a: 'Yes, on a case-by-case basis. If you have an active incident or a hard compliance deadline, contact me directly via WhatsApp or email.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes. Standard NDA included in the service agreement for all projects involving sensitive government or defence data.',
  },
  {
    q: 'Do you provide ongoing maintenance?',
    a: 'Yes, via the monthly retainer. Includes feature development, security monitoring, and priority response on incidents.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <ScrollScene>
      <section id="faq" className="py-32 max-w-3xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>FAQ</p>
        <h2 className="text-4xl font-semibold mb-12">Common questions.</h2>
        <div className="space-y-0">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-5 flex items-center justify-between gap-4"
                aria-expanded={open === i}
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <span
                  className="text-lg flex-shrink-0 transition-transform"
                  style={{
                    color: 'var(--text-subtle)',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
          <div className="border-t" style={{ borderColor: 'var(--border)' }} />
        </div>
      </section>
    </ScrollScene>
  )
}
