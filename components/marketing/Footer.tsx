export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="border-t py-12 px-6"
      style={{ background: '#000', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand + tagline */}
          <div>
            <p className="font-mono text-sm font-semibold mb-1" style={{ color: 'var(--white-80)' }}>
              BRT <span style={{ color: 'var(--accent)' }}>INC.</span>
            </p>
            <p className="font-mono text-xs" style={{ color: 'var(--white-30)' }}>
              Building sovereign infrastructure for Southern Africa.
            </p>
          </div>

          {/* Nav + socials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <nav className="flex flex-wrap gap-5">
              {[
                { href: '#marketplace', label: 'Marketplace' },
                { href: '/ecosystem',   label: 'Ecosystem',  accent: true },
                { href: '/writing',     label: 'Writing' },
                { href: '/privacy',     label: 'Privacy' },
                { href: '/terms',       label: 'Terms' },
                { href: '/trust',       label: 'Trust' },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-mono text-xs transition-colors hover:text-white"
                  style={{ color: (l as { accent?: boolean }).accent ? 'var(--accent-2)' : 'var(--white-40)' }}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/CBahtaria"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                style={{ color: 'var(--white-40)' }}
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/brt-inc-eswatini"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                style={{ color: 'var(--white-40)' }}
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--white-20)' }}>
            © {year} BRT Inc. — Manzini, Technology Park, Eswatini · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
