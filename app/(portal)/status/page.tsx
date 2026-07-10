import { PortalShell } from '@/components/portal/PortalShell'
import { StatusGrid } from '@/components/portal/StatusGrid'

export default function StatusPage() {
  return (
    <PortalShell title="System Status">
      <StatusGrid />
    </PortalShell>
  )
}
