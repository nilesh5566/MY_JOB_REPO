'use client'
import { useState, useEffect } from 'react'

type Group = { id:string; name:string; focus:string; members:number; maxMembers:number; skills:string[]; meetingTime:string; platform:string; link:string; college?:string; active:boolean }

const SEED:Group[]=[
  {id:'g1',name:'FAANG DSA Grinders',focus:'LeetCode + System Design for FAANG',members:7,maxMembers:8,skills:['DSA','LeetCode','C++','Java'],meetingTime:'Daily 8pm IST',platform:'Discord',link:'https://discord.gg/example',active:true},
  {id:'g2',name:'ML/AI Interview Prep',focus:'ML theory + coding + paper reading',members:5,maxMembers:6,skills:['Python','ML','Statistics','PyTorch'],meetingTime:'Tue/Thu 7pm IST',platform:'Discord',link:'https://discord.gg/example2',active:true},
  {id:'g3',name:'Razorpay SDE-1 Prep',focus:'Backend + low-level design for fintech',members:4,maxMembers:5,skills:['Java','Go','System Design','SQL'],meetingTime:'Weekends 10am IST',platform:'Google Meet',link:'https://meet.google.com/example',active:true},
  {id:'g4',name:'Tier-2/3 College Hustlers',focus:'Off-campus placement + resume building',members:12,maxMembers:15,skills:['Any Stack','Resume','Interview'],meetingTime:'Sun 6pm IST',platform:'WhatsApp',link:'https://chat.whatsapp.com/example',active:true},
  {id:'g5',name:'Remote Jobs Seekers',focus:'Landing remote roles at global companies',members:8,maxMembers:10,skills:['React','Node.js','Go','Remote'],meetingTime:'Wed 9pm IST',platform:'Discord',link:'https://discord.gg/example3',active:true},
]

export default function StudyGroupsPage(){
  const [groups,setGroups]   = useState<Group[]>(SEED)
  const [showForm,setShowForm] = useState(false)
  const [search,setSearch]   = useState('')
  const [toast,setToast]     = useState('')
  const [form,setForm]       = useState({name:'',focus:'',skills:'',meetingTime:'',platform:'Discord',link:'',maxMembers:'6',college:''})

  useEffect(()=>{
    const custom=JSON.parse(localStorage.getItem('tl_study_groups')||'[]')
    setGroups([...custom,...SEED])
  },[])

  function createGroup(){
    if(!form.name||!form.focus||!form.link){showToast('Name, focus and link required');return}
    const g:Group={id:`sg_${Date.now()}`,name:form.name,focus:form.focus,members:1,maxMembers:parseInt(form.maxMembers)||6,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),meetingTime:form.meetingTime,platform:form.platform,link:form.link,college:form.college||undefined,active:true}
    const custom=JSON.parse(localStorage.getItem('tl_study_groups')||'[]')
    localStorage.setItem('tl_study_groups',JSON.stringify([g,...custom]))
    setGroups(p=>[g,...p]); setShowForm(false)
    setForm({name:'',focus:'',skills:'',meetingTime:'',platform:'Discord',link:'',maxMembers:'6',college:''})
    showToast('Study group created!')
  }
  function showToast(m:string){setToast(m);setTimeout(()=>setToast(''),2500)}

  const filtered=groups.filter(g=>!search||`${g.name} ${g.focus} ${g.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
  const inp='w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  return(
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display font-extrabold text-3xl">📖 Study Groups</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Find peers for DSA + interview prep · accountability partners</p></div>
        <button onClick={()=>setShowForm(p=>!p)} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">+ Create Group</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search groups by focus, skills..."
        className="w-full bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
      {showForm&&(
        <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
          <div className="font-bold text-sm">Create a Study Group</div>
          <div className="grid md:grid-cols-2 gap-3">
            {[['name','Group Name *','FAANG DSA Squad'],['focus','Focus *','LeetCode + System Design'],['skills','Skills (comma)','Java, DSA, LeetCode'],['meetingTime','Meeting Time','Daily 8pm IST'],['college','College (optional)','IIT Bombay'],['maxMembers','Max Members','6']].map(([k,l,p])=>(
              <div key={k}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className={inp}/></div>
            ))}
            <div><label className="text-xs text-[var(--t2)] block mb-1">Platform</label>
              <select value={form.platform} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} className={inp}>
                {['Discord','WhatsApp','Telegram','Google Meet','Zoom'].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Group Link *</label>
              <input value={form.link} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="https://discord.gg/..." className={inp}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setShowForm(false)} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl py-2.5 text-sm">Cancel</button>
            <button onClick={createGroup} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Create Group</button>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(g=>{
          const full=g.members>=g.maxMembers
          return(
            <div key={g.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 hover:border-cyan-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-sm">{g.name}</div>
                  <div className="text-xs text-cyan-400 mt-0.5">{g.focus}</div>
                  {g.college&&<div className="text-xs text-[var(--t3)] mt-0.5">🎓 {g.college}</div>}
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${full?'bg-red-500/10 text-red-400':'bg-green-500/10 text-green-400'}`}>
                  {g.members}/{g.maxMembers} members
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {g.skills.map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{s}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--t2)] mb-3">
                <span>⏰ {g.meetingTime}</span>
                <span>📱 {g.platform}</span>
              </div>
              <div className="h-1.5 bg-[var(--el)] rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${full?'bg-red-500':'bg-green-500'}`} style={{width:`${(g.members/g.maxMembers)*100}%`}}/>
              </div>
              <a href={g.link} target="_blank" rel="noreferrer"
                className={`block text-center text-xs font-bold py-2.5 rounded-xl transition-all ${full?'bg-[var(--el)] text-[var(--t3)] cursor-not-allowed':'bg-gradient-to-r from-cyan-500 to-cyan-400 text-white hover:shadow-[0_0_12px_rgba(0,220,255,0.3)]'}`}>
                {full?'Group Full':'Join Group →'}
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
