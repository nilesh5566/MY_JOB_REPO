'use client'
import { useState, useEffect } from 'react'
import { extractSkills as extract } from '@/lib/match'

export default function MatchPage() {
  const [resume, setResume] = useState('')
  const [job, setJob] = useState('')
  const [res, setRes] = useState<{score:number; have:string[]; missing:string[]; extra:string[]} | null>(null)
  const [tips, setTips] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { try { setResume(localStorage.getItem('tl_resume') || '') } catch {} }, [])

  function calc() {
    if (resume.trim().length < 30 || job.trim().length < 30) { setToast('Add your resume and the job text first'); setTimeout(() => setToast(''), 2500); return }
    const jobSk = extract(job), resSk = extract(resume)
    const have = jobSk.filter(s => resSk.includes(s))
    const missing = jobSk.filter(s => !resSk.includes(s))
    const extra = resSk.filter(s => !jobSk.includes(s)).slice(0, 8)
    const score = jobSk.length ? Math.round((have.length / jobSk.length) * 100) : 0
    setRes({ score, have, missing, extra }); setTips('')
    try { localStorage.setItem('tl_xp', String(parseInt(localStorage.getItem('tl_xp') || '0') + 10)) } catch {}
  }

  async function getTips() {
    if (!res) return
    setLoading(true); setTips('')
    try {
      const r = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_tokens: 500, messages: [
          { role: 'system', content: 'You are a friendly career coach for freshers. Reply in 4 short bullet points, simple English.' },
          { role: 'user', content: `Match score ${res.score}%. Missing skills: ${res.missing.join(', ') || 'none'}.\nJob:\n${job.slice(0, 800)}\n\nResume:\n${resume.slice(0, 800)}\n\nGive 4 specific tips to improve my chances for this job.` }
        ] })
      })
      const d = await r.json()
      if (d.error) throw new Error(typeof d.error === 'string' ? d.error : 'AI unavailable')
      setTips(d.choices?.[0]?.message?.content || '')
    } catch (e: any) { setToast('AI tips unavailable right now (the score above still works)'); setTimeout(() => setToast(''), 3500) }
    setLoading(false)
  }

  const color = !res ? '' : res.score >= 70 ? '#22c55e' : res.score >= 40 ? '#f59e0b' : '#ef4444'
  const box = 'w-full h-56 bg-[var(--card)] border border-[var(--bds)] rounded-xl p-3 text-sm outline-none focus:border-cyan-400'

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}
      <div>
        <h1 className="font-display font-extrabold text-3xl">🎯 Job Match Score</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Paste a job description. See how well your resume matches and what to add.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><div className="text-xs font-bold mb-1 text-[var(--t2)]">YOUR RESUME (loaded from Resume page)</div>
          <textarea className={box} value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume text" /></div>
        <div><div className="text-xs font-bold mb-1 text-[var(--t2)]">JOB DESCRIPTION</div>
          <textarea className={box} value={job} onChange={e => setJob(e.target.value)} placeholder="Paste the job description" /></div>
      </div>
      <button onClick={calc} className="px-6 py-3 rounded-xl font-bold bg-cyan-400 text-black">Check my match</button>

      {res && (
        <div className="bg-[var(--card)] border border-[var(--bds)] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-5">
            <div className="text-6xl font-extrabold" style={{ color }}>{res.score}%</div>
            <div className="text-sm text-[var(--t2)]">{res.score >= 70 ? 'Strong match. Apply now.' : res.score >= 40 ? 'Decent match. Add the missing skills if you really have them.' : 'Low match. Learn the missing skills or pick a closer job.'}</div>
          </div>
          <div className="h-3 rounded-full bg-[var(--el)] overflow-hidden"><div className="h-full" style={{ width: res.score + '%', background: color }} /></div>
          <Chips title="✅ Skills you have" items={res.have} cls="bg-green-500/15 text-green-400" />
          <Chips title="❌ Missing from your resume" items={res.missing} cls="bg-red-500/15 text-red-400" />
          <Chips title="➕ Extra skills you have" items={res.extra} cls="bg-cyan-500/15 text-cyan-300" />
          <button onClick={getTips} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-bold border border-[var(--bds)]">{loading ? 'Thinking...' : '🤖 Get AI tips'}</button>
          {tips && <pre className="whitespace-pre-wrap text-sm bg-[var(--el)] rounded-xl p-4">{tips}</pre>}
        </div>
      )}
    </div>
  )
}

function Chips({ title, items, cls }: { title: string; items: string[]; cls: string }) {
  return (<div><div className="text-xs font-bold mb-1.5">{title}</div>
    <div className="flex flex-wrap gap-1.5">{items.length ? items.map(s => <span key={s} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{s}</span>) : <span className="text-xs text-[var(--t2)]">None</span>}</div></div>)
}
