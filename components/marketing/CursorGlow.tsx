'use client'
import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
      }
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: -300,
        left: -300,
        width: 600,
        height: 600,
        background: 'radial-gradient(circle at center, rgba(45,212,191,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
    />
  )
}
