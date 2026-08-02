'use client'
import { useEffect, useState } from 'react'

export function ScrollProgressBar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setWidth(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, zIndex: 200, pointerEvents: 'none',
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(to right, #2dd4bf 0%, #6366f1 100%)',
          transition: 'width 0.06s linear',
        }}
      />
    </div>
  )
}
