# eMali Manual-Payment Monetization — Cross-Repo Design

Date: 2026-08-09
Scope: brt-inc, wheels-deals-eswatini, likhono-lami, maize-model, MahlanyaRPG
Excluded: agentic-uav-stack / Sentinel (export-control exposure — no payment rails), `layered` (Stripe there is SaaS subscription billing for a browser extension, no storefront/payee concept — not an eMali fit)

## Why this shape

Swazi Mobile E-Mali has no public merchant/developer API (unlike MTN MoMo, which does — `momodeveloper.mtn.com`). A third-party aggregator, MaphaPay, claims to unify MoMo/eMali/FNB eWallet, but is unverified and out of scope for this round. The only reliable integration today is **manual reconciliation**: the customer pays a fixed number via the eMali app themselves, submits proof, a human confirms.

Contact/payee for all projects:
- Email: `charleskris9@gmail.com`
- eMali number: `+26879657744`

## Shared pattern (every repo implements this shape)

1. **Reference submission**: form/endpoint collects payer contact + eMali transaction reference + amount + what it's for. Creates a record with status `pending`. No auto-confirm — a submitted reference is a claim, not proof.
2. **Status workflow**: `pending → confirmed | rejected`. Nothing (content access, vehicle reservation, license key, API access) unlocks until a human moves the record to `confirmed`. This is a fail-closed gate, not a fail-open one — absence of confirmation means NO_GO, matching existing repo conventions (e.g. likhono-lami's `INSTACASH_ENABLED` fail-closed flag).
3. **Admin confirm action**: authenticated, human-triggered. No unauthenticated party can move a record to `confirmed`.

## Per-repo implementation

### brt-inc (Next.js 16 / Supabase / Vercel)
- New Supabase table `payment_references`: `id, service_slug, amount_cents, currency default 'SZL', payer_name, payer_contact, emali_reference, status, created_at, confirmed_at, confirmed_by`.
- New `app/api/emali/submit/route.ts` — zod-validated, writes the row, sends a Resend notification email to `charleskris9@gmail.com`.
- New "Pay via eMali" UI alongside the existing Stripe checkout (`app/checkout/*`), for services outside the Stripe `PRICE_MAP` (e.g. custom institutional consulting engagements).
- New `app/admin/emali/page.tsx`, gated by an `ADMIN_SECRET` env var compared with `timingSafeEqual` — mirrors the pattern already live in wheels-deals-eswatini (this repo has no admin auth today).

### wheels-deals-eswatini (Next.js 16 / Supabase / Vercel)
- New `payment_references` table, FK'd to `vehicle_id`.
- On submission: `Vehicle.status` flips `available → reserved`.
- On confirm: stays `reserved` (site owner marks `sold` separately after real-world handoff).
- On reject **or timeout** (24–48h with no confirm): auto-reverts to `available` — otherwise a reservation can be claimed indefinitely without payment ever landing.
- New `app/api/emali/submit/route.ts`, same shape as brt-inc.
- Admin confirm page reuses the *existing* `ADMIN_SECRET` auth already in this repo (`app/api/admin/auth/route.ts`).

### likhono-lami (NestJS / TypeORM / apps/admin)
- Extend `Payment` entity: add `PaymentGateway.EMALI`, add a manual-review status distinct from the automated-gateway `PENDING` (e.g. `PENDING_MANUAL_REVIEW`) so it's never conflated with a MoMo/Peach callback-driven pending state.
- New `emali.service.ts` in `apps/api/src/payments/` — no client class (no API to call): `createReference()`, `confirmReference()`, `rejectReference()`.
- New env flags following the existing `INSTACASH_ENABLED` fail-closed convention: `EMALI_ENABLED`, `EMALI_MERCHANT_NUMBER`. If disabled, the submit endpoint 404s rather than silently accepting.
- Confirm/reject exposed as an admin-only NestJS endpoint, surfaced in the existing `apps/admin` portal (reuses whatever RBAC/auth already gates that portal).

### maize-model (FastAPI, no DB, no auth today)
- New table `farm_access(farm_id, status, emali_reference, created_at)` — new isolated Supabase (or SQLite for this scale) project, not shared with the other four.
- New endpoint `POST /access/request` (farm_id + eMali reference).
- Gate the existing `POST /classify` on `X-Farm-ID` matching a `confirmed` row.
- Admin confirm: a single `ADMIN_API_KEY`-gated endpoint, not a built UI — this is a 5%-portfolio-weight, low-volume smallholder-farmer tool; a full admin UI here is unjustified scope.

### MahlanyaRPG (`web/`, Next.js 14 viewer app, no backend today)
- Biggest lift: no DB, no `.env`, no forms exist in `web/` at all.
- New isolated Supabase project (not shared with other repos).
- New `web/app/access/page.tsx` — supporter-tier description, eMali instructions, reference form.
- New `web/app/api/emali/submit/route.ts`, same shape as brt-inc.
- Confirm action uploads a build artifact to Supabase Storage and generates a 7-day signed URL; a Resend email delivers the link to `payer_contact`. No public/permanent download link exists — every grant is per-payer and expires.

## Cross-repo decisions locked in
- **Persistence isolation**: each repo that needs new persistence (MahlanyaRPG, maize-model) gets its own Supabase project — a leaked key or bug in one can't expose another's rows. brt-inc, wheels-deals-eswatini, likhono-lami reuse their existing databases.
- **No shared "payment service"**: five different stacks (Next.js x3, NestJS, FastAPI) with no current cross-project reporting need — a shared microservice is premature centralization for this scope.
- **Fail-closed everywhere**: unconfirmed = no access, no exceptions. Confirm actions require authentication in every repo; none of the five get an unauthenticated confirm path.
