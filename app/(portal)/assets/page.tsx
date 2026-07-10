import { PortalShell } from '@/components/portal/PortalShell'
import { AssetGenerator } from '@/components/portal/AssetGenerator'

export const metadata = { title: 'Asset Generator — BRT Inc.' }

export default function AssetsPage() {
  return (
    <PortalShell title="Asset Generator">
      <div className="max-w-5xl">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
            Higgsfield AI
          </p>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Generate visual assets</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Images and videos for BRT Inc. — hero banners, OG images, MahlanyaRPG trailer, portfolio card assets.
          </p>
        </div>
        <AssetGenerator />
      </div>
    </PortalShell>
  )
}
