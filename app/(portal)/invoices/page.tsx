import { PortalShell } from '@/components/portal/PortalShell'
import { InvoiceBuilder } from '@/components/portal/InvoiceBuilder'

export const metadata = { title: 'Invoices — BRT Inc.' }

export default function InvoicesPage() {
  return (
    <PortalShell title="Invoices">
      <InvoiceBuilder />
    </PortalShell>
  )
}
