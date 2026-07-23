import { ScrollScene } from './ScrollScene'

const TESTIMONIALS = [
  {
    quote: 'The security audit uncovered 3 critical findings we had no idea about. All patched within the engagement window with zero downtime.',
    author: 'Defence Systems Lead',
    org: 'SADC Military Institution',
    initials: 'DSL',
    color: '#2dd4bf',
  },
  {
    quote: 'BRT Inc. replaced our spreadsheet-based scheduling with a live booking system. The staff onboarded in an afternoon.',
    author: 'Studio Owner',
    org: 'Studio P Barbershop, Manzini',
    initials: 'SO',
    color: '#6366f1',
  },
  {
    quote: 'The macro dashboard runs 10,000 Monte Carlo simulations in under 2 seconds. The finance team uses it every morning.',
    author: 'Senior Economist',
    org: 'Eswatini Government',
    initials: 'SE',
    color: '#10b981',
  },
]

const TESTIMONIALS_BOTTOM = [
  {
    quote: 'The codebase arrived with a written audit report and zero open findings. That is the first time we have seen that from any vendor.',
    author: 'Infrastructure Lead',
    org: 'SADC Civic Institution',
    initials: 'IL',
    color: '#f59e0b',
  },
  {
    quote: 'Our booking conflicts dropped to zero from day one. The system handles concurrent reservations correctly — something our previous solution never managed.',
    author: 'Operations Manager',
    org: 'Service Business, Mbabane',
    initials: 'OM',
    color: '#f43f5e',
  },
]

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div
      className="p-6 rounded-xl border border-t-2"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
        borderTopColor: t.color,
      }}
    >
      <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: t.color + '20',
            border: `1px solid ${t.color}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="font-mono text-xs font-bold" style={{ color: t.color }}>{t.initials}</span>
        </div>
        <div>
          <p className="text-sm font-medium">{t.author}</p>
          <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>{t.org}</p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <ScrollScene>
      <section id="testimonials" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Testimonials</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-12">What clients say.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {TESTIMONIALS_BOTTOM.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
