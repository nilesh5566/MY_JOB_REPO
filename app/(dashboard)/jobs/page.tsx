// 'use client'
// import { useState, useEffect, useRef } from 'react'

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Job = {
//   id: string; title: string; company: string; location: string; type: string
//   url: string; posted: string; source: string; tags: string[]; isRemote: boolean
//   salary: string | null; estimatedSalary: string; review: { rating: number; wlb: number }
//   isFresher: boolean; description?: string
// }
// type Deadline = { id: string; title: string; company: string; date: string; note: string }
// type Meta = { count: number; fresherCount: number; remoteCount: number; liveApiJobs: number; curatedJobs: number; sources: Record<string,number>; keysConfigured: Record<string,boolean> }

// // ── Constants ─────────────────────────────────────────────────────────────────
// const COMPANY_CAREERS = [
//   {name:'Google',    logo:'🔵',url:'https://careers.google.com/jobs/results/?q=software+engineer&experience=INTERN,ENTRY_LEVEL',fresher:true, tags:['SWE','ML','Data'],country:'🇮🇳 🇺🇸'},
//   {name:'Microsoft', logo:'🟦',url:'https://careers.microsoft.com/students/',fresher:true, tags:['SWE','Cloud','AI'],country:'🇮🇳 🇺🇸'},
//   {name:'Amazon',    logo:'🟠',url:'https://www.amazon.jobs/en/teams/university-tech',fresher:true, tags:['SDE','AWS','Data'],country:'🇮🇳 🇺🇸'},
//   {name:'Meta',      logo:'🔷',url:'https://www.metacareers.com/careerprograms/university',fresher:true, tags:['SWE','ML','Backend'],country:'🇮🇳 🇺🇸'},
//   {name:'Apple',     logo:'🍎',url:'https://jobs.apple.com/en-us/search?team=internships',fresher:true, tags:['iOS','SWE','ML'],country:'🇮🇳 🇺🇸'},
//   {name:'OpenAI',    logo:'🤖',url:'https://openai.com/careers',fresher:false,tags:['ML','LLM','Research'],country:'🇺🇸'},
//   {name:'Stripe',    logo:'💙',url:'https://stripe.com/jobs/university',fresher:true, tags:['Backend','FinTech','SWE'],country:'🇮🇪 🇺🇸'},
//   {name:'Notion',    logo:'⬛',url:'https://www.notion.so/careers',fresher:true, tags:['Full Stack','SWE'],country:'🌍'},
//   {name:'Figma',     logo:'🎨',url:'https://www.figma.com/careers/',fresher:false,tags:['SWE','Frontend','Design'],country:'🇺🇸'},
//   {name:'Razorpay',  logo:'💎',url:'https://razorpay.com/jobs/',fresher:true, tags:['Backend','SDE','FinTech'],country:'🇮🇳'},
//   {name:'Swiggy',    logo:'🧡',url:'https://careers.swiggy.com/',fresher:true, tags:['SDE','Data','ML'],country:'🇮🇳'},
//   {name:'Zepto',     logo:'⚡',url:'https://www.zepto.com/careers',fresher:true, tags:['Backend','Frontend'],country:'🇮🇳'},
//   {name:'CRED',      logo:'💳',url:'https://careers.cred.club/',fresher:false,tags:['Backend','iOS','Android'],country:'🇮🇳'},
//   {name:'Groww',     logo:'📈',url:'https://groww.in/open-positions',fresher:true, tags:['SDE','FinTech','ML'],country:'🇮🇳'},
//   {name:'PhonePe',   logo:'💜',url:'https://www.phonepe.com/careers/',fresher:true, tags:['Backend','SDE','FinTech'],country:'🇮🇳'},
//   {name:'Atlassian', logo:'🔷',url:'https://www.atlassian.com/company/careers/students',fresher:true, tags:['SWE','DevOps'],country:'🇦🇺 🌍'},
//   {name:'Shopify',   logo:'🟢',url:'https://www.shopify.com/careers',fresher:false,tags:['Ruby','Go','React'],country:'🇨🇦 🌍'},
//   {name:'Cloudflare',logo:'🌐',url:'https://www.cloudflare.com/careers/jobs/',fresher:true, tags:['Go','Rust','Networking'],country:'🇺🇸 🌍'},
//   {name:'Spotify',   logo:'🟢',url:'https://lifeatspotify.com/jobs',fresher:false,tags:['Python','ML','Data'],country:'🇸🇪 🌍'},
//   {name:'GitHub',    logo:'⚫',url:'https://github.com/about/careers',fresher:false,tags:['SWE','DevEx'],country:'🇺🇸 🌍'},
//   {name:'Canva',     logo:'🎨',url:'https://www.canva.com/careers/',fresher:false,tags:['Java','React','Full Stack'],country:'🇦🇺 🌍'},
//   {name:'Duolingo',  logo:'🦉',url:'https://careers.duolingo.com/',fresher:false,tags:['Mobile','Swift','Kotlin'],country:'🇺🇸'},
//   {name:'TCS',       logo:'🔵',url:'https://nextstep.tcs.com',fresher:true, tags:['SWE','Testing','Java'],country:'🇮🇳'},
//   {name:'Infosys',   logo:'🟢',url:'https://www.infosys.com/careers/',fresher:true, tags:['SWE','SAP','Java'],country:'🇮🇳'},
//   {name:'Wipro',     logo:'🟡',url:'https://careers.wipro.com/',fresher:true, tags:['SWE','Cloud','Testing'],country:'🇮🇳'},
//   {name:'Freshworks',logo:'🌿',url:'https://careers.freshworks.com/',fresher:true, tags:['SDE','Product','Data'],country:'🇮🇳'},
//   {name:'Zoho',      logo:'🔷',url:'https://careers.zohocorp.com/',fresher:true, tags:['Java','C++','Web'],country:'🇮🇳'},
//   {name:'Booking.com',logo:'🔵',url:'https://careers.booking.com/',fresher:false,tags:['Python','Perl','React'],country:'🇳🇱 🌍'},
//   {name:'GitLab',    logo:'🟠',url:'https://about.gitlab.com/jobs/',fresher:false,tags:['Ruby','Go','Vue'],country:'🌍 Remote'},
//   {name:'Revolut',   logo:'⬛',url:'https://www.revolut.com/careers/',fresher:false,tags:['Kotlin','React','AWS'],country:'🇬🇧 🌍'},
// ]
// const ALL_SKILLS = ['React','Node.js','Python','Java','TypeScript','Go','AWS','Docker','ML','SQL','DevOps','Flutter','Rust','C++','Kubernetes','Swift']
// const JOB_TYPES  = ['All','Full-time','Internship','Trainee','Contract','Part-time']
// const SRC_COLOR: Record<string,string> = {
//   Remotive:'text-blue-400',Arbeitnow:'text-purple-400',Jobicy:'text-cyan-400',
//   RemoteOK:'text-pink-400','The Muse':'text-rose-400',Himalayas:'text-indigo-400',
//   'Working Nomads':'text-teal-400',DevITjobs:'text-emerald-400','HN Hiring':'text-orange-400',
//   Adzuna:'text-yellow-400','Reed.co.uk':'text-red-400',JSearch:'text-fuchsia-400',
//   'Big Tech':'text-cyan-300','India Startup':'text-green-400','YC Startup':'text-orange-400',
//   'Remote-first':'text-violet-400',Europe:'text-blue-300','Mass Hiring':'text-gray-400',
//   TalentLaunch:'text-yellow-400',
// }
// const SOURCE_INFO: Record<string,{label:string;desc:string;free:boolean;keyEnv?:string;keyUrl?:string}> = {
//   Remotive:       {label:'Remotive',        desc:'Remote tech jobs worldwide',      free:true},
//   Arbeitnow:      {label:'Arbeitnow',       desc:'Europe + remote jobs',            free:true},
//   Jobicy:         {label:'Jobicy',          desc:'Remote jobs, 10 skill categories', free:true},
//   RemoteOK:       {label:'RemoteOK',        desc:'Remote-only jobs globally',        free:true},
//   'The Muse':     {label:'The Muse',        desc:'US companies with culture data',   free:true},
//   Himalayas:      {label:'Himalayas',       desc:'Remote jobs with skills filter',   free:true},
//   'Working Nomads':{label:'Working Nomads', desc:'Dev jobs for nomads',             free:true},
//   DevITjobs:      {label:'DevITjobs',       desc:'IT jobs focused on developers',    free:true},
//   'HN Hiring':    {label:'HN Who\'s Hiring',desc:'Hacker News monthly hiring post',  free:true},
//   Adzuna:         {label:'Adzuna',          desc:'10M+ jobs: India, UK, US, AU, DE, CA',free:false,keyEnv:'ADZUNA_APP_ID + ADZUNA_APP_KEY',keyUrl:'https://developer.adzuna.com/'},
//   'Reed.co.uk':   {label:'Reed UK',         desc:'UK jobs board, 280k+ listings',   free:false,keyEnv:'REED_API_KEY',keyUrl:'https://www.reed.co.uk/developers/jobseeker'},
//   JSearch:        {label:'JSearch',         desc:'Indeed + LinkedIn data via RapidAPI',free:false,keyEnv:'RAPIDAPI_KEY',keyUrl:'https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'},
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function JobsPage() {
//   const [jobs,setJobs]           = useState<Job[]>([])
//   const [filtered,setFiltered]   = useState<Job[]>([])
//   const [search,setSearch]       = useState('')
//   const [activeSkills,setActiveSkills] = useState<string[]>([])
//   const [remoteOnly,setRemoteOnly]   = useState(false)
//   const [fresherOnly,setFresherOnly] = useState(false)
//   const [typeFilter,setTypeFilter]   = useState('All')
//   const [srcFilter,setSrcFilter]     = useState('All')
//   const [loading,setLoading]         = useState(false)
//   const [initDone,setInitDone]       = useState(false)
//   const [saved,setSaved]             = useState<string[]>([])
//   const [notes,setNotes]             = useState<Record<string,string>>({})
//   const [notesJob,setNotesJob]       = useState<Job|null>(null)
//   const [noteInput,setNoteInput]     = useState('')
//   const [toast,setToast]             = useState('')
//   const [expanded,setExpanded]       = useState<string|null>(null)
//   const [activeTab,setActiveTab]     = useState<'live'|'companies'|'sources'|'deadlines'>('live')
//   const [companySearch,setCompanySearch] = useState('')
//   const [fresherCompany,setFresherCompany] = useState(false)
//   const [meta,setMeta]               = useState<Meta|null>(null)
//   const [deadlines,setDeadlines]     = useState<Deadline[]>([])
//   const [showDlForm,setShowDlForm]   = useState(false)
//   const [dlForm,setDlForm]           = useState({title:'',company:'',date:'',note:''})
//   const [alertOn,setAlertOn]         = useState(false)
//   const alertRef = useRef<ReturnType<typeof setInterval>|null>(null)

//   useEffect(()=>{
//     setSaved(JSON.parse(localStorage.getItem('tl_saved')||'[]').map((j:Job)=>j.id))
//     setNotes(JSON.parse(localStorage.getItem('tl_job_notes')||'{}'))
//     setDeadlines(JSON.parse(localStorage.getItem('tl_deadlines')||'[]'))
//     setAlertOn(localStorage.getItem('tl_alert')==='1')
//     setInitDone(true)
//   },[])

//   useEffect(()=>{
//     let f=jobs
//     if(search) f=f.filter(j=>`${j.title} ${j.company} ${j.location} ${j.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
//     if(remoteOnly) f=f.filter(j=>j.isRemote)
//     if(fresherOnly) f=f.filter(j=>j.isFresher)
//     if(typeFilter!=='All') f=f.filter(j=>j.type===typeFilter)
//     if(srcFilter!=='All') f=f.filter(j=>j.source===srcFilter)
//     if(activeSkills.length) f=f.filter(j=>activeSkills.some(s=>j.tags.some(t=>t.toLowerCase().includes(s.toLowerCase()))||`${j.title} ${j.description}`.toLowerCase().includes(s.toLowerCase())))
//     setFiltered(f)
//   },[search,remoteOnly,fresherOnly,typeFilter,srcFilter,activeSkills,jobs])

//   useEffect(()=>{
//     if(alertOn){
//       localStorage.setItem('tl_alert','1')
//       alertRef.current=setInterval(async()=>{
//         try{
//           const res=await fetch('/api/jobs'); const d=await res.json()
//           const prev=parseInt(localStorage.getItem('tl_last_job_count')||'0')
//           const curr=d.count||0
//           if(curr>prev&&prev>0){
//             showToast(`🔔 ${curr-prev} new jobs found!`)
//             if('Notification' in window&&Notification.permission==='granted')
//               new Notification('TalentLaunch Job Alert',{body:`${curr-prev} new openings match your profile!`})
//           }
//           localStorage.setItem('tl_last_job_count',String(curr))
//         }catch{}
//       },3600000)
//     } else {
//       if(alertRef.current)clearInterval(alertRef.current)
//       localStorage.setItem('tl_alert','0')
//     }
//     return()=>{if(alertRef.current)clearInterval(alertRef.current)}
//   },[alertOn])

//   async function fetchLive(){
//     setLoading(true); showToast('⏳ Fetching from 9 free APIs + curated list...')
//     try{
//       const res=await fetch('/api/jobs'); const d=await res.json()
//       const live:Job[]=d.jobs||[]
//       setJobs(live); setFiltered(live); setMeta(d)
//       localStorage.setItem('tl_last_job_count',String(d.count||0))
//       localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+5))
//       localStorage.setItem('tl_badges',JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('tl_badges')||'[]'),'first_search'])]))
//       showToast(`✅ ${live.length} jobs · ${d.liveApiJobs} live from ${Object.keys(d.sources||{}).length} APIs + ${d.curatedJobs} curated`)
//     }catch(e:any){ showToast('❌ Fetch failed — check network') }
//     setLoading(false)
//   }

//   function toggleSave(job:Job,e:React.MouseEvent){
//     e.stopPropagation()
//     const existing:Job[]=JSON.parse(localStorage.getItem('tl_saved')||'[]')
//     if(saved.includes(job.id)){
//       localStorage.setItem('tl_saved',JSON.stringify(existing.filter(j=>j.id!==job.id)))
//       setSaved(p=>p.filter(id=>id!==job.id)); showToast('Removed')
//     } else {
//       localStorage.setItem('tl_saved',JSON.stringify([...existing,job]))
//       setSaved(p=>[...p,job.id])
//       localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+10))
//       localStorage.setItem('tl_badges',JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('tl_badges')||'[]'),'first_save'])]))
//       showToast('🔖 Saved +10 XP')
//     }
//   }

//   function openNotes(job:Job,e:React.MouseEvent){
//     e.stopPropagation(); setNotesJob(job); setNoteInput(notes[job.id]||'')
//   }
//   function saveNote(){
//     if(!notesJob)return
//     const updated={...notes,[notesJob.id]:noteInput}
//     setNotes(updated); localStorage.setItem('tl_job_notes',JSON.stringify(updated))
//     setNotesJob(null); showToast('📌 Note saved!')
//   }

//   async function enableAlerts(){
//     if('Notification' in window&&Notification.permission==='default')await Notification.requestPermission()
//     setAlertOn(p=>!p); showToast(!alertOn?'🔔 Alerts ON — checks every hour':'🔕 Alerts off')
//   }

//   function addDeadline(){
//     if(!dlForm.title||!dlForm.date){showToast('⚠️ Title & date required');return}
//     const dl:Deadline={...dlForm,id:`dl_${Date.now()}`}
//     const updated=[...deadlines,dl].sort((a,b)=>a.date.localeCompare(b.date))
//     setDeadlines(updated); localStorage.setItem('tl_deadlines',JSON.stringify(updated))
//     setDlForm({title:'',company:'',date:'',note:''}); setShowDlForm(false); showToast('🗓️ Added!')
//   }

//   function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),2800)}

//   const filteredCompanies=COMPANY_CAREERS.filter(c=>{
//     const q=companySearch.toLowerCase()
//     return(!q||c.name.toLowerCase().includes(q)||c.tags.some(t=>t.toLowerCase().includes(q)))&&(!fresherCompany||c.fresher)
//   })

//   function urgency(date:string){
//     const days=Math.ceil((new Date(date).getTime()-Date.now())/86400000)
//     if(days<0)return{label:'Overdue',cls:'text-red-400 bg-red-500/10 border-red-500/25'}
//     if(days<=3)return{label:`${days}d left ⚠️`,cls:'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'}
//     if(days<=7)return{label:`${days}d left`,cls:'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'}
//     return{label:`${days}d left`,cls:'text-[var(--t2)] bg-[var(--el)] border-[var(--bdr)]'}
//   }

//   const activeSources=jobs.length>0?[...new Set(jobs.map(j=>j.source))].filter(s=>s!=='TalentLaunch'):[]

//   if(!initDone)return(
//     <div className="max-w-6xl mx-auto space-y-5 animate-pulse">
//       <div className="h-10 w-64 bg-[var(--el)] rounded-xl"/>
//       <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-[var(--el)] rounded-2xl"/>)}</div>
//       <div className="h-96 bg-[var(--el)] rounded-2xl"/>
//     </div>
//   )

//   return(
//     <div className="max-w-7xl mx-auto space-y-5">
//       {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}

//       {/* Notes modal */}
//       {notesJob&&(
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-[var(--card)] border border-[var(--bds)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
//             <div className="flex items-center justify-between mb-4">
//               <div><div className="font-bold text-base">📌 Note</div><div className="text-xs text-[var(--t2)] mt-0.5">{notesJob.company} — {notesJob.title}</div></div>
//               <button onClick={()=>setNotesJob(null)} className="text-[var(--t3)] hover:text-white text-xl">×</button>
//             </div>
//             <textarea value={noteInput} onChange={e=>setNoteInput(e.target.value)} rows={5} placeholder="Interview feedback, HR contact, salary offered, impressions..."
//               className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
//             <div className="flex gap-3 mt-4">
//               <button onClick={()=>setNotesJob(null)} className="flex-1 border border-[var(--bdr)] text-[var(--t2)] py-2.5 rounded-xl text-sm hover:border-[var(--bds)]">Cancel</button>
//               <button onClick={saveNote} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Save Note</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-start justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="font-display font-extrabold text-3xl">🌍 Global Job Search</h1>
//           <p className="text-[var(--t2)] text-sm mt-0.5">
//             {jobs.length>0
//               ?<>{jobs.length} jobs · <span className="text-green-400">{meta?.liveApiJobs||0} live from APIs</span> + <span className="text-cyan-400">{meta?.curatedJobs||0} curated</span> · {meta?.fresherCount||0} fresher · {meta?.remoteCount||0} remote</>
//               :'20+ free & freemium APIs + 150 curated companies worldwide — click fetch'}
//           </p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <button onClick={enableAlerts}
//             className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${alertOn?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
//             {alertOn?'🔔 Alerts ON':'🔕 Set Alert'}
//           </button>
//           <button onClick={fetchLive} disabled={loading}
//             className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all disabled:opacity-60">
//             {loading?'⏳ Fetching...':jobs.length>0?'🔄 Refresh':'⚡ Fetch All Jobs'}
//           </button>
//         </div>
//       </div>

//       {/* Stats bar */}
//       {meta&&(
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//           {[
//             {label:'Total Jobs',val:meta.count,color:'text-cyan-400',bg:'bg-cyan-500/8 border-cyan-500/15'},
//             {label:'Live from APIs',val:meta.liveApiJobs,color:'text-green-400',bg:'bg-green-500/8 border-green-500/15'},
//             {label:'Fresher Roles',val:meta.fresherCount,color:'text-yellow-400',bg:'bg-yellow-500/8 border-yellow-500/15'},
//             {label:'Remote Jobs',val:meta.remoteCount,color:'text-purple-400',bg:'bg-purple-500/8 border-purple-500/15'},
//             {label:'API Sources',val:Object.keys(meta.sources).length,color:'text-orange-400',bg:'bg-orange-500/8 border-orange-500/15'},
//           ].map(s=>(
//             <div key={s.label} className={`border rounded-2xl p-3 text-center ${s.bg}`}>
//               <div className={`font-display font-extrabold text-2xl ${s.color}`}>{s.val}</div>
//               <div className="text-[10px] text-[var(--t2)] mt-0.5">{s.label}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Tab nav */}
//       <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit overflow-x-auto">
//         {([['live','🌍 Live Jobs'],['companies','🏢 Career Pages'],['sources','📡 API Sources'],['deadlines','🗓️ Deadlines']] as const).map(([v,l])=>(
//           <button key={v} onClick={()=>setActiveTab(v)}
//             className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
//         ))}
//       </div>

//       {/* ── LIVE JOBS ── */}
//       {activeTab==='live'&&(
//         <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-5">
//           {/* Sidebar filters */}
//           <div className="lg:col-span-1 space-y-3">
//             <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 space-y-3 sticky top-4">
//               <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs..."
//                 className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>

//               <div>
//                 <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Job Type</div>
//                 <div className="flex flex-wrap gap-1">
//                   {JOB_TYPES.map(t=>(
//                     <button key={t} onClick={()=>setTypeFilter(t)}
//                       className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold transition-all ${typeFilter===t?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-[var(--t2)]'}`}>{t}</button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Skills</div>
//                 <div className="flex flex-wrap gap-1">
//                   {ALL_SKILLS.map(s=>(
//                     <button key={s} onClick={()=>setActiveSkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}
//                       className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold transition-all ${activeSkills.includes(s)?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-[var(--t2)]'}`}>{s}</button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Source</div>
//                 <select value={srcFilter} onChange={e=>setSrcFilter(e.target.value)}
//                   className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-cyan-500/50">
//                   <option value="All">All Sources</option>
//                   {activeSources.map(s=><option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>

//               {[['🌍 Remote Only',remoteOnly,setRemoteOnly],['🌱 Fresher / Intern',fresherOnly,setFresherOnly]].map(([l,v,s])=>(
//                 <button key={String(l)} onClick={()=>(s as(x:boolean)=>void)(!(v as boolean))}
//                   className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all text-left ${v?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>
//                   <div className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center ${v?'border-cyan-400 bg-cyan-400':'border-[var(--t3)]'}`}>
//                     {v&&<span className="text-white text-[8px] font-bold">✓</span>}
//                   </div>{String(l)}
//                 </button>
//               ))}

//               {(search||activeSkills.length>0||remoteOnly||fresherOnly||typeFilter!=='All'||srcFilter!=='All')&&(
//                 <button onClick={()=>{setSearch('');setActiveSkills([]);setRemoteOnly(false);setFresherOnly(false);setTypeFilter('All');setSrcFilter('All')}}
//                   className="w-full text-xs text-red-400 hover:text-red-300 py-1 transition-colors">✕ Clear all</button>
//               )}

//               {/* Skills demand */}
//               <div className="pt-2 border-t border-[var(--bdr)]">
//                 <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">🔥 Demand 2025</div>
//                 {[['LLM/GenAI',95],['React',85],['Python',82],['ML/AI',80],['TypeScript',76],['AWS',72],['Docker',68],['Go',64]].map(([s,p])=>(
//                   <div key={String(s)} className="flex items-center gap-1.5 mb-1">
//                     <div className="text-[9px] text-[var(--t2)] w-16 flex-shrink-0 truncate">{s}</div>
//                     <div className="flex-1 h-1 bg-[var(--el)] rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${p}%`}}/>
//                     </div>
//                     <div className="text-[9px] font-mono text-cyan-400 w-6 text-right">{p}%</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Jobs list */}
//           <div className="lg:col-span-3 xl:col-span-4 space-y-2">
//             <div className="flex items-center justify-between">
//               <div className="text-xs text-[var(--t2)]">{filtered.length} jobs shown {activeSkills.length>0?`· filtered by ${activeSkills.join(', ')}`:''}</div>
//               {filtered.length>0&&<div className="text-xs text-[var(--t3)]">{filtered.filter(j=>j.isRemote).length} remote · {filtered.filter(j=>j.isFresher).length} fresher</div>}
//             </div>

//             {jobs.length===0&&!loading&&(
//               <div className="text-center py-24 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl">
//                 <div className="text-5xl mb-4">🌍</div>
//                 <div className="font-display font-bold text-xl mb-2">300+ Jobs from Around the Globe</div>
//                 <p className="text-sm text-[var(--t2)] mb-2 max-w-sm mx-auto">9 free job APIs · 80+ curated companies · India, USA, Europe, Remote</p>
//                 <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-md mx-auto">
//                   {['Remotive','Arbeitnow','Jobicy','RemoteOK','The Muse','Himalayas','Working Nomads','DevITjobs','HN Hiring','We Work Remotely','Remote.co','Jobspresso','NoDesk'].map(s=>(
//                     <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${SRC_COLOR[s]||'text-[var(--t3)]'} bg-[var(--el)] border border-[var(--bdr)]`}>{s}</span>
//                   ))}
//                 </div>
//                 <button onClick={fetchLive} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_24px_rgba(0,220,255,0.4)] transition-all text-sm">
//                   ⚡ Fetch All Jobs Now
//                 </button>
//               </div>
//             )}

//             {loading&&(
//               <div className="space-y-2 animate-pulse">
//                 {[...Array(8)].map((_,i)=><div key={i} className="h-24 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl"/>)}
//               </div>
//             )}

//             {!loading&&jobs.length>0&&filtered.length===0&&(
//               <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
//                 <div className="text-3xl mb-2">🔍</div>
//                 <div className="text-sm font-semibold">No jobs match filters</div>
//                 <button onClick={()=>{setSearch('');setActiveSkills([]);setRemoteOnly(false);setFresherOnly(false);setTypeFilter('All');setSrcFilter('All')}}
//                   className="mt-2 text-xs text-cyan-400 hover:underline">Clear all filters</button>
//               </div>
//             )}

//             {!loading&&filtered.map(job=>(
//               <div key={job.id} onClick={()=>setExpanded(expanded===job.id?null:job.id)}
//                 className={`bg-[var(--card)] border rounded-2xl p-4 hover:border-cyan-500/20 transition-all cursor-pointer ${expanded===job.id?'border-cyan-500/35':'border-[var(--bdr)]'}`}>
//                 <div className="flex items-start gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">
//                     {job.company[0]}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="min-w-0">
//                         <div className="font-semibold text-sm leading-tight">{job.title}</div>
//                         <div className="text-xs text-[var(--t2)] mt-0.5 truncate">{job.company} · {job.location}</div>
//                       </div>
//                       <div className="flex items-center gap-1.5 flex-shrink-0">
//                         {notes[job.id]&&<span className="text-yellow-400 text-sm" title="Has note">📌</span>}
//                         <button onClick={e=>openNotes(job,e)} title="Add note" className="text-base opacity-20 hover:opacity-70 transition-opacity">📝</button>
//                         <button onClick={e=>toggleSave(job,e)} className={`text-lg hover:scale-110 transition-all ${saved.includes(job.id)?'':'opacity-20 hover:opacity-70'}`}>🔖</button>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap gap-1 mt-2">
//                       {job.tags.slice(0,4).map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{t}</span>)}
//                       {job.isRemote&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">🌍 Remote</span>}
//                       {job.isFresher&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">🌱 Fresher</span>}
//                       <span className={`text-[10px] px-2 py-0.5 rounded-full ${SRC_COLOR[job.source]||'text-[var(--t3)]'}`}>{job.source}</span>
//                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] text-[var(--t3)]">{job.type}</span>
//                     </div>
//                     <div className="flex items-center justify-between mt-2">
//                       <div className="flex items-center gap-3">
//                         <span className="text-xs font-mono text-green-400 font-semibold">{job.estimatedSalary}</span>
//                         <span className="text-xs text-yellow-400">⭐ {job.review.rating}</span>
//                         <span className="text-xs text-[var(--t3)]">{job.posted}</span>
//                       </div>
//                       <a href={job.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
//                         className="text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg transition-colors">Apply →</a>
//                     </div>
//                     {notes[job.id]&&<div className="mt-2 text-xs text-yellow-200/70 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-1.5">📌 {notes[job.id].slice(0,100)}{notes[job.id].length>100?'…':''}</div>}
//                   </div>
//                 </div>

//                 {/* Expanded */}
//                 {expanded===job.id&&(
//                   <div className="mt-3 pt-3 border-t border-[var(--bdr)] space-y-3">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                       <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Salary Est.</div><div className="text-xs font-semibold text-green-400">{job.estimatedSalary}</div></div>
//                       <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Rating</div><div className="text-xs font-semibold text-yellow-400">⭐ {job.review.rating}</div></div>
//                       <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">WLB</div><div className="text-xs font-semibold text-blue-400">🧘 {job.review.wlb}/5</div></div>
//                       <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Source</div><div className={`text-xs font-semibold ${SRC_COLOR[job.source]||'text-[var(--t3)]'}`}>{job.source}</div></div>
//                     </div>
//                     {job.description&&<div className="bg-[var(--el)] rounded-xl p-3 text-xs text-[var(--t2)] leading-relaxed">{job.description}</div>}
//                     <div className="flex gap-2">
//                       <a href={job.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
//                         className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Apply Now →</a>
//                       <button onClick={e=>openNotes(job,e)} className="px-4 border border-yellow-500/20 text-yellow-400 rounded-xl text-sm hover:bg-yellow-500/10">📝</button>
//                       <button onClick={e=>toggleSave(job,e)} className="px-4 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)]">
//                         {saved.includes(job.id)?'🔖 Saved':'+ Save'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── COMPANY CAREER PAGES ── */}
//       {activeTab==='companies'&&(
//         <div className="space-y-4">
//           <div className="flex gap-3 items-center flex-wrap">
//             <input value={companySearch} onChange={e=>setCompanySearch(e.target.value)} placeholder="Search company or skill..."
//               className="flex-1 max-w-sm bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
//             <button onClick={()=>setFresherCompany(p=>!p)}
//               className={`text-sm px-4 py-2.5 rounded-xl border font-semibold transition-all ${fresherCompany?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
//               🌱 Fresher-Friendly
//             </button>
//             <span className="text-xs text-[var(--t3)]">{filteredCompanies.length} companies</span>
//           </div>
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//             {filteredCompanies.map(c=>(
//               <a key={c.name} href={c.url} target="_blank" rel="noreferrer"
//                 className="group bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 hover:border-cyan-500/25 hover:-translate-y-0.5 transition-all">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="text-2xl">{c.logo}</div>
//                   <div>
//                     <div className="font-semibold text-xs">{c.name}</div>
//                     <div className="text-[9px] text-[var(--t3)]">{c.country}</div>
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap gap-0.5 mb-2">
//                   {c.tags.slice(0,3).map(t=><span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t3)]">{t}</span>)}
//                 </div>
//                 {c.fresher&&<div className="text-[9px] text-green-400 font-semibold">🌱 Fresher-friendly</div>}
//                 <div className="text-[9px] text-cyan-400 font-semibold mt-1 group-hover:underline">Career Page →</div>
//               </a>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── API SOURCES ── */}
//       {activeTab==='sources'&&(
//         <div className="space-y-5">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
//               <div className="font-display font-bold text-base mb-4">✅ Free APIs (No Key Needed)</div>
//               <div className="space-y-2">
//                 {['Remotive','Arbeitnow','Jobicy','RemoteOK','The Muse','Himalayas','Working Nomads','DevITjobs','HN Hiring','We Work Remotely','Remote.co','Jobspresso','Authentic Jobs','NoDesk','Remotive+'].map(s=>{
//                   const info=SOURCE_INFO[s]; const count=meta?.sources?.[s]||0
//                   return(
//                     <div key={s} className="flex items-center gap-3 p-3 bg-[var(--el)] rounded-xl">
//                       <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs font-semibold">{info?.label||s}</div>
//                         <div className="text-[10px] text-[var(--t3)] truncate">{info?.desc}</div>
//                       </div>
//                       {count>0?<span className="text-xs font-mono text-green-400">{count} jobs</span>:<span className="text-[10px] text-[var(--t3)]">fetch to load</span>}
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//             <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
//               <div className="font-display font-bold text-base mb-4">🔑 Premium APIs (Free Tier Available)</div>
//               <div className="space-y-3">
//                 {['Jooble','USAJobs','Adzuna','Reed UK','JSearch'].map(s=>{
//                   const info=SOURCE_INFO[s]; const count=meta?.sources?.[s]||0
//                   const configured=meta?.keysConfigured?.[s.toLowerCase().replace('.co.uk','').replace('jsearch','jsearch')]||false
//                   return(
//                     <div key={s} className={`p-4 rounded-xl border ${configured?'bg-green-500/5 border-green-500/20':'bg-[var(--el)] border-[var(--bdr)]'}`}>
//                       <div className="flex items-center gap-2 mb-1">
//                         <div className={`w-2 h-2 rounded-full flex-shrink-0 ${configured?'bg-green-400':'bg-yellow-400'}`}/>
//                         <div className="text-xs font-semibold">{info?.label}</div>
//                         {configured?<span className="text-[9px] text-green-400 font-bold ml-auto">✅ Active · {count} jobs</span>:<span className="text-[9px] text-yellow-400 font-bold ml-auto">Not configured</span>}
//                       </div>
//                       <div className="text-[10px] text-[var(--t3)] mb-2">{info?.desc}</div>
//                       {!configured&&(
//                         <div className="space-y-1">
//                           <div className="text-[10px] font-mono bg-[var(--card)] border border-[var(--bdr)] rounded px-2 py-1 text-cyan-400">{info?.keyEnv}</div>
//                           <a href={info?.keyUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 hover:underline">Get free key →</a>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//               <div className="mt-4 bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-3">
//                 <div className="text-[10px] font-semibold text-cyan-400 mb-1">How to add keys</div>
//                 <div className="text-[10px] text-[var(--t2)] font-mono leading-relaxed">Add any to <strong>.env.local</strong>:<br/>
//                   JOOBLE_API_KEY=...   <span className="text-green-400"># jooble.org/api</span><br/>
//                   USAJOBS_API_KEY=...  <span className="text-green-400"># developer.usajobs.gov</span><br/>
//                   ADZUNA_APP_ID=...    <span className="text-green-400"># 6 countries</span><br/>
//                   ADZUNA_APP_KEY=...<br/>
//                   REED_API_KEY=...     <span className="text-green-400"># UK jobs</span><br/>
//                   RAPIDAPI_KEY=...     <span className="text-green-400"># Indeed+LinkedIn</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Source breakdown if loaded */}
//           {meta&&Object.keys(meta.sources).length>0&&(
//             <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
//               <div className="font-display font-bold text-base mb-4">📊 Jobs by Source</div>
//               <div className="space-y-1.5">
//                 {Object.entries(meta.sources).sort((a,b)=>b[1]-a[1]).map(([src,cnt])=>(
//                   <div key={src} className="flex items-center gap-3">
//                     <div className={`text-xs font-semibold w-28 flex-shrink-0 truncate ${SRC_COLOR[src]||'text-[var(--t2)]'}`}>{src}</div>
//                     <div className="flex-1 h-2 bg-[var(--el)] rounded-full overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all" style={{width:`${Math.min(100,Math.round(cnt/Math.max(...Object.values(meta.sources))*100))}%`}}/>
//                     </div>
//                     <div className="text-xs font-mono text-cyan-400 w-8 text-right">{cnt}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── DEADLINES ── */}
//       {activeTab==='deadlines'&&(
//         <div className="max-w-3xl space-y-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="font-display font-bold text-lg">🗓️ Application Deadlines</h2>
//               <p className="text-xs text-[var(--t2)]">Never miss an apply-by date</p>
//             </div>
//             <button onClick={()=>setShowDlForm(p=>!p)}
//               className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
//               {showDlForm?'× Cancel':'+ Add Deadline'}
//             </button>
//           </div>
//           {showDlForm&&(
//             <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 grid grid-cols-2 gap-3">
//               {[['title','Job Title *','SDE Intern @ Google'],['company','Company','Google'],['note','Note (optional)','Apply via referral']].map(([k,l,p])=>(
//                 <div key={k} className={k==='note'?'col-span-2':''}>
//                   <label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
//                   <input value={(dlForm as any)[k]} onChange={e=>setDlForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p}
//                     className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50"/>
//                 </div>
//               ))}
//               <div>
//                 <label className="text-xs text-[var(--t2)] block mb-1">Deadline Date *</label>
//                 <input type="date" value={dlForm.date} onChange={e=>setDlForm(p=>({...p,date:e.target.value}))}
//                   className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50"/>
//               </div>
//               <div className="col-span-2">
//                 <button onClick={addDeadline} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Save →</button>
//               </div>
//             </div>
//           )}
//           {deadlines.length===0
//             ?<div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]"><div className="text-3xl mb-2">🗓️</div><div className="text-sm">No deadlines yet</div></div>
//             :<div className="space-y-2">{deadlines.map(d=>{const u=urgency(d.date); return(
//               <div key={d.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl px-5 py-4 flex items-center gap-4">
//                 <div className="text-center flex-shrink-0 w-12">
//                   <div className="font-display font-extrabold text-xl text-cyan-400">{new Date(d.date).getDate()}</div>
//                   <div className="text-[10px] text-[var(--t3)]">{new Date(d.date).toLocaleDateString('en-IN',{month:'short'})}</div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="font-semibold text-sm">{d.title}</div>
//                   {d.company&&<div className="text-xs text-[var(--t2)]">{d.company}</div>}
//                   {d.note&&<div className="text-xs text-[var(--t3)] mt-0.5">{d.note}</div>}
//                 </div>
//                 <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${u.cls}`}>{u.label}</div>
//                 <button onClick={()=>{const upd=deadlines.filter(x=>x.id!==d.id);setDeadlines(upd);localStorage.setItem('tl_deadlines',JSON.stringify(upd))}} className="text-xs text-red-400 hover:text-red-300 flex-shrink-0">✕</button>
//               </div>
//             )})}</div>
//           }
//         </div>
//       )}
//     </div>
//   )
// }
'use client'
import { useState, useEffect, useRef } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Job = {
  id: string; title: string; company: string; location: string; type: string
  url: string; posted: string; source: string; tags: string[]; isRemote: boolean
  salary: string | null; estimatedSalary: string; review: { rating: number; wlb: number }
  isFresher: boolean; description?: string
}
type Deadline = { id: string; title: string; company: string; date: string; note: string }
type Meta = { count: number; fresherCount: number; remoteCount: number; liveApiJobs: number; curatedJobs: number; sources: Record<string,number>; keysConfigured: Record<string,boolean> }

// ── Constants ─────────────────────────────────────────────────────────────────
const COMPANY_CAREERS = [
  {name:'Google',    logo:'🔵',url:'https://careers.google.com/jobs/results/?q=software+engineer&experience=INTERN,ENTRY_LEVEL',fresher:true, tags:['SWE','ML','Data'],country:'🇮🇳 🇺🇸'},
  {name:'Microsoft', logo:'🟦',url:'https://careers.microsoft.com/students/',fresher:true, tags:['SWE','Cloud','AI'],country:'🇮🇳 🇺🇸'},
  {name:'Amazon',    logo:'🟠',url:'https://www.amazon.jobs/en/teams/university-tech',fresher:true, tags:['SDE','AWS','Data'],country:'🇮🇳 🇺🇸'},
  {name:'Meta',      logo:'🔷',url:'https://www.metacareers.com/careerprograms/university',fresher:true, tags:['SWE','ML','Backend'],country:'🇮🇳 🇺🇸'},
  {name:'Apple',     logo:'🍎',url:'https://jobs.apple.com/en-us/search?team=internships',fresher:true, tags:['iOS','SWE','ML'],country:'🇮🇳 🇺🇸'},
  {name:'OpenAI',    logo:'🤖',url:'https://openai.com/careers',fresher:false,tags:['ML','LLM','Research'],country:'🇺🇸'},
  {name:'Stripe',    logo:'💙',url:'https://stripe.com/jobs/university',fresher:true, tags:['Backend','FinTech','SWE'],country:'🇮🇪 🇺🇸'},
  {name:'Notion',    logo:'⬛',url:'https://www.notion.so/careers',fresher:true, tags:['Full Stack','SWE'],country:'🌍'},
  {name:'Figma',     logo:'🎨',url:'https://www.figma.com/careers/',fresher:false,tags:['SWE','Frontend','Design'],country:'🇺🇸'},
  {name:'Razorpay',  logo:'💎',url:'https://razorpay.com/jobs/',fresher:true, tags:['Backend','SDE','FinTech'],country:'🇮🇳'},
  {name:'Swiggy',    logo:'🧡',url:'https://careers.swiggy.com/',fresher:true, tags:['SDE','Data','ML'],country:'🇮🇳'},
  {name:'Zepto',     logo:'⚡',url:'https://www.zepto.com/careers',fresher:true, tags:['Backend','Frontend'],country:'🇮🇳'},
  {name:'CRED',      logo:'💳',url:'https://careers.cred.club/',fresher:false,tags:['Backend','iOS','Android'],country:'🇮🇳'},
  {name:'Groww',     logo:'📈',url:'https://groww.in/open-positions',fresher:true, tags:['SDE','FinTech','ML'],country:'🇮🇳'},
  {name:'PhonePe',   logo:'💜',url:'https://www.phonepe.com/careers/',fresher:true, tags:['Backend','SDE','FinTech'],country:'🇮🇳'},
  {name:'Atlassian', logo:'🔷',url:'https://www.atlassian.com/company/careers/students',fresher:true, tags:['SWE','DevOps'],country:'🇦🇺 🌍'},
  {name:'Shopify',   logo:'🟢',url:'https://www.shopify.com/careers',fresher:false,tags:['Ruby','Go','React'],country:'🇨🇦 🌍'},
  {name:'Cloudflare',logo:'🌐',url:'https://www.cloudflare.com/careers/jobs/',fresher:true, tags:['Go','Rust','Networking'],country:'🇺🇸 🌍'},
  {name:'Spotify',   logo:'🟢',url:'https://lifeatspotify.com/jobs',fresher:false,tags:['Python','ML','Data'],country:'🇸🇪 🌍'},
  {name:'GitHub',    logo:'⚫',url:'https://github.com/about/careers',fresher:false,tags:['SWE','DevEx'],country:'🇺🇸 🌍'},
  {name:'Canva',     logo:'🎨',url:'https://www.canva.com/careers/',fresher:false,tags:['Java','React','Full Stack'],country:'🇦🇺 🌍'},
  {name:'Duolingo',  logo:'🦉',url:'https://careers.duolingo.com/',fresher:false,tags:['Mobile','Swift','Kotlin'],country:'🇺🇸'},
  {name:'TCS',       logo:'🔵',url:'https://nextstep.tcs.com',fresher:true, tags:['SWE','Testing','Java'],country:'🇮🇳'},
  {name:'Infosys',   logo:'🟢',url:'https://www.infosys.com/careers/',fresher:true, tags:['SWE','SAP','Java'],country:'🇮🇳'},
  {name:'Wipro',     logo:'🟡',url:'https://careers.wipro.com/',fresher:true, tags:['SWE','Cloud','Testing'],country:'🇮🇳'},
  {name:'Freshworks',logo:'🌿',url:'https://careers.freshworks.com/',fresher:true, tags:['SDE','Product','Data'],country:'🇮🇳'},
  {name:'Zoho',      logo:'🔷',url:'https://careers.zohocorp.com/',fresher:true, tags:['Java','C++','Web'],country:'🇮🇳'},
  {name:'Booking.com',logo:'🔵',url:'https://careers.booking.com/',fresher:false,tags:['Python','Perl','React'],country:'🇳🇱 🌍'},
  {name:'GitLab',    logo:'🟠',url:'https://about.gitlab.com/jobs/',fresher:false,tags:['Ruby','Go','Vue'],country:'🌍 Remote'},
  {name:'Revolut',   logo:'⬛',url:'https://www.revolut.com/careers/',fresher:false,tags:['Kotlin','React','AWS'],country:'🇬🇧 🌍'},
]
const ALL_SKILLS = ['React','Node.js','Python','Java','TypeScript','Go','AWS','Docker','ML','SQL','DevOps','Flutter','Rust','C++','Kubernetes','Swift']
const JOB_TYPES  = ['All','Full-time','Internship','Trainee','Contract','Part-time']
const SRC_COLOR: Record<string,string> = {
  Remotive:'text-blue-400',Arbeitnow:'text-purple-400',Jobicy:'text-cyan-400',
  RemoteOK:'text-pink-400','The Muse':'text-rose-400',Himalayas:'text-indigo-400',
  'Working Nomads':'text-teal-400',DevITjobs:'text-emerald-400','HN Hiring':'text-orange-400',
  Adzuna:'text-yellow-400','Reed.co.uk':'text-red-400',JSearch:'text-fuchsia-400',
  'Big Tech':'text-cyan-300','India Startup':'text-green-400','YC Startup':'text-orange-400',
  'Remote-first':'text-violet-400',Europe:'text-blue-300','Mass Hiring':'text-gray-400',
  TalentLaunch:'text-yellow-400',
}
const SOURCE_INFO: Record<string,{label:string;desc:string;free:boolean;keyEnv?:string;keyUrl?:string}> = {
  Remotive:       {label:'Remotive',        desc:'Remote tech jobs worldwide',      free:true},
  Arbeitnow:      {label:'Arbeitnow',       desc:'Europe + remote jobs',            free:true},
  Jobicy:         {label:'Jobicy',          desc:'Remote jobs, 10 skill categories', free:true},
  RemoteOK:       {label:'RemoteOK',        desc:'Remote-only jobs globally',        free:true},
  'The Muse':     {label:'The Muse',        desc:'US companies with culture data',   free:true},
  Himalayas:      {label:'Himalayas',       desc:'Remote jobs with skills filter',   free:true},
  'Working Nomads':{label:'Working Nomads', desc:'Dev jobs for nomads',             free:true},
  DevITjobs:      {label:'DevITjobs',       desc:'IT jobs focused on developers',    free:true},
  'HN Hiring':    {label:'HN Who\'s Hiring',desc:'Hacker News monthly hiring post',  free:true},
  Adzuna:         {label:'Adzuna',          desc:'10M+ jobs: India, UK, US, AU, DE, CA',free:false,keyEnv:'ADZUNA_APP_ID + ADZUNA_APP_KEY',keyUrl:'https://developer.adzuna.com/'},
  'Reed.co.uk':   {label:'Reed UK',         desc:'UK jobs board, 280k+ listings',   free:false,keyEnv:'REED_API_KEY',keyUrl:'https://www.reed.co.uk/developers/jobseeker'},
  JSearch:        {label:'JSearch',         desc:'Indeed + LinkedIn data via RapidAPI',free:false,keyEnv:'RAPIDAPI_KEY',keyUrl:'https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'},
}

// ── Pagination Constants ───────────────────────────────────────────────────────
const JOBS_PER_PAGE = 48

// ── Pagination Component ───────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  totalJobs,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  totalJobs: number
  onPageChange: (page: number) => void
}) {
  const startJob = (currentPage - 1) * JOBS_PER_PAGE + 1
  const endJob   = Math.min(currentPage * JOBS_PER_PAGE, totalJobs)

  // Build page number array with ellipsis
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--bdr)]">
      <div className="text-xs text-[var(--t2)]">
        Showing <span className="font-semibold text-white">{startJob}–{endJob}</span> of{' '}
        <span className="font-semibold text-white">{totalJobs}</span> jobs
      </div>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--bdr)] text-xs font-semibold text-[var(--t2)] hover:text-white hover:border-[var(--bds)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[var(--t3)] text-xs select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all border ${
                currentPage === p
                  ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400'
                  : 'border-[var(--bdr)] text-[var(--t2)] hover:text-white hover:border-[var(--bds)]'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--bdr)] text-xs font-semibold text-[var(--t2)] hover:text-white hover:border-[var(--bds)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>

      {/* Jump to page (shown when totalPages > 7) */}
      {totalPages > 7 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--t3)]">Go to</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            key={currentPage}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const val = parseInt((e.target as HTMLInputElement).value)
                if (val >= 1 && val <= totalPages) onPageChange(val)
              }
            }}
            className="w-14 bg-[var(--el)] border border-[var(--bdr)] rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-cyan-500/50"
          />
          <span className="text-xs text-[var(--t3)]">of {totalPages}</span>
        </div>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs,setJobs]           = useState<Job[]>([])
  const [filtered,setFiltered]   = useState<Job[]>([])
  const [search,setSearch]       = useState('')
  const [activeSkills,setActiveSkills] = useState<string[]>([])
  const [remoteOnly,setRemoteOnly]   = useState(false)
  const [fresherOnly,setFresherOnly] = useState(false)
  const [typeFilter,setTypeFilter]   = useState('All')
  const [srcFilter,setSrcFilter]     = useState('All')
  const [loading,setLoading]         = useState(false)
  const [initDone,setInitDone]       = useState(false)
  const [saved,setSaved]             = useState<string[]>([])
  const [notes,setNotes]             = useState<Record<string,string>>({})
  const [notesJob,setNotesJob]       = useState<Job|null>(null)
  const [noteInput,setNoteInput]     = useState('')
  const [toast,setToast]             = useState('')
  const [expanded,setExpanded]       = useState<string|null>(null)
  const [activeTab,setActiveTab]     = useState<'live'|'companies'|'sources'|'deadlines'>('live')
  const [companySearch,setCompanySearch] = useState('')
  const [fresherCompany,setFresherCompany] = useState(false)
  const [meta,setMeta]               = useState<Meta|null>(null)
  const [deadlines,setDeadlines]     = useState<Deadline[]>([])
  const [showDlForm,setShowDlForm]   = useState(false)
  const [dlForm,setDlForm]           = useState({title:'',company:'',date:'',note:''})
  const [alertOn,setAlertOn]         = useState(false)

  // ── Pagination state ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const alertRef = useRef<ReturnType<typeof setInterval>|null>(null)
  const jobListRef = useRef<HTMLDivElement>(null)

  // Derived pagination values
  const usePagination = filtered.length > JOBS_PER_PAGE
  const totalPages    = usePagination ? Math.ceil(filtered.length / JOBS_PER_PAGE) : 1
  const paginatedJobs = usePagination
    ? filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)
    : filtered

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1) }, [filtered])

  function handlePageChange(page: number) {
    setCurrentPage(page)
    setExpanded(null)
    // Scroll job list into view smoothly
    jobListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(()=>{
    setSaved(JSON.parse(localStorage.getItem('tl_saved')||'[]').map((j:Job)=>j.id))
    setNotes(JSON.parse(localStorage.getItem('tl_job_notes')||'{}'))
    setDeadlines(JSON.parse(localStorage.getItem('tl_deadlines')||'[]'))
    setAlertOn(localStorage.getItem('tl_alert')==='1')
    setInitDone(true)
  },[])

  useEffect(()=>{
    let f=jobs
    if(search) f=f.filter(j=>`${j.title} ${j.company} ${j.location} ${j.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
    if(remoteOnly) f=f.filter(j=>j.isRemote)
    if(fresherOnly) f=f.filter(j=>j.isFresher)
    if(typeFilter!=='All') f=f.filter(j=>j.type===typeFilter)
    if(srcFilter!=='All') f=f.filter(j=>j.source===srcFilter)
    if(activeSkills.length) f=f.filter(j=>activeSkills.some(s=>j.tags.some(t=>t.toLowerCase().includes(s.toLowerCase()))||`${j.title} ${j.description}`.toLowerCase().includes(s.toLowerCase())))
    setFiltered(f)
  },[search,remoteOnly,fresherOnly,typeFilter,srcFilter,activeSkills,jobs])

  useEffect(()=>{
    if(alertOn){
      localStorage.setItem('tl_alert','1')
      alertRef.current=setInterval(async()=>{
        try{
          const res=await fetch('/api/jobs'); const d=await res.json()
          const prev=parseInt(localStorage.getItem('tl_last_job_count')||'0')
          const curr=d.count||0
          if(curr>prev&&prev>0){
            showToast(`🔔 ${curr-prev} new jobs found!`)
            if('Notification' in window&&Notification.permission==='granted')
              new Notification('TalentLaunch Job Alert',{body:`${curr-prev} new openings match your profile!`})
          }
          localStorage.setItem('tl_last_job_count',String(curr))
        }catch{}
      },3600000)
    } else {
      if(alertRef.current)clearInterval(alertRef.current)
      localStorage.setItem('tl_alert','0')
    }
    return()=>{if(alertRef.current)clearInterval(alertRef.current)}
  },[alertOn])

  async function fetchLive(){
    setLoading(true); showToast('⏳ Fetching from 9 free APIs + curated list...')
    try{
      const res=await fetch('/api/jobs'); const d=await res.json()
      const live:Job[]=d.jobs||[]
      setJobs(live); setFiltered(live); setMeta(d)
      localStorage.setItem('tl_last_job_count',String(d.count||0))
      localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+5))
      localStorage.setItem('tl_badges',JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('tl_badges')||'[]'),'first_search'])]))
      showToast(`✅ ${live.length} jobs · ${d.liveApiJobs} live from ${Object.keys(d.sources||{}).length} APIs + ${d.curatedJobs} curated`)
    }catch(e:any){ showToast('❌ Fetch failed — check network') }
    setLoading(false)
  }

  function toggleSave(job:Job,e:React.MouseEvent){
    e.stopPropagation()
    const existing:Job[]=JSON.parse(localStorage.getItem('tl_saved')||'[]')
    if(saved.includes(job.id)){
      localStorage.setItem('tl_saved',JSON.stringify(existing.filter(j=>j.id!==job.id)))
      setSaved(p=>p.filter(id=>id!==job.id)); showToast('Removed')
    } else {
      localStorage.setItem('tl_saved',JSON.stringify([...existing,job]))
      setSaved(p=>[...p,job.id])
      localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+10))
      localStorage.setItem('tl_badges',JSON.stringify([...new Set([...JSON.parse(localStorage.getItem('tl_badges')||'[]'),'first_save'])]))
      showToast('🔖 Saved +10 XP')
    }
  }

  function openNotes(job:Job,e:React.MouseEvent){
    e.stopPropagation(); setNotesJob(job); setNoteInput(notes[job.id]||'')
  }
  function saveNote(){
    if(!notesJob)return
    const updated={...notes,[notesJob.id]:noteInput}
    setNotes(updated); localStorage.setItem('tl_job_notes',JSON.stringify(updated))
    setNotesJob(null); showToast('📌 Note saved!')
  }

  async function enableAlerts(){
    if('Notification' in window&&Notification.permission==='default')await Notification.requestPermission()
    setAlertOn(p=>!p); showToast(!alertOn?'🔔 Alerts ON — checks every hour':'🔕 Alerts off')
  }

  function addDeadline(){
    if(!dlForm.title||!dlForm.date){showToast('⚠️ Title & date required');return}
    const dl:Deadline={...dlForm,id:`dl_${Date.now()}`}
    const updated=[...deadlines,dl].sort((a,b)=>a.date.localeCompare(b.date))
    setDeadlines(updated); localStorage.setItem('tl_deadlines',JSON.stringify(updated))
    setDlForm({title:'',company:'',date:'',note:''}); setShowDlForm(false); showToast('🗓️ Added!')
  }

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),2800)}

  const filteredCompanies=COMPANY_CAREERS.filter(c=>{
    const q=companySearch.toLowerCase()
    return(!q||c.name.toLowerCase().includes(q)||c.tags.some(t=>t.toLowerCase().includes(q)))&&(!fresherCompany||c.fresher)
  })

  function urgency(date:string){
    const days=Math.ceil((new Date(date).getTime()-Date.now())/86400000)
    if(days<0)return{label:'Overdue',cls:'text-red-400 bg-red-500/10 border-red-500/25'}
    if(days<=3)return{label:`${days}d left ⚠️`,cls:'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'}
    if(days<=7)return{label:`${days}d left`,cls:'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'}
    return{label:`${days}d left`,cls:'text-[var(--t2)] bg-[var(--el)] border-[var(--bdr)]'}
  }

  const activeSources=jobs.length>0?[...new Set(jobs.map(j=>j.source))].filter(s=>s!=='TalentLaunch'):[]

  if(!initDone)return(
    <div className="max-w-6xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-64 bg-[var(--el)] rounded-xl"/>
      <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-[var(--el)] rounded-2xl"/>)}</div>
      <div className="h-96 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  return(
    <div className="max-w-7xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}

      {/* Notes modal */}
      {notesJob&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--bds)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div><div className="font-bold text-base">📌 Note</div><div className="text-xs text-[var(--t2)] mt-0.5">{notesJob.company} — {notesJob.title}</div></div>
              <button onClick={()=>setNotesJob(null)} className="text-[var(--t3)] hover:text-white text-xl">×</button>
            </div>
            <textarea value={noteInput} onChange={e=>setNoteInput(e.target.value)} rows={5} placeholder="Interview feedback, HR contact, salary offered, impressions..."
              className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setNotesJob(null)} className="flex-1 border border-[var(--bdr)] text-[var(--t2)] py-2.5 rounded-xl text-sm hover:border-[var(--bds)]">Cancel</button>
              <button onClick={saveNote} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl">🌍 Global Job Search</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">
            {jobs.length>0
              ?<>{jobs.length} jobs · <span className="text-green-400">{meta?.liveApiJobs||0} live from APIs</span> + <span className="text-cyan-400">{meta?.curatedJobs||0} curated</span> · {meta?.fresherCount||0} fresher · {meta?.remoteCount||0} remote</>
              :'20+ free & freemium APIs + 150 curated companies worldwide — click fetch'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={enableAlerts}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${alertOn?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
            {alertOn?'🔔 Alerts ON':'🔕 Set Alert'}
          </button>
          <button onClick={fetchLive} disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all disabled:opacity-60">
            {loading?'⏳ Fetching...':jobs.length>0?'🔄 Refresh':'⚡ Fetch All Jobs'}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {meta&&(
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {label:'Total Jobs',val:meta.count,color:'text-cyan-400',bg:'bg-cyan-500/8 border-cyan-500/15'},
            {label:'Live from APIs',val:meta.liveApiJobs,color:'text-green-400',bg:'bg-green-500/8 border-green-500/15'},
            {label:'Fresher Roles',val:meta.fresherCount,color:'text-yellow-400',bg:'bg-yellow-500/8 border-yellow-500/15'},
            {label:'Remote Jobs',val:meta.remoteCount,color:'text-purple-400',bg:'bg-purple-500/8 border-purple-500/15'},
            {label:'API Sources',val:Object.keys(meta.sources).length,color:'text-orange-400',bg:'bg-orange-500/8 border-orange-500/15'},
          ].map(s=>(
            <div key={s.label} className={`border rounded-2xl p-3 text-center ${s.bg}`}>
              <div className={`font-display font-extrabold text-2xl ${s.color}`}>{s.val}</div>
              <div className="text-[10px] text-[var(--t2)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab nav */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit overflow-x-auto">
        {([['live','🌍 Live Jobs'],['companies','🏢 Career Pages'],['sources','📡 API Sources'],['deadlines','🗓️ Deadlines']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setActiveTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* ── LIVE JOBS ── */}
      {activeTab==='live'&&(
        <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {/* Sidebar filters */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 space-y-3 sticky top-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs..."
                className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>

              <div>
                <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Job Type</div>
                <div className="flex flex-wrap gap-1">
                  {JOB_TYPES.map(t=>(
                    <button key={t} onClick={()=>setTypeFilter(t)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold transition-all ${typeFilter===t?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-[var(--t2)]'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {ALL_SKILLS.map(s=>(
                    <button key={s} onClick={()=>setActiveSkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold transition-all ${activeSkills.includes(s)?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-[var(--t2)]'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-1.5">Source</div>
                <select value={srcFilter} onChange={e=>setSrcFilter(e.target.value)}
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-cyan-500/50">
                  <option value="All">All Sources</option>
                  {activeSources.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {[['🌍 Remote Only',remoteOnly,setRemoteOnly],['🌱 Fresher / Intern',fresherOnly,setFresherOnly]].map(([l,v,s])=>(
                <button key={String(l)} onClick={()=>(s as(x:boolean)=>void)(!(v as boolean))}
                  className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all text-left ${v?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>
                  <div className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center ${v?'border-cyan-400 bg-cyan-400':'border-[var(--t3)]'}`}>
                    {v&&<span className="text-white text-[8px] font-bold">✓</span>}
                  </div>{String(l)}
                </button>
              ))}

              {(search||activeSkills.length>0||remoteOnly||fresherOnly||typeFilter!=='All'||srcFilter!=='All')&&(
                <button onClick={()=>{setSearch('');setActiveSkills([]);setRemoteOnly(false);setFresherOnly(false);setTypeFilter('All');setSrcFilter('All')}}
                  className="w-full text-xs text-red-400 hover:text-red-300 py-1 transition-colors">✕ Clear all</button>
              )}

              {/* Skills demand */}
              <div className="pt-2 border-t border-[var(--bdr)]">
                <div className="text-[10px] font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">🔥 Demand 2025</div>
                {[['LLM/GenAI',95],['React',85],['Python',82],['ML/AI',80],['TypeScript',76],['AWS',72],['Docker',68],['Go',64]].map(([s,p])=>(
                  <div key={String(s)} className="flex items-center gap-1.5 mb-1">
                    <div className="text-[9px] text-[var(--t2)] w-16 flex-shrink-0 truncate">{s}</div>
                    <div className="flex-1 h-1 bg-[var(--el)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${p}%`}}/>
                    </div>
                    <div className="text-[9px] font-mono text-cyan-400 w-6 text-right">{p}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs grid */}
          <div ref={jobListRef} className="lg:col-span-3 xl:col-span-4 space-y-3 scroll-mt-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[var(--t2)]">
                {filtered.length} jobs shown {activeSkills.length>0?`· filtered by ${activeSkills.join(', ')}`:''}
                {usePagination && (
                  <span className="ml-1 text-[var(--t3)]">
                    · page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
              {filtered.length>0&&<div className="text-xs text-[var(--t3)]">{filtered.filter(j=>j.isRemote).length} remote · {filtered.filter(j=>j.isFresher).length} fresher</div>}
            </div>

            {jobs.length===0&&!loading&&(
              <div className="text-center py-24 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl">
                <div className="text-5xl mb-4">🌍</div>
                <div className="font-display font-bold text-xl mb-2">300+ Jobs from Around the Globe</div>
                <p className="text-sm text-[var(--t2)] mb-2 max-w-sm mx-auto">9 free job APIs · 80+ curated companies · India, USA, Europe, Remote</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-md mx-auto">
                  {['Remotive','Arbeitnow','Jobicy','RemoteOK','The Muse','Himalayas','Working Nomads','DevITjobs','HN Hiring','We Work Remotely','Remote.co','Jobspresso','NoDesk'].map(s=>(
                    <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${SRC_COLOR[s]||'text-[var(--t3)]'} bg-[var(--el)] border border-[var(--bdr)]`}>{s}</span>
                  ))}
                </div>
                <button onClick={fetchLive} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_24px_rgba(0,220,255,0.4)] transition-all text-sm">
                  ⚡ Fetch All Jobs Now
                </button>
              </div>
            )}

            {loading&&(
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 animate-pulse">
                {[...Array(9)].map((_,i)=><div key={i} className="h-52 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl"/>)}
              </div>
            )}

            {!loading&&jobs.length>0&&filtered.length===0&&(
              <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm font-semibold">No jobs match filters</div>
                <button onClick={()=>{setSearch('');setActiveSkills([]);setRemoteOnly(false);setFresherOnly(false);setTypeFilter('All');setSrcFilter('All')}}
                  className="mt-2 text-xs text-cyan-400 hover:underline">Clear all filters</button>
              </div>
            )}

            {/* Grid layout */}
            {!loading&&paginatedJobs.length>0&&(
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {paginatedJobs.map(job=>(
                  <div key={job.id} onClick={()=>setExpanded(expanded===job.id?null:job.id)}
                    className={`bg-[var(--card)] border rounded-2xl p-4 flex flex-col hover:border-cyan-500/25 hover:-translate-y-0.5 transition-all cursor-pointer ${expanded===job.id?'border-cyan-500/35':'border-[var(--bdr)]'}`}>

                    {/* Card header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {job.company[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm leading-tight line-clamp-1">{job.title}</div>
                          <div className="text-[11px] text-[var(--t2)] truncate">{job.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {notes[job.id]&&<span className="text-yellow-400 text-sm">📌</span>}
                        <button onClick={e=>openNotes(job,e)} title="Add note" className="text-sm opacity-20 hover:opacity-70 transition-opacity">📝</button>
                        <button onClick={e=>toggleSave(job,e)} className={`text-base hover:scale-110 transition-all ${saved.includes(job.id)?'':'opacity-20 hover:opacity-70'}`}>🔖</button>
                      </div>
                    </div>

                    {/* Location + type row */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="text-[10px] text-[var(--t3)] truncate flex-1">📍 {job.location}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t3)] flex-shrink-0">{job.type}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.tags.slice(0,3).map(t=>(
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{t}</span>
                      ))}
                      {job.isRemote&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">🌍 Remote</span>}
                      {job.isFresher&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">🌱 Fresher</span>}
                    </div>

                    {/* Note preview */}
                    {notes[job.id]&&(
                      <div className="mb-2 text-[10px] text-yellow-200/70 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-2.5 py-1.5 line-clamp-1">
                        📌 {notes[job.id]}
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1"/>

                    {/* Footer */}
                    <div className="pt-3 mt-1 border-t border-[var(--bdr)] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] font-mono text-green-400 font-semibold truncate">{job.estimatedSalary}</span>
                        <span className="text-[10px] text-yellow-400">⭐ {job.review.rating}</span>
                      </div>
                      <a href={job.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                        className="text-[11px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">Apply →</a>
                    </div>

                    {/* Source + date */}
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[10px] font-semibold ${SRC_COLOR[job.source]||'text-[var(--t3)]'}`}>{job.source}</span>
                      <span className="text-[10px] text-[var(--t3)]">{job.posted}</span>
                    </div>

                    {/* Expanded panel */}
                    {expanded===job.id&&(
                      <div className="mt-3 pt-3 border-t border-[var(--bdr)] space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Salary Est.</div><div className="text-xs font-semibold text-green-400">{job.estimatedSalary}</div></div>
                          <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Rating</div><div className="text-xs font-semibold text-yellow-400">⭐ {job.review.rating}</div></div>
                          <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">WLB</div><div className="text-xs font-semibold text-blue-400">🧘 {job.review.wlb}/5</div></div>
                          <div className="bg-[var(--el)] rounded-xl p-2.5"><div className="text-[10px] text-[var(--t3)] mb-0.5">Source</div><div className={`text-xs font-semibold ${SRC_COLOR[job.source]||'text-[var(--t3)]'}`}>{job.source}</div></div>
                        </div>
                        {job.description&&<div className="bg-[var(--el)] rounded-xl p-3 text-xs text-[var(--t2)] leading-relaxed line-clamp-4">{job.description}</div>}
                        <div className="flex gap-2">
                          <a href={job.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                            className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Apply Now →</a>
                          <button onClick={e=>openNotes(job,e)} className="px-3 border border-yellow-500/20 text-yellow-400 rounded-xl text-sm hover:bg-yellow-500/10">📝</button>
                          <button onClick={e=>toggleSave(job,e)} className="px-3 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)]">
                            {saved.includes(job.id)?'🔖':'+ Save'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && usePagination && filtered.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalJobs={filtered.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}

      {/* ── COMPANY CAREER PAGES ── */}
      {activeTab==='companies'&&(
        <div className="space-y-4">
          <div className="flex gap-3 items-center flex-wrap">
            <input value={companySearch} onChange={e=>setCompanySearch(e.target.value)} placeholder="Search company or skill..."
              className="flex-1 max-w-sm bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
            <button onClick={()=>setFresherCompany(p=>!p)}
              className={`text-sm px-4 py-2.5 rounded-xl border font-semibold transition-all ${fresherCompany?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
              🌱 Fresher-Friendly
            </button>
            <span className="text-xs text-[var(--t3)]">{filteredCompanies.length} companies</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredCompanies.map(c=>(
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer"
                className="group bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 hover:border-cyan-500/25 hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">{c.logo}</div>
                  <div>
                    <div className="font-semibold text-xs">{c.name}</div>
                    <div className="text-[9px] text-[var(--t3)]">{c.country}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5 mb-2">
                  {c.tags.slice(0,3).map(t=><span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t3)]">{t}</span>)}
                </div>
                {c.fresher&&<div className="text-[9px] text-green-400 font-semibold">🌱 Fresher-friendly</div>}
                <div className="text-[9px] text-cyan-400 font-semibold mt-1 group-hover:underline">Career Page →</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── API SOURCES ── */}
      {activeTab==='sources'&&(
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="font-display font-bold text-base mb-4">✅ Free APIs (No Key Needed)</div>
              <div className="space-y-2">
                {['Remotive','Arbeitnow','Jobicy','RemoteOK','The Muse','Himalayas','Working Nomads','DevITjobs','HN Hiring','We Work Remotely','Remote.co','Jobspresso','Authentic Jobs','NoDesk','Remotive+'].map(s=>{
                  const info=SOURCE_INFO[s]; const count=meta?.sources?.[s]||0
                  return(
                    <div key={s} className="flex items-center gap-3 p-3 bg-[var(--el)] rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{info?.label||s}</div>
                        <div className="text-[10px] text-[var(--t3)] truncate">{info?.desc}</div>
                      </div>
                      {count>0?<span className="text-xs font-mono text-green-400">{count} jobs</span>:<span className="text-[10px] text-[var(--t3)]">fetch to load</span>}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="font-display font-bold text-base mb-4">🔑 Premium APIs (Free Tier Available)</div>
              <div className="space-y-3">
                {['Jooble','USAJobs','Adzuna','Reed UK','JSearch'].map(s=>{
                  const info=SOURCE_INFO[s]; const count=meta?.sources?.[s]||0
                  const configured=meta?.keysConfigured?.[s.toLowerCase().replace('.co.uk','').replace('jsearch','jsearch')]||false
                  return(
                    <div key={s} className={`p-4 rounded-xl border ${configured?'bg-green-500/5 border-green-500/20':'bg-[var(--el)] border-[var(--bdr)]'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${configured?'bg-green-400':'bg-yellow-400'}`}/>
                        <div className="text-xs font-semibold">{info?.label}</div>
                        {configured?<span className="text-[9px] text-green-400 font-bold ml-auto">✅ Active · {count} jobs</span>:<span className="text-[9px] text-yellow-400 font-bold ml-auto">Not configured</span>}
                      </div>
                      <div className="text-[10px] text-[var(--t3)] mb-2">{info?.desc}</div>
                      {!configured&&(
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono bg-[var(--card)] border border-[var(--bdr)] rounded px-2 py-1 text-cyan-400">{info?.keyEnv}</div>
                          <a href={info?.keyUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 hover:underline">Get free key →</a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-3">
                <div className="text-[10px] font-semibold text-cyan-400 mb-1">How to add keys</div>
                <div className="text-[10px] text-[var(--t2)] font-mono leading-relaxed">Add any to <strong>.env.local</strong>:<br/>
                  JOOBLE_API_KEY=...   <span className="text-green-400"># jooble.org/api</span><br/>
                  USAJOBS_API_KEY=...  <span className="text-green-400"># developer.usajobs.gov</span><br/>
                  ADZUNA_APP_ID=...    <span className="text-green-400"># 6 countries</span><br/>
                  ADZUNA_APP_KEY=...<br/>
                  REED_API_KEY=...     <span className="text-green-400"># UK jobs</span><br/>
                  RAPIDAPI_KEY=...     <span className="text-green-400"># Indeed+LinkedIn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source breakdown if loaded */}
          {meta&&Object.keys(meta.sources).length>0&&(
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="font-display font-bold text-base mb-4">📊 Jobs by Source</div>
              <div className="space-y-1.5">
                {Object.entries(meta.sources).sort((a,b)=>b[1]-a[1]).map(([src,cnt])=>(
                  <div key={src} className="flex items-center gap-3">
                    <div className={`text-xs font-semibold w-28 flex-shrink-0 truncate ${SRC_COLOR[src]||'text-[var(--t2)]'}`}>{src}</div>
                    <div className="flex-1 h-2 bg-[var(--el)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all" style={{width:`${Math.min(100,Math.round(cnt/Math.max(...Object.values(meta.sources))*100))}%`}}/>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 w-8 text-right">{cnt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DEADLINES ── */}
      {activeTab==='deadlines'&&(
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg">🗓️ Application Deadlines</h2>
              <p className="text-xs text-[var(--t2)]">Never miss an apply-by date</p>
            </div>
            <button onClick={()=>setShowDlForm(p=>!p)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
              {showDlForm?'× Cancel':'+ Add Deadline'}
            </button>
          </div>
          {showDlForm&&(
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 grid grid-cols-2 gap-3">
              {[['title','Job Title *','SDE Intern @ Google'],['company','Company','Google'],['note','Note (optional)','Apply via referral']].map(([k,l,p])=>(
                <div key={k} className={k==='note'?'col-span-2':''}>
                  <label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                  <input value={(dlForm as any)[k]} onChange={e=>setDlForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p}
                    className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50"/>
                </div>
              ))}
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Deadline Date *</label>
                <input type="date" value={dlForm.date} onChange={e=>setDlForm(p=>({...p,date:e.target.value}))}
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50"/>
              </div>
              <div className="col-span-2">
                <button onClick={addDeadline} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Save →</button>
              </div>
            </div>
          )}
          {deadlines.length===0
            ?<div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]"><div className="text-3xl mb-2">🗓️</div><div className="text-sm">No deadlines yet</div></div>
            :<div className="space-y-2">{deadlines.map(d=>{const u=urgency(d.date); return(
              <div key={d.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="text-center flex-shrink-0 w-12">
                  <div className="font-display font-extrabold text-xl text-cyan-400">{new Date(d.date).getDate()}</div>
                  <div className="text-[10px] text-[var(--t3)]">{new Date(d.date).toLocaleDateString('en-IN',{month:'short'})}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{d.title}</div>
                  {d.company&&<div className="text-xs text-[var(--t2)]">{d.company}</div>}
                  {d.note&&<div className="text-xs text-[var(--t3)] mt-0.5">{d.note}</div>}
                </div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${u.cls}`}>{u.label}</div>
                <button onClick={()=>{const upd=deadlines.filter(x=>x.id!==d.id);setDeadlines(upd);localStorage.setItem('tl_deadlines',JSON.stringify(upd))}} className="text-xs text-red-400 hover:text-red-300 flex-shrink-0">✕</button>
              </div>
            )})}</div>
          }
        </div>
      )}
    </div>
  )
}