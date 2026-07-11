import { PortalShell } from '@/components/portal/PortalShell'
import { ProposalEditor } from '@/components/portal/ProposalEditor'

export const metadata = { title: 'Proposals — BRT Inc.' }

export default function ProposalsPage() {
  return (
    <PortalShell title="Proposals">
      <ProposalEditor />
    </PortalShell>
  )
}
