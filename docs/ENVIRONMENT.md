# BRT Inc. — Environment Variables

All secrets go in `.env.local` (never committed). Set production values via `vercel env add` or the Vercel dashboard.

## Required

| Variable | Scope | Where used |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser + server) | Supabase client init |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser + server) | Supabase browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | `/api/send-email` auth verify |
| `RESEND_API_KEY` | **Server-only** | `/api/contact`, `/api/send-email` |

## Optional (features degrade gracefully without them)

| Variable | Scope | Where used | Default |
|---|---|---|---|
| `HIGGSFIELD_API_KEY` | **Server-only** | `/api/generate`, `/api/generate/[jobId]` | — (generator returns 502) |
| `HIGGSFIELD_API_BASE_URL` | **Server-only** | `lib/higgsfield.ts` | `https://api.higgsfield.ai` |
| `STRIPE_SECRET_KEY` | **Server-only** | `/api/stripe-webhook` (stub) | — |
| `STRIPE_WEBHOOK_SECRET` | **Server-only** | `/api/stripe-webhook` (stub) | — |
| `STRIPE_STARTER_URL` | Public | Pricing section | Placeholder |
| `STRIPE_PROFESSIONAL_URL` | Public | Pricing section | Placeholder |
| `STRIPE_CUSTOM_URL` | Public | Pricing section | Placeholder |

## Security rules

- `SUPABASE_SERVICE_ROLE_KEY` — never import in client components. Only used in server Route Handlers.
- `HIGGSFIELD_API_KEY` — only in `lib/higgsfield.ts` (server import). Never bundled to client.
- `RESEND_API_KEY` — only in `app/api/contact/route.ts` and `app/api/send-email/route.ts`.

## Supabase tables required

| Table | Used by |
|---|---|
| `clients` | `/crm` — CRMTable |
| `proposals` | `/proposals` — ProposalEditor |
| `invoices` | `/invoices` — InvoiceBuilder |
| `onboarding_submissions` | `/onboarding` — OnboardingForm |
| `runbook_templates` | `/runbooks` — RunbookList |

RLS must be enabled. Auth guard in `app/(portal)/layout.tsx` ensures only authenticated users reach portal routes.
