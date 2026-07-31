'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getDeviceProfile, DeviceTier } from '@/lib/device-profile'
import { EcosystemSection } from '@/components/marketing/EcosystemSection'

const EcosystemMap3D = dynamic(
  () => import('./EcosystemMap3D'),
  { ssr: false }
)

export function EcosystemMapClient() {
  const [mounted, setMounted] = useState(false)
  const [tier, setTier] = useState<DeviceTier>('high')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const { tier: detectedTier } = getDeviceProfile()
    setTier(detectedTier)
  }, [])

  // SSR + initial hydration: always render the static fallback.
  // EcosystemMap3D is ssr:false (dynamic lazy) — attempting to render it
  // server-side causes React to bail out the entire component tree.
  if (!mounted || reducedMotion || tier === 'low' || tier === 'mid') {
    return <EcosystemSection />
  }

  return <EcosystemMap3D />
}
