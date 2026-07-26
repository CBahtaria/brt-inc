import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="max-w-md w-full text-center p-10 rounded-2xl"
        style={{
          background: 'rgba(13,17,23,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h1 className="text-xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
          Checkout cancelled
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          No charge was made. If you have questions before committing, reach out directly.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/#pricing"
            className="block py-2.5 rounded-lg text-sm font-medium text-white text-center"
            style={{ background: 'var(--accent)' }}
          >
            View pricing again
          </Link>
          <Link
            href="/#contact"
            className="block py-2.5 rounded-lg text-sm text-center"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Contact me first
          </Link>
        </div>
      </div>
    </main>
  )
}
