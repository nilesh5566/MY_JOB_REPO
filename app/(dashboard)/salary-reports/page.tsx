'use client'
import { useState, useEffect } from 'react'

type SalaryReport = { id:string; role:string; company:string; location:string; package:string; yoe:string; type:'FTE'|'Intern'|'Contract'; year:string; source:string; verified:boolean; upvotes:number }

const SEED_REPORTS: SalaryReport[] = [
  {id:'s1',role:'SDE-1',company:'Google',location:'Hyderabad',package:'₹45 LPA',yoe:'0',type:'FTE',year:'2024',source:'LinkedIn',verified:true,upvotes:124},
  {id:'s2',role:'SDE Intern',company:'Microsoft',location:'Hyderabad',package:'₹80k/mo',yoe:'0',type:'Intern',year:'2024',source:'Reddit',verified:true,upvotes:89},
  {id:'s3',role:'SDE-1',company:'Razorpay',location:'Bangalore',package:'₹22 LPA',yoe:'0',type:'FTE',year:'2024',source:'Blind',verified:true,upvotes:67},
  {id:'s4',role:'Data Scientist',company:'Amazon',location:'Hyderabad',package:'₹35 LPA',yoe:'0',type:'FTE',year:'2024',source:'Glassdoor',verified:true,upvotes:52},
  {id:'s5',role:'Full Stack Intern',company:'Swiggy',location:'Bangalore',package:'₹30k/mo',yoe:'0',type:'Intern',year:'2024',source:'Anonymous',verified:false,upvotes:38},
  {id:'s6',role:'SDE-1',company:'Zepto',location:'Mumbai',package:'₹18 LPA',yoe:'0',type:'FTE',year:'2024',source:'Blind',verified:false,upvotes:29},
  {id:'s7',role:'SDE Intern',company:'Google',location:'Hyderabad',package:'₹1L/mo',yoe:'0',type:'Intern',year:'2024',source:'Levels.fyi',verified:true,upvotes:210},
  {id:'s8',role:'ML Engineer',company:'OpenAI',location:'Remote',package:'$140k',yoe:'0',type:'FTE',year:'2024',source:'Levels.fyi',verified:true,upvotes:156},
  {id:'s9',role:'Graduate SWE',company:'Atlassian',location:'Bangalore',package:'₹28 LPA',yoe:'0',type:'FTE',year:'2024',source:'LinkedIn',verified:true,upvotes:44},
  {id:'s10',role:'Backend Intern',company:'CRED',location:'Bangalore',package:'₹25k/mo',yoe:'0',type:'Intern',year:'2024',source:'Anonymous',verified:false,upvotes:31},
]

export default function SalaryReportsPage() {
  const [reports, setReports] = useState<SalaryReport[]>([])
  const [form, setForm] = useState({role:'',company:'',location:'',package:'',yoe:'0',type:'FTE' as const,year:'2024',source:'Anonymous'})
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({type:'All',search:''})
  const [toast, setToast] = useState('')
  const [upvoted, setUpvoted] = useState<string[]>([])

  useEffect(() => {
    const custom = JSON.parse(localStorage.getItem('tl_salary_reports') || '[]')
    setReports([...SEED_REPORTS, ...custom])
    setUpvoted(JSON.parse(localStorage.getItem('tl_upvoted') || '[]'))
  }, [])

  function submit() {
    if (!form.role || !form.company || !form.package) { showToast('⚠️ Role, company & package required'); return }
    const report: SalaryReport = { ...form, id:`sr_${Date.now()}`, verified:false, upvotes:0 }
    const custom = JSON.parse(localStorage.getItem('tl_salary_reports') || '[]')
    const updated = [report, ...custom]
    localStorage.setItem('tl_salary_reports', JSON.stringify(updated))
    setReports([report, ...reports])
    setShowForm(false)
    setForm({role:'',company:'',location:'',package:'',yoe:'0',type:'FTE',year:'2024',source:'Anonymous'})
    showToast('✅ Report submitted anonymously!')
  }

  function upvote(id: string) {
    if (upvoted.includes(id)) return
    setReports(p => p.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    const updated = [...upvoted, id]
    setUpvoted(updated)
    localStorage.setItem('tl_upvoted', JSON.stringify(updated))
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = reports.filter(r => {
    const matchType = filter.type === 'All' || r.type === filter.type
    const q = filter.search.toLowerCase()
    const matchSearch = !q || `${r.role} ${r.company} ${r.location}`.toLowerCase().includes(q)
    return matchType && matchSearch
  }).sort((a,b) => b.upvotes - a.upvotes)

  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">💰 Salary Reports</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Anonymous, crowdsourced real salary data from the community</p>
        </div>
        <button onClick={() => setShowForm(p=>!p)}
          className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
          {showForm?'× Cancel':'+ Share Anonymously'}
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
          <div className="font-bold text-sm text-cyan-400">🔒 100% Anonymous — no name or email stored</div>
          <div className="grid grid-cols-2 gap-3">
            {[['role','Role *','SDE-1'],['company','Company *','Google'],['location','Location','Hyderabad'],['package','Package *','₹22 LPA or ₹80k/mo']].map(([k,l,p])=>(
              <div key={k}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className={inp}/></div>
            ))}
            <div><label className="text-xs text-[var(--t2)] block mb-1">Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as any}))} className={inp}>
                {['FTE','Intern','Contract'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Year</label>
              <select value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))} className={inp}>
                {['2025','2024','2023'].map(y=><option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <button onClick={submit} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Submit Anonymously →</button>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <input value={filter.search} onChange={e=>setFilter(p=>({...p,search:e.target.value}))} placeholder="Search role or company..."
          className="flex-1 min-w-40 bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
        {['All','FTE','Intern','Contract'].map(t=>(
          <button key={t} onClick={()=>setFilter(p=>({...p,type:t}))}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filter.type===t?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>{t}</button>
        ))}
      </div>

      <div className="text-xs text-[var(--t3)]">{filtered.length} reports · sorted by community votes</div>

      <div className="space-y-2">
        {filtered.map(r => (
          <div key={r.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-cyan-500/15 transition-all">
            <button onClick={() => upvote(r.id)}
              className={`flex flex-col items-center gap-0.5 flex-shrink-0 p-2 rounded-xl border transition-all ${upvoted.includes(r.id)?'bg-cyan-500/10 border-cyan-500/25 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:border-[var(--bds)]'}`}>
              <span className="text-sm">▲</span>
              <span className="text-xs font-bold">{r.upvotes}</span>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{r.role}</span>
                <span className="text-xs text-[var(--t2)]">@</span>
                <span className="text-sm font-semibold text-cyan-400">{r.company}</span>
                {r.verified && <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">✓ Verified</span>}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-[var(--t2)]">📍 {r.location}</span>
                <span className="text-xs text-[var(--t2)]">⏱ YOE: {r.yoe}yr</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.type==='Intern'?'bg-purple-500/10 text-purple-400':'bg-blue-500/10 text-blue-400'}`}>{r.type}</span>
                <span className="text-xs text-[var(--t3)]">{r.year} · {r.source}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono font-extrabold text-base text-green-400">{r.package}</div>
              <div className="text-[10px] text-[var(--t3)]">per annum / month</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
