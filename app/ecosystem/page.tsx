import Link from 'next/link'
import { EcosystemMapClient } from '@/components/ecosystem/EcosystemMapClient'

export const metadata = { title: 'Ecosystem Map — BRT Inc.' }

export default function EcosystemPage() {
  return (
    <main className="flex flex-col" style={{ minHeight: '100vh' }}>
      <div
        className="flex items-center justify-between px-4 md:px-6 h-16 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'rgba(9,9,11,0.96)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-white"
            style={{ color: 'var(--text-subtle)' }}
          >
            ← BRT Inc.
          </Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
            Ecosystem
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 md:gap-6">
          {[
            { label: '14 systems',    color: 'var(--accent-2)' },
            { label: '8 NATS streams', color: 'var(--accent)' },
            { label: '1,466+ tests',  color: '#10b981' },
            { label: 'SRL-6',         color: 'var(--accent-game)' },
          ].map(s => (
            <span key={s.label} className="font-mono text-[10px]" style={{ color: s.color }}>{s.label}</span>
          ))}
        </div>
      </div>

      <EcosystemMapClient />
    </main>
  )
}
