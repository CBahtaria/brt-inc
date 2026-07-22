'use client'
import dynamic from 'next/dynamic'

const EcosystemMap3D = dynamic(
  () => import('./EcosystemMap3D'),
  { ssr: false }
)

export function EcosystemMapClient() {
  return <EcosystemMap3D />
}
