import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — BRT Inc.' }

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-32">
      <Link href="/" className="font-mono text-xs uppercase tracking-widest mb-12 block" style={{ color: 'var(--text-subtle)' }}>
        ← BRT Inc.
      </Link>
      <h1 className="text-4xl font-semibold mb-10">Privacy Policy</h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>What we collect</h2>
          <p>When you submit the contact form, we collect your name, email address, and message. We do not collect data passively — no cookies, no analytics trackers, no third-party scripts beyond what Vercel requires to serve the site.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>How we use it</h2>
          <p>Contact form submissions are used solely to reply to your enquiry. We do not sell, rent, or share your data with third parties. We do not send marketing email without explicit consent.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Data retention</h2>
          <p>Enquiry data is retained for the duration of the engagement and deleted on request. Email us at charleskris9@gmail.com to request deletion.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Hosting</h2>
          <p>This site is hosted on Vercel (San Francisco, USA). Vercel may log IP addresses and request metadata per their own privacy policy. No personally identifiable data is stored in our own databases from public site visits.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Contact</h2>
          <p>BRT Inc., Manzini, Eswatini. For privacy enquiries: charleskris9@gmail.com.</p>
        </section>

        <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>Last updated: July 2026</p>
      </div>
    </main>
  )
}
