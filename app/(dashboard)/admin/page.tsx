'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type PostedJob = {
  id:string; title:string; company:string; location:string; type:string
  url:string; salary:string; tags:string[]; description:string; isRemote:boolean; isFresher:boolean; source:string; posted:string
}

const JOB_TYPES = ['Full-time','Internship','Trainee','Part-time','Contract']
const SAMPLE_TAGS = ['React','Node.js','Python','Java','TypeScript','AWS','Docker','ML','SQL','DevOps','Flutter','Go','Android','iOS','Data Science']

export default function AdminPage() {
  const router = useRouter()
  const [role, setRole]         = useState('')
  const [user, setUser]         = useState<any>(null)
  const [jobs, setJobs]         = useState<PostedJob[]>([])
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState('')
  const [activeTab, setActiveTab] = useState<'post'|'manage'|'stats'>('post')
  const [form, setForm] = useState({
    title:'', company:'', location:'', type:'Full-time', url:'', salary:'',
    description:'', isRemote:true, isFresher:true, tags:[] as string[],
  })
  const [initDone, setInitDone] = useState(false)

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    const r = u.role || localStorage.getItem('tl_role') || 'student'
    setUser(u); setRole(r)
    if(!['admin','recruiter'].includes(r)) { router.push('/dashboard'); return }
    loadJobs(); setInitDone(true)
  },[])

  async function loadJobs() {
    try{
      const res = await fetch('/api/admin/jobs')
      const d = await res.json()
      setJobs(d.jobs||[])
    }catch{}
  }

  async function postJob() {
    if(!form.title||!form.company||!form.url){ showToast('⚠️ Title, company & URL required'); return }
    setLoading(true)
    const token = localStorage.getItem('tl_token')
    try{
      const res = await fetch('/api/admin/jobs',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body:JSON.stringify(form),
      })
      const d = await res.json()
      if(res.ok){
        showToast('✅ Job posted! Visible to all users immediately')
        setJobs(p=>[d.job,...p])
        setForm({title:'',company:'',location:'',type:'Full-time',url:'',salary:'',description:'',isRemote:true,isFresher:true,tags:[]})
        setActiveTab('manage')
      } else showToast(`❌ ${d.error}`)
    }catch{ showToast('❌ Failed to post job') }
    setLoading(false)
  }

  async function deleteJob(id:string) {
    const token = localStorage.getItem('tl_token')
    try{
      await fetch('/api/admin/jobs',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({id})})
      setJobs(p=>p.filter(j=>j.id!==id))
      showToast('🗑️ Job deleted')
    }catch{}
  }

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),3000)}
  function toggleTag(t:string){setForm(p=>({...p,tags:p.tags.includes(t)?p.tags.filter(x=>x!==t):[...p.tags,t]}))}

  if(!initDone) return <div className="animate-pulse space-y-4 max-w-4xl mx-auto"><div className="h-10 w-48 bg-[var(--el)] rounded-xl"/><div className="h-96 bg-[var(--el)] rounded-2xl"/></div>
  if(!['admin','recruiter'].includes(role)) return null

  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl">{role==='admin'?'⚡ Admin Panel':'💼 Recruiter Panel'}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${role==='admin'?'bg-yellow-500/15 text-yellow-400':'bg-purple-500/15 text-purple-400'}`}>
              {role==='admin'?'⚡ Admin':'💼 Recruiter'}
            </span>
            <span className="text-xs text-[var(--t2)]">{user?.name} · {user?.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center bg-cyan-500/8 border border-cyan-500/15 rounded-xl px-4 py-2">
            <div className="font-display font-bold text-xl text-cyan-400">{jobs.length}</div>
            <div className="text-[10px] text-[var(--t3)]">Jobs Posted</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit">
        {([['post','📝 Post a Job'],['manage','📋 Manage Jobs'],['stats','📊 Stats']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setActiveTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* POST JOB */}
      {activeTab==='post'&&(
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-6 space-y-4">
          <div className="font-display font-bold text-lg">📝 Post a New Job</div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs text-[var(--t2)] block mb-1">Job Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="SDE Intern, Backend Engineer..." className={inp}/></div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Company *</label><input value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} placeholder="Company name" className={inp}/></div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Location</label><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="Bangalore / Remote / USA" className={inp}/></div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Job Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className={inp}>
                {JOB_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Apply URL *</label><input value={form.url} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="https://company.com/apply" className={inp}/></div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Salary / Stipend</label><input value={form.salary} onChange={e=>setForm(p=>({...p,salary:e.target.value}))} placeholder="₹15k/mo, ₹8 LPA, $80k..." className={inp}/></div>
          </div>
          <div><label className="text-xs text-[var(--t2)] block mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={4} placeholder="Job description, requirements, perks..." className={inp+' resize-none'}/>
          </div>
          <div>
            <label className="text-xs text-[var(--t2)] block mb-2">Required Skills / Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TAGS.map(t=>(
                <button key={t} onClick={()=>toggleTag(t)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${form.tags.includes(t)?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-white'}`}>{t}</button>
              ))}
            </div>
            <p className="text-[10px] text-[var(--t3)] mt-1">Or add custom tags separated by comma:</p>
            <input placeholder="e.g. Golang, GraphQL, Redis" className={inp+' mt-1'} onBlur={e=>{
              const custom = e.target.value.split(',').map(s=>s.trim()).filter(Boolean)
              if(custom.length) setForm(p=>({...p,tags:[...new Set([...p.tags,...custom])]}))
              e.target.value=''
            }}/>
          </div>
          <div className="flex gap-4">
            {[['🌍 Remote Position',form.isRemote,'isRemote'],['🌱 Fresher-Friendly (0-2 yrs)',form.isFresher,'isFresher']].map(([l,v,k])=>(
              <button key={String(k)} onClick={()=>setForm(p=>({...p,[String(k)]:!v}))}
                className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold transition-all ${v?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${v?'border-cyan-400 bg-cyan-400':'border-[var(--t3)]'}`}>
                  {v&&<span className="text-white text-[10px] font-bold">✓</span>}
                </div>{String(l)}
              </button>
            ))}
          </div>
          <button onClick={postJob} disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.3)] transition-all disabled:opacity-50 text-sm">
            {loading?'Posting...':'📤 Post Job — Live on TalentLaunch Immediately'}
          </button>
        </div>
      )}

      {/* MANAGE JOBS */}
      {activeTab==='manage'&&(
        <div className="space-y-3">
          {jobs.length===0?(
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-sm font-semibold">No jobs posted yet</div>
              <button onClick={()=>setActiveTab('post')} className="mt-3 text-xs text-cyan-400">Post your first job →</button>
            </div>
          ):jobs.map(j=>(
            <div key={j.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{j.title}</div>
                  <div className="text-xs text-[var(--t2)] mt-0.5">{j.company} · {j.location}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {j.tags?.slice(0,5).map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{t}</span>)}
                    {j.isRemote&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">🌍 Remote</span>}
                    {j.isFresher&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">🌱 Fresher</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-green-400 font-mono">{j.salary||'—'}</span>
                  <a href={j.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-lg hover:bg-cyan-500/10">View</a>
                  <button onClick={()=>deleteJob(j.id)} className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded-lg hover:bg-red-500/10">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATS */}
      {activeTab==='stats'&&(
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-3">
            <div className="font-display font-bold text-base">📊 Job Stats</div>
            {[
              {label:'Total Posted',val:jobs.length,color:'text-cyan-400'},
              {label:'Fresher-Friendly',val:jobs.filter(j=>j.isFresher).length,color:'text-green-400'},
              {label:'Remote Jobs',val:jobs.filter(j=>j.isRemote).length,color:'text-blue-400'},
              {label:'Internships',val:jobs.filter(j=>j.type==='Internship').length,color:'text-purple-400'},
            ].map(s=>(
              <div key={s.label} className="flex items-center justify-between px-3 py-2 bg-[var(--el)] rounded-xl">
                <span className="text-sm text-[var(--t2)]">{s.label}</span>
                <span className={`font-display font-bold text-lg ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-3">⚡ Admin Tools</div>
            <div className="space-y-2">
              {[
                {label:'Platform Users',val:'View all',icon:'👥'},
                {label:'Export Job Data CSV',val:'Download',icon:'📥'},
                {label:'Clear All Jobs',val:'Reset',icon:'🗑️'},
              ].map(t=>(
                <div key={t.label} className="flex items-center justify-between px-3 py-3 bg-[var(--el)] rounded-xl">
                  <div className="flex items-center gap-2"><span>{t.icon}</span><span className="text-sm">{t.label}</span></div>
                  <button className="text-xs text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg hover:bg-cyan-500/10">{t.val}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
