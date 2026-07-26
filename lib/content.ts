import fs from 'fs'
import path from 'path'

export interface ContentMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  premium: boolean
  category: string
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function getContentFiles(category: string): ContentMeta[] {
  const dir = path.join(CONTENT_ROOT, category)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const frontmatter = parseFrontmatter(raw)
      const slug = file.replace(/\.(mdx|md)$/, '')
      return { slug, category, ...frontmatter } as ContentMeta
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

function parseFrontmatter(raw: string): Partial<ContentMeta> {
  const match = raw.match(/^---\n([\s\S]+?)\n---/)
  if (!match) return {}
  const block = match[1]
  const get = (key: string) => {
    const m = block.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))
    return m?.[1]?.trim()
  }
  const tags = block.match(/^tags:\s*\[([^\]]+)\]$/m)?.[1]
    ?.split(',').map(t => t.trim().replace(/"/g, '')) ?? []

  return {
    title:   get('title')   ?? '',
    date:    get('date')    ?? '',
    summary: get('summary') ?? '',
    premium: get('premium') === 'true',
    tags,
  }
}
