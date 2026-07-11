'use client'
import { useEffect, useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

interface Client { id: string; name: string; email: string }

const lineSchema = z.object({
  description: z.string().min(1, 'Required'),
  qty: z.coerce.number().min(1),
  rate: z.coerce.number().min(0),
})

const schema = z.object({
  client_id: z.string().min(1, 'Select a client'),
  invoice_number: z.string().min(1, 'Required'),
  line_items: z.array(lineSchema).min(1),
})
type FormValues = z.infer<typeof schema>

const VAT_RATE = 0.15

export function InvoiceBuilder() {
  const [clients, setClients] = useState<Client[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const printRef = useRef<HTMLDivElement>(null)

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_id: '',
      invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      line_items: [{ description: '', qty: 1, rate: 0 }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'line_items' })

  const values = watch()
  const subtotal = values.line_items?.reduce((s, li) => s + (Number(li.qty) || 1) * (Number(li.rate) || 0), 0) ?? 0
  const vat = subtotal * VAT_RATE
  const total = subtotal + vat
  const selectedClient = clients.find(c => c.id === values.client_id)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('clients').select('id, name, email').order('name').then(({ data }) => setClients(data ?? []))
  }, [])

  async function onSave(data: FormValues) {
    setSaveStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.from('invoices').insert({
      client_id: data.client_id,
      invoice_number: data.invoice_number,
      line_items: data.line_items,
      total,
    })
    setSaveStatus(error ? 'error' : 'saved')
    setTimeout(() => setSaveStatus('idle'), 2500)
  }

  function printInvoice() {
    const printContent = printRef.current?.innerHTML
    if (!printContent) return
    const win = window.open('', '_blank', 'width=800,height=900')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>${values.invoice_number}</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#111;}table{width:100%;border-collapse:collapse;}th,td{padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:left;}th{background:#f9fafb;font-size:12px;text-transform:uppercase;letter-spacing:.05em;}@media print{body{padding:20px}}</style></head><body>${printContent}</body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: form */}
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>Client</label>
            <select {...register('client_id')} className="w-full px-3 py-2 rounded-md text-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <option value="">Select…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.client_id && <p className="text-red-400 text-xs mt-1">{errors.client_id.message}</p>}
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>Invoice #</label>
            <input {...register('invoice_number')} className="w-full px-3 py-2 rounded-md text-sm font-mono" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
        </div>

        {/* Line items */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Line items</label>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_60px_90px_24px] gap-2">
              {(['Description', 'Qty', 'Rate (R)', ''] as const).map(h => (
                <span key={h} className="font-mono text-[10px] uppercase tracking-widest px-1" style={{ color: 'var(--text-subtle)' }}>{h}</span>
              ))}
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_60px_90px_24px] gap-2 items-center">
                <input {...register(`line_items.${i}.description`)} placeholder="Service or deliverable" className="px-3 py-2 rounded-md text-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <input {...register(`line_items.${i}.qty`)} type="number" min={1} className="px-3 py-2 rounded-md text-sm font-mono text-center" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <input {...register(`line_items.${i}.rate`)} type="number" min={0} className="px-3 py-2 rounded-md text-sm font-mono" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                {fields.length > 1 ? (
                  <button type="button" onClick={() => remove(i)} className="text-xs w-6 h-6 flex items-center justify-center rounded" style={{ color: 'var(--text-subtle)' }}>✕</button>
                ) : <span />}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => append({ description: '', qty: 1, rate: 0 })} className="mt-2 font-mono text-xs px-3 py-1.5 rounded-md border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            + Add line
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-1 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          {[
            { label: 'Subtotal', value: subtotal },
            { label: 'VAT (15%)', value: vat },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
              <span>{label}</span>
              <span className="font-mono">R{value.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-1 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
            <span>Total</span>
            <span className="font-mono" style={{ color: 'var(--accent)' }}>R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saveStatus === 'saving'} className="flex-1 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Error' : 'Save'}
          </button>
          <button type="button" onClick={printInvoice} className="flex-1 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
            Print / PDF
          </button>
        </div>
      </form>

      {/* Right: printable preview */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>Preview</p>
        <div ref={printRef} className="rounded-xl p-6 text-sm" style={{ background: '#fff', color: '#111', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>BRT Inc.</h2>
              <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Manzini, Eswatini · charleskris9@gmail.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600, margin: '0 0 2px', fontSize: 13 }}>{values.invoice_number}</p>
              <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>{new Date().toLocaleDateString('en-ZA')}</p>
            </div>
          </div>

          {selectedClient && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 2px' }}>Billed to</p>
              <p style={{ fontWeight: 600, margin: 0 }}>{selectedClient.name}</p>
              <p style={{ color: '#6b7280', fontSize: 11, margin: '2px 0 0' }}>{selectedClient.email}</p>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Description', 'Qty', 'Rate', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: '#6b7280', textAlign: h === 'Description' ? 'left' : 'right', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.line_items?.map((li, i) => {
                const amt = (Number(li.qty) || 1) * (Number(li.rate) || 0)
                return (
                  <tr key={i}>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>{li.description}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace' }}>{li.qty}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace' }}>R{Number(li.rate).toLocaleString()}</td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace' }}>R{amt.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', fontSize: 12 }}>
            {[{ l: 'Subtotal', v: subtotal }, { l: 'VAT (15%)', v: vat }].map(({ l, v }) => (
              <div key={l} style={{ color: '#6b7280', marginBottom: 4 }}>{l}: <strong style={{ fontFamily: 'monospace' }}>R{v.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong></div>
            ))}
            <div style={{ fontWeight: 700, fontSize: 14, borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 4 }}>
              Total: <span style={{ color: '#4f46e5', fontFamily: 'monospace' }}>R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <p style={{ color: '#9ca3af', fontSize: 10, marginTop: 24 }}>Payment due within 14 days. Bank details available on request.</p>
        </div>
      </div>
    </div>
  )
}
