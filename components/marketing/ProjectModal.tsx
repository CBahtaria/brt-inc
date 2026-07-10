'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/lib/projects'
import { useEffect } from 'react'

interface Props {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(9,9,11,0.82)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            layoutId={`card-${project.slug}`}
            className="fixed inset-x-4 top-16 bottom-8 z-50 max-w-2xl mx-auto overflow-y-auto rounded-2xl border p-8"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                  {project.categories.join(' · ')}
                </p>
                <h2 className="text-2xl font-bold">{project.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-xl leading-none transition-colors ml-4 flex-shrink-0"
                style={{ color: 'var(--text-subtle)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{project.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(t => (
                <span
                  key={t}
                  className="font-mono text-xs px-3 py-1 rounded-full border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--surface-2)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div
              className="grid grid-cols-3 gap-4 border-t pt-6"
              style={{ borderColor: 'var(--border)' }}
            >
              {project.metrics.map(m => (
                <div key={m} className="text-center">
                  <p className="font-mono text-xs" style={{ color: 'var(--accent-2)' }}>{m}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
