'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/lib/projects'

const ACHIEVEMENTS = [
  { label: 'Platform', value: 'Steam' },
  { label: 'Engine', value: 'UE5 C++' },
  { label: 'Tests', value: '310 pipeline' },
]

interface Props {
  project: Project
  onOpen: (p: Project) => void
}

export function ProjectCardGaming({ project, onOpen }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layoutId={`card-${project.slug}`}
      className="relative overflow-hidden rounded-xl border cursor-pointer"
      style={{
        minHeight: 240,
        background: 'var(--surface-1)',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, var(--background) 60%)' }}
      />

      {/* Amber badge */}
      <div
        className="absolute top-4 right-4 z-20 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border"
        style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-game)', borderColor: 'rgba(245,158,11,0.25)' }}
      >
        Game
      </div>

      {/* Hover: clip-path wipe from bottom reveals video */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Replace with real trailer path when video file is available */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ opacity: 0.55 }}
              src="/videos/mahlanya-trailer.mp4"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, var(--background) 0%, var(--background)/60 40%, transparent 100%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 p-6 h-full flex flex-col justify-end">
        <h3 className="font-bold text-xl mb-1">{project.title}</h3>
        <p className="text-xs mb-5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>

        {/* Achievement stats — slide up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="flex gap-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {ACHIEVEMENTS.map(a => (
                <motion.div
                  key={a.label}
                  variants={{ hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                >
                  <div className="font-mono text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-subtle)' }}>{a.label}</div>
                  <div className="font-mono text-xs" style={{ color: 'var(--accent-game)' }}>{a.value}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
