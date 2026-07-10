import { PortalShell } from '@/components/portal/PortalShell'
import { CRMTable } from '@/components/portal/CRMTable'

export default function CRMPage() {
  return (
    <PortalShell title="CRM">
      <CRMTable />
    </PortalShell>
  )
}
