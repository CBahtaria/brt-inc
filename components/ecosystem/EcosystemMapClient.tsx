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
  const [tier, setTier] = useState<DeviceTier>('high')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const { tier: detectedTier } = getDeviceProfile()
    setTier(detectedTier)
  }, [])

  if (reducedMotion || tier === 'low' || tier === 'mid') {
    return <EcosystemSection />
  }

  return <EcosystemMap3D />
}
