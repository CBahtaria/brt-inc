'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollScene } from './ScrollScene'

interface CaseStudy {
  id: string
  tag: string
  tagColor: string
  title: string
  client: string
  metric: string
  metricLabel: string
  problem: string
  approach: string[]
  result: string
  stack: string[]
}

const CASES: CaseStudy[] = [
  {
    id: 'sentinel',
    tag: 'Security Audit',
    tagColor: '#2dd4bf',
    title: 'Sentinel v5.0 — Zero open findings',
    client: 'SADC Military Institution',
    metric: '9/9',
    metricLabel: 'findings resolved',
    problem: 'An active C2 platform managing drone fleet operations had never undergone a formal security review. The system was approaching a compliance gate for broader institutional deployment.',
    approach: [
      'Static analysis across 27,900 lines of PHP 8 + Node.js',
      'Auth flow audit: session fixation, TOTP enforcement, role escalation paths',
      'Database review: 14 unparameterised queries → PDO prepared statements',
      'Security headers, env-var secret management, login lockout enforcement',
      'Audit-gated CI — any regression in security surface blocks the pipeline',
    ],
    result: '3 Critical + 6 High findings resolved. 22 files patched, 317 lines fixed, 0 regressions. Audit report delivered. CI gate active on main branch.',
    stack: ['PHP 8.3', 'MySQL 8', 'Node.js', 'PHPUnit', 'GitHub Actions'],
  },
  {
    id: 'wheels-deals',
    tag: 'Full-Stack Build',
    tagColor: '#6366f1',
    title: 'Wheels & Deals — 0 to deployed in one sprint',
    client: 'Automotive Dealership, Matsapha',
    metric: '36',
    metricLabel: 'API endpoints live',
    problem: 'A used car dealership had no digital presence. Inventory was not searchable online, there was no way for customers to enquire outside business hours, and vehicle photos had no standard pipeline.',
    approach: [
      'Next.js 16 App Router — typed vehicle catalogue with Supabase backend',
      'Procedural ASCII highway animation (30 FPS) for the hero section',
      'Thandi AI chat assistant — Haiku 4.5 with live Supabase inventory context',
      'Admin vehicle posting: password-gated, timingSafeEqual auth, Supabase insert',
      'Media pipeline: magic-byte validation → sharp WebP (150/400/800px) → CDN',
      'Anonymous analytics + scored PersonalizedFeed + 4-step UX survey',
    ],
    result: 'Live on Vercel. Inventory searchable and filterable. AI chat handles out-of-hours enquiries. Media pipeline processes uploads in under 2 seconds.',
    stack: ['Next.js 16', 'TypeScript', 'Supabase', 'sharp', 'Anthropic', 'Vercel'],
  },
  {
    id: 'studio-p',
    tag: 'Platform',
    tagColor: '#10b981',
    title: 'Studio P — Zero double-bookings since launch',
    client: 'Studio P Barbershop, Manzini',
    metric: '0',
    metricLabel: 'booking conflicts',
    problem: 'A busy barbershop was managing bookings via WhatsApp and a shared spreadsheet. Double-bookings were a weekly occurrence. Staff had no visibility into upcoming slots in real time.',
    approach: [
      'React 19 + TypeScript — OS-aware UI applied synchronously (zero layout flash)',
      'Supabase RLS — row-level security on all booking records',
      'Two-round parallel validation: availability check → conflict detection → lock',
      'PBKDF2 + Web Crypto API for client-side credential handling',
      'Real-time slot locking prevents concurrent reservation conflicts',
    ],
    result: 'Staff onboarded in one afternoon. Booking conflicts dropped to zero from day one. Deployed on Vercel with automated backups via Supabase.',
    stack: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL RLS', 'Vercel'],
  },
]

export function CaseStudies() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <ScrollScene>
      <section id="case-studies" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Case studies</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-4">Real work, real results.</h2>
        <p className="text-base mb-12 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          Three engagements from different sectors — each one scoped, agreed, and delivered with a written audit trail.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CASES.map(c => (
            <div key={c.id} className="rounded-xl border overflow-hidden" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              {/* Top accent bar */}
              <div style={{ height: 3, background: c.tagColor }} />

              <div className="p-6">
                {/* Tag + metric */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: c.tagColor + '15', color: c.tagColor, border: `1px solid ${c.tagColor}40` }}
                  >
                    {c.tag}
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-2xl font-bold leading-none" style={{ color: c.tagColor }}>{c.metric}</p>
                    <p className="font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>{c.metricLabel}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-base mb-1">{c.title}</h3>
                <p className="font-mono text-[11px] mb-4" style={{ color: 'var(--text-subtle)' }}>{c.client}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.problem}</p>

                {/* Expand / collapse */}
                <AnimatePresence>
                  {expanded === c.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Approach</p>
                          <ul className="space-y-1.5">
                            {c.approach.map((step, i) => (
                              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                                <span style={{ color: c.tagColor, flexShrink: 0 }}>›</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Result</p>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.result}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {c.stack.map(s => (
                            <span key={s} className="font-mono text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="mt-5 w-full text-center py-2 rounded-md text-xs font-mono border transition-colors"
                  style={{
                    borderColor: expanded === c.id ? c.tagColor + '60' : 'var(--border)',
                    color: expanded === c.id ? c.tagColor : 'var(--text-subtle)',
                    background: expanded === c.id ? c.tagColor + '08' : 'transparent',
                  }}
                >
                  {expanded === c.id ? '↑ Less detail' : '↓ Full breakdown'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollScene>
  )
}
