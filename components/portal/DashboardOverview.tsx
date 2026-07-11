'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Stats {
  totalClients: number
  activeClients: number
  totalRevenue: number
  openProposals: number
}

interface RecentClient {
  id: string
  name: string
  stage: string
  value: number
  service: string
}

const STAGE_COLOR: Record<string, string> = {
  'Lead': 'var(--text-subtle)',
  'Qualified': 'var(--accent-2)',
  'Proposal Sent': 'var(--accent)',
  'Active': '#4ade80',
  'Complete': 'var(--text-muted)',
}

const QUICK_LINKS = [
  { href: '/crm',       label: 'CRM',           icon: '◉', desc: 'Manage leads and clients' },
  { href: '/proposals', label: 'Proposals',      icon: '◈', desc: 'Draft and send proposals' },
  { href: '/invoices',  label: 'Invoices',       icon: '◇', desc: 'Build and print invoices' },
  { href: '/runbooks',  label: 'Runbooks',       icon: '◫', desc: 'SOP and runbook templates' },
  { href: '/status',    label: 'Status',         icon: '◎', desc: 'Service health monitor' },
  { href: '/assets',    label: 'Asset Generator',icon: '◐', desc: 'Generate images and video' },
]

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase.from('clients').select('id, stage, value'),
      supabase.from('proposals').select('id, status'),
      supabase.from('invoices').select('total, paid_at'),
      supabase.from('clients').select('id, name, stage, value, service').order('created_at', { ascending: false }).limit(5),
    ]).then(([clientsRes, proposalsRes, invoicesRes, recentRes]) => {
      const clients = clientsRes.data ?? []
      const proposals = proposalsRes.data ?? []
      const invoices = invoicesRes.data ?? []

      setStats({
        totalClients: clients.length,
        activeClients: clients.filter(c => c.stage === 'Active').length,
        totalRevenue: invoices.filter(i => i.paid_at).reduce((s, i) => s + (i.total ?? 0), 0),
        openProposals: proposals.filter(p => p.status === 'draft' || p.status === 'sent').length,
      })
      setRecent(recentRes.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: 'var(--surface-1)', height: 80 }} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total clients', value: stats?.totalClients ?? 0, suffix: '', accent: false },
          { label: 'Active clients', value: stats?.activeClients ?? 0, suffix: '', accent: true },
          { label: 'Open proposals', value: stats?.openProposals ?? 0, suffix: '', accent: false },
          { label: 'Revenue collected', value: stats?.totalRevenue ?? 0, prefix: 'R', format: true, accent: true },
        ].map(({ label, value, suffix, prefix, format, accent }) => (
          <div key={label} className="rounded-xl p-5 border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>{label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}>
              {prefix ?? ''}{format ? (value as number).toLocaleString() : value}{suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>Tools</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-start gap-3 p-3 rounded-xl border transition-colors group"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
              >
                <span className="text-base mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>{l.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{l.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{l.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent clients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>Recent clients</p>
            <Link href="/crm" className="font-mono text-xs" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {recent.length === 0 ? (
              <p className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>No clients yet.</p>
            ) : (
              recent.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--surface-1)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{c.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs" style={{ color: STAGE_COLOR[c.stage] ?? 'var(--text-muted)' }}>{c.stage}</p>
                    <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>R{(c.value ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
