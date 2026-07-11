'use client'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

interface Client { id: string; name: string; email: string }

const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  amount: z.coerce.number().min(0),
})

const schema = z.object({
  client_id: z.string().min(1, 'Select a client'),
  title: z.string().min(1, 'Required'),
  scope: z.string().min(1, 'Required'),
  line_items: z.array(lineItemSchema).min(1, 'Add at least one item'),
})
type FormValues = z.infer<typeof schema>

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function ProposalEditor() {
  const [clients, setClients] = useState<Client[]>([])
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_id: '',
      title: '',
      scope: '',
      line_items: [{ description: '', amount: 0 }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'line_items' })

  const values = watch()
  const total = values.line_items?.reduce((sum, li) => sum + (Number(li.amount) || 0), 0) ?? 0
  const selectedClient = clients.find(c => c.id === values.client_id)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('clients').select('id, name, email').order('name').then(({ data }) => setClients(data ?? []))
  }, [])

  async function onSave(data: FormValues) {
    setSaveStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.from('proposals').insert({
      client_id: data.client_id,
      title: data.title,
      scope: data.scope,
      line_items: data.line_items,
      total,
      status: 'draft',
    })
    setSaveStatus(error ? 'error' : 'saved')
    setTimeout(() => setSaveStatus('idle'), 2500)
  }

  async function onSend(data: FormValues) {
    if (!selectedClient) return
    setSendStatus('sending')
    const html = buildPreviewHTML(data, selectedClient, total)
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedClient.email,
        subject: `Proposal: ${data.title} — BRT Inc.`,
        html,
        type: 'proposal',
      }),
    })
    setSendStatus(res.ok ? 'sent' : 'error')
    setTimeout(() => setSendStatus('idle'), 3000)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Left: form */}
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          {(['edit', 'preview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-mono text-xs px-3 py-1.5 rounded-md border transition-colors"
              style={{
                borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
                background: tab === t ? 'rgba(99,102,241,0.08)' : 'transparent',
                color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'edit' && (
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            {/* Client */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>Client</label>
              <select {...register('client_id')} className="w-full px-3 py-2 rounded-md text-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.client_id && <p className="text-red-400 text-xs mt-1">{errors.client_id.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>Proposal title</label>
              <input {...register('title')} placeholder="e.g. C2 System v6.0 Development" className="w-full px-3 py-2 rounded-md text-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Scope */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>Scope of work</label>
              <textarea {...register('scope')} rows={4} placeholder="Describe deliverables, timeline, and acceptance criteria…" className="w-full px-3 py-2 rounded-md text-sm resize-none" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              {errors.scope && <p className="text-red-400 text-xs mt-1">{errors.scope.message}</p>}
            </div>

            {/* Line items */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Line items</label>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <input
                      {...register(`line_items.${i}.description`)}
                      placeholder="Description"
                      className="flex-1 px-3 py-2 rounded-md text-sm"
                      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    />
                    <input
                      {...register(`line_items.${i}.amount`)}
                      type="number"
                      placeholder="0"
                      className="w-28 px-3 py-2 rounded-md text-sm font-mono"
                      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(i)} className="px-2 py-2 text-xs rounded-md" style={{ color: 'var(--text-subtle)' }}>✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => append({ description: '', amount: 0 })} className="mt-2 font-mono text-xs px-3 py-1.5 rounded-md border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                + Add item
              </button>
            </div>

            {/* Total */}
            <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>Total: <strong>R{total.toLocaleString()}</strong></span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saveStatus === 'saving'} className="flex-1 py-2 rounded-md text-sm font-medium transition-colors" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Error' : 'Save draft'}
              </button>
              <button type="button" onClick={handleSubmit(onSend)} disabled={sendStatus === 'sending' || !selectedClient} className="flex-1 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40" style={{ background: 'var(--accent)', color: '#fff' }}>
                {sendStatus === 'sending' ? 'Sending…' : sendStatus === 'sent' ? 'Sent ✓' : sendStatus === 'error' ? 'Error' : `Send to ${selectedClient?.name ?? 'client'}`}
              </button>
            </div>
          </form>
        )}

        {tab === 'preview' && (
          <div
            className="rounded-xl p-6 text-sm leading-relaxed overflow-y-auto"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', maxHeight: '70vh' }}
            dangerouslySetInnerHTML={{ __html: buildPreviewHTML(values, selectedClient ?? null, total) }}
          />
        )}
      </div>

      {/* Right: live preview (desktop) */}
      <div className="hidden lg:block">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>Live preview</p>
        <div
          className="rounded-xl p-6 text-sm leading-relaxed overflow-y-auto"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', maxHeight: 'calc(100vh - 10rem)' }}
          dangerouslySetInnerHTML={{ __html: buildPreviewHTML(values, selectedClient ?? null, total) }}
        />
      </div>
    </div>
  )
}

function buildPreviewHTML(data: Partial<FormValues>, client: Client | null, total: number): string {
  const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
  const rows = (data.line_items ?? []).map(li => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #27272a;">${escapeHTML(li.description)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #27272a;text-align:right;font-family:monospace;">R${Number(li.amount).toLocaleString()}</td>
    </tr>`).join('')

  return `
    <div style="font-family:system-ui,sans-serif;color:#fafafa;background:#111113;padding:32px;border-radius:12px;max-width:680px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:32px;">
        <div>
          <h1 style="font-size:20px;font-weight:700;margin:0;color:#fafafa;">BRT Inc.</h1>
          <p style="color:#a1a1aa;font-size:12px;margin:4px 0 0;">Manzini, Eswatini · charleskris9@gmail.com</p>
        </div>
        <div style="text-align:right;">
          <p style="color:#a1a1aa;font-size:12px;margin:0;">${date}</p>
          <p style="color:#6366f1;font-size:11px;font-family:monospace;margin:4px 0 0;">PROPOSAL</p>
        </div>
      </div>
      ${client ? `<div style="margin-bottom:24px;"><p style="color:#a1a1aa;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.08em;">Prepared for</p><p style="font-weight:600;margin:0;">${escapeHTML(client.name)}</p><p style="color:#a1a1aa;font-size:12px;margin:2px 0 0;">${escapeHTML(client.email)}</p></div>` : ''}
      <h2 style="font-size:16px;font-weight:600;margin:0 0 8px;">${escapeHTML(data.title ?? '')}</h2>
      <p style="color:#a1a1aa;font-size:13px;white-space:pre-wrap;margin:0 0 24px;">${escapeHTML(data.scope ?? '')}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead><tr style="background:#18181b;"><th style="padding:8px 12px;text-align:left;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:.08em;color:#71717a;">Description</th><th style="padding:8px 12px;text-align:right;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:.08em;color:#71717a;">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td style="padding:12px;font-weight:700;">Total</td><td style="padding:12px;text-align:right;font-weight:700;font-family:monospace;color:#6366f1;">R${total.toLocaleString()}</td></tr></tfoot>
      </table>
      <p style="color:#52525b;font-size:11px;margin-top:24px;">This proposal is valid for 30 days. Reply to accept or request changes.</p>
    </div>`
}

function escapeHTML(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
