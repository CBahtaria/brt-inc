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

**Exception**: pure grep/bash in the orchestrating session (Fable) is faster and cheaper than spawning a Haiku agent. Only spawn Haiku when reading + light reasoning are both needed (e.g. "read this file and tell me if the invariant holds"). For bare `grep`/`find`/`wc`, use Bash directly in Fable's session.

---

## Review → Fix → Re-Review Loop

```
1. Fable dispatches implementer (sonnet or opus based on task complexity)
2. Implementer completes work, reports DONE
3. Fable reads the actual changed files (never trusts the summary alone)
4. If gaps found:
   → SendMessage({ to: <agentId>, message: "fix X — you missed Y" })
   → Implementer fixes and reports DONE again
5. Repeat — MAX 3 CORRECTION ROUNDS per task.
   Round 3 failure → do NOT re-dispatch sonnet.
   Escalate: dispatch opus to redesign the approach from scratch.
6. Fable runs `make lint` (or direct Bash grep) to spot-check key invariants
7. Task marked complete only after verification passes
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

### Hero Section (live state)
Do **not** read hardcoded descriptions — grep the file directly:
```bash
grep -n 'id="hero\|class="hero\|#particle\|#hero-reel\|camera-card\|initParticles\|initVideoScrub\|initHeroShuffle\|initCamera' index.html | head -40
```
This always reflects the current implementation, not stale docs.

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

# Merge worktree branch first if working from a worktree
git merge worktree-feature+operational-toolkit --no-edit

# Lint before deploying
make lint

# Deploy + verify
make deploy
```

`make deploy` runs `vercel --prod` then curls the live URL to confirm key elements are present. If either check prints WARN, inspect the deployment before sharing the URL.
