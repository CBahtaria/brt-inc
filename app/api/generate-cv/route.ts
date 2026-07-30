import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, client, sections } = body as {
    title?: string
    client?: string
    sections?: Record<string, string>
  }

  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  // Check if rendercv is available
  try {
    await execAsync('rendercv --version')
  } catch {
    return NextResponse.json({
      error: 'PDF generation unavailable',
      hint: 'Install rendercv: pip install rendercv',
      fallback: 'Use browser print (Ctrl+P) on the proposal preview page',
    }, { status: 503 })
  }

  const jobId = randomUUID()
  const workDir = join(tmpdir(), `brt-proposal-${jobId}`)
  await mkdir(workDir, { recursive: true })

  const yamlContent = buildProposalYaml({ title, client, sections, author: user.email ?? 'BRT Inc.' })
  const yamlPath = join(workDir, 'proposal.yaml')
  await writeFile(yamlPath, yamlContent, 'utf8')

  try {
    await execAsync(`rendercv render "${yamlPath}" --pdf-path "${workDir}/output.pdf"`, {
      timeout: 30000,
    })
    const pdf = await readFile(join(workDir, 'output.pdf'))
    await unlink(yamlPath).catch(() => {})
    await unlink(join(workDir, 'output.pdf')).catch(() => {})

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BRT-Proposal-${String(title).replace(/[^a-z0-9]/gi, '-')}.pdf"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'PDF generation failed', detail: String(err) }, { status: 502 })
  }
}

function buildProposalYaml(opts: {
  title: string
  client?: string
  sections?: Record<string, string>
  author: string
}): string {
  const sectionEntries = Object.entries(opts.sections ?? {})
    .map(([k, v]) => `    ${k.replace(/\s+/g, '_').toLowerCase()}:\n      - "${v.replace(/"/g, "'")}"`)
    .join('\n')

  return `cv:
  name: BRT Inc. — ${opts.title}
  email: charleskris9@gmail.com
  website: https://brtinc.dev
  sections:
    prepared_for:
      - label: Client
        details: "${opts.client ?? 'Confidential'}"
      - label: Author
        details: "${opts.author}"
      - label: Date
        details: "${new Date().toISOString().split('T')[0]}"
${sectionEntries}
design:
  theme: classic
  font_size: 10pt
  page_size: a4paper
  color: '#0f172a'
  disable_page_numbering: false
`
}
