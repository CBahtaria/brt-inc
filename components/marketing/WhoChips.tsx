import { ScrollScene } from './ScrollScene'

const WHO = [
  'National defence forces',
  'Government ministries',
  'National libraries',
  'Civic institutions',
  'Royal households',
  'SADC enterprises',
]

export function WhoChips() {
  return (
    <ScrollScene>
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>Built for</p>
        <div className="flex flex-wrap gap-3">
          {WHO.map(w => (
            <span
              key={w}
              className="px-4 py-2 rounded-full text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-1)' }}
            >
              {w}
            </span>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
