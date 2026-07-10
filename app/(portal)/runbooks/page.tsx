import { PortalShell } from '@/components/portal/PortalShell'
import { RunbookList } from '@/components/portal/RunbookList'

export default function RunbooksPage() {
  return (
    <PortalShell title="Runbooks">
      <RunbookList />
    </PortalShell>
  )
}
