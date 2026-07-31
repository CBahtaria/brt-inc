import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export default function EnquiryConfirmedPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center px-6 py-32">
        <div
          className="max-w-md w-full text-center p-10 rounded-2xl"
          style={{
            background: 'rgba(13,17,23,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(45,212,191,0.3)',
            boxShadow: '0 0 0 1px rgba(45,212,191,0.1), 0 24px 48px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#2dd4bf' }}>Enquiry received</p>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            You&apos;re in the queue
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            I will respond within one business day to discuss scope, timeline, and send a service agreement for review. If you need a faster response, WhatsApp is monitored daily.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/26879657744"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 rounded-lg text-sm font-medium text-center"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              WhatsApp +268 7965 7744
            </a>
            <Link
              href="/onboarding"
              className="block py-2.5 rounded-lg text-sm font-medium text-center"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              Complete intake form
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
