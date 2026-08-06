# BRT Inc. — CLAUDE.md

## Role: Orchestrator

The current Claude Code session is the **Orchestrator** — planner, dispatcher, and final reviewer. The Orchestrator does not write code directly. It designs the approach, dispatches child agents with exactly the right context, reviews their output against actual changed files, and issues correction commands until each task is approved.

The Orchestrator never says "this looks good" without reading the actual diff.

---

## Blocking Gates (must be satisfied before any commit to main)

**Phase 1 — Secret scan. Never proceed past this step until it passes.**
```bash
gitleaks detect --source . --no-git
```
`gitleaks detect` must return 0 findings. Any Supabase service-role key, Stripe live key, or Resend API key in source is an immediate STOP — do not proceed, do not commit.

**Phase 2 — Security CI.**
```bash
# Verify all internal pages include auth.js
grep -rL 'src/js/auth.js' src/ --include="*.html" | grep -v login.html | grep -v onboarding
```
Output must be empty. Any internal page missing `auth.js` is a blocker.

**Phase 3 — Lint.**
```bash
make lint
```
Must pass clean. Fix all warnings before committing.

---

## Agent Dispatch Rules

### Use `model: "opus"` (`claude-opus-4-7`) for:
- Architecture decisions — layout changes, new CSS systems, new JS modules
- Multi-file coordination — changes spanning HTML + CSS + JS + vercel.json together
- Review passes — reading implementer output and deciding if it meets spec
- Security review — any change touching auth, RLS, CSP, or key handling
- Debugging — root cause analysis when something breaks unexpectedly
- Any task where wrong judgment = visible regression on production

### Use `model: "sonnet"` (`claude-sonnet-4-6`) for:
- Mechanical implementation against a complete spec (Orchestrator has already designed it)
- Single-section HTML/CSS edits with clear before/after
- Scripted JS additions (new isolated function, new event listener)
- File writes where the exact content is already decided
- Fixing issues called out by the reviewer

### Use `model: "haiku"` (`claude-haiku-4-5`) for:
- File reads and grep — "does X exist in this file?"
- Verification — "did the edit land correctly?"
- Line count, structure checks, syntax validation
- Quick searches across the repo
- Running blocking gates and reporting pass/fail

**Exception**: pure grep/bash in the orchestrating session is faster and cheaper than spawning a Haiku agent. Only spawn Haiku when reading + light reasoning are both needed (e.g. "read this file and tell me if the invariant holds"). For bare `grep`/`find`/`wc`, use Bash directly.

---

## Review → Fix → Re-Review Loop

```
1. Orchestrator dispatches implementer (sonnet or opus based on task complexity)
2. Implementer completes work, reports DONE
3. Orchestrator reads the actual changed files (never trusts the summary alone)
4. If gaps found:
   → SendMessage({ to: <agentId>, message: "fix X — you missed Y" })
   → Implementer fixes and reports DONE again
5. Repeat — MAX 3 CORRECTION ROUNDS per task.
   Round 3 failure → do NOT re-dispatch sonnet.
   Escalate: dispatch opus to redesign the approach from scratch.
6. Orchestrator runs blocking gates (gitleaks, auth.js check, make lint)
7. Task marked complete only after all gates pass
```

Never move to the next task while the current task has open issues.

---

## Review Rubric

An agent's work is **APPROVED** only if ALL of the following hold:

| # | Criterion | How to verify |
|---|-----------|---------------|
| a | Every file the agent claims to have touched has a visible diff | `git diff --name-only` matches the agent's report |
| b | Every finding has a fix AND a verification step | Finding IDs map 1-to-1 in the agent record below |
| c | No new secrets committed | `gitleaks detect` → 0 findings |
| d | Every test the agent named actually ran and passed | Test output included in agent record, no skips |
| e | No doc claim contradicts source | Cross-check any prose claim against the actual file before marking done |

A "looks good" without satisfying all five is not an approval.

---

## Agent Record Schema

Each completed task must have a record in YAML format:

```yaml
agent:         # agent ID or session label
model:         # opus | sonnet | haiku
phase:         # phase number or name within the task
status:        # DONE | NEEDS_REVIEW | BLOCKED
files_touched:
  - path/to/file.ext
findings:
  - id:          F-001
    severity:    high | medium | low | info
    title:       Short description
    fix:         What was changed
    verified_by: Command or manual step that confirmed the fix
tests_run:
  - name: test suite or script name
    command: make lint / npm test / etc.
tests_result: PASS | FAIL | SKIP
residual_risk: >
  Any known limitation, deferred item, or assumption that must be
  revisited before production release.
```

---

## Project: BRT Inc. Website

**Repo root**: `/home/cbartaria1/my-projects/personal/CBahtaria/brt-inc/`
**Deploy**: push to GitHub (`CBahtaria/brt-inc`) → Vercel auto-deploys via GitHub integration
**Live URL**: `brtinc.dev` (Vercel project: `brt-inc`, team: `sir-charles-projects`)

### Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Supabase for auth + data (CRM, proposals, invoices, runbooks, agreements)
- Vercel for hosting + serverless API routes (`app/api/`)
- Framer Motion v11 + GSAP + Three.js + D3 for animations and visualizations
- Stripe for payments (checkout + customer portal)
- Resend for transactional email

### File Map
```
app/
  page.tsx                     ← homepage (Nav, Hero, ProductSection ×5, Contact, Footer)
  layout.tsx                   ← root layout
  (portal)/                    ← auth-gated: dashboard, crm, proposals, invoices, assets, runbooks, status
  marketplace/                 ← public SADC B2B marketplace (5 pages)
  ecosystem/page.tsx           ← 3D ecosystem map (EcosystemMap3D)
  writing/                     ← MDX blog (category/slug routing)
  api/                         ← serverless: contact, send-email, generate, healthcheck, stripe, marketplace
components/
  marketing/                   ← landing page sections (ProductSection, Hero, CaseStudies, Pricing, etc.)
  ecosystem/                   ← EcosystemMap3D, EcosystemMapClient
  portal/                      ← CRMTable, ProposalEditor, InvoiceBuilder, AssetGenerator, etc.
  writing/WritingClient.tsx
lib/                           ← higgsfield.ts, motion.ts, supabase.ts, stripe.ts, etc.
content/                       ← MDX articles (research/, science/, security/)
supabase/migrations/           ← DB schema (001, 002; 003 pending for service_agreements + runbook_templates)
public/
  business-card.html           ← print-ready business card (Next.js 16.2.10 + React 19 + TypeScript)
```

### Security Rules
- No hardcoded Stripe live keys, no raw Supabase service-role JWT in source
- Portal routes protected via Supabase session middleware in `(portal)/layout.tsx`
- API routes requiring auth validate Supabase Bearer token before processing

---

## Coding Standards

- No new files unless the feature genuinely requires a separate component or page
- No comments unless the WHY is non-obvious
- Tailwind only — no inline `style={}` for layout; CSS variables via `globals.css` for theme tokens
- All new portal pages must be inside `app/(portal)/` — Supabase session checked by layout
- `prefers-reduced-motion` guard on every new animation
- `npm run build` must pass before any commit — 0 type errors, 0 missing imports

---

## Deployment

Push to `main` on GitHub (`CBahtaria/brt-inc`) — Vercel auto-deploys via GitHub integration. No manual `vercel --prod` required.

```bash
# Blocking gates before pushing to main
gitleaks detect --source . --no-git
npm run build   # must produce 0 type errors
```

---

## Security Gates (blocking)

These three gates must pass before any PR is merged to main. CI enforces all three; the Orchestrator also runs them locally before dispatching a deploy.

**Gate 1 — gitleaks (must pass first, blocks all downstream jobs)**
```bash
gitleaks detect --source . --no-git
```
Zero findings required. Any Supabase service-role key, Stripe live key, or Resend API key is an immediate STOP. The `secret-scan` job in both `deploy.yml` and `security.yml` runs this; all other jobs declare `needs: secret-scan`.

**Gate 2 — npm audit (no high or critical)**
```bash
npm audit --production --audit-level=high
```
Zero high/critical findings in production dependencies. Run after `npm ci --ignore-scripts` to avoid script injection during install. The `npm-audit` job in `security.yml` runs this on schedule (weekly Monday 06:00 UTC) and on every PR.

**Gate 3 — no client secrets in bundle (grep gate)**
```bash
# No Supabase service-role JWT in any bundled JS/HTML
grep -rniE 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.' \
  --include="*.html" --include="*.js" --exclude="supabase-client.js" src/ api/ 2>/dev/null
# Must return empty. Any match = STOP.
```
The `check-no-secrets-in-source` job in `security.yml` covers Stripe and Supabase JWT patterns. Supabase anon key (`VITE_SUPABASE_ANON_KEY`) is acceptable in `.env.example` only — never in committed source.
