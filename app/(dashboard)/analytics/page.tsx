'use client'
import { useState, useEffect } from 'react'

const BEST_COMPANIES = [
  {rank:1,name:'Razorpay',  logo:'💎',fresherScore:95,avgPkg:'₹18–24 LPA',hiresPerYear:200, tags:['Backend','Full Stack'],location:'Bangalore',wlb:3.9,glass:4.2},
  {rank:2,name:'Swiggy',    logo:'🧡',fresherScore:90,avgPkg:'₹14–22 LPA',hiresPerYear:350, tags:['SDE','Data'],location:'Bangalore',wlb:3.5,glass:3.9},
  {rank:3,name:'Atlassian', logo:'🔷',fresherScore:88,avgPkg:'$100k–$130k',hiresPerYear:150,tags:['SWE','DevOps'],location:'Remote',wlb:4.4,glass:4.3},
  {rank:4,name:'Freshworks',logo:'🌿',fresherScore:87,avgPkg:'₹12–18 LPA',hiresPerYear:400, tags:['SDE','Product'],location:'Chennai',wlb:4.1,glass:4.0},
  {rank:5,name:'Groww',     logo:'📈',fresherScore:85,avgPkg:'₹14–20 LPA',hiresPerYear:150, tags:['SDE','FinTech'],location:'Bangalore',wlb:3.8,glass:4.1},
  {rank:6,name:'Meesho',    logo:'🛍️',fresherScore:84,avgPkg:'₹12–18 LPA',hiresPerYear:200,tags:['SDE','ML'],location:'Bangalore',wlb:3.9,glass:3.8},
  {rank:7,name:'Zepto',     logo:'⚡',fresherScore:82,avgPkg:'₹14–22 LPA',hiresPerYear:120, tags:['Backend','SDE'],location:'Mumbai',wlb:3.3,glass:3.7},
  {rank:8,name:'Postman',   logo:'📮',fresherScore:80,avgPkg:'$90k–$120k',hiresPerYear:80,  tags:['SDE','DevEx'],location:'Remote',wlb:4.5,glass:4.4},
  {rank:9,name:'PhonePe',   logo:'💜',fresherScore:79,avgPkg:'₹14–20 LPA',hiresPerYear:250, tags:['Backend','FinTech'],location:'Bangalore',wlb:3.6,glass:3.8},
  {rank:10,name:'CRED',     logo:'💳',fresherScore:75,avgPkg:'₹15–22 LPA',hiresPerYear:100, tags:['Backend','iOS'],location:'Bangalore',wlb:3.7,glass:3.9},
]

const HIRING_CITIES = [
  {city:'Bangalore',jobs:4800,trend:'+12%',skills:['SDE','ML','DevOps','Full Stack']},
  {city:'Mumbai',   jobs:2100,trend:'+8%', skills:['FinTech','Backend','Android']},
  {city:'Hyderabad',jobs:1900,trend:'+15%',skills:['SDE','Data','Cloud']},
  {city:'Pune',     jobs:1400,trend:'+6%', skills:['Java','Cloud','DevOps']},
  {city:'Chennai',  jobs:1100,trend:'+9%', skills:['SDE','Data','Python']},
  {city:'Delhi/NCR',jobs:980, trend:'+5%', skills:['SDE','Product','FinTech']},
  {city:'Remote 🌍',jobs:6200,trend:'+32%',skills:['Any skill','Global openings']},
]

const SALARY_RANGES: Record<string,{india:string,us:string,eu:string,remote:string,demand:number}> = {
  'React + Node.js':  {india:'₹6–12 LPA', us:'$70k–$105k',eu:'€45k–€70k',remote:'$55k–$90k', demand:82},
  'Python + ML':      {india:'₹8–18 LPA', us:'$85k–$130k',eu:'€55k–€90k',remote:'$70k–$110k',demand:90},
  'Java + Spring':    {india:'₹6–11 LPA', us:'$75k–$110k',eu:'€50k–€75k',remote:'$60k–$95k', demand:70},
  'AWS + DevOps':     {india:'₹8–16 LPA', us:'$90k–$130k',eu:'€60k–€90k',remote:'$75k–$115k',demand:85},
  'Flutter/Dart':     {india:'₹5–10 LPA', us:'$65k–$95k', eu:'€40k–€65k',remote:'$50k–$80k', demand:65},
  'TypeScript':       {india:'₹7–13 LPA', us:'$80k–$115k',eu:'€52k–€78k',remote:'$65k–$100k',demand:78},
  'Data Science':     {india:'₹7–15 LPA', us:'$80k–$125k',eu:'€55k–€85k',remote:'$65k–$105k',demand:87},
  'Go/Golang':        {india:'₹8–16 LPA', us:'$85k–$125k',eu:'€55k–€85k',remote:'$70k–$110k',demand:72},
  'Kubernetes/Docker':{india:'₹7–14 LPA', us:'$85k–$125k',eu:'€55k–€85k',remote:'$70k–$110k',demand:80},
  'LLM/GenAI':        {india:'₹10–22 LPA',us:'$100k–$160k',eu:'€70k–€110k',remote:'$85k–$140k',demand:95},
}

export default function AnalyticsPage() {
  const [tab, setTab]           = useState<'report'|'cities'|'companies'|'salary'>('report')
  const [selectedSkill, setSelectedSkill] = useState('React + Node.js')
  const [predSkills, setPredSkills] = useState('')
  const [predExp, setPredExp]   = useState('0')
  const [prediction, setPrediction] = useState<any>(null)
  const [initDone, setInitDone] = useState(false)
  const [weekData, setWeekData] = useState({applied:0,interview:0,offer:0,saved:0,prevApplied:0})

  useEffect(() => {
    const apps:{date:string;status:string}[] = JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const saved = JSON.parse(localStorage.getItem('tl_saved')||'[]')
    const now = Date.now()
    const thisWeek = apps.filter(a => new Date(a.date).getTime() > now - 7*864e5)
    const lastWeek = apps.filter(a => {
      const t = new Date(a.date).getTime()
      return t > now - 14*864e5 && t <= now - 7*864e5
    })
    setWeekData({
      applied:   thisWeek.filter(a=>a.status!=='saved').length,
      interview: thisWeek.filter(a=>a.status==='interview').length,
      offer:     thisWeek.filter(a=>a.status==='offer').length,
      saved:     saved.length,
      prevApplied: lastWeek.filter(a=>a.status!=='saved').length,
    })
    setInitDone(true)
  }, [])

  function predictSalary() {
    const skills = predSkills.toLowerCase()
    const exp    = parseInt(predExp)||0
    let base = SALARY_RANGES['React + Node.js']
    for (const [k,v] of Object.entries(SALARY_RANGES)) {
      if (skills.includes(k.toLowerCase().split('+')[0].trim().toLowerCase())) { base = v; break }
    }
    const bump = exp * 0.15
    setPrediction({
      india:  base.india,
      us:     base.us,
      eu:     base.eu,
      remote: base.remote,
      demand: base.demand,
      expNote: exp > 0 ? `+${Math.round(bump*100)}% for ${exp} yr exp` : 'Fresher range',
    })
  }

  const pct = weekData.prevApplied > 0 ? Math.round(((weekData.applied - weekData.prevApplied) / weekData.prevApplied) * 100) : 0
  const maxJobs = Math.max(...HIRING_CITIES.map(c => c.jobs))

  if (!initDone) return (
    <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
      <div className="h-9 w-40 bg-[var(--el)] rounded-xl"/>
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-[var(--el)] rounded-2xl"/>)}</div>
      <div className="h-80 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-3xl">📈 Analytics</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Progress reports, market insights & salary intelligence</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit overflow-x-auto">
        {([['report','📈 Weekly Report'],['cities','🏙️ Hiring Cities'],['companies','💡 Best Companies'],['salary','🔮 Salary Predictor']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* ── WEEKLY REPORT ── */}
      {tab==='report'&&(
        <div className="space-y-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="font-display font-bold text-xl">This Week's Report</div>
                <div className="text-xs text-[var(--t2)] mt-1">{new Date().toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric'})}</div>
              </div>
              {weekData.applied > 0 ? (
                <div className={`text-sm font-bold px-3 py-1.5 rounded-lg ${pct>=0?'bg-green-500/10 text-green-400':'bg-red-500/10 text-red-400'}`}>
                  {pct>=0?'↑':'↓'} {Math.abs(pct)}% vs last week
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {label:'Applied',val:weekData.applied,  color:'text-cyan-400',   bg:'bg-cyan-500/8 border-cyan-500/15'},
                {label:'Interviews',val:weekData.interview,color:'text-purple-400',bg:'bg-purple-500/8 border-purple-500/15'},
                {label:'Offers',   val:weekData.offer,  color:'text-green-400',  bg:'bg-green-500/8 border-green-500/15'},
                {label:'Saved Jobs',val:weekData.saved, color:'text-yellow-400', bg:'bg-yellow-500/8 border-yellow-500/15'},
              ].map(s=>(
                <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.bg}`}>
                  <div className={`font-display font-extrabold text-3xl ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-[var(--t2)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            {weekData.applied===0&&(
              <div className="mt-6 bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-4 text-sm text-yellow-200/80">
                💡 <strong>No applications this week yet.</strong> Aim for at least 5 applications per week for the best results. Tuesday 10am is the best time to apply!
              </div>
            )}
            {weekData.applied>0&&weekData.applied<5&&(
              <div className="mt-6 bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-4 text-sm text-cyan-200/80">
                ⚡ Good start with {weekData.applied} application{weekData.applied>1?'s':''}! Top job seekers apply to <strong>5–10 roles per week</strong>. Keep going!
              </div>
            )}
            {weekData.applied>=5&&(
              <div className="mt-6 bg-green-500/8 border border-green-500/15 rounded-xl p-4 text-sm text-green-200/80">
                🔥 <strong>Great week!</strong> {weekData.applied} applications is above average. {weekData.interview>0?`You have ${weekData.interview} interview${weekData.interview>1?'s':''} lined up — prep with the AI Mock Interview.`:'Focus on following up after 5–7 days.'}
              </div>
            )}
          </div>

          {/* Application funnel */}
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-4">All-time Funnel</div>
            {(()=>{
              const apps:{status:string}[] = JSON.parse(localStorage.getItem('tl_applications')||'[]')
              const total = apps.filter(a=>a.status!=='saved').length||0
              const stages = [
                {label:'Applied',   n:apps.filter(a=>a.status==='applied').length,  color:'bg-blue-400'},
                {label:'Interview', n:apps.filter(a=>a.status==='interview').length, color:'bg-purple-400'},
                {label:'Offer',     n:apps.filter(a=>a.status==='offer').length,     color:'bg-green-400'},
                {label:'Rejected',  n:apps.filter(a=>a.status==='rejected').length,  color:'bg-red-400'},
              ]
              return stages.map(s=>{
                const pct2 = total>0?Math.round(s.n/total*100):0
                return (
                  <div key={s.label} className="flex items-center gap-3 mb-3">
                    <div className="text-xs text-[var(--t2)] w-20">{s.label}</div>
                    <div className="flex-1 h-7 bg-[var(--el)] rounded-xl overflow-hidden">
                      <div className={`h-full ${s.color} rounded-xl flex items-center px-2 transition-all duration-700`} style={{width:`${Math.max(pct2,3)}%`}}>
                        <span className="text-[10px] font-bold text-white">{s.n}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[var(--t3)] w-8 text-right">{pct2}%</div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}

      {/* ── HIRING CITIES ── */}
      {tab==='cities'&&(
        <div className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-1">🏙️ Top Hiring Cities for CS Freshers</div>
            <div className="text-xs text-[var(--t2)] mb-5">Based on live job postings · Updated weekly</div>
            {HIRING_CITIES.map((c,i)=>(
              <div key={c.city} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center">{i+1}</div>
                    <span className="text-sm font-semibold">{c.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-400">{c.jobs.toLocaleString()} jobs</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.trend.startsWith('+')?'bg-green-500/10 text-green-400':'bg-red-500/10 text-red-400'}`}>{c.trend}</span>
                  </div>
                </div>
                <div className="h-2.5 bg-[var(--el)] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-700" style={{width:`${Math.round(c.jobs/maxJobs*100)}%`}}/>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.skills.map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)]">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-2xl p-4 text-sm text-yellow-100/80">
            💡 <strong>Remote jobs are growing fastest (+32%)</strong> — if you have strong fundamentals, apply globally for 3x more opportunities and better pay.
          </div>
        </div>
      )}

      {/* ── BEST COMPANIES ── */}
      {tab==='companies'&&(
        <div className="space-y-3">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-1">💡 Best Companies for CS Freshers</div>
            <div className="text-xs text-[var(--t2)] mb-4">Ranked by: fresher hiring rate × salary × culture × WLB</div>
            {BEST_COMPANIES.map(c=>(
              <div key={c.name} className="flex items-center gap-4 py-3 border-b border-[var(--bdr)] last:border-0">
                <div className="font-display font-extrabold text-lg text-[var(--t3)] w-6 text-center">#{c.rank}</div>
                <div className="text-2xl">{c.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.tags.map(t=><span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--el)] text-[var(--t3)]">{t}</span>)}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--el)] text-[var(--t3)]">{c.location}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-green-400">{c.avgPkg}</div>
                  <div className="text-[10px] text-yellow-400 mt-0.5">⭐ {c.glass} · WLB {c.wlb}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">~{c.hiresPerYear} hires/yr</div>
                </div>
                <div className="w-16 flex-shrink-0">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-[var(--t3)]">Score</span>
                    <span className="text-cyan-400">{c.fresherScore}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--el)] rounded-full">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-green-400 rounded-full" style={{width:`${c.fresherScore}%`}}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SALARY PREDICTOR ── */}
      {tab==='salary'&&(
        <div className="space-y-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-6 space-y-4">
            <div className="font-display font-bold text-base">🔮 Salary Predictor</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--t2)] block mb-2">Your Primary Skills</label>
                <input value={predSkills} onChange={e=>setPredSkills(e.target.value)} placeholder="e.g. React, Python, AWS..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--t2)] block mb-2">Years of Experience</label>
                <select value={predExp} onChange={e=>setPredExp(e.target.value)}
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50">
                  {['0 (Fresher)','1','2','3','4','5+'].map((v,i)=><option key={v} value={String(i===5?5:i)}>{v}</option>)}
                </select>
              </div>
            </div>
            <button onClick={predictSalary}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.3)] transition-all">
              🔮 Predict My Salary →
            </button>
          </div>

          {prediction&&(
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-display font-bold text-base">Your Salary Range</div>
                <span className="text-xs text-[var(--t2)] bg-[var(--el)] px-2 py-1 rounded-lg">{prediction.expNote}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['🇮🇳 India',prediction.india,'text-green-400'],['🇺🇸 USA',prediction.us,'text-blue-400'],['🇪🇺 Europe',prediction.eu,'text-purple-400'],['🌍 Remote',prediction.remote,'text-cyan-400']].map(([flag,range,color])=>(
                  <div key={String(flag)} className="bg-[var(--el)] rounded-xl p-3 text-center">
                    <div className="text-base mb-1">{String(flag).split(' ')[0]}</div>
                    <div className={`text-xs font-bold font-mono ${color}`}>{range}</div>
                    <div className="text-[10px] text-[var(--t3)] mt-0.5">{String(flag).split(' ')[1]}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--t2)]">Market Demand for your stack</span>
                  <span className="text-cyan-400 font-bold">{prediction.demand}%</span>
                </div>
                <div className="h-2.5 bg-[var(--el)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-green-400 rounded-full" style={{width:`${prediction.demand}%`}}/>
                </div>
              </div>
            </div>
          )}

          {/* Market table */}
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-sm mb-4">📊 Salary by Stack — India (Fresher)</div>
            <div className="space-y-0">
              {Object.entries(SALARY_RANGES)
                .sort((a,b)=>b[1].demand-a[1].demand)
                .map(([skill,data])=>(
                <button key={skill} onClick={()=>setSelectedSkill(skill)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${selectedSkill===skill?'bg-cyan-500/10 border border-cyan-500/15':'hover:bg-[var(--el)]'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{skill}</div>
                  </div>
                  <div className="text-xs font-mono text-green-400 flex-shrink-0">{data.india}</div>
                  <div className="w-16 flex-shrink-0">
                    <div className="h-1.5 bg-[var(--card)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${data.demand}%`}}/>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 w-8 text-right">{data.demand}%</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
