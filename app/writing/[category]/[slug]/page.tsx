import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

interface Params { category: string; slug: string }

export async function generateStaticParams() {
  const root = path.join(process.cwd(), 'content')
  if (!fs.existsSync(root)) return []
  const params: Params[] = []
  for (const category of fs.readdirSync(root)) {
    const dir = path.join(root, category)
    if (!fs.statSync(dir).isDirectory()) continue
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        params.push({ category, slug: file.replace(/\.(mdx|md)$/, '') })
      }
    }
  }
  return params
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params
  const extensions = ['.mdx', '.md']
  let filePath = ''
  let source = ''

  for (const ext of extensions) {
    const candidate = path.join(process.cwd(), 'content', category, `${slug}${ext}`)
    if (fs.existsSync(candidate)) {
      filePath = candidate
      source = fs.readFileSync(filePath, 'utf-8')
      break
    }
  }

  if (!source) notFound()

  // Strip frontmatter for MDX rendering
  const body = source.replace(/^---[\s\S]+?---\n/, '')

  // Extract title from frontmatter
  const titleMatch = source.match(/^title:\s*"?([^"\n]+)"?/m)
  const title = titleMatch?.[1] ?? slug
  const dateMatch = source.match(/^date:\s*"?([^"\n]+)"?/m)
  const date = dateMatch?.[1] ?? ''

  return (
    <main
      className="min-h-screen py-24 px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1 font-mono text-xs mb-10 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-subtle)' }}
        >
          ← Writing
        </Link>

        <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-subtle)' }}>{date}</p>
        <h1 className="text-3xl lg:text-4xl font-bold mb-10 leading-tight" style={{ color: 'var(--text)' }}>{title}</h1>

        <article
          className="prose prose-invert prose-sm max-w-none"
          style={{
            '--tw-prose-body': 'var(--text-muted)',
            '--tw-prose-headings': 'var(--text)',
            '--tw-prose-links': 'var(--accent-2)',
            '--tw-prose-code': 'var(--accent)',
            lineHeight: '1.75',
          } as React.CSSProperties}
        >
          <MDXRemote source={body} />
        </article>

        <div
          className="mt-16 p-6 rounded-xl"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Get the annotated version</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Premium subscribers on Substack get derivations, worked examples, and direct Q&amp;A access for R 150/mo.
          </p>
          <a
            href="https://brtinc.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Subscribe on Substack
          </a>
        </div>
      </div>
    </main>
  )
}
