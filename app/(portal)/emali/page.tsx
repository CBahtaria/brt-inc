import { PortalShell } from '@/components/portal/PortalShell'
import { EmaliReferences } from '@/components/portal/EmaliReferences'

export const metadata = { title: 'eMali — BRT Inc.' }

export default function EmaliPage() {
  return (
    <PortalShell title="eMali payment references">
      <EmaliReferences />
    </PortalShell>
  )
}
