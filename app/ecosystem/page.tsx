import Link from 'next/link'
import { EcosystemMap } from '@/components/ecosystem/EcosystemMap'

export const metadata = { title: 'Ecosystem Map — BRT Inc.' }

export default function EcosystemPage() {
  return (
    <main className="flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 h-16 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-white"
            style={{ color: 'var(--text-subtle)' }}
          >
            ← BRT Inc.
          </Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
            Ecosystem Map
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: '13 systems', color: 'var(--accent-2)' },
            { label: '8 NATS streams', color: 'var(--accent)' },
            { label: '1,466+ tests', color: '#10b981' },
            { label: 'SRL-6', color: 'var(--accent-game)' },
          ].map(s => (
            <span key={s.label} className="font-mono text-[10px]" style={{ color: s.color }}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Map fills remaining viewport */}
      <EcosystemMap />
    </main>
  )
}
