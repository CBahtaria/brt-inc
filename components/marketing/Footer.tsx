export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="border-t py-10 px-6"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs" style={{ color: 'var(--text-subtle)' }}>
          © {year} BRT Inc. — Manzini, Eswatini
        </p>
        <nav className="flex gap-6">
          {[
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms',   label: 'Terms' },
            { href: '/trust',   label: 'Trust' },
          ].map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs hover:text-text transition-colors"
              style={{ color: 'var(--text-subtle)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
