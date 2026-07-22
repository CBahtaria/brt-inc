'use client'
import { useEffect, useRef, useState } from 'react'

const LINES = [
  { delay: 0,    text: 'BRT INC. ECOSYSTEM — BOOT SEQUENCE v6.0',  type: 'header'  },
  { delay: 180,  text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'divider' },
  { delay: 400,  text: 'NATS JetStream .............. [ONLINE]',    type: 'ok'      },
  { delay: 600,  text: 'Safety Governor (DAL-A) ..... [ARMED]',     type: 'armed'   },
  { delay: 800,  text: 'Agentic UAV Stack SRL-6 ..... [ONLINE]',    type: 'ok'      },
  { delay: 1000, text: 'Second Brain (17 tasks) ..... [ONLINE]',    type: 'ok'      },
  { delay: 1200, text: 'Sentinel v5 ................. [ONLINE]',    type: 'ok'      },
  { delay: 1400, text: 'Zig Bridge AES-GCM-256 ...... [SECURED]',   type: 'secure'  },
  { delay: 1600, text: 'BRT Ecosystem (edge) ........ [ACTIVE]',    type: 'ok'      },
  { delay: 1800, text: 'Lets Connect Eswatini ....... [BUILDING]',  type: 'warn'    },
  { delay: 2000, text: 'Likhona Lami ................ [ONLINE]',    type: 'ok'      },
  { delay: 2200, text: 'MahlanyaRPG Phase 11 ........ [ACTIVE]',    type: 'ok'      },
  { delay: 2400, text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'divider' },
  { delay: 2600, text: 'DAL-A GATES   15 / 15  ......... [PASS]',   type: 'ok'      },
  { delay: 2750, text: 'VULN SCAN     9 personas ...... [CLEAR]',   type: 'ok'      },
  { delay: 2900, text: 'TESTS PASSING 1,466+ ........... [PASS]',   type: 'ok'      },
  { delay: 3100, text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: 'divider' },
  { delay: 3300, text: 'ALL SYSTEMS NOMINAL — MANZINI, ESWATINI',  type: 'final'   },
]

const TYPE_COLOR: Record<string, string> = {
  header:  '#2dd4bf',
  divider: '#27272a',
  ok:      '#a1a1aa',
  armed:   '#f59e0b',
  secure:  '#6366f1',
  warn:    '#f59e0b',
  final:   '#fafafa',
}

const STATUS_COLOR: Record<string, string> = {
  ONLINE: '#10b981', ARMED: '#f59e0b', SECURED: '#6366f1',
  ACTIVE: '#2dd4bf', BUILDING: '#f59e0b', PASS: '#10b981',
  CLEAR: '#10b981',
}

function colorizeStatus(text: string) {
  return text.replace(/\[(.*?)\]/, (_, status) => {
    const c = STATUS_COLOR[status] ?? '#a1a1aa'
    return `<span style="color:${c};font-weight:700">[${status}]</span>`
  })
}

export function TerminalBoot() {
  const [visible, setVisible] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const [cursor, setCursor] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)')
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered.current) {
        triggered.current = true

        if (pref.matches) {
          setVisible(LINES.map((_, i) => i))
          setDone(true)
          return
        }

        LINES.forEach((l, i) => {
          setTimeout(() => {
            setVisible(prev => [...prev, i])
            if (i === LINES.length - 1) setTimeout(() => setDone(true), 200)
          }, l.delay)
        })
      }
    }, { threshold: 0.3 })

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Blinking cursor
  useEffect(() => {
    if (done) return
    const id = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(id)
  }, [done])

  return (
    <section
      ref={ref}
      className="py-24 px-4 md:px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
          System Status
        </p>

        <div
          className="rounded-xl border p-4 md:p-6 overflow-auto"
          style={{
            background: '#080a0d',
            borderColor: 'rgba(45,212,191,0.15)',
            boxShadow: '0 0 40px rgba(45,212,191,0.04)',
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: '#f43f5e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
            <span className="ml-3 text-xs" style={{ color: '#52525b' }}>brt-inc — boot.sh</span>
          </div>

          {/* Output lines */}
          <div className="space-y-1 text-xs md:text-sm leading-relaxed min-h-[280px]">
            {LINES.map((line, i) => (
              visible.includes(i) ? (
                <div
                  key={i}
                  className="flex items-baseline gap-2 whitespace-pre"
                  style={{ opacity: 1, color: TYPE_COLOR[line.type] ?? '#a1a1aa' }}
                >
                  {line.type !== 'divider' && line.type !== 'header' && line.type !== 'final' && (
                    <span style={{ color: '#52525b' }}>$</span>
                  )}
                  <span
                    dangerouslySetInnerHTML={{ __html: colorizeStatus(line.text) }}
                  />
                </div>
              ) : null
            ))}

            {/* Cursor */}
            {!done && (
              <div className="flex items-center gap-2">
                <span style={{ color: '#52525b' }}>$</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px', height: '14px',
                    background: cursor ? 'var(--accent-2)' : 'transparent',
                    verticalAlign: 'middle',
                  }}
                />
              </div>
            )}

            {/* Final line after done */}
            {done && (
              <div className="mt-4 flex items-center gap-2">
                <span style={{ color: '#52525b' }}>$</span>
                <span style={{ color: 'var(--accent-2)' }}>_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
