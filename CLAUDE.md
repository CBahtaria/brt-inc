# BRT Inc. — CLAUDE.md

## Role: Fable (Orchestrator)

The current Claude Code session is **Fable** — the orchestrator and final reviewer. Fable does not write code directly. It plans, dispatches child agents with exactly the right context, reviews their output, and sends correction commands until each task is approved.

Fable never says "this looks good" without checking the actual changed files.

---

## Agent Dispatch Rules

### Use `model: "opus"` for:
- Architecture decisions — layout changes, new CSS systems, new JS modules
- Multi-file coordination — changes that span HTML + CSS + JS + vercel.json together
- Review passes — reading child agent output and deciding if it meets spec
- Debugging — root cause analysis when something breaks unexpectedly
- Any task where wrong judgment = visible regression on production

### Use `model: "sonnet"` for:
- Mechanical implementation against a complete spec (Fable has already designed it)
- Single-section HTML/CSS edits with clear before/after
- Scripted JS additions (new isolated function, new event listener)
- File writes where the exact content is already decided
- Fixing issues called out by the reviewer

### Use `model: "haiku"` for:
- File reads and grep — "does X exist in this file?"
- Verification — "did the edit land correctly?"
- Line count, structure checks, syntax validation
- Quick searches across the repo

---

## Review → Fix → Re-Review Loop

```
1. Fable dispatches implementer (sonnet or opus based on task complexity)
2. Implementer completes work, reports DONE
3. Fable reads the actual changed files (never trusts the summary alone)
4. If gaps found:
   → SendMessage({ to: <agentId>, message: "fix X — you missed Y" })
   → Implementer fixes and reports DONE again
5. Repeat until Fable confirms the file matches spec
6. Fable dispatches haiku verifier to spot-check key lines
7. Task marked complete only after haiku confirms
```

Never move to the next task while the current task has open issues.

---

## Project: BRT Inc. Website

**Repo root**: `/home/cbartaria1/brt-inc/`  
**Worktree**: `/home/cbartaria1/brt-inc/.claude/worktrees/feature+operational-toolkit/`  
**Deploy**: `vercel --prod` from repo root (CLI, not GitHub)  
**Live URL**: `brtinc.vercel.app`

### Stack
- Pure HTML/CSS/JS — single-page (`index.html`), no build step
- Supabase for auth + data (CRM, onboarding, agreements)
- Vercel for hosting + API routes (`/api/send-email.js`, `/api/stripe-webhook.js`)
- MediaPipe Hands (CDN, deferred) for hand tracking hero

### File Map
```
index.html                     ← landing page (hero, services, portfolio, pricing, contact)
tools.html                     ← internal operator dashboard (auth-gated)
vercel.json                    ← headers (CSP, Permissions-Policy), rewrites
src/
  js/auth.js                   ← requireAuth() + logout() for all internal pages
  js/db.js                     ← Supabase CRUD: clients, submissions, agreements
  js/supabase-client.js        ← Supabase client init
  crm/crm.html                 ← kanban + table CRM (auth-gated)
  proposals/                   ← proposal generator + invoice (auth-gated)
  agreements/service-agreement.html
  runbooks/runbook-templates.html
  onboarding/onboarding-form.html   ← public intake form
  casestudy/sentinel-audit.html
  login/login.html
  status/status-dashboard.html
api/
  send-email.js                ← Vercel serverless: email via Resend
  stripe-webhook.js            ← Stripe webhook handler
supabase/migrations/           ← DB schema
```

### Security Rules (enforced by CI)
- Every internal page MUST include `src/js/auth.js` — checked by `.github/workflows/security.yml`
- No hardcoded Stripe live keys, no raw Supabase JWT service role keys in source
- CSP blocks inline scripts except `'unsafe-inline'` (existing constraint)
- `Permissions-Policy: camera=(self)` — only this origin can request camera

### Hero Section (current state)
- Two-column grid: left = content, right = video frame + camera card
- `#particle-canvas` — 60-dot connected graph, `requestAnimationFrame` loop
- `#hero-reel` — scroll-driven video scrub (`video.currentTime = progress * duration`)
- `.camera-card` — MediaPipe hand skeleton (21 landmarks), opt-in on button click
- Hand tracking scroll: wrist Y position → `window.scrollTo()`
- Auto-shuffle: 3 hero variants rotate every 6s with fade transition
- Responsive: single column ≤1100px, `.hero-right` hidden ≤600px

---

## Coding Standards

- No new files unless the feature genuinely requires a separate page
- No comments unless the WHY is non-obvious
- No TypeScript, no build tools, no npm in the website repo
- CSS variables only — no hardcoded colour values in new rules
- All new internal pages must `<script src="/src/js/auth.js">` (CI enforces this)
- `esc()` for any user-controlled data rendered into HTML
- `prefers-reduced-motion` guard on every new animation

---

## Deployment

```bash
# Always deploy from the main brt-inc directory (not the worktree)
cd /home/cbartaria1/brt-inc
vercel --prod
```

After pushing to the worktree branch, merge into main before deploying:
```bash
git -C /home/cbartaria1/brt-inc merge worktree-feature+operational-toolkit --no-edit
```
