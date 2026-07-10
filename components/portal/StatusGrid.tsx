'use client'
import { useEffect, useState, useCallback } from 'react'

interface ServiceStatus {
  name: string
  status: 'checking' | 'ok' | 'down'
  latencyMs?: number
  checkedAt?: string
}

const SERVICES = ['Vercel', 'Supabase DB', 'Resend Email', 'GitHub', 'Stripe'] as const

async function checkService(name: string): Promise<ServiceStatus> {
  const t0 = Date.now()
  try {
    switch (name) {
      case 'Vercel':
        await fetch('/api/healthcheck', { method: 'HEAD' })
        break
      case 'Supabase DB': {
        const { createClient } = await import('@/lib/supabase')
        const sb = createClient()
        const { error } = await sb.from('clients').select('id', { count: 'exact', head: true })
        if (error) throw error
        break
      }
      case 'GitHub':
        await fetch('https://www.githubstatus.com/api/v2/status.json')
        break
      case 'Stripe':
        await fetch('https://status.stripe.com/api/v2/status.json')
        break
      case 'Resend Email': {
        const res = await fetch('/api/healthcheck')
        if (!res.ok) throw new Error('healthcheck failed')
        break
      }
    }
    return { name, status: 'ok', latencyMs: Date.now() - t0, checkedAt: new Date().toISOString() }
  } catch {
    return { name, status: 'down', latencyMs: Date.now() - t0, checkedAt: new Date().toISOString() }
  }
}

const DOT_COLOR = {
  ok:       '#4ade80',
  down:     '#f87171',
  checking: 'var(--text-subtle)',
}

export function StatusGrid() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>(
    SERVICES.map(name => ({ name, status: 'checking' as const }))
  )

  const checkAll = useCallback(async () => {
    const results = await Promise.allSettled(SERVICES.map(checkService))
    setStatuses(results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { name: SERVICES[i], status: 'down' as const }
    ))
  }, [])

  useEffect(() => {
    checkAll()
    const id = setInterval(checkAll, 30_000)
    return () => clearInterval(id)
  }, [checkAll])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statuses.map(s => (
        <div
          key={s.name}
          className="border rounded-xl p-5"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: DOT_COLOR[s.status],
                animation: s.status === 'checking' ? 'pulse 2s infinite' : 'none',
              }}
            />
            <h3 className="font-medium text-sm">{s.name}</h3>
            <span
              className="ml-auto font-mono text-xs capitalize"
              style={{ color: 'var(--text-subtle)' }}
            >
              {s.status}
            </span>
          </div>
          {s.latencyMs != null && (
            <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>
              {s.latencyMs}ms
              {s.checkedAt && ` · ${new Date(s.checkedAt).toLocaleTimeString()}`}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
