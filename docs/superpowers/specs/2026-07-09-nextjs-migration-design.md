# BRT Inc. — Next.js Migration & x10 Redesign
**Date:** 2026-07-09  
**Status:** Approved  
**Scope:** Full migration from static HTML to Next.js 15 App Router — public marketing site + internal operator portals

---

## 1. Goals

- x10 visual upgrade over the current static HTML site
- Migrate all 7 existing sections plus 4 new institutional project cards
- Add 6 internal operator portals (CRM, proposals, invoices, onboarding, runbooks, status) behind Supabase auth
- Achieve cinematic animation quality: Three.js hero + GSAP scroll-scrub + Framer Motion interactions + Steam-style gaming cards
- Deploy to existing Vercel project (brt-inc.vercel.app) with zero downtime

---

## 2. Architecture

### Route Groups

```
app/
├── (marketing)/
│   ├── layout.tsx          # dark theme, Geist font, marketing metadata
│   ├── page.tsx            # full landing page (all sections as components)
│   └── casestudy/
│       └── [slug]/
│           └── page.tsx    # dynamic case study pages
├── (portal)/
│   ├── layout.tsx          # auth guard (getUser → redirect /login), sidebar shell
│   ├── page.tsx            # overview/dashboard
│   ├── crm/page.tsx
│   ├── proposals/page.tsx
│   ├── invoices/page.tsx
│   ├── onboarding/         # NOTE: no auth — see app/onboarding below
│   ├── runbooks/page.tsx
│   └── status/page.tsx
├── onboarding/
│   └── page.tsx            # public intake form — no auth, writes to supabase.submissions
├── login/
│   └── page.tsx
├── api/
│   ├── contact/route.ts
│   └── send-email/route.ts
└── layout.tsx              # root layout (Geist font load, theme provider)
```

### Component Tree

```
components/
├── marketing/
│   ├── Nav.tsx             # glassmorphism sticky nav
│   ├── Hero.tsx            # orchestrates Hero3D + ParticleField + headline
│   ├── Hero3D.tsx          # React Three Fiber scene (client component)
│   ├── ParticleField.tsx   # canvas particle system (client component)
│   ├── ScrollScene.tsx     # GSAP ScrollTrigger wrapper (client component)
│   ├── About.tsx
│   ├── WhoChips.tsx
│   ├── PracticeAreas.tsx   # horizontal scroll pin (GSAP)
│   ├── StackStrip.tsx      # scrolling tech tag marquee
│   ├── Services.tsx
│   ├── Process.tsx
│   ├── Portfolio.tsx       # bento grid + filter logic
│   ├── ProjectCard.tsx     # standard card
│   ├── ProjectCardGaming.tsx  # Steam-style card with video hover
│   ├── ProjectModal.tsx    # Framer Motion layout expansion overlay
│   ├── Impact.tsx          # GSAP count-up stats
│   ├── Testimonials.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── Contact.tsx         # form → /api/contact
│   └── Footer.tsx
├── portal/
│   ├── PortalShell.tsx     # sidebar + topbar layout
│   ├── Sidebar.tsx         # shadcn/ui sidebar, icon-only on mobile
│   ├── CRMTable.tsx        # DataTable + kanban drawer
│   ├── ProposalEditor.tsx  # form + live PDF preview
│   ├── InvoiceBuilder.tsx  # line-item form + Stripe link
│   ├── OnboardingForm.tsx  # public intake form
│   ├── RunbookList.tsx     # MDX runbook renderer
│   └── StatusGrid.tsx      # live system status cards
└── ui/                     # shadcn/ui primitives (button, dialog, table…)
```

---

## 3. Design System

### Colors
```css
--background:   #09090b;   /* zinc-950 */
--surface-1:    #111113;   /* cards */
--surface-2:    #18181b;   /* hover */
--border:       rgba(255,255,255,0.06);
--accent:       #6366f1;   /* indigo — defence/trust */
--accent-2:     #2dd4bf;   /* teal — civic/institutional */
--accent-game:  #f59e0b;   /* amber — game projects */
--text:         #fafafa;
--text-muted:   #a1a1aa;   /* zinc-400 */
--text-subtle:  #52525b;   /* zinc-600 */
```

### Typography
- **Geist** (next/font/google) — headings and body
- **Geist Mono** — metrics, tags, tech specs, code blocks
- Hero headline: `text-6xl lg:text-8xl font-bold tracking-tight`
- Section h2: `text-4xl lg:text-5xl font-semibold`
- Labels: `text-xs font-mono uppercase tracking-widest text-muted`

---

## 4. Animation System

### Layer 1 — Three.js Hero (React Three Fiber)
- Rotating icosahedron wireframe mesh (`IcosahedronGeometry`, `wireframe: true`)
- `MeshStandardMaterial` with indigo emissive tint
- `PointLight` at cursor position via `useFrame` + raycasting
- Fog depth for depth perception
- Fades out as user scrolls past 30vh (GSAP opacity scrub)

### Layer 2 — Particle Field (Canvas)
- Existing particle system upgraded: particles connect at <80px with `rgba(99,102,241,0.12)` lines
- Velocity reacts to scroll speed (particles scatter on fast scroll)
- Runs on `<canvas>` behind the Three.js scene, z-index managed

### Layer 3 — GSAP ScrollTrigger
- `<ScrollScene>` wrapper on every `<section>`: `y: 60→0`, `opacity: 0→1`, scrubbed
- Practice Areas: horizontal scroll track, pinned section, panels cycle on vertical scroll
- Hero headline: each word on staggered y-axis scrub, locks, then compresses into stats bar
- Impact counters: `gsap.to()` proxy count-up at 50% viewport entry

### Layer 4 — Framer Motion
- Portfolio cards: `layoutId` expand-in-place to detail overlay on click
- Nav links: `motion.a` underline scale on hover
- Page transitions: `AnimatePresence` with `opacity`/`y` slide between routes
- Stagger children on card grids: `staggerChildren: 0.08`
- Logo mark: 360° rotation on first mount (800ms, ease-out)

### Layer 5 — Steam-style Gaming Cards (MahlanyaRPG)
- At rest: landscape image, title, amber badge
- Hover: `clip-path` wipe from bottom, trailer `<video autoPlay muted loop>` fades in
- Stats "achievements" slide up with Framer Motion stagger
- Click: full-screen modal, Steam-aesthetic gradient burn header

---

## 5. Portfolio — Bento Grid Layout

```
┌──────────────────────┬───────────┬───────────┐
│   SENTINEL  (2×2)    │  UAV Stack│   Maize   │
│   featured + wide    │  1×1      │  1×1      │
├──────────────────────┼───────────┴───────────┤
│   BEDF C2   (2×1)    │  Eswatini Dashboard   │
│                      │  (2×1)                │
├──────────┬───────────┴───────────┬───────────┤
│ Studio P │  CivisGrid            │ Est.Rdrs  │
│  1×1     │  1×1                  │  1×1      │
├──────────┴───────────────────────┴───────────┤
│              MahlanyaRPG (3×1 full-width)    │
│              STEAM-STYLE CINEMATIC CARD      │
├───────────────────────────────────────────────┤
│  BRT Platform  │  Attendance  │  BEDF C2     │
│  1×1           │  1×1         │  1×1         │
└────────────────┴──────────────┴──────────────┘
```

Filter buttons (`All`, `Web`, `Security`, `AI/ML`, `Systems`, `Game`, `Institutional`) hide/show cards with Framer Motion `layout` animation — grid reflows smoothly.

---

## 6. Internal Portals

### Auth Guard
`(portal)/layout.tsx` calls `supabase.auth.getUser()` server-side. No session → `redirect('/login')`. `/onboarding` is public (outside the auth group).

### Portal Shell
- shadcn/ui `<SidebarProvider>` + `<Sidebar>`
- Collapses to icon-only rail on `md` breakpoint
- Top bar: BRT logo, current page title, live status dot, user avatar, logout
- Dark theme matching marketing site palette

### CRM (`/crm`)
- shadcn/ui `<DataTable>` with TanStack Table
- Columns: Name, Email, Status, Project type, Value (ZAR), Last contact, Actions
- Status pipeline: `Lead → Qualified → Proposal Sent → Active → Complete`
- Row click → `<Sheet>` drawer with full client detail + notes
- Data: `supabase.from('clients')`

### Proposals (`/proposals`)
- Left panel: form (client, scope, line items, timeline, total ZAR)
- Right panel: live rendered proposal preview (HTML → print CSS)
- "Send" → POST `/api/send-email` (Resend) with proposal attached
- Data: `supabase.from('proposals')`

### Invoices (`/invoices`)
- Line-item builder, quantity × rate, ZAR subtotal/tax/total
- "Generate Stripe link" → calls Stripe Payment Links API
- PDF export via `window.print()` with invoice print stylesheet
- Data: `supabase.from('invoices')`

### Onboarding (`/onboarding`) — public
- Multi-step form: contact → project type → budget → timeline → additional notes
- Submit → `supabase.from('submissions').insert()` + email notification via `/api/send-email`
- No auth required; accessible from marketing site "Start a project" CTA

### Runbooks (`/runbooks`)
- Static MDX files in `content/runbooks/`
- Rendered with `next-mdx-remote`, syntax-highlighted code blocks
- Copy-to-clipboard button on every `<pre>` block

### Status (`/status`)
- Cards for: Vercel deployment, Supabase DB, GitHub (last commit), Email (Resend), Stripe
- Each card polls its endpoint every 30s via `useEffect` + `fetch`
- Green/amber/red indicator + last-checked timestamp
- Incident log: `supabase.from('incidents')` — manual entries

---

## 7. Routing & Legacy Redirects

All existing URLs must continue to resolve:
- `/src/casestudy/sentinel-audit.html` → `301 /casestudy/sentinel-audit`
- `/src/casestudy/uav-stack.html` → `301 /casestudy/uav-stack`
- `/terms` `/privacy` `/trust` `/accessibility` → static Next.js pages
- `/onboard` → `/onboarding`

Configured in `next.config.ts` `redirects()`.

---

## 8. Performance Constraints

- Three.js scene: dynamic import with `ssr: false`, suspense fallback is static gradient
- GSAP: loaded client-side only, no SSR impact
- Framer Motion: `LazyMotion` with `domAnimation` feature bundle only
- All Unsplash images via `next/image` with `sizes` and `priority` on above-fold
- `next/font` for Geist — no FOUT, zero layout shift
- Target: LCP < 2.5s on 4G, CLS = 0

---

## 9. Deployment

- Vercel project: existing `brt-inc` project, linked to `CBahtaria/brt-inc` repo
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Build command: `next build`
- No separate staging — feature branches get Vercel preview URLs automatically

---

## 10. Out of Scope

- Native mobile app
- Custom CMS (content is hardcoded in `lib/projects.ts`)
- Internationalization
- Server-sent events / WebSocket for real-time (polling is sufficient for status dashboard)
