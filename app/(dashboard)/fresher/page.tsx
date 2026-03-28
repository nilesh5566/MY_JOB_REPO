'use client'
import { useState, useEffect } from 'react'

// ── Off-campus drives ────────────────────────────────────────────────────────
const OFF_CAMPUS = [
  {company:'TCS',logo:'🔵',program:'TCS NQT (National Qualifier Test)',url:'https://nextstep.tcs.com',batch:'2024/2025',pkg:'₹3.36–7 LPA',tips:'Focus on Aptitude + Verbal + Coding (2 problems)',deadline:'Ongoing',fresher:true},
  {company:'Infosys',logo:'🟢',program:'InfyTQ + Instep Internship',url:'https://www.infosys.com/careers/campus/',batch:'2024/2025',pkg:'₹3.6–8 LPA',tips:'Clear InfyTQ certification first for better roles',deadline:'Ongoing',fresher:true},
  {company:'Wipro',logo:'🟡',program:'NLTH (National Level Talent Hunt)',url:'https://careers.wipro.com/opportunities/nlth',batch:'2024/2025',pkg:'₹3.5–6.5 LPA',tips:'Good for tier-2/3 college students',deadline:'Rolling',fresher:true},
  {company:'Cognizant',logo:'🔷',program:'GenC + GenC Elevate + GenC Pro',url:'https://www.cognizant.com/in/en/careers',batch:'2024/2025',pkg:'₹4–5 LPA',tips:'GenC Pro for CS with 7+ CGPA',deadline:'Rolling',fresher:true},
  {company:'Accenture',logo:'⬜',program:'ASE Off-Campus',url:'https://www.accenture.com/in-en/careers/jobsearch',batch:'2024/2025',pkg:'₹4.5 LPA',tips:'Resume shortlisting + Online test + HR round',deadline:'Rolling',fresher:true},
  {company:'Capgemini',logo:'🔵',program:'Joining as an Analyst',url:'https://www.capgemini.com/careers/',batch:'2024/2025',pkg:'₹3.8 LPA',tips:'Use Superset portal for registration',deadline:'Rolling',fresher:true},
  {company:'Google',logo:'🌈',program:'STEP Internship (for 2nd/3rd yr)',url:'https://careers.google.com/programs/students/',batch:'2024',pkg:'$6k–$8k/mo',tips:'Apply Sep–Nov. Focus on DSA heavily',deadline:'Oct–Nov',fresher:true},
  {company:'Microsoft',logo:'🟦',program:'MSIDC + Explore Intern',url:'https://careers.microsoft.com/students/',batch:'2024',pkg:'₹80k/mo',tips:'Resume + OA + 2 coding rounds',deadline:'Aug–Sep',fresher:true},
  {company:'Amazon',logo:'🟠',program:'SDE Intern (University Hire)',url:'https://www.amazon.jobs/en/teams/university-tech',batch:'2024',pkg:'₹1L/mo',tips:'2 coding rounds focused on arrays/trees/DP',deadline:'Sep–Oct',fresher:true},
  {company:'Flipkart',logo:'🟡',program:'Campus Hiring',url:'https://www.flipkartcareers.com/#!/',batch:'2024/2025',pkg:'₹18–40 LPA',tips:'GriT program for freshers. OA + 3 tech rounds',deadline:'Aug–Sep',fresher:true},
  {company:'Zomato',logo:'🔴',program:'Fresh Grads Hiring',url:'https://careers.zomato.com/',batch:'2025',pkg:'₹15–25 LPA',tips:'Strong DSA + system design basics needed',deadline:'Rolling',fresher:true},
  {company:'Paytm',logo:'💙',program:'Associate Engineer',url:'https://careers.paytm.com/',batch:'2025',pkg:'₹8–15 LPA',tips:'Good for tier-2 college students',deadline:'Rolling',fresher:true},
]

// ── Campus placement tracker ─────────────────────────────────────────────────
const CAMPUS_COMPANIES = {
  FAANG: [
    {name:'Google',visits:'Aug–Nov',pkg:'₹1.2–2 Cr',roles:['SWE','SRE','Data Scientist'],cgpa:'7+',locations:'Hyderabad, Bangalore'},
    {name:'Microsoft',visits:'Sep–Oct',pkg:'₹40–80 LPA',roles:['SWE','Explore Intern'],cgpa:'7+',locations:'Hyderabad'},
    {name:'Amazon',visits:'Sep–Nov',pkg:'₹32–50 LPA',roles:['SDE-1','Data Engineer'],cgpa:'6.5+',locations:'Hyderabad, Bangalore'},
    {name:'Meta',visits:'Oct–Nov',pkg:'₹40–80 LPA',roles:['SWE','Research Scientist'],cgpa:'7.5+',locations:'Bangalore'},
    {name:'Apple',visits:'Aug–Sep',pkg:'₹35–70 LPA',roles:['SWE','ML Engineer'],cgpa:'7+',locations:'Hyderabad'},
  ],
  Product: [
    {name:'Razorpay',visits:'Aug–Oct',pkg:'₹15–28 LPA',roles:['SDE-1','Data Analyst'],cgpa:'6.5+',locations:'Bangalore'},
    {name:'Swiggy',visits:'Sep–Nov',pkg:'₹14–22 LPA',roles:['SDE-1','SRE'],cgpa:'6+',locations:'Bangalore'},
    {name:'Flipkart',visits:'Aug–Sep',pkg:'₹18–40 LPA',roles:['SDE-1','SDE-2'],cgpa:'7+',locations:'Bangalore'},
    {name:'Zepto',visits:'Sep–Oct',pkg:'₹14–22 LPA',roles:['Backend','Frontend'],cgpa:'6.5+',locations:'Mumbai'},
    {name:'CRED',visits:'Oct–Nov',pkg:'₹15–25 LPA',roles:['SDE-1','iOS','Android'],cgpa:'7+',locations:'Bangalore'},
    {name:'Groww',visits:'Sep–Nov',pkg:'₹12–20 LPA',roles:['SDE-1','Data'],cgpa:'6.5+',locations:'Bangalore'},
    {name:'PhonePe',visits:'Aug–Oct',pkg:'₹14–20 LPA',roles:['SDE-1','SRE','Data'],cgpa:'6.5+',locations:'Bangalore'},
    {name:'Atlassian',visits:'Aug–Sep',pkg:'₹28–55 LPA',roles:['SWE','Graduate'],cgpa:'7+',locations:'Bangalore'},
  ],
  Service: [
    {name:'TCS',visits:'Yr round',pkg:'₹3.36–7 LPA',roles:['System Eng','ITA','Ninja'],cgpa:'6+',locations:'Pan India'},
    {name:'Infosys',visits:'Yr round',pkg:'₹3.6–8 LPA',roles:['Systems Eng','Specialist'],cgpa:'6+',locations:'Pan India'},
    {name:'Wipro',visits:'Yr round',pkg:'₹3.5–6.5 LPA',roles:['Project Eng','Turbo'],cgpa:'6+',locations:'Pan India'},
    {name:'Cognizant',visits:'Yr round',pkg:'₹4–5 LPA',roles:['Prog Analyst Trainee'],cgpa:'6+',locations:'Pan India'},
    {name:'HCLTech',visits:'Sep–Nov',pkg:'₹3.5–5 LPA',roles:['Graduate Eng Trainee'],cgpa:'6+',locations:'Pan India'},
    {name:'Mindtree',visits:'Aug–Oct',pkg:'₹3.6–5 LPA',roles:['Software Eng'],cgpa:'6.5+',locations:'Bangalore'},
  ]
}

type InternTrack = {id:string;company:string;role:string;startDate:string;endDate:string;stipend:string;mentor:string;ppoStatus:'Pending'|'Received PPO'|'No PPO'|'Accepted'|'Declined';notes:string}

export default function FresherPage() {
  const [tab,setTab] = useState<'board'|'offcampus'|'campus'|'interntrack'>('board')
  const [jobs,setJobs] = useState<any[]>([])
  const [loading,setLoading] = useState(false)
  const [search,setSearch] = useState('')
  const [typeFilter,setTypeFilter] = useState('All')
  const [sourceFilter,setSourceFilter] = useState('All')
  const [saved,setSaved] = useState<string[]>([])
  const [toast,setToast] = useState('')
  const [campusCat,setCampusCat] = useState<'FAANG'|'Product'|'Service'>('FAANG')
  const [internships,setInternships] = useState<InternTrack[]>([])
  const [showForm,setShowForm] = useState(false)
  const [form,setForm] = useState<Partial<InternTrack>>({ppoStatus:'Pending'})
  const [initDone,setInitDone] = useState(false)

  useEffect(()=>{
    const s:any[]=JSON.parse(localStorage.getItem('tl_saved')||'[]')
    setSaved(s.map(j=>j.id))
    setInternships(JSON.parse(localStorage.getItem('tl_intern_track')||'[]'))
    fetchFresherJobs()
    setInitDone(true)
  },[])

  async function fetchFresherJobs(){
    setLoading(true)
    try{
      const res=await fetch('/api/jobs')
      const d=await res.json()
      const fresher=(d.jobs||[]).filter((j:any)=>j.isFresher)
      setJobs(fresher)
      showToast(`✅ ${fresher.length} fresher jobs loaded`)
    }catch{showToast('❌ Failed — check network')}
    setLoading(false)
  }

  function toggleSave(job:any){
    const existing:any[]=JSON.parse(localStorage.getItem('tl_saved')||'[]')
    if(saved.includes(job.id)){
      localStorage.setItem('tl_saved',JSON.stringify(existing.filter(j=>j.id!==job.id)))
      setSaved(p=>p.filter(id=>id!==job.id)); showToast('Removed')
    }else{
      localStorage.setItem('tl_saved',JSON.stringify([...existing,job]))
      setSaved(p=>[...p,job.id]); showToast('🔖 Saved +10 XP')
      localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+10))
    }
  }

  function submitIntern(){
    if(!form.company||!form.role){showToast('⚠️ Company & role required');return}
    const track:InternTrack={...form as InternTrack,id:`it_${Date.now()}`}
    const updated=[track,...internships]
    setInternships(updated); localStorage.setItem('tl_intern_track',JSON.stringify(updated))
    setForm({ppoStatus:'Pending'}); setShowForm(false); showToast('✅ Internship tracked!')
  }

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),2500)}

  const filtered = jobs.filter(j=>{
    const q=search.toLowerCase()
    const matchSearch=!q||`${j.title} ${j.company} ${j.tags?.join(' ')}`.toLowerCase().includes(q)
    const matchType=typeFilter==='All'||j.type===typeFilter
    const matchSrc=sourceFilter==='All'||j.source===sourceFilter
    return matchSearch&&matchType&&matchSrc
  })
  const sources=[...new Set(jobs.map(j=>j.source))]

  const inp='w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'
  const SRC_COLOR:Record<string,string>={Remotive:'text-blue-400',Arbeitnow:'text-purple-400',Jobicy:'text-cyan-400','The Muse':'text-pink-400','YC Startup':'text-orange-400','YC/Startup':'text-orange-400','India Startup':'text-green-400',TalentLaunch:'text-yellow-400'}

  if(!initDone) return (
    <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
      <div className="h-9 w-48 bg-[var(--el)] rounded-xl"/>
      <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-[var(--el)] rounded-2xl"/>)}</div>
      <div className="h-96 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div>
        <h1 className="font-display font-extrabold text-3xl">🌱 Fresher Hub</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Curated jobs for 0–2 year experience · Campus placements · Off-campus drives · Internship tracker</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {label:'Fresher Jobs',val:jobs.length,color:'text-green-400',bg:'bg-green-500/8 border-green-500/15'},
          {label:'Internships',val:jobs.filter(j=>j.type==='Internship').length,color:'text-purple-400',bg:'bg-purple-500/8 border-purple-500/15'},
          {label:'Remote',val:jobs.filter(j=>j.isRemote).length,color:'text-cyan-400',bg:'bg-cyan-500/8 border-cyan-500/15'},
          {label:'Off-Campus Drives',val:OFF_CAMPUS.length,color:'text-yellow-400',bg:'bg-yellow-500/8 border-yellow-500/15'},
        ].map(s=>(
          <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.bg}`}>
            <div className={`font-display font-extrabold text-3xl ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-[var(--t2)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit overflow-x-auto">
        {([['board','🌱 Fresher Jobs'],['offcampus','🏢 Off-Campus Drives'],['campus','🎓 Campus Placement'],['interntrack','📋 Internship Tracker']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* FRESHER JOB BOARD */}
      {tab==='board'&&(
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search fresher jobs..."
              className="flex-1 min-w-48 bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50">
              {['All','Internship','Full-time','Trainee'].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)} className="bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50">
              <option value="All">All Sources</option>
              {sources.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={fetchFresherJobs} disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60">
              {loading?'⏳':'🔄 Refresh'}
            </button>
          </div>
          <div className="text-xs text-[var(--t2)]">{filtered.length} fresher jobs · 0–2 years experience</div>
          {loading&&<div className="space-y-3 animate-pulse">{[...Array(5)].map((_,i)=><div key={i} className="h-20 bg-[var(--el)] rounded-2xl"/>)}</div>}
          {!loading&&filtered.length===0&&(
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">🌱</div>
              <div className="text-sm font-semibold">No fresher jobs match filters</div>
              <button onClick={()=>{setSearch('');setTypeFilter('All');setSourceFilter('All')}} className="mt-2 text-xs text-cyan-400">Clear filters</button>
            </div>
          )}
          <div className="space-y-2">
            {filtered.map(job=>(
              <div key={job.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 hover:border-green-500/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/15 to-cyan-500/15 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">{job.company?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm">{job.title}</div>
                        <div className="text-xs text-[var(--t2)]">{job.company} · {job.location}</div>
                      </div>
                      <button onClick={()=>toggleSave(job)} className={`text-base flex-shrink-0 hover:scale-110 transition-all ${saved.includes(job.id)?'':'opacity-25 hover:opacity-70'}`}>🔖</button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {job.tags?.slice(0,4).map((t:string)=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{t}</span>)}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">🌱 Fresher</span>
                      {job.isRemote&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">🌍 Remote</span>}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${SRC_COLOR[job.source]||'text-[var(--t3)]'}`}>{job.source}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-green-400 font-semibold">{job.estimatedSalary}</span>
                        <span className="text-xs text-yellow-400">⭐ {job.review?.rating}</span>
                        <span className="text-xs text-[var(--t3)]">{job.posted}</span>
                      </div>
                      <a href={job.url} target="_blank" rel="noreferrer"
                        className="text-xs font-semibold bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg transition-colors">Apply →</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFF-CAMPUS DRIVES */}
      {tab==='offcampus'&&(
        <div className="space-y-4">
          <div className="bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-4 text-sm text-yellow-200/80">
            💡 <strong>Off-campus = applying without college placement cell.</strong> Great for students from tier-2/3 colleges or those who missed on-campus. Many roles are always open!
          </div>
          <div className="grid gap-3">
            {OFF_CAMPUS.map(d=>(
              <div key={d.company} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 hover:border-cyan-500/15 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{d.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm">{d.company}</div>
                        <div className="text-xs text-cyan-400 mt-0.5">{d.program}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono text-green-400 font-bold">{d.pkg}</div>
                        <div className="text-[10px] text-[var(--t3)] mt-0.5">{d.batch}</div>
                      </div>
                    </div>
                    <div className="mt-2 bg-[var(--el)] rounded-xl px-3 py-2 text-xs text-[var(--t2)]">
                      💡 {d.tips}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${d.deadline==='Ongoing'||d.deadline==='Rolling'?'bg-green-500/10 border-green-500/20 text-green-400':'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                        📅 {d.deadline}
                      </div>
                      <a href={d.url} target="_blank" rel="noreferrer"
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-1.5 rounded-xl text-xs hover:shadow-[0_0_12px_rgba(0,220,255,0.3)] transition-all">
                        Apply Now →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMPUS PLACEMENT */}
      {tab==='campus'&&(
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['FAANG','Product','Service'] as const).map(c=>(
              <button key={c} onClick={()=>setCampusCat(c)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${campusCat===c?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
                {c==='FAANG'?'🌟 FAANG':c==='Product'?'🚀 Product':'🏢 Service'}
              </button>
            ))}
          </div>
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--bdr)] bg-[var(--el)] grid grid-cols-5 text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider">
              <div>Company</div><div>When</div><div>Package</div><div>Roles</div><div>CGPA</div>
            </div>
            {CAMPUS_COMPANIES[campusCat].map((c,i)=>(
              <div key={c.name} className={`px-5 py-4 grid grid-cols-5 items-center border-b border-[var(--bdr)]/50 last:border-0 ${i%2===0?'':'bg-[var(--el)]/30'} hover:bg-[var(--hov)] transition-colors`}>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-cyan-400">{c.visits}</div>
                <div className="text-xs font-mono text-green-400 font-bold">{c.pkg}</div>
                <div className="text-xs text-[var(--t2)]">{c.roles.slice(0,2).join(', ')}</div>
                <div className="text-xs font-bold text-purple-400">{c.cgpa}</div>
              </div>
            ))}
          </div>
          <div className="bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-4 text-xs text-cyan-200/70">
            ℹ️ Timelines and packages are approximate and change yearly. Check your TPO (Training & Placement Officer) portal and the company's official campus page for the latest info.
          </div>
        </div>
      )}

      {/* INTERNSHIP → FTE TRACKER */}
      {tab==='interntrack'&&(
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg">📋 Internship → Full-time Tracker</h2>
              <p className="text-xs text-[var(--t2)] mt-0.5">Track your internship → PPO → offer conversion</p>
            </div>
            <button onClick={()=>setShowForm(p=>!p)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
              {showForm?'× Cancel':'+ Add Internship'}
            </button>
          </div>

          {showForm&&(
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[['company','Company *','Google'],['role','Role *','SDE Intern'],['stipend','Stipend','₹25k/mo'],['mentor','Mentor / Manager','Rahul S.']].map(([k,l,p])=>(
                  <div key={k}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                    <input value={(form as any)[k]||''} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className={inp}/>
                  </div>
                ))}
                <div><label className="text-xs text-[var(--t2)] block mb-1">Start Date</label>
                  <input type="date" value={form.startDate||''} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))} className={inp}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">End Date</label>
                  <input type="date" value={form.endDate||''} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))} className={inp}/></div>
                <div className="col-span-2"><label className="text-xs text-[var(--t2)] block mb-1">PPO Status</label>
                  <select value={form.ppoStatus||'Pending'} onChange={e=>setForm(p=>({...p,ppoStatus:e.target.value as any}))} className={inp}>
                    {['Pending','Received PPO','No PPO','Accepted','Declined'].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="text-xs text-[var(--t2)] block mb-1">Notes</label>
                  <textarea value={form.notes||''} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Learnings, team, tech stack..." className={inp+' resize-none'}/></div>
              </div>
              <button onClick={submitIntern} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Save →</button>
            </div>
          )}

          {internships.length===0?(
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-sm font-semibold">No internships tracked yet</div>
              <div className="text-xs mt-1">Add your current or past internships to track PPO status</div>
            </div>
          ):internships.map(iv=>{
            const PPO_STYLE:Record<string,string>={
              'Received PPO':'bg-green-500/10 border-green-500/25 text-green-400',
              'Accepted':'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
              'No PPO':'bg-red-500/10 border-red-500/25 text-red-400',
              'Declined':'bg-gray-500/10 border-gray-500/25 text-gray-400',
              'Pending':'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
            }
            return (
              <div key={iv.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-sm">{iv.role}</div>
                    <div className="text-xs text-[var(--t2)] mt-0.5">{iv.company}{iv.mentor?` · Mentor: ${iv.mentor}`:''}</div>
                    {(iv.startDate||iv.endDate)&&<div className="text-xs text-[var(--t3)] mt-0.5">{iv.startDate||'?'} → {iv.endDate||'Present'}</div>}
                    {iv.stipend&&<div className="text-xs text-green-400 font-mono mt-1">{iv.stipend}</div>}
                    {iv.notes&&<div className="mt-2 text-xs text-[var(--t2)] bg-[var(--el)] rounded-xl px-3 py-2">{iv.notes}</div>}
                  </div>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex-shrink-0 ${PPO_STYLE[iv.ppoStatus]||PPO_STYLE['Pending']}`}>
                    {iv.ppoStatus}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
