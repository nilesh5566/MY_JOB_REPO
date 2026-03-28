'use client'
import { useState, useEffect } from 'react'

export default function TPOPage(){
  const [role,setRole] = useState('')
  const [stats,setStats] = useState({students:0,applied:0,interviews:0,offers:0})
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    setRole(u.role||localStorage.getItem('tl_role')||'student')
    const apps=JSON.parse(localStorage.getItem('tl_applications')||'[]')
    setStats({students:1,applied:apps.filter((a:any)=>a.status!=='saved').length,interviews:apps.filter((a:any)=>a.status==='interview').length,offers:apps.filter((a:any)=>a.status==='offer').length})
    setLoading(false)
  },[])

  const DRIVES=[
    {company:'TCS',date:'15 Mar 2025',roles:'Systems Engineer, Digital',pkg:'₹3.36–7 LPA',cgpa:'6+',link:'https://nextstep.tcs.com',status:'Open'},
    {company:'Infosys',date:'20 Mar 2025',roles:'Systems Eng, Power Prog',pkg:'₹3.6–8 LPA',cgpa:'6+',link:'https://www.infosys.com/careers/',status:'Open'},
    {company:'Wipro',date:'28 Mar 2025',roles:'Project Eng, Turbo Hire',pkg:'₹3.5–6.5 LPA',cgpa:'6+',link:'https://careers.wipro.com/',status:'Open'},
    {company:'Cognizant',date:'5 Apr 2025',roles:'Prog Analyst Trainee',pkg:'₹4–5 LPA',cgpa:'6+',link:'https://www.cognizant.com/in/en/careers',status:'Open'},
    {company:'Accenture',date:'12 Apr 2025',roles:'ASE, Packaged App Dev',pkg:'₹4.5 LPA',cgpa:'6+',link:'https://www.accenture.com/in-en/careers',status:'Opening Soon'},
    {company:'HCLTech',date:'18 Apr 2025',roles:'Graduate Eng Trainee',pkg:'₹3.5–5 LPA',cgpa:'6+',link:'https://www.hcltech.com/careers',status:'Open'},
    {company:'Capgemini',date:'25 Apr 2025',roles:'Analyst',pkg:'₹3.8 LPA',cgpa:'6+',link:'https://www.capgemini.com/careers/',status:'Opening Soon'},
    {company:'Deloitte',date:'2 May 2025',roles:'Tech Analyst, Consulting',pkg:'₹7–12 LPA',cgpa:'7+',link:'https://careers.deloitte.com/',status:'Open'},
  ]

  if(loading) return <div className="animate-pulse h-96 bg-[var(--el)] rounded-2xl max-w-5xl mx-auto"/>

  return(
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">🎓 TPO Portal</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Placement Cell dashboard · Company drives · Student stats</p>
        </div>
        {role==='admin'&&<span className="bg-yellow-500/15 text-yellow-400 font-bold text-xs px-3 py-1.5 rounded-xl">⚡ Admin Access</span>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:'Students',v:stats.students,c:'text-cyan-400',b:'bg-cyan-500/8 border-cyan-500/15'},
          {l:'Applications',v:stats.applied,c:'text-purple-400',b:'bg-purple-500/8 border-purple-500/15'},
          {l:'Interviews',v:stats.interviews,c:'text-yellow-400',b:'bg-yellow-500/8 border-yellow-500/15'},
          {l:'Offers',v:stats.offers,c:'text-green-400',b:'bg-green-500/8 border-green-500/15'}].map(s=>(
          <div key={s.l} className={`border rounded-2xl p-4 text-center ${s.b}`}>
            <div className={`font-display font-extrabold text-3xl ${s.c}`}>{s.v}</div>
            <div className="text-xs text-[var(--t2)] mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Campus Drive Calendar */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center justify-between">
          <div className="font-display font-bold text-base">📅 Campus Drive Calendar 2025</div>
          <div className="text-xs text-[var(--t2)]">Register early — seats fill fast</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--bdr)] bg-[var(--el)]">
              {['Company','Drive Date','Roles','Package','Min CGPA','Status','Apply'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-[var(--t3)] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {DRIVES.map(d=>(
                <tr key={d.company} className="border-b border-[var(--bdr)]/50 hover:bg-[var(--el)] transition-colors">
                  <td className="px-4 py-3 font-semibold">{d.company}</td>
                  <td className="px-4 py-3 text-xs text-cyan-400">{d.date}</td>
                  <td className="px-4 py-3 text-xs text-[var(--t2)] max-w-36 truncate">{d.roles}</td>
                  <td className="px-4 py-3 text-xs font-mono text-green-400">{d.pkg}</td>
                  <td className="px-4 py-3 text-xs font-bold text-yellow-400">{d.cgpa}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status==='Open'?'bg-green-500/10 text-green-400':'bg-yellow-500/10 text-yellow-400'}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={d.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-cyan-400 hover:underline">Register →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resources for TPO */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
          <div className="font-bold text-base mb-3">📊 Embed Job Board</div>
          <p className="text-xs text-[var(--t2)] mb-3">Add TalentLaunch job board to your college placement portal</p>
          <a href="/embed" className="text-xs font-semibold text-cyan-400 border border-cyan-500/20 px-3 py-2 rounded-lg hover:bg-cyan-500/10">Get Embed Code →</a>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
          <div className="font-bold text-base mb-3">📢 Announce a Drive</div>
          <p className="text-xs text-[var(--t2)] mb-3">Post your college's placement drive — students get notified instantly</p>
          <a href="/admin" className="text-xs font-semibold text-yellow-400 border border-yellow-500/20 px-3 py-2 rounded-lg hover:bg-yellow-500/10">Post Drive →</a>
        </div>
      </div>
    </div>
  )
}
