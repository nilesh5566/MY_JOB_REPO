'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ClerkProvider, SignIn, useAuth } from '@clerk/nextjs'

const KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Runs once Clerk says the visitor is signed in: swaps the Clerk session for a TalentLaunch token.
function Bridge() {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const ran = useRef(false)
  useEffect(() => {
    if (!isLoaded || !isSignedIn || ran.current) return
    ran.current = true
    ;(async () => {
      try {
        const t = await getToken()
        const r = await fetch('/api/auth/clerk', { method: 'POST', headers: { Authorization: `Bearer ${t}` } })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Sign-in failed')
        localStorage.removeItem('tl_token'); localStorage.setItem('tl_user', JSON.stringify(d.user))
        router.push('/dashboard')
      } catch (e: any) { setError(e.message || 'Sign-in failed'); await signOut().catch(() => {}); ran.current = false }
    })()
  }, [isLoaded, isSignedIn, getToken, signOut, router])
  if (error) return <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mt-4">{error}</div>
  if (isSignedIn) return <p className="text-sm text-[var(--t2)] mt-4 text-center">Signing you in…</p>
  return null
}

export default function ClerkLoginPage() {
  if (!KEY) return (
    <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-8 max-w-md text-center">
      <h1 className="font-display font-bold text-xl mb-2">Clerk sign-in is not set up</h1>
      <p className="text-sm text-[var(--t2)] mb-4">Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable it.</p>
      <Link href="/login" className="text-cyan-400 font-semibold">← Back to sign in</Link>
    </div>
  )
  return (
    <ClerkProvider publishableKey={KEY}>
      <div className="w-full max-w-md flex flex-col items-center">
        <SignIn routing="hash" signUpUrl="#/sign-up" fallbackRedirectUrl="/clerk-login" />
        <Bridge />
        <Link href="/login" className="text-sm text-cyan-400 font-semibold mt-4">← Use email and password instead</Link>
      </div>
    </ClerkProvider>
  )
}
