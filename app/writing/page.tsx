import { getContentFiles } from '@/lib/content'
import WritingClient from '@/components/writing/WritingClient'

export const metadata = {
  title: 'Writing — Security Research & AI Engineering',
  description: 'Technical writing on AI security, autonomous systems, institutional surveillance risks, and software engineering for southern African governments and institutions.',
  keywords: ['AI security Africa', 'cybersecurity SADC', 'surveillance research', 'autonomous systems research', 'institutional AI risk'],
  alternates: { canonical: 'https://brtinc.dev/writing' },
}

export default function WritingPage() {
  const science  = getContentFiles('science')
  const research = getContentFiles('research')
  const security = getContentFiles('security')
  const all = [...science, ...research, ...security].sort((a, b) => (a.date > b.date ? -1 : 1))

  return <WritingClient posts={all} />
}
