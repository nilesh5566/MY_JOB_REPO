'use client'
import { useState } from 'react'

const SKILLS = ['React','Node.js','Python','Java','TypeScript','Go','Flutter','AWS','Docker','ML','SQL','DevOps','Android','iOS','C++','Data Science']
const ROLES  = ['Full Stack Developer','Backend Engineer','Frontend Engineer','ML Engineer','Data Scientist','DevOps Engineer','Android Developer','iOS Developer','Product Manager']

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep]       = useState(1)
  const [skills, setSkills]   = useState<string[]>([])
  const [role, setRole]       = useState('')
  const [college, setCollege] = useState('')
  const [exp, setExp]         = useState('0')

  function finish() {
    localStorage.setItem('tl_skills', skills.join(','))
    localStorage.setItem('tl_target_role', role)
    localStorage.setItem('tl_college', college)
    localStorage.setItem('tl_exp', exp)
    localStorage.setItem('tl_onboarding', '0')
    // Award XP for completing onboarding
    localStorage.setItem('tl_xp', '50')
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--card)] border border-[var(--bds)] rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-xl font-bold text-black mx-auto mb-4">TL</div>
          <h2 className="font-display font-extrabold text-2xl glow-text">Welcome to TalentLaunch!</h2>
          <p className="text-sm text-[var(--t2)] mt-1">Quick setup (30 seconds) · Personalises your whole experience</p>
          {/* Steps */}
          <div className="flex gap-2 justify-center mt-4">
            {[1,2,3].map(s=><div key={s} className={`h-1.5 w-14 rounded-full transition-all ${s<=step?'bg-cyan-500':'bg-[var(--el)]'}`}/>)}
          </div>
        </div>

        {step===1&&(
          <div className="space-y-4">
            <div className="text-sm font-semibold text-center">What are your technical skills?</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SKILLS.map(s=>(
                <button key={s} onClick={()=>setSkills(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}
                  className={`text-sm px-3 py-2 rounded-xl border font-semibold transition-all ${skills.includes(s)?'bg-cyan-500/15 border-cyan-500/40 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-white'}`}>{s}</button>
              ))}
            </div>
            {skills.length>0&&<div className="text-center text-xs text-green-400">{skills.length} skill{skills.length>1?'s':''} selected ✓</div>}
            <button onClick={()=>setStep(2)} disabled={skills.length===0}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl disabled:opacity-40 transition-all hover:shadow-[0_0_20px_rgba(0,220,255,0.3)]">
              Next →
            </button>
          </div>
        )}

        {step===2&&(
          <div className="space-y-4">
            <div className="text-sm font-semibold text-center">What role are you targeting?</div>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r=>(
                <button key={r} onClick={()=>setRole(r)}
                  className={`text-xs p-3 rounded-xl border text-left font-semibold transition-all ${role===r?'bg-cyan-500/15 border-cyan-500/40 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>{r}</button>
              ))}
            </div>
            <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Or type a custom role..."
              className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)] py-3">← Back</button>
              <button onClick={()=>setStep(3)} disabled={!role}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold py-3 rounded-xl disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div className="space-y-4">
            <div className="text-sm font-semibold text-center">A bit more about you</div>
            <div>
              <label className="text-xs text-[var(--t2)] block mb-1">College / University</label>
              <input value={college} onChange={e=>setCollege(e.target.value)} placeholder="IIT Bombay, VIT, BITS Pilani..."
                className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
            </div>
            <div>
              <label className="text-xs text-[var(--t2)] block mb-2">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[['0','🌱 Fresher','0 years'],['1','💻 1 year','1 year exp'],['2','⚡ 2+ years','2+ years']].map(([v,e,d])=>(
                  <button key={v} onClick={()=>setExp(v)}
                    className={`p-3 rounded-xl border text-center transition-all ${exp===v?'bg-cyan-500/15 border-cyan-500/40 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>
                    <div className="text-lg">{e.split(' ')[0]}</div>
                    <div className="text-[10px] mt-0.5">{d}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-3 text-xs text-cyan-200/70">
              🎁 Completing setup gives you <strong className="text-cyan-400">50 XP</strong> to start your journey!
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(2)} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm py-3 hover:border-[var(--bds)]">← Back</button>
              <button onClick={finish}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.3)]">
                🚀 Launch My Career!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
