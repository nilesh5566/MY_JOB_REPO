'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ROLES = [
  { id:'student',   emoji:'🎓', label:'Student / Fresher',   desc:'Looking for jobs, internships, placements' },
  { id:'recruiter', emoji:'💼', label:'Recruiter / HR',       desc:'Hiring talent, posting job openings' },
]
const SKILLS_LIST = ['React','Node.js','Python','Java','TypeScript','Go','Flutter','AWS','Docker','ML','SQL','DevOps','Android','iOS','C++','Rust']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep]         = useState(1)
  const [role, setRole]         = useState('student')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [college, setCollege]   = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [skills, setSkills]     = useState<string[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  function toggleSkill(s: string) {
    setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  async function handleSubmit() {
    if (!name || !email || !password) { setError('Fill all required fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, college, skills, targetRole }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('tl_token', data.token)
        localStorage.setItem('tl_user', JSON.stringify(data.user))
        localStorage.setItem('tl_role', data.user.role)
        localStorage.setItem('tl_skills', skills.join(','))
        // Show onboarding for new students
        if (data.user.role === 'student') localStorage.setItem('tl_onboarding', '1')
        router.push(data.user.role === 'admin' ? '/admin' : data.user.role === 'recruiter' ? '/admin' : '/dashboard')
      } else setError(data.error || 'Registration failed')
    } catch { setError('Cannot connect to server') }
    setLoading(false)
  }

  const inp = 'mt-1.5 w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-colors placeholder:text-[var(--t3)]'

  return (
    <div className="relative w-full max-w-lg animate-fade-up">
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">TL</div>
            <span className="font-display font-bold text-xl glow-text">TalentLaunch</span>
          </Link>
          <h1 className="font-display font-bold text-2xl">Create your account</h1>
          <p className="text-sm text-[var(--t2)] mt-1">Step {step} of 2 · Free forever</p>
          {/* Progress */}
          <div className="flex gap-1 mt-3 justify-center">
            {[1,2].map(s => <div key={s} className={`h-1 w-16 rounded-full transition-all ${s<=step?'bg-cyan-500':'bg-[var(--el)]'}`}/>)}
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

        {/* Step 1 — Role + Credentials */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">I am a...</div>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${role===r.id?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)] hover:text-white'}`}>
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-[10px] font-bold leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[var(--t3)] mt-2 text-center">{ROLES.find(r=>r.id===role)?.desc}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Full Name *</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Aman Nayak" className={inp}/>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Email *</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className={inp}/>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Password *</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" className={inp}/>
            </div>
            <button onClick={()=>{ if(!name||!email||!password){setError('Fill all required fields');return}; setError(''); setStep(2) }}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all">
              Next →
            </button>
          </div>
        )}

        {/* Step 2 — Profile details */}
        {step === 2 && (
          <div className="space-y-4">
            {role === 'student' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">College / University</label>
                  <input value={college} onChange={e=>setCollege(e.target.value)} placeholder="IIT Bombay, VIT, BITS..." className={inp}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Target Role</label>
                  <input value={targetRole} onChange={e=>setTargetRole(e.target.value)} placeholder="e.g. Full Stack Developer, ML Engineer..." className={inp}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2 block">Your Skills (select all)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS_LIST.map(s=>(
                      <button key={s} onClick={()=>toggleSkill(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${skills.includes(s)?'bg-cyan-500/15 border-cyan-500/40 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-white'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {role === 'recruiter' && (
              <div>
                <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Company Name</label>
                <input value={college} onChange={e=>setCollege(e.target.value)} placeholder="e.g. Google, Razorpay..." className={inp}/>
              </div>
            )}
            {role === 'admin' && (
              <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-200/80">
                ⚡ Admin accounts have full platform access. Please use a secure password and keep credentials private.
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="px-5 py-3 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)]">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all disabled:opacity-50">
                {loading ? 'Creating...' : role==='student' ? 'Start My Career Journey 🚀' : role==='recruiter' ? 'Start Hiring →' : 'Create Admin Account →'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-[var(--t2)]">
          Already have an account? <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
