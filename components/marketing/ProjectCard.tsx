'use client'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/projects'

interface Props {
  project: Project
  onOpen: (p: Project) => void
  className?: string
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  live:       { color: '#10b981', label: 'LIVE' },
  production: { color: '#10b981', label: 'Production' },
  building:   { color: '#f59e0b', label: 'Building' },
  partial:    { color: '#f43f5e', label: 'Partial' },
  phase11:    { color: '#2dd4bf', label: 'Phase 11' },
}

export function ProjectCard({ project, onOpen, className }: Props) {
  const status = STATUS_CONFIG[project.status]

  return (
    <motion.div
      layoutId={`card-${project.slug}`}
      onClick={() => onOpen(project)}
      className={`cursor-pointer relative rounded-xl p-5 border transition-colors group ${className ?? ''}`}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      whileHover={{ y: -2, background: 'var(--surface-2)' } as any}
      transition={{ duration: 0.2 }}
    >
      {/* Status badge */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{
          background: `${status.color}20`,
          color: status.color,
          border: `1px solid ${status.color}40`,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: status.color }} />
        {status.label}
      </div>

      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="font-semibold text-sm leading-tight pr-20">{project.title}</h3>
        <div className="flex gap-1 flex-shrink-0">
          {project.categories.slice(0, 2).map(c => (
            <span
              key={c}
              className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{ background: 'var(--surface-2)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1 mb-3">
        {project.tags.slice(0, 4).map(t => (
          <span
            key={t}
            className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {project.metrics.map(m => (
          <span key={m} className="font-mono text-[10px]" style={{ color: 'var(--accent-2)' }}>{m}</span>
        ))}
      </div>
    </motion.div>
  )
}
