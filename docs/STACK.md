# BRT Inc. — Tech Stack

## Runtime & Framework

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.10 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Package manager | npm | — |
| Build tool | Turbopack (Next.js) | bundled |
| Node.js (Vercel) | Node.js | 24.x |

## Styling

| Layer | Technology | Version |
|---|---|---|
| CSS framework | Tailwind CSS v4 | ^4 |
| PostCSS plugin | @tailwindcss/postcss | ^4 |
| Fonts | Geist (Sans + Mono) | ^1.7.2 |

Design tokens defined in `app/globals.css` as CSS custom properties. No Tailwind config — v4 uses `@import "tailwindcss"` directly.

## Animation

| Layer | Technology | Version |
|---|---|---|
| Declarative animation | Framer Motion | ^11.18.2 |
| Scroll-driven animation | GSAP + ScrollTrigger | ^3.15.0 |
| 3D scene | React Three Fiber | ^8.18.0 |
| 3D scene helpers | @react-three/drei | ^9.122.0 |
| 3D engine | Three.js | ^0.169.0 |

Three.js is client-only (`dynamic(() => import('./Hero3D'), { ssr: false })`). GSAP is dynamically imported inside `useEffect` to avoid SSR. `// @ts-nocheck` on `Hero3D.tsx` due to Turbopack JSX augmentation gap.

## Data & Auth

| Layer | Technology | Version |
|---|---|---|
| Database | Supabase (PostgreSQL) | — |
| Browser Supabase client | @supabase/ssr (browser) | ^0.12.0 |
| Server Supabase client | @supabase/ssr (server) | ^0.12.0 |
| Data tables | TanStack Table | ^8.21.3 |

Auth guard in `app/(portal)/layout.tsx` — `getUser()` server-side, redirects to `/login` if no session.

## Forms & Validation

| Layer | Technology | Version |
|---|---|---|
| Form state | react-hook-form | ^7.81.0 |
| Schema validation | Zod | ^3.25.76 |
| Resolver | @hookform/resolvers | ^5.4.0 |

## Email & Payments

| Layer | Technology | Version |
|---|---|---|
| Transactional email | Resend | ^3.5.0 |
| Payments | Stripe | ^16.12.0 |

## AI / Generation

| Layer | Technology | Notes |
|---|---|---|
| Image generation | Higgsfield AI (GPT Image 2, Nano Banana 2, Recraft V4.1) | REST via `/api/generate` |
| Video generation | Higgsfield AI (Seedance 2.0, Kling 3.0) | REST via `/api/generate` |
| API client | `lib/higgsfield.ts` | Server-only, Bearer auth |

Requires `HIGGSFIELD_API_KEY` env var. Never bundled to client.

## Content

| Layer | Technology | Version |
|---|---|---|
| MDX rendering | next-mdx-remote | ^6.0.0 |

## Infrastructure

| Layer | Technology |
|---|---|
| Hosting | Vercel (Fluid Compute) |
| CDN | Vercel Edge Network |
| Database | Supabase (managed PostgreSQL) |
| Git | GitHub (CBahtaria/brt-inc) |

## Route Architecture

```
app/
  layout.tsx                      ← Root layout (Geist fonts, metadata)
  globals.css                     ← Design tokens (CSS vars)
  page.tsx                        ← Marketing landing page (static)
  login/page.tsx                  ← Auth page (static)
  onboarding/page.tsx             ← Public intake form (static)
  (portal)/
    layout.tsx                    ← Auth guard (server component)
    dashboard/page.tsx            ← Portal overview  → /dashboard
    crm/page.tsx                  → /crm
    proposals/page.tsx            → /proposals
    invoices/page.tsx             → /invoices
    runbooks/page.tsx             → /runbooks
    status/page.tsx               → /status
    assets/page.tsx               → /assets  (Higgsfield generator)
  api/
    contact/route.ts              → POST /api/contact
    send-email/route.ts           → POST /api/send-email
    generate/route.ts             → POST /api/generate
    generate/[jobId]/route.ts     → GET  /api/generate/[jobId]
    healthcheck/route.ts          → GET|HEAD /api/healthcheck
    stripe-webhook/route.ts       → POST /api/stripe-webhook (stub)

lib/
  supabase.ts                     ← Browser Supabase client
  supabase-server.ts              ← Server Supabase client (cookie-based)
  projects.ts                     ← All 11 portfolio projects (typed)
  higgsfield.ts                   ← Higgsfield REST client (server-only)

components/
  marketing/                      ← Landing page sections
    Nav, Hero, Hero3D, ParticleField, ScrollScene, About, WhoChips,
    PracticeAreas, StackStrip, Services, Process, Portfolio,
    ProjectCard, ProjectCardGaming, ProjectModal, Impact,
    Testimonials, Pricing, FAQ, Contact, Footer
  portal/                         ← Internal ops UI
    PortalShell, Sidebar, CRMTable, OnboardingForm, ProposalEditor,
    InvoiceBuilder, RunbookList, StatusGrid, AssetGenerator
```

## Known Constraints

- `.npmrc` `legacy-peer-deps=true` required — `@react-three/drei@9` has `@react-spring/*` peers that expect React ≤18.
- Higgsfield `fnf.internal` SDK unavailable (Cloudflare Worker-only) — use REST API via `lib/higgsfield.ts`.
- `brt-inc.vercel.app` domain owned by personal Vercel account, not team — canonical URL is `brtinc.dev`.
