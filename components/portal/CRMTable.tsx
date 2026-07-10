'use client'
import { useEffect, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { createClient } from '@/lib/supabase'

interface Client {
  id: string
  name: string
  email: string
  stage: string
  service: string
  value: number
  follow_up_date: string | null
  source: string | null
  notes: string | null
}

const STAGE_COLOR: Record<string, string> = {
  'Lead':          'var(--text-subtle)',
  'Qualified':     'var(--accent-2)',
  'Proposal Sent': 'var(--accent)',
  'Active':        '#4ade80',
  'Complete':      'var(--text-muted)',
}

const col = createColumnHelper<Client>()

const COLUMNS = [
  col.accessor('name', {
    header: 'Name',
    cell: i => <span className="font-medium text-sm">{i.getValue()}</span>,
  }),
  col.accessor('email', {
    header: 'Email',
    cell: i => <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{i.getValue()}</span>,
  }),
  col.accessor('stage', {
    header: 'Stage',
    cell: i => (
      <span className="font-mono text-xs" style={{ color: STAGE_COLOR[i.getValue()] ?? 'var(--text-muted)' }}>
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor('service', {
    header: 'Service',
    cell: i => <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{i.getValue()}</span>,
  }),
  col.accessor('value', {
    header: 'Value (ZAR)',
    cell: i => <span className="font-mono text-xs">R{(i.getValue() ?? 0).toLocaleString()}</span>,
  }),
]

export function CRMTable() {
  const [data, setData] = useState<Client[]>([])
  const [selected, setSelected] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data: rows }) => {
        setData(rows ?? [])
        setLoading(false)
      })
  }, [])

  const table = useReactTable({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading clients…</p>
  }

  return (
    <div className="flex gap-6">
      {/* Table */}
      <div className="flex-1 overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest"
                    style={{ color: 'var(--text-subtle)' }}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => setSelected(row.original)}
                className="border-b last:border-0 cursor-pointer transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  background: selected?.id === row.original.id ? 'var(--surface-2)' : 'transparent',
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No clients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="w-72 flex-shrink-0 border rounded-xl p-5 h-fit sticky top-20"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-sm">{selected.name}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-sm"
              style={{ color: 'var(--text-subtle)' }}
              aria-label="Close"
            >✕</button>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Email',    value: selected.email },
              { label: 'Stage',    value: selected.stage },
              { label: 'Service',  value: selected.service },
              { label: 'Value',    value: `R${(selected.value ?? 0).toLocaleString()}` },
              { label: 'Source',   value: selected.source ?? '—' },
              { label: 'Follow up',value: selected.follow_up_date ?? '—' },
            ].map(r => (
              <div key={r.label}>
                <span className="block mb-0.5 font-mono uppercase tracking-widest text-[10px]" style={{ color: 'var(--text-subtle)' }}>{r.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{r.value}</span>
              </div>
            ))}
            {selected.notes && (
              <div>
                <span className="block mb-0.5 font-mono uppercase tracking-widest text-[10px]" style={{ color: 'var(--text-subtle)' }}>Notes</span>
                <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>{selected.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
