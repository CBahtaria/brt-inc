import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export default function CheckoutCancelPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center px-6 py-32">
        <div
          className="max-w-md w-full text-center p-10 rounded-2xl"
          style={{
            background: 'rgba(13,17,23,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-subtle)' }}>No worries</p>
          <h1 className="text-xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Take your time
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            No commitment made. If you have questions before reaching out, the pricing page has scope breakdowns and the trust page covers how we work.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/26879657744"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 rounded-lg text-sm font-medium text-center"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Ask via WhatsApp
            </a>
            <Link
              href="/#pricing"
              className="block py-2.5 rounded-lg text-sm font-medium text-center"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              View pricing
            </Link>
            <Link
              href="/"
              className="block py-2.5 rounded-lg text-sm text-center"
              style={{ color: 'var(--text-subtle)' }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
