'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Runbook {
  id: string
  title: string
  category: string
  content: string
  last_used_at: string | null
}

export function RunbookList() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([])
  const [selected, setSelected] = useState<Runbook | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('runbook_templates')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRunbooks(data ?? [])
        setLoading(false)
      })
  }, [])

  const copyContent = async () => {
    if (!selected?.content) return
    await navigator.clipboard.writeText(selected.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="flex border rounded-xl overflow-hidden"
      style={{ borderColor: 'var(--border)', height: 'calc(100vh - 8rem)' }}
    >
      {/* Left: list */}
      <div className="w-64 flex-shrink-0 border-r overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
        {loading && (
          <p className="p-4 text-xs" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        )}
        {runbooks.map(r => (
          <button
            key={r.id}
            onClick={() => setSelected(r)}
            className="w-full text-left px-4 py-3 border-b transition-colors"
            style={{
              borderColor: 'var(--border)',
              background: selected?.id === r.id ? 'var(--surface-2)' : 'transparent',
              color: selected?.id === r.id ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <div className="font-medium text-sm truncate">{r.title}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{r.category}</div>
          </button>
        ))}
        {!loading && runbooks.length === 0 && (
          <p className="p-4 text-xs" style={{ color: 'var(--text-muted)' }}>No runbooks yet.</p>
        )}
      </div>

      {/* Right: content */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{selected.title}</h2>
              <button
                onClick={copyContent}
                className="font-mono text-xs px-3 py-1.5 rounded border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre
              className="whitespace-pre-wrap text-xs leading-relaxed font-mono p-4 rounded-lg"
              style={{ background: 'var(--surface-1)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {selected.content}
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>Select a runbook from the left.</p>
          </div>
        )}
      </div>
    </div>
  )
}
