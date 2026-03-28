'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const Onboarding = dynamic(()=>import('@/components/Onboarding'),{ssr:false})

const DAILY_TIPS=["🎯 Apply Mon–Tue: 40% fewer competitors than Friday!","📄 Tailor resume keywords to each JD for 3x more callbacks.","🤝 80% of jobs filled through networking — connect with 1 new person today!","⚡ Follow up after 5–7 days if no response. Persistence pays!","🔑 Add quantified impact: 'Built app used by 500+ users' > 'Built app'","🎤 Record yourself answering interview questions — review for filler words.","💡 LinkedIn headline: 'CS Fresher | Python · ML · React' gets 5x more views.","🏆 Apply 5 reach + 5 match + 5 safe companies for best odds.","📊 ATS tip: Use exact keywords from the job posting in your resume.","🚀 Side projects on GitHub > certificates when competing for tech roles.","⏰ Best time to apply: Tuesday 10am–12pm gets highest recruiter attention.","💬 Cold email: Mention 1 specific thing you admire about the company.","📈 Most in demand 2025: AI/ML, Cloud, Full Stack, LLM.","🎁 Open source contributions show initiative and build real-world skills.","🔍 Google: 'site:linkedin.com/in {company} engineer' to find contacts."]
const LEVELS=[{name:'🌱 Fresher',min:0},{name:'💻 Junior Dev',min:100},{name:'⚡ Mid Engineer',min:300},{name:'🚀 Senior Dev',min:600},{name:'🏆 Tech Lead',min:1000}]
const ALL_BADGES=[
  {id:'first_search',name:'First Search',emoji:'🔍',desc:'Searched for jobs'},
  {id:'first_save',name:'Job Saver',emoji:'🔖',desc:'Saved first job'},
  {id:'first_apply',name:'First Apply',emoji:'📨',desc:'Logged first application'},
  {id:'resume_built',name:'Resume Pro',emoji:'📄',desc:'Built a resume'},
  {id:'ai_master',name:'AI Master',emoji:'🤖',desc:'Used AI 5+ times'},
  {id:'mock_done',name:'Interview Ready',emoji:'🎤',desc:'Did mock interview'},
  {id:'streak_3',name:'On a Roll',emoji:'🔥',desc:'3-day streak'},
  {id:'streak_7',name:'Week Warrior',emoji:'⚡',desc:'7-day streak'},
  {id:'offer',name:'Offer Getter',emoji:'🏆',desc:'Got an offer'},
  {id:'resume_pdf',name:'PDF Master',emoji:'📎',desc:'Uploaded resume PDF'},
]
const QUICK_ACTIONS=[
  {href:'/jobs',emoji:'🔍',label:'Search Jobs',desc:'200+ live openings'},
  {href:'/fresher',emoji:'🌱',label:'Fresher Hub',desc:'Off-campus drives'},
  {href:'/ai',emoji:'🤖',label:'AI Suite',desc:'24 AI career tools'},
  {href:'/tracker',emoji:'➕',label:'Log Application',desc:'Track your pipeline'},
  {href:'/resume',emoji:'📄',label:'Build Resume',desc:'Upload PDF or builder'},
  {href:'/resources',emoji:'📚',label:'Resources',desc:'DSA, SD, projects'},
]
function getLevel(xp:number){
  let lvl=LEVELS[0]
  for(const l of LEVELS){if(xp>=l.min)lvl=l}
  const next=LEVELS[LEVELS.indexOf(lvl)+1]
  const pct=next?Math.round(((xp-lvl.min)/(next.min-lvl.min))*100):100
  return{...lvl,pct,nextName:next?.name||'Max Level',nextMin:next?.min||1000}
}

export default function DashboardPage(){
  const[user,setUser]=useState<{name:string}|null>(null)
  const[showOnboarding,setShowOnboarding]=useState(false)
  const[xp,setXp]=useState(0)
  const[streak,setStreak]=useState(0)
  const[badges,setBadges]=useState<string[]>([])
  const[stats,setStats]=useState({applied:0,interview:0,offer:0,saved:0})
  const[aiCount,setAiCount]=useState(0)
  const[loading,setLoading]=useState(true)
  const[goalTarget,setGoalTarget]=useState(5)
  const[goalEdit,setGoalEdit]=useState(false)
  const[heatDays,setHeatDays]=useState<{date:string;count:number;label:string}[]>([])
  const[aiProviders,setAiProviders]=useState<string[]>([])
  const tip=DAILY_TIPS[new Date().getDate()%DAILY_TIPS.length]
  const notifRef=useRef(false)

  useEffect(()=>{
    setShowOnboarding(localStorage.getItem('tl_onboarding')==='1')
    const u=localStorage.getItem('tl_user')
    if(u)setUser(JSON.parse(u))
    const storedXp=parseInt(localStorage.getItem('tl_xp')||'0')
    setXp(storedXp)
    const goal=parseInt(localStorage.getItem('tl_goal_target')||'5')
    setGoalTarget(goal)

    // Streak
    const today=new Date().toDateString()
    const yesterday=new Date(Date.now()-864e5).toDateString()
    const lastLogin=localStorage.getItem('tl_last_login')
    let s=parseInt(localStorage.getItem('tl_streak')||'0')
    if(lastLogin!==today){
      s=lastLogin===yesterday?s+1:1
      localStorage.setItem('tl_last_login',today)
      localStorage.setItem('tl_streak',String(s))
      localStorage.setItem('tl_xp',String(storedXp+5))
      setXp(storedXp+5)
    }
    setStreak(s)

    // Stats
    const apps=JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const saved=JSON.parse(localStorage.getItem('tl_saved')||'[]')
    setStats({
      applied:apps.filter((a:any)=>a.status==='applied').length,
      interview:apps.filter((a:any)=>a.status==='interview').length,
      offer:apps.filter((a:any)=>a.status==='offer').length,
      saved:saved.length,
    })

    // Badges
    const ac=parseInt(localStorage.getItem('tl_ai_count')||'0')
    setAiCount(ac)
    const earned=JSON.parse(localStorage.getItem('tl_badges')||'[]')
    const auto=[...earned]
    const add=(id:string)=>{if(!auto.includes(id))auto.push(id)}
    if(apps.some((a:any)=>a.status!=='saved'))add('first_apply')
    if(saved.length>=1)add('first_save')
    if(apps.some((a:any)=>a.status==='offer'))add('offer')
    if(s>=3)add('streak_3');if(s>=7)add('streak_7');if(ac>=5)add('ai_master')
    setBadges([...new Set(auto)])
    localStorage.setItem('tl_badges',JSON.stringify([...new Set(auto)]))

    // Heatmap (last 15 weeks)
    const counts:Record<string,number>={}
    apps.forEach((a:any)=>{if(a.date)counts[a.date]=(counts[a.date]||0)+1})
    const days=[]
    for(let i=104;i>=0;i--){
      const d=new Date(Date.now()-i*86400000)
      const key=d.toISOString().slice(0,10)
      days.push({date:key,count:counts[key]||0,label:d.toLocaleDateString('en-IN',{month:'short',day:'numeric'})})
    }
    setHeatDays(days)

    // Check AI providers
    fetch('/api/ai').then(r=>r.json()).then(d=>setAiProviders(d.providers||[])).catch(()=>{})

    // Push notification setup
    if(!notifRef.current&&'Notification' in window&&Notification.permission==='default'){
      notifRef.current=true
    }

    setLoading(false)
  },[])

  async function enableNotifications(){
    if(!('Notification' in window)){alert('Browser notifications not supported');return}
    const perm=await Notification.requestPermission()
    if(perm==='granted'){
      new Notification('TalentLaunch 🚀',{body:'Daily career tips & job alerts enabled!',icon:'/favicon.ico'})
    }
  }

  function saveGoal(n:number){
    setGoalTarget(n)
    localStorage.setItem('tl_goal_target',String(n))
    setGoalEdit(false)
  }

  function heatColor(c:number){
    if(c===0)return'bg-[var(--el)]'
    if(c===1)return'bg-cyan-900/60'
    if(c===2)return'bg-cyan-700/70'
    if(c<=4)return'bg-cyan-500/80'
    return'bg-cyan-400'
  }

  const level=getLevel(xp)
  const hour=new Date().getHours()
  const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'
  const thisWeekApps=()=>{
    const apps=JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const weekAgo=Date.now()-7*864e5
    return apps.filter((a:any)=>new Date(a.date).getTime()>weekAgo&&a.status!=='saved').length
  }
  const weeklyApplied=typeof window!=='undefined'?thisWeekApps():0
  const goalPct=Math.min(100,Math.round((weeklyApplied/goalTarget)*100))

  if(loading)return(
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-[var(--el)] rounded-xl"/>
      <div className="h-24 bg-[var(--el)] rounded-2xl"/>
      <div className="h-32 bg-[var(--el)] rounded-2xl"/>
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-[var(--el)] rounded-2xl"/>)}</div>
    </div>
  )

  return(
    <div className="max-w-5xl mx-auto space-y-6">
      {showOnboarding&&<Onboarding onComplete={()=>setShowOnboarding(false)}/>}

      {/* Greeting */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl">
            {greeting}, <span className="glow-text">{user?.name?.split(' ')[0]||'there'}</span> 👋
          </h1>
          <p className="text-[var(--t2)] text-sm mt-1">
            {streak>0?`🔥 Day ${streak} streak · `:''}Ready to land that dream role?
          </p>
        </div>
        <div className="flex items-center gap-2">
          {aiProviders.length>0
            ?<div className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-xl font-semibold">🤖 AI Ready · {aiProviders[0]}</div>
            :<div className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl">⚠️ No AI key</div>
          }
          <button onClick={enableNotifications} className="text-xs border border-[var(--bdr)] text-[var(--t2)] px-3 py-1.5 rounded-xl hover:border-[var(--bds)] transition-all">🔔 Alerts</button>
        </div>
      </div>

      {/* Daily tip */}
      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-2xl px-5 py-4 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-0.5">Daily Tip</div>
          <div className="text-sm text-yellow-100/80">{tip}</div>
        </div>
      </div>

      {/* XP + Goal row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* XP Bar */}
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div><div className="font-display font-bold text-base">{level.name}</div><div className="text-xs text-[var(--t2)]">Current Level</div></div>
            <div className="text-right"><div className="font-mono font-extrabold text-2xl text-cyan-400">{xp} XP</div><div className="text-xs text-[var(--t2)]">earned</div></div>
          </div>
          <div className="h-2.5 bg-[var(--el)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-1000" style={{width:`${level.pct}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-[var(--t3)] mt-1">
            <span>{level.name}</span><span>→ {level.nextName} at {level.nextMin} XP</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--t2)]">
            <span>🔥 {streak}d streak</span><span>🤖 {aiCount} AI uses</span><span>🏅 {badges.length} badges</span>
          </div>
        </div>

        {/* Weekly Goal Tracker */}
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display font-bold text-base">🎯 Weekly Goal</div>
              <div className="text-xs text-[var(--t2)]">Applications this week</div>
            </div>
            {goalEdit
              ?<div className="flex items-center gap-1">
                {[3,5,7,10].map(n=><button key={n} onClick={()=>saveGoal(n)} className="text-xs px-2 py-1 rounded-lg bg-[var(--el)] hover:bg-cyan-500/10 hover:text-cyan-400">{n}</button>)}
              </div>
              :<button onClick={()=>setGoalEdit(true)} className="text-xs text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-lg hover:bg-cyan-500/10">Edit goal</button>
            }
          </div>
          <div className="flex items-end gap-3 mb-3">
            <div className={`font-display font-extrabold text-4xl ${goalPct>=100?'text-green-400':'text-cyan-400'}`}>{weeklyApplied}</div>
            <div className="text-[var(--t3)] text-sm mb-1">/ {goalTarget} this week</div>
            {goalPct>=100&&<div className="text-green-400 text-lg mb-1">🎉</div>}
          </div>
          <div className="h-3 bg-[var(--el)] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${goalPct>=100?'bg-gradient-to-r from-green-400 to-cyan-400':'bg-gradient-to-r from-cyan-500 to-purple-500'}`} style={{width:`${Math.min(goalPct,100)}%`}}/>
          </div>
          <div className="text-xs text-[var(--t3)] mt-1">{goalPct>=100?'Goal smashed! 🔥 Raise the bar?':`${goalTarget-weeklyApplied} more to hit your goal`}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {label:'Applied',val:stats.applied,color:'text-cyan-400',bg:'bg-cyan-500/8 border-cyan-500/20'},
          {label:'Interviews',val:stats.interview,color:'text-purple-400',bg:'bg-purple-500/8 border-purple-500/20'},
          {label:'Offers 🎉',val:stats.offer,color:'text-green-400',bg:'bg-green-500/8 border-green-500/20'},
          {label:'Saved',val:stats.saved,color:'text-yellow-400',bg:'bg-yellow-500/8 border-yellow-500/20'},
        ].map(s=>(
          <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.bg}`}>
            <div className={`font-display font-extrabold text-3xl ${s.color}`}>{s.val}</div>
            <div className="text-xs text-[var(--t2)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak heatmap calendar */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
        <div className="font-display font-bold text-base mb-4">📊 Application Activity (15 weeks)</div>
        <div className="overflow-x-auto">
          <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.ceil(heatDays.length/7)},1fr)`,gap:'3px',width:'fit-content'}}>
            {Array.from({length:Math.ceil(heatDays.length/7)}).map((_,week)=>(
              <div key={week} style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                {heatDays.slice(week*7,(week+1)*7).map(day=>(
                  <div key={day.date} title={`${day.label}: ${day.count} app${day.count!==1?'s':''}`}
                    className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-cyan-400 ${heatColor(day.count)}`}/>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-[var(--t3)]">Less</span>
          {['bg-[var(--el)]','bg-cyan-900/60','bg-cyan-700/70','bg-cyan-500/80','bg-cyan-400'].map((c,i)=>(
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`}/>
          ))}
          <span className="text-[10px] text-[var(--t3)]">More</span>
          <span className="ml-auto text-xs text-[var(--t2)]">Total: {heatDays.reduce((s,d)=>s+d.count,0)} applications</span>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
        <div className="font-display font-bold text-base mb-3">🏅 Badges ({badges.length}/{ALL_BADGES.length})</div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {ALL_BADGES.map(b=>{
            const earned=badges.includes(b.id)
            return(
              <div key={b.id} title={`${b.name}: ${b.desc}`}
                className={`text-center p-2 rounded-xl border transition-all ${earned?'bg-cyan-500/8 border-cyan-500/20':'bg-[var(--el)] border-[var(--bdr)] opacity-30'}`}>
                <div className={`text-2xl ${!earned?'grayscale':''}`}>{b.emoji}</div>
                <div className="text-[9px] text-[var(--t3)] mt-0.5 truncate">{b.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-lg mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(a=>(
            <Link key={a.label} href={a.href}
              className="group bg-[var(--card)] border border-[var(--bdr)] rounded-xl p-4 hover:border-cyan-500/25 hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">{a.emoji}</div>
              <div className="font-semibold text-sm">{a.label}</div>
              <div className="text-xs text-[var(--t2)] mt-0.5">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Provider status */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
        <div className="font-display font-bold text-base mb-3">🤖 AI Providers</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[['Groq','GROQ_API_KEY','console.groq.com'],['Gemini','GEMINI_API_KEY','aistudio.google.com'],['Cohere','COHERE_API_KEY','cohere.com'],['Mistral','MISTRAL_API_KEY','console.mistral.ai'],['OpenAI','OPENAI_API_KEY','platform.openai.com']].map(([name,key,site])=>{
            const active=aiProviders.includes(name)
            return(
              <div key={name} className={`rounded-xl p-3 border text-center ${active?'bg-green-500/8 border-green-500/20':'bg-[var(--el)] border-[var(--bdr)] opacity-60'}`}>
                <div className={`text-lg ${active?'':'grayscale'}`}>{active?'✅':'🔑'}</div>
                <div className={`text-xs font-semibold mt-1 ${active?'text-green-400':'text-[var(--t3)]'}`}>{name}</div>
                {!active&&<a href={`https://${site}`} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 hover:underline">Get free key</a>}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-[var(--t3)] mt-3">Add any key to <code className="bg-[var(--el)] px-1.5 py-0.5 rounded font-mono">.env.local</code> — TalentLaunch auto-picks the best available provider.</p>
      </div>
    </div>
  )
}
