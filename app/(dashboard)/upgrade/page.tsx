'use client'
import { readJSON } from '@/lib/storage'
import { useEffect, useRef, useState } from 'react'

declare global { interface Window { paypal?: any } }

export default function UpgradePage() {
  const box = useRef<HTMLDivElement>(null)
  const [plan, setPlan] = useState('free')
  const [msg, setMsg] = useState('')
  const [ready, setReady] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  useEffect(() => { try { setPlan(readJSON('tl_user','{}').plan || 'free') } catch {} }, [])

  useEffect(() => {
    if (!clientId || plan === 'pro') return
    const s = document.createElement('script')
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`
    s.onload = () => setReady(true)
    s.onerror = () => setMsg('Could not load PayPal. Check your internet connection.')
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [clientId, plan])

  useEffect(() => {
    if (!ready || !window.paypal || !box.current) return
    const h = { 'Content-Type': 'application/json' }
    const b = window.paypal.Buttons({
      style: { layout: 'vertical', shape: 'pill' },
      createOrder: async () => {
        const r = await fetch('/api/paypal/create-order', { method: 'POST', headers: h })
        const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Could not start payment')
        return d.id
      },
      onApprove: async (data: any) => {
        const r = await fetch('/api/paypal/capture-order', { method: 'POST', headers: h, body: JSON.stringify({ orderId: data.orderID }) })
        const d = await r.json()
        if (!r.ok) { setMsg('❌ ' + (d.error || 'Payment failed')); return }
        try { const u = readJSON('tl_user','{}'); u.plan = 'pro'; u.xp = d.xp; localStorage.setItem('tl_user', JSON.stringify(u)); localStorage.setItem('tl_xp', String(d.xp || 0)) } catch {}
        setPlan('pro'); setMsg('🎉 You are now Pro! (+100 XP)')
      },
      onError: () => setMsg('❌ Something went wrong with PayPal. Please try again.'),
    })
    b.render(box.current)
    return () => { try { b.close() } catch {} }
  }, [ready])

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-3xl">⭐ TalentLaunch Pro</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Get more daily AI runs and a Pro badge. Payments run in the PayPal <b>sandbox</b>, so no real money is used.</p>
      </div>
      <div className="bg-[var(--card)] border border-[var(--bds)] rounded-2xl p-6 space-y-4">
        <div className="text-4xl font-extrabold">$2 <span className="text-sm font-normal text-[var(--t2)]">one time (sandbox)</span></div>
        <ul className="text-sm space-y-1.5">
          <li>✅ <b>100 AI runs per day</b> (free accounts get 15)</li>
          <li>✅ Pro badge on your profile</li>
          <li>✅ +100 bonus XP</li>
          <li>✅ Early access to new features</li>
        </ul>
        {plan === 'pro' ? <div className="text-green-400 font-bold">✅ You already have Pro. Thank you!</div>
          : !clientId ? <div className="text-yellow-300 text-sm">PayPal is not set up yet. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to the environment variables.</div>
          : <div ref={box} />}
        {msg && <div className="text-sm font-semibold">{msg}</div>}
      </div>
      <p className="text-xs text-[var(--t2)]">Testing: pay with a PayPal sandbox buyer account from developer.paypal.com.</p>
    </div>
  )
}
