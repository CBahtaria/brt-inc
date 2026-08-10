'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type PaymentReference = {
  id: string
  service_slug: string
  amount_cents: number
  currency: string
  payer_name: string
  payer_contact: string
  emali_reference: string
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
}

type RowMessage = { id: string; text: string; tone: 'info' | 'error' }

const STATUS_CLASS: Record<PaymentReference['status'], string> = {
  pending: 'text-accent-game',
  confirmed: 'text-accent-2',
  rejected: 'text-red-400',
}

const SESSION_EXPIRED = 'Session expired — sign in again before deciding.'

function formatAmount(cents: number, currency: string) {
  const value = (cents / 100).toFixed(2)
  return currency === 'SZL' ? `E${value}` : `${currency} ${value}`
}

export function EmaliReferences() {
  const [supabase] = useState(() => createClient())
  const [refs, setRefs] = useState<PaymentReference[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  // Per-row, not a single id: two rows can be in flight at once, and one finishing
  // must not re-enable the other's buttons mid-request.
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(() => new Set())
  const [message, setMessage] = useState<RowMessage | null>(null)

  const load = useCallback(() => {
    return supabase
      .from('payment_references')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setLoadError(true)
          setRefs([])
        } else {
          setLoadError(false)
          setRefs((data ?? []) as PaymentReference[])
        }
        setLoading(false)
      })
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function act(id: string, action: 'confirm' | 'reject') {
    if (busyIds.has(id)) return
    setBusyIds(prev => new Set(prev).add(id))
    setMessage(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ id, text: SESSION_EXPIRED, tone: 'error' })
        return
      }

      let res: Response
      try {
        res = await fetch(`/api/emali/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action }),
        })
      } catch {
        setMessage({ id, text: 'Network error — nothing was changed. Try again.', tone: 'error' })
        return
      }

      // 404 means the row was already confirmed or rejected — a real outcome of two
      // people (or two tabs) deciding at once, not a failure. Show it and re-sync.
      if (res.status === 404) {
        setMessage({ id, text: 'Already decided by someone else — refreshing list.', tone: 'info' })
        await load()
        return
      }

      if (!res.ok) {
        setMessage({
          id,
          text: res.status === 401
            ? SESSION_EXPIRED
            : 'Could not update this reference — nothing was changed.',
          tone: 'error',
        })
        return
      }

      await load()
    } catch {
      // getSession() or the reload threw. The decision may or may not have landed,
      // so the wording must not claim either — but the row must never stay stuck.
      setMessage({ id, text: 'Something went wrong — reload the page to see the current status.', tone: 'error' })
    } finally {
      setBusyIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Loading payment references…</p>
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <p role="alert" className="text-sm text-red-400">
          Could not load payment references.
        </p>
        <button
          onClick={() => { setLoading(true); load() }}
          className="mt-3 rounded-md border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent/50 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const pendingCount = refs.filter(r => r.status === 'pending').length

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-text-subtle">
        {pendingCount} pending · {refs.length} total
      </p>

      {refs.length === 0 && (
        <p className="text-sm text-text-muted">No payment references submitted yet.</p>
      )}

      {refs.map(r => (
        <div
          key={r.id}
          className="rounded-xl border border-border bg-surface-1 p-4 flex flex-col gap-1"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-text">
              {r.payer_name} <span className="text-text-muted">({r.payer_contact})</span> — {r.service_slug}
            </p>
            <p className="font-mono text-sm text-text">{formatAmount(r.amount_cents, r.currency)}</p>
          </div>

          <p className="text-xs text-text-muted">
            Ref <span className="font-mono text-text">{r.emali_reference}</span>
            {' · '}
            <span className={`font-mono uppercase ${STATUS_CLASS[r.status]}`}>{r.status}</span>
            {' · '}
            {new Date(r.created_at).toLocaleString('en-GB')}
          </p>

          {r.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => act(r.id, 'confirm')}
                disabled={busyIds.has(r.id)}
                aria-busy={busyIds.has(r.id)}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {busyIds.has(r.id) ? 'Working…' : 'Confirm'}
              </button>
              <button
                onClick={() => act(r.id, 'reject')}
                disabled={busyIds.has(r.id)}
                aria-busy={busyIds.has(r.id)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                {busyIds.has(r.id) ? 'Working…' : 'Reject'}
              </button>
            </div>
          )}

          {message?.id === r.id && (
            <p
              role={message.tone === 'error' ? 'alert' : 'status'}
              className={`text-xs mt-2 ${message.tone === 'error' ? 'text-red-400' : 'text-text-muted'}`}
            >
              {message.text}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
