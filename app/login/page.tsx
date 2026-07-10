'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 border border-border rounded-xl bg-surface-1 space-y-4">
        <h1 className="text-xl font-bold mb-6">BRT Inc. // Login</h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/50"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/50"
        />
        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent text-white font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
