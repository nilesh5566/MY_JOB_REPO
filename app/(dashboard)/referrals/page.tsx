'use client'
import { useState, useEffect } from 'react'

type Referral = { id:string; type:'offer'|'request'; company:string; role:string; name:string; college?:string; skills:string[]; note:string; time:string; contact:string; badges:number }

const SEED: Referral[] = [
  {id:'r1',type:'offer',company:'Google',role:'SDE Intern',name:'Arjun M.',college:'IIT Bombay',skills:['Python','DSA','ML'],note:'Can refer strong candidates with 7+ CGPA. Send your resume.',time:'2h ago',contact:'https://linkedin.com/in/arjun',badges:9},
  {id:'r2',type:'offer',company:'Razorpay',role:'SDE-1',name:'Priya S.',college:'BITS Pilani',skills:['Java','Backend','System Design'],note:'Looking for backend engineers. Strong fundamentals + 1 good project.',time:'5h ago',contact:'https://linkedin.com/in/priya',badges:7},
  {id:'r3',type:'request',company:'Microsoft',role:'New Grad SWE',name:'Rahul K.',college:'NIT Trichy',skills:['C#','.NET','Azure'],note:'Final year CS, CGPA 8.4. Strong DSA. 2 internships.',time:'1d ago',contact:'mailto:rahul@email.com',badges:5},
  {id:'r4',type:'offer',company:'Atlassian',role:'Graduate Engineer',name:'Sneha T.',college:'VIT',skills:['Java','Kotlin','AWS'],note:'Can refer for solid DSA + at least 1 internship.',time:'1d ago',contact:'https://linkedin.com/in/sneha',badges:8},
  {id:'r5',type:'request',company:'Swiggy',role:'SDE-1',name:'Dev P.',college:'DTU Delhi',skills:['Go','Node.js','Docker'],note:'2 years exp at startup. Looking for referral to Swiggy.',time:'2d ago',contact:'mailto:dev@email.com',badges:6},
  {id:'r6',type:'offer',company:'Freshworks',role:'SDE-1',name:'Kavya M.',college:'Anna University',skills:['Ruby','React','MySQL'],note:'Any tier college welcome. Culture fit + project matters.',time:'2d ago',contact:'https://linkedin.com/in/kavya',badges:6},
]

export default function ReferralsPage(){
  const [posts,setPosts]   = useState<Referral[]>(SEED)
  const [filter,setFilter] = useState<'all'|'offer'|'request'>('all')
  const [search,setSearch] = useState('')
  const [showForm,setShowForm] = useState(false)
  const [formType,setFormType] = useState<'offer'|'request'>('offer')
  const [form,setForm]     = useState({company:'',role:'',college:'',skills:'',note:'',contact:''})
  const [toast,setToast]   = useState('')

  useEffect(()=>{
    const custom = JSON.parse(localStorage.getItem('tl_referrals')||'[]')
    setPosts([...custom,...SEED])
  },[])

  function submit(){
    if(!form.company||!form.role||!form.contact){ showToast('Company, role and contact required'); return }
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    const ref:Referral={
      id:`ref_${Date.now()}`,type:formType,company:form.company,role:form.role,
      name:u.name||'Anonymous',college:form.college||undefined,
      skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),
      note:form.note,time:'Just now',contact:form.contact,
      badges:JSON.parse(localStorage.getItem('tl_badges')||'[]').length
    }
    const custom=JSON.parse(localStorage.getItem('tl_referrals')||'[]')
    localStorage.setItem('tl_referrals',JSON.stringify([ref,...custom]))
    setPosts(p=>[ref,...p])
    setShowForm(false); setForm({company:'',role:'',college:'',skills:'',note:'',contact:''})
    showToast(formType==='offer'?'Referral offer posted!':'Referral request posted!')
  }

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(''),2500)}

  const filtered = posts.filter(p=>{
    const matchType = filter==='all'||p.type===filter
    const q = search.toLowerCase()
    return matchType&&(!q||`${p.company} ${p.role} ${p.skills.join(' ')}`.toLowerCase().includes(q))
  })

  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  return(
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display font-extrabold text-3xl">🤝 Referral Marketplace</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Offer referrals · Request referrals · Get hired faster</p></div>
        <div className="flex gap-2">
          <button onClick={()=>{setFormType('request');setShowForm(p=>!p)}} className="border border-[var(--bdr)] text-[var(--t2)] px-4 py-2 rounded-xl text-sm font-semibold hover:border-[var(--bds)]">Request</button>
          <button onClick={()=>{setFormType('offer');setShowForm(p=>!p)}} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">Offer Referral</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{l:'Offers',v:posts.filter(p=>p.type==='offer').length,c:'text-cyan-400',b:'bg-cyan-500/8 border-cyan-500/15'},
          {l:'Requests',v:posts.filter(p=>p.type==='request').length,c:'text-purple-400',b:'bg-purple-500/8 border-purple-500/15'},
          {l:'Companies',v:[...new Set(posts.map(p=>p.company))].length,c:'text-green-400',b:'bg-green-500/8 border-green-500/15'}].map(s=>(
          <div key={s.l} className={`border rounded-2xl p-4 text-center ${s.b}`}>
            <div className={`font-display font-extrabold text-3xl ${s.c}`}>{s.v}</div>
            <div className="text-xs text-[var(--t2)] mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      {showForm&&(
        <div className="border border-cyan-500/20 bg-cyan-500/5 rounded-2xl p-5 space-y-4">
          <div className="font-bold text-sm">{formType==='offer'?'Offer a Referral':'Request a Referral'}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {[['company','Company *','Google'],['role','Role *','SDE Intern'],['college','College','IIT Bombay'],['skills','Skills','Java, Python, DSA'],['contact','LinkedIn/Email *','https://linkedin.com/in/you']].map(([k,l,p])=>(
              <div key={k} className={k==='contact'?'md:col-span-2':''}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className={inp}/></div>
            ))}
            <div className="md:col-span-2"><label className="text-xs text-[var(--t2)] block mb-1">Note</label>
              <textarea value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} rows={2} placeholder="Requirements, background, what you are looking for..." className={inp+' resize-none'}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setShowForm(false)} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl py-2.5 text-sm">Cancel</button>
            <button onClick={submit} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Post</button>
          </div>
        </div>
      )}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, role, skills..." className="flex-1 min-w-48 bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
        {(['all','offer','request'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-all ${filter===f?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>
            {f==='all'?'All':f==='offer'?'Offers':'Requests'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r=>(
          <div key={r.id} className={`border rounded-2xl p-5 ${r.type==='offer'?'bg-[var(--card)] border-[var(--bdr)] hover:border-cyan-500/20':'bg-purple-500/5 border-purple-500/15'} transition-all`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${r.type==='offer'?'bg-cyan-500/20':'bg-purple-500/20'}`}>{r.type==='offer'?'🌟':'🙋'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-sm">{r.company}</span>
                  <span className="text-sm text-cyan-400 font-semibold">{r.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${r.type==='offer'?'bg-cyan-500/15 text-cyan-400':'bg-purple-500/15 text-purple-400'}`}>{r.type==='offer'?'Offering':'Seeking'}</span>
                </div>
                <div className="text-xs text-[var(--t2)] mb-2">👤 {r.name}{r.college?` · 🎓 ${r.college}`:''} · 🏅 {r.badges} badges · {r.time}</div>
                <div className="flex flex-wrap gap-1 mb-2">{r.skills.map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{s}</span>)}</div>
                {r.note&&<p className="text-xs text-[var(--t2)]">{r.note}</p>}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--bdr)] flex justify-end">
              <a href={r.contact} target="_blank" rel="noreferrer" className={`text-xs font-bold px-4 py-2 rounded-xl ${r.type==='offer'?'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20':'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>
                {r.type==='offer'?'Contact for Referral →':'View Profile →'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
