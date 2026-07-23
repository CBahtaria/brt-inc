import Image from 'next/image'
import { ScrollScene } from './ScrollScene'

export function About() {
  const chips = ['DAL-A', 'SRL-6', 'TOTP 2FA', 'PostGIS', 'UE5 Nanite', 'AES-GCM-256']
  const stats = [
    { label: 'Year founded', value: '2021' },
    { label: 'Projects shipped', value: '13' },
    { label: 'SADC institutions', value: '6' },
    { label: 'Tests passing', value: '1,466+' },
  ]
  return (
    <ScrollScene>
      <section id="about" className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>About</p>
            <h2 className="text-4xl lg:text-5xl font-semibold mb-6">One engineer.<br />Institution-grade output.</h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Founded in Manzini in 2021. BRT Inc. serves SADC national institutions where software failures carry real-world consequences — defence operations, national data, civic infrastructure.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Every project begins with a service agreement. Every commit is signed. Every deployment has a runbook.
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map(c => (
                <span key={c} className="font-mono text-[11px] px-2.5 py-1 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)', background: 'var(--surface-1)' }}>{c}</span>
              ))}
            </div>
          </div>
          {/* Right */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map(s => (
                <div key={s.label} className="p-4 rounded-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                  <p className="text-3xl font-bold font-mono mb-1" style={{ color: 'var(--accent)' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Image src="/logo-render.png" alt="BRT Inc." width={180} height={180} className="rounded-xl" style={{ boxShadow: '0 0 40px rgba(45,212,191,0.12)' }} />
            </div>
          </div>
        </div>
      </section>
    </ScrollScene>
  )
}
