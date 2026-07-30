'use client'

export type DeviceTier = 'low' | 'mid' | 'high'

export function getDeviceProfile(): { mem: number; cores: number; conn: string; tier: DeviceTier } {
  if (typeof navigator === 'undefined') return { mem: 4, cores: 4, conn: '4g', tier: 'high' }
  const mem   = (navigator as any).deviceMemory ?? 4
  const cores = navigator.hardwareConcurrency ?? 4
  const conn  = (navigator as any).connection?.effectiveType ?? '4g'
  const tier: DeviceTier =
    mem <= 1 || cores <= 2 || conn === 'slow-2g' || conn === '2g' ? 'low'
    : mem <= 2 || cores <= 4 || conn === '3g'                      ? 'mid'
    :                                                                 'high'
  return { mem, cores, conn, tier }
}
