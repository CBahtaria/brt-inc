# eMali Manual Payment (brt-inc) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Orchestrator note (this repo only):** Per `CLAUDE.md`, the session running this plan is the Orchestrator and must NOT write code directly — dispatch a child agent per task (opus for Task 1 and Task 5, sonnet for Tasks 2–4 and 6 per the model-routing table below), review the actual diff against the Review Rubric, and run the three Blocking Gates before marking any task complete.

**Goal:** Let a site visitor pay for a service via Swazi Mobile E-Mali (manual reconciliation — no API exists) and let the site owner confirm the payment from an authenticated portal page before anything is marked paid.

**Architecture:** A new `payment_references` Supabase table (RLS-protected) holds submissions. A public API route inserts rows and emails a notification via Resend. A new `app/(portal)/emali` page (gated by the existing Supabase session middleware) lists pending references; a second API route lets the authenticated owner confirm/reject, validated the same way `app/api/send-email/route.ts` already validates a Bearer token against Supabase auth.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Resend, Zod.

## Global Constraints

- No hardcoded Stripe live keys or raw Supabase service-role JWT in source (repo `CLAUDE.md`).
- All new portal pages live inside `app/(portal)/`; auth is the existing session check in `app/(portal)/layout.tsx` — do not invent a parallel auth scheme.
- API routes requiring auth validate a Supabase Bearer token server-side before processing (matches `app/api/send-email/route.ts`).
- No inline `style={}` for layout — Tailwind only.
- No comments unless the WHY is non-obvious.
- `npm run build` must pass with 0 type errors, 0 missing imports, before any task is marked done.
- Blocking gates before any commit to `main`: `gitleaks detect --source . --no-git` (0 findings), the `auth.js` grep (N/A — no `src/*.html` pages touched by this plan, confirm this stays true), `make lint`.
- Money stored as integer cents; currency default `SZL`.
- eMali payee: `+26879657744`. Notification recipient: `charleskris9@gmail.com`.
- No auto-confirm on submission — a submitted reference is a claim, not proof. Status starts `pending`; only an authenticated portal action can move it to `confirmed` or `rejected`.

---

### Task 1: `payment_references` table + RLS migration

**Model:** opus (touches DB schema + RLS — "formal DB schema decisions" per repo routing rules; also a Review-Rubric-gated security surface).

**Files:**
- Create: `supabase/migrations/004_payment_references.sql`

**Interfaces:**
- Produces: table `payment_references(id uuid PK, service_slug text, amount_cents integer, currency text default 'SZL', payer_name text, payer_contact text, emali_reference text, status text default 'pending', created_at timestamptz default now(), confirmed_at timestamptz, confirmed_by uuid references auth.users)`. `status` constrained to `('pending','confirmed','rejected')`.

- [ ] **Step 1: Write the migration**

```sql
CREATE TABLE IF NOT EXISTS payment_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL DEFAULT 'SZL',
  payer_name text NOT NULL,
  payer_contact text NOT NULL,
  emali_reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  confirmed_by uuid REFERENCES auth.users
);
ALTER TABLE payment_references ENABLE ROW LEVEL SECURITY;

-- Public submissions happen server-side via the service-role key (bypasses RLS by design).
-- Only authenticated portal users may read or update rows.
CREATE POLICY "authenticated_read" ON payment_references
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update" ON payment_references
  FOR UPDATE USING (auth.role() = 'authenticated');
```

- [ ] **Step 2: Apply and verify**

Run: `npx supabase db push` (or the project's existing migration-apply command — check `package.json` scripts / `docs/` for the established flow before assuming `supabase db push` is wired up).
Expected: migration applies with no errors; `select * from payment_references limit 1;` in the Supabase SQL editor returns an empty result set (table exists, zero rows).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/004_payment_references.sql
git commit -m "feat: add payment_references table for eMali manual reconciliation"
```

---

### Task 2: Public submit API route

**Model:** sonnet (mechanical implementation against a complete spec).

**Files:**
- Create: `app/api/emali/submit/route.ts`

**Interfaces:**
- Consumes: `payment_references` table from Task 1.
- Produces: `POST /api/emali/submit` accepting `{ serviceSlug: string, amountCents: number, payerName: string, payerContact: string, emaliReference: string }`, returns `{ ok: true, id: string }` on success or `{ error: string }` with 4xx/5xx.

- [ ] **Step 1: Write the route**

```typescript
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const RATE_MAP = new Map<string, number[]>()
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const prev = (RATE_MAP.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  if (prev.length >= RATE_MAX) return true
  prev.push(now)
  RATE_MAP.set(ip, prev)
  return false
}

const SubmitSchema = z.object({
  serviceSlug: z.string().min(1).max(100),
  amountCents: z.number().int().positive(),
  payerName: z.string().min(1).max(200),
  payerContact: z.string().min(1).max(200),
  emaliReference: z.string().min(1).max(100),
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests — please try again in 15 minutes.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = SubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  const { serviceSlug, amountCents, payerName, payerContact, emaliReference } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('payment_references')
    .insert({
      service_slug: serviceSlug,
      amount_cents: amountCents,
      payer_name: payerName,
      payer_contact: payerContact,
      emali_reference: emaliReference,
    })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Could not record submission' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    await resend.emails.send({
      from: 'BRT Inc. <noreply@brtinc.dev>',
      to: 'charleskris9@gmail.com',
      subject: `New eMali payment reference — ${serviceSlug}`,
      html: `<p>${payerName} (${payerContact}) submitted reference <strong>${emaliReference}</strong> for ${serviceSlug}, E${(amountCents / 100).toFixed(2)}. Confirm at /emali in the portal.</p>`,
    })
  } catch {
    // Notification failure must not block the recorded submission — the portal list is authoritative.
  }

  return NextResponse.json({ ok: true, id: data.id })
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: 0 type errors, 0 missing imports.

- [ ] **Step 3: Manual verification against the dev server**

Run: `npm run dev`, then in another shell:
```bash
curl -s -X POST http://localhost:3000/api/emali/submit \
  -H 'Content-Type: application/json' \
  -d '{"serviceSlug":"consultation","amountCents":50000,"payerName":"Test User","payerContact":"+26876000000","emaliReference":"TESTREF123"}'
```
Expected: `{"ok":true,"id":"<uuid>"}`. Confirm the row appears in the Supabase table editor with `status = 'pending'`.

- [ ] **Step 4: Commit**

```bash
git add app/api/emali/submit/route.ts
git commit -m "feat: add public eMali payment reference submission endpoint"
```

---

### Task 3: Submit UI

**Model:** sonnet.

**Files:**
- Create: `components/marketing/EmaliPayment.tsx`
- Modify: `app/page.tsx` — add `<EmaliPayment />` near the existing `<Contact />` section.

**Interfaces:**
- Consumes: `POST /api/emali/submit` from Task 2.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'

const EMALI_NUMBER = '+26879657744'

export default function EmaliPayment() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = new FormData(e.currentTarget)
    const amountRand = Number(form.get('amount'))
    try {
      const res = await fetch('/api/emali/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: String(form.get('service')),
          amountCents: Math.round(amountRand * 100),
          payerName: String(form.get('name')),
          payerContact: String(form.get('contact')),
          emaliReference: String(form.get('reference')),
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p className="text-sm text-neutral-400">Reference received — we&apos;ll confirm shortly.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <p className="text-sm text-neutral-400">
        Send payment to {EMALI_NUMBER} via the eMali app, then enter your details below.
      </p>
      <input name="service" placeholder="Service (e.g. consultation)" required className="rounded border border-neutral-700 bg-transparent px-3 py-2" />
      <input name="amount" type="number" step="0.01" placeholder="Amount (SZL)" required className="rounded border border-neutral-700 bg-transparent px-3 py-2" />
      <input name="name" placeholder="Your name" required className="rounded border border-neutral-700 bg-transparent px-3 py-2" />
      <input name="contact" placeholder="Your phone or email" required className="rounded border border-neutral-700 bg-transparent px-3 py-2" />
      <input name="reference" placeholder="eMali transaction reference" required className="rounded border border-neutral-700 bg-transparent px-3 py-2" />
      <button type="submit" disabled={status === 'submitting'} className="rounded bg-white text-black px-4 py-2 disabled:opacity-50">
        {status === 'submitting' ? 'Submitting…' : 'Submit reference'}
      </button>
      {status === 'error' && <p className="text-sm text-red-400">Something went wrong — try again.</p>}
    </form>
  )
}
```

- [ ] **Step 2: Wire into the homepage**

Read `app/page.tsx` first to find the exact JSX location of `<Contact />`, then add the import and place `<EmaliPayment />` immediately after it.

- [ ] **Step 3: Type-check and manual browser check**

Run: `npm run build`, then `npm run dev` and load `http://localhost:3000` in a browser. Confirm the form renders below Contact, `prefers-reduced-motion` is respected (no motion added here — none needed), and submitting a test reference returns the "Reference received" message.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/EmaliPayment.tsx app/page.tsx
git commit -m "feat: add eMali payment submission UI to homepage"
```

---

### Task 4: Confirm/reject API route

**Model:** sonnet, with opus review (auth-boundary change — repo rule: "Security review — any change touching auth... " gets opus review even when sonnet implements).

**Files:**
- Create: `app/api/emali/[id]/route.ts`

**Interfaces:**
- Consumes: `payment_references` table from Task 1.
- Produces: `PATCH /api/emali/[id]` accepting `{ action: 'confirm' | 'reject' }` with header `Authorization: Bearer <supabase_access_token>`. Returns `{ ok: true }` or 401/404/400.

- [ ] **Step 1: Write the route**

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ActionSchema = z.object({ action: z.enum(['confirm', 'reject']) })

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = ActionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const status = parsed.data.action === 'confirm' ? 'confirmed' : 'rejected'
  const { error } = await supabase
    .from('payment_references')
    .update({ status, confirmed_at: new Date().toISOString(), confirmed_by: user.id })
    .eq('id', id)
    .eq('status', 'pending')

  if (error) {
    return NextResponse.json({ error: 'Could not update reference' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

Note the `.eq('status', 'pending')` guard — a reference already confirmed or rejected cannot be flipped again through this route, preventing a double-confirm race.

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: 0 type errors.

- [ ] **Step 3: Manual verification**

With a valid session access token (from browser devtools after logging into `/login`) and a `pending` row's id from Task 2's test:
```bash
curl -s -X PATCH http://localhost:3000/api/emali/<id> \
  -H "Authorization: Bearer <access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"action":"confirm"}'
```
Expected: `{"ok":true}`. Confirm the row's `status` is now `confirmed` in the Supabase table editor, and a second identical call now no-ops (0 rows updated, still returns `{"ok":true}` since the guard silently matches 0 rows — acceptable since the end state is correct either way).

- [ ] **Step 4: Commit**

```bash
git add app/api/emali/[id]/route.ts
git commit -m "feat: add authenticated confirm/reject endpoint for eMali references"
```

---

### Task 5: Admin portal page

**Model:** opus ("Multi-file coordination" + the page is the human-in-the-loop control for a financial gate).

**Files:**
- Create: `app/(portal)/emali/page.tsx`

**Interfaces:**
- Consumes: `PATCH /api/emali/[id]` from Task 4, `lib/supabase.ts` browser client.

- [ ] **Step 1: Write the page**

```tsx
'use client'

import { useEffect, useState } from 'react'
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

export default function EmaliAdminPage() {
  const [refs, setRefs] = useState<PaymentReference[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase
      .from('payment_references')
      .select('*')
      .order('created_at', { ascending: false })
    setRefs((data ?? []) as PaymentReference[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function act(id: string, action: 'confirm' | 'reject') {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await fetch(`/api/emali/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action }),
    })
    load()
  }

  if (loading) return <p>Loading…</p>

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">eMali payment references</h1>
      {refs.map(r => (
        <div key={r.id} className="rounded border border-neutral-700 p-4 flex flex-col gap-1">
          <p>{r.payer_name} ({r.payer_contact}) — {r.service_slug} — E{(r.amount_cents / 100).toFixed(2)}</p>
          <p className="text-sm text-neutral-400">Ref: {r.emali_reference} — Status: {r.status}</p>
          {r.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button onClick={() => act(r.id, 'confirm')} className="rounded bg-green-700 px-3 py-1 text-sm">Confirm</button>
              <button onClick={() => act(r.id, 'reject')} className="rounded bg-red-700 px-3 py-1 text-sm">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Type-check and manual browser check**

Run: `npm run build`, then log into `/login` and visit `/emali`. Confirm the pending test reference from Task 2 appears, Confirm/Reject buttons work, and the list refreshes to show `confirmed`/`rejected` afterward. Also confirm an unauthenticated visit to `/emali` redirects to `/login` (the existing `(portal)/layout.tsx` check).

- [ ] **Step 3: Commit**

```bash
git add app/\(portal\)/emali/page.tsx
git commit -m "feat: add eMali payment confirmation page to portal"
```

---

### Task 6: Blocking gates and deploy

**Model:** haiku (running gates and reporting pass/fail).

- [ ] **Step 1: Run all three blocking gates**

```bash
gitleaks detect --source . --no-git
grep -rL 'src/js/auth.js' src/ --include="*.html" | grep -v login.html | grep -v onboarding
npm run build
```
Expected: gitleaks 0 findings; grep output empty (or repo has no `src/*.html` at all, in which case this gate is vacuously satisfied — confirm which is true); build 0 errors.

- [ ] **Step 2: Push to main**

```bash
git push origin main
```
Expected: Vercel auto-deploys via the GitHub integration. Confirm the deploy succeeds in the Vercel dashboard before considering this plan complete.
