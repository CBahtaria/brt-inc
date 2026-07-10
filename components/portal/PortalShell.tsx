import { Sidebar } from './Sidebar'

interface Props {
  children: React.ReactNode
  title: string
}

export function PortalShell({ children, title }: Props) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar />
      <div className="ml-14 md:ml-56 min-h-screen flex flex-col">
        <header
          className="h-14 flex items-center px-6 border-b sticky top-0 z-30"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <h1 className="text-sm font-medium">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
