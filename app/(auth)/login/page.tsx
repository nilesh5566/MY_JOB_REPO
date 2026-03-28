'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('tl_token', data.token)
        localStorage.setItem('tl_user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch { setError('Cannot connect to server') }
    setLoading(false)
  }

  return (
    <div className="relative w-full max-w-md animate-fade-up">
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">TL</div>
            <span className="font-display font-bold text-xl glow-text">TalentLaunch</span>
          </Link>
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-sm text-[var(--t2)] mt-1">Sign in to continue your career journey</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="mt-1.5 w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-colors placeholder:text-[var(--t3)]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="mt-1.5 w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-colors placeholder:text-[var(--t3)]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--t2)]">
          Don't have an account?{' '}
          <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300">Create one free</Link>
        </div>
      </div>
    </div>
  )
}
