import { ScrollScene } from './ScrollScene'

const TESTIMONIALS = [
  {
    quote: 'The security audit uncovered 3 critical findings we had no idea about. All patched within the engagement window with zero downtime.',
    author: 'Defence Systems Lead',
    org: 'SADC Military Institution',
  },
  {
    quote: 'BRT Inc. replaced our spreadsheet-based scheduling with a live booking system. The staff onboarded in an afternoon.',
    author: 'Studio Owner',
    org: 'Studio P Barbershop, Manzini',
  },
  {
    quote: 'The macro dashboard runs 10,000 Monte Carlo simulations in under 2 seconds. The finance team uses it every morning.',
    author: 'Senior Economist',
    org: 'Eswatini Government',
  },
]

export function Testimonials() {
  return (
    <ScrollScene>
      <section id="testimonials" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Testimonials</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-12">What clients say.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-medium">{t.author}</p>
                <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>{t.org}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
