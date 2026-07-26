import { getContentFiles } from '@/lib/content'
import WritingClient from '@/components/writing/WritingClient'

export const metadata = { title: 'Writing — BRT Inc.' }

export default function WritingPage() {
  const science  = getContentFiles('science')
  const research = getContentFiles('research')
  const security = getContentFiles('security')
  const all = [...science, ...research, ...security].sort((a, b) => (a.date > b.date ? -1 : 1))

  return <WritingClient posts={all} />
}
