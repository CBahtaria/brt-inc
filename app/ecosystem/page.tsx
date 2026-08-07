import { EcosystemHeader } from '@/components/ecosystem/EcosystemHeader'
import { EcosystemMapClient } from '@/components/ecosystem/EcosystemMapClient'

export const metadata = {
  title: 'Technology Ecosystem — BRT Inc.',
  description: 'Interactive map of the BRT Inc. technology ecosystem: autonomous systems, AI platforms, privacy tools, institutional software, and SADC digital infrastructure.',
  keywords: ['BRT technology stack', 'SADC AI ecosystem', 'autonomous systems Africa', 'software ecosystem Eswatini'],
  openGraph: {
    title: 'BRT Inc. Technology Ecosystem',
    description: 'Interactive 3D map of the full BRT product and platform ecosystem across SADC.',
    url: 'https://brtinc.dev/ecosystem',
  },
  alternates: { canonical: 'https://brtinc.dev/ecosystem' },
}

export default function EcosystemPage() {
  return (
    <main className="flex flex-col" style={{ minHeight: '100vh' }}>
      <EcosystemHeader />

      <EcosystemMapClient />
    </main>
  )
}
