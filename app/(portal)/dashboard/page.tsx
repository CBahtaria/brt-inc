import { PortalShell } from '@/components/portal/PortalShell'
import { DashboardOverview } from '@/components/portal/DashboardOverview'

export const metadata = { title: 'Dashboard — BRT Inc.' }

export default function DashboardPage() {
  return (
    <PortalShell title="Overview">
      <DashboardOverview />
    </PortalShell>
  )
}
