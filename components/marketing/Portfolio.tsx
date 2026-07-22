'use client'
import { useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { PROJECTS, type FilterCategory, type Project } from '@/lib/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectCardGaming } from './ProjectCardGaming'
import { ProjectModal } from './ProjectModal'
import { ScrollScene } from './ScrollScene'

const FILTERS: { label: string; value: FilterCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Platform', value: 'platform' },
  { label: 'Security', value: 'security' },
  { label: 'AI/ML', value: 'ai' },
  { label: 'Systems', value: 'systems' },
  { label: 'Game', value: 'game' },
  { label: 'Institutional', value: 'institutional' },
]

export function Portfolio() {
  const [active, setActive] = useState<FilterCategory | 'all'>('all')
  const [modal, setModal] = useState<Project | null>(null)

  const filtered = active === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.categories.includes(active as FilterCategory))

  return (
    <ScrollScene>
      <section id="portfolio" className="py-32 max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>Portfolio</p>
        <h2 className="text-4xl lg:text-5xl font-semibold mb-10">Shipped work.</h2>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects by category">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className="font-mono text-xs px-4 py-2 rounded-full border transition-colors"
              style={active === f.value
                ? { borderColor: 'var(--accent)', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }
                : { borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-3 gap-4 auto-rows-[220px]">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => {
                const isGaming = p.variant === 'gaming'
                const colSpan = isGaming ? 'col-span-3' : p.featured ? 'col-span-2' : p.wide ? 'col-span-2' : 'col-span-1'
                const rowSpan = p.featured ? 'row-span-2' : 'row-span-1'

                return (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className={`${colSpan} ${rowSpan}`}
                  >
                    {isGaming ? (
                      <ProjectCardGaming project={p} onOpen={setModal} />
                    ) : (
                      <ProjectCard project={p} onOpen={setModal} className="h-full" />
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        <ProjectModal project={modal} onClose={() => setModal(null)} />
      </section>
    </ScrollScene>
  )
}
