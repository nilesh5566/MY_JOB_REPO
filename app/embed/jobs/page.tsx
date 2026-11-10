'use client'
import { useEffect, useState } from 'react'
import { safeUrl } from '@/lib/safeUrl'

// Public, read-only job list designed to be placed in an iframe on other sites.
export default function EmbedJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const limit = Math.min(Math.max(parseInt(q.get('limit') || '10') || 10, 1), 30)
    const dark = q.get('theme') === 'dark'
    document.body.style.background = dark ? '#0F172A' : '#FFFFFF'
    document.body.style.color = dark ? '#E2E8F0' : '#0F172A'
    fetch('/api/jobs').then(r => r.json()).then(d => { setJobs((d.jobs || []).slice(0, limit)); setState('ok') }).catch(() => setState('error'))
  }, [])
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 12 }}>
      <h1 style={{ fontSize: 16, margin: '0 0 10px' }}>Latest tech jobs</h1>
      {state === 'loading' && <p style={{ fontSize: 13 }}>Loading jobs…</p>}
      {state === 'error' && <p style={{ fontSize: 13 }}>Jobs could not be loaded right now.</p>}
      {jobs.map(j => (
        <a key={j.id} href={safeUrl(j.url)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 10, marginBottom: 8, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{j.title}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{j.company} · {j.location}</div>
        </a>
      ))}
      <p style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>Powered by TalentLaunch</p>
    </main>
  )
}
