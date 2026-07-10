'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Overview',  icon: '⬡' },
  { href: '/crm',       label: 'CRM',       icon: '◉' },
  { href: '/proposals', label: 'Proposals', icon: '◈' },
  { href: '/invoices',  label: 'Invoices',  icon: '◇' },
  { href: '/runbooks',  label: 'Runbooks',  icon: '◫' },
  { href: '/status',    label: 'Status',    icon: '◎' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-14 md:w-56 flex flex-col z-40 border-r"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      <div className="h-14 flex items-center px-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="font-mono text-xs font-bold hidden md:block">
          BRT <span style={{ color: 'var(--accent)' }}>OPS</span>
        </span>
        <span className="font-mono text-xs font-bold md:hidden">B</span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV.map(n => {
          const isActive = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
          return (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors"
              style={isActive
                ? { background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }
                : { color: 'var(--text-muted)' }}
            >
              <span className="text-base w-6 text-center flex-shrink-0">{n.icon}</span>
              <span className="hidden md:block">{n.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="text-base w-6 text-center flex-shrink-0">→</span>
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </aside>
  )
}
