import Link from 'next/link'
import { getContentFiles } from '@/lib/content'

export const metadata = { title: 'Writing — BRT Inc.' }

export default function WritingPage() {
  const science   = getContentFiles('science')
  const research  = getContentFiles('research')
  const all = [...science, ...research].sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <main
      className="min-h-screen py-24 px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>
          Field notes
        </p>
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>Writing</h1>
        <p className="text-base mb-12" style={{ color: 'var(--text-muted)' }}>
          Technical articles on security, physics, and what I build. Free to read.
          Premium tier (R 150/mo) unlocks annotated source code and Q&amp;A on{' '}
          <a href="https://brtinc.substack.com" className="underline" style={{ color: 'var(--accent-2)' }}>Substack</a>.
        </p>

        <div className="flex flex-col gap-4">
          {all.map(post => (
            <Link
              key={post.slug}
              href={`/writing/${post.category}/${post.slug}`}
              className="group p-5 rounded-xl block transition-colors"
              style={{
                background: 'rgba(13,17,23,0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.055)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.premium && (
                      <span
                        className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
                      >
                        Premium
                      </span>
                    )}
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-subtle)' }}>{post.date}</span>
                  </div>
                  <h2
                    className="font-semibold text-base mb-1 group-hover:text-white transition-colors"
                    style={{ color: 'var(--text)' }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{post.summary}</p>
                </div>
                <span className="text-lg mt-1" style={{ color: 'var(--text-subtle)', flexShrink: 0 }}>→</span>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
