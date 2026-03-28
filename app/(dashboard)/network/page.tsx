'use client'
import { useState, useEffect } from 'react'

type Story = { id: string; name: string; role: string; company: string; story: string; tips: string; date: string }

const ALL_BADGES = [
  { id:'first_search', emoji:'🔍', name:'First Search',     how:'Search for jobs once',           xp:5   },
  { id:'first_save',   emoji:'🔖', name:'Job Saver',        how:'Save your first job',            xp:10  },
  { id:'first_apply',  emoji:'📨', name:'First Apply',      how:'Log first application',          xp:20  },
  { id:'resume_built', emoji:'📄', name:'Resume Pro',       how:'Build & download a resume',      xp:30  },
  { id:'resume_pdf',   emoji:'📎', name:'PDF Master',       how:'Upload your resume as PDF',      xp:10  },
  { id:'ai_master',    emoji:'🤖', name:'AI Master',        how:'Use AI tools 5+ times',          xp:50  },
  { id:'mock_done',    emoji:'🎤', name:'Interview Ready',  how:'Complete a mock interview',      xp:25  },
  { id:'streak_3',     emoji:'🔥', name:'On a Roll',        how:'3-day login streak',             xp:15  },
  { id:'streak_7',     emoji:'⚡', name:'Week Warrior',     how:'7-day login streak',             xp:40  },
  { id:'offer',        emoji:'🏆', name:'Offer Getter',     how:'Log an offer in tracker',        xp:100 },
]

const COMPANIES = ['Google','Microsoft','Amazon','Meta','Apple','Razorpay','Swiggy','Zepto','Paytm','CRED','Groww','Meesho','PhonePe','Atlassian','Freshworks','Postman','Notion','Figma','Stripe','Cloudflare']
const ROLES     = ['Software Engineer','Backend Developer','Frontend Developer','Full Stack Developer','Data Scientist','ML Engineer','DevOps Engineer']

export default function NetworkPage() {
  const [tab, setTab]         = useState<'badges'|'referral'|'stories'>('badges')
  const [badges, setBadges]   = useState<string[]>([])
  const [xp, setXp]           = useState(0)
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState('')
  const [role, setRole]       = useState('')
  const [skills, setSkills]   = useState('')
  const [stories, setStories] = useState<Story[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ name:'', role:'', company:'', story:'', tips:'' })
  const [copied, setCopied]   = useState(false)
  const [toast, setToast]     = useState('')

  useEffect(() => {
    setBadges(JSON.parse(localStorage.getItem('tl_badges') || '[]'))
    setXp(parseInt(localStorage.getItem('tl_xp') || '0'))
    setSkills(localStorage.getItem('tl_skills') || '')
    // Load community stories from localStorage only (no hardcoded samples)
    const saved = localStorage.getItem('tl_stories')
    setStories(saved ? JSON.parse(saved) : [])
    setLoading(false)
  }, [])

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2400) }

  function buildSearchURL() {
    if (!company) return ''
    const q = encodeURIComponent(`site:linkedin.com/in "${company}" "${role || 'software engineer'}"`)
    return `https://www.google.com/search?q=${q}`
  }

  function coldMessage() {
    const co = company || '[Company]'
    const ro = role    || '[Role]'
    const sk = skills  || 'software engineering'
    return `Hi [Name],

I'm a CS student focused on ${sk.split(',')[0]?.trim() || 'software engineering'}. I've been following ${co}'s work on [specific product/project you admire] and would love to learn more.

I'm exploring the ${ro} role and would appreciate a 10-minute chat about your experience on the team. Here's my GitHub for context: [your-github-link].

Happy to work around your schedule — even a brief reply would mean a lot!

Best,
[Your Name]`
  }

  function copyMsg() {
    navigator.clipboard.writeText(coldMessage())
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    showToast('📋 Message copied!')
  }

  function submitStory() {
    if (!form.name || !form.company || !form.story) { showToast('⚠️ Name, company & story required'); return }
    const s: Story = {
      ...form,
      id: `st_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month:'short', year:'numeric' })
    }
    const updated = [s, ...stories]
    setStories(updated)
    localStorage.setItem('tl_stories', JSON.stringify(updated))
    setForm({ name:'', role:'', company:'', story:'', tips:'' })
    setShowForm(false)
    showToast('🎉 Story shared! Thank you.')
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-48 bg-[var(--el)] rounded-xl"/>
      <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_,i)=><div key={i} className="h-20 bg-[var(--el)] rounded-2xl"/>)}</div>
      <div className="h-64 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  const earnedCount = ALL_BADGES.filter(b => badges.includes(b.id)).length

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div>
        <h1 className="font-display font-extrabold text-3xl">🌐 Network & XP</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Badges · Referral finder · Community stories</p>
      </div>

      {/* XP summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-2xl p-4 text-center">
          <div className="font-display font-extrabold text-3xl text-cyan-400">{xp}</div>
          <div className="text-xs text-[var(--t2)] mt-1">Total XP</div>
        </div>
        <div className="bg-purple-500/8 border border-purple-500/20 rounded-2xl p-4 text-center">
          <div className="font-display font-extrabold text-3xl text-purple-400">{earnedCount}</div>
          <div className="text-xs text-[var(--t2)] mt-1">Badges Earned</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 text-center">
          <div className="font-display font-extrabold text-3xl text-[var(--t2)]">{ALL_BADGES.length - earnedCount}</div>
          <div className="text-xs text-[var(--t2)] mt-1">Remaining</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit">
        {([['badges','🏅 Badges'],['referral','🤝 Referral Finder'],['stories','💬 Stories']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === v ? 'bg-[var(--card)] text-white shadow' : 'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* BADGES TAB */}
      {tab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_BADGES.map(b => {
            const earned = badges.includes(b.id)
            return (
              <div key={b.id} className={`flex items-center gap-4 bg-[var(--card)] border rounded-2xl p-4 transition-all ${earned ? 'border-cyan-500/25' : 'border-[var(--bdr)] opacity-50'}`}>
                <div className={`text-4xl ${!earned ? 'grayscale' : ''}`}>{b.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-xs text-[var(--t2)] mt-0.5">{b.how}</div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">+{b.xp} XP</div>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded-lg flex-shrink-0 ${earned ? 'bg-green-500/10 text-green-400' : 'bg-[var(--el)] text-[var(--t3)]'}`}>
                  {earned ? '✓ Earned' : 'Locked'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* REFERRAL FINDER TAB */}
      {tab === 'referral' && (
        <div className="space-y-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-4">
            <div className="font-display font-bold text-base">🎯 Find Referrals on LinkedIn</div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Target Company</label>
                <input value={company} onChange={e => setCompany(e.target.value)} list="cos" placeholder="Google, Swiggy..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]" />
                <datalist id="cos">{COMPANIES.map(c => <option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Target Role</label>
                <input value={role} onChange={e => setRole(e.target.value)} list="ros" placeholder="Software Engineer..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]" />
                <datalist id="ros">{ROLES.map(r => <option key={r} value={r}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Your Skills</label>
                <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]" />
              </div>
            </div>
            {company
              ? <a href={buildSearchURL()} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                  🔗 Find {company} employees on LinkedIn →
                </a>
              : <p className="text-xs text-[var(--t3)]">Enter a company name above to generate the search link.</p>
            }
          </div>

          {/* Cold message */}
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-3">
            <div className="font-display font-bold text-base">✉️ Cold Message Template</div>
            <p className="text-xs text-[var(--t2)]">Personalise before sending — mention their specific work, not just "I admire your company."</p>
            <pre className="bg-[var(--el)] rounded-xl p-4 text-xs text-[var(--t)] whitespace-pre-wrap leading-relaxed border border-[var(--bdr)]">{coldMessage()}</pre>
            <button onClick={copyMsg}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
              {copied ? '✅ Copied!' : '📋 Copy Message'}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-3">💡 Referral Tips That Work</div>
            <div className="space-y-2">
              {[
                ['Personalise every message','Generic requests get ignored. Mention a specific project, blog post, or feature you genuinely admire.'],
                ['Lead with your work','Include a GitHub or project link in your first message. Don\'t make them ask.'],
                ['Ask for advice, not a referral','"Can we chat for 10 min about your team?" converts 3× better than "Can you refer me?"'],
                ['Target college alumni first','Alumni are 5× more likely to respond. Check LinkedIn → your school → "People who work at X".'],
                ['Follow up once, after 7 days','"Hey [Name], just following up — no worries if you\'re busy!" One reminder is fine, two is too many.'],
              ].map(([t, d]) => (
                <div key={String(t)} className="flex gap-3 p-3 bg-[var(--el)] rounded-xl">
                  <span className="text-cyan-400 font-bold text-sm mt-0.5 flex-shrink-0">→</span>
                  <div>
                    <div className="text-sm font-semibold">{t}</div>
                    <div className="text-xs text-[var(--t2)] mt-0.5">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STORIES TAB */}
      {tab === 'stories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--t2)]">{stories.length} {stories.length === 1 ? 'story' : 'stories'} from the community</div>
            <button onClick={() => setShowForm(p => !p)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
              {showForm ? '× Cancel' : '+ Share My Story'}
            </button>
          </div>

          {/* Submit form */}
          {showForm && (
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="font-display font-bold text-base text-cyan-400">Share Your Story 🎉</div>
              <div className="grid grid-cols-3 gap-3">
                {([['name','Your Name','e.g. Aman N.'],['company','Company','e.g. Google'],['role','Role','e.g. SDE Intern']] as const).map(([k, l, p]) => (
                  <div key={k}>
                    <label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                    <input value={(form as any)[k]} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={p}
                      className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">How did you get the role? *</label>
                <textarea value={form.story} onChange={e => setForm({...form,story:e.target.value})} rows={3}
                  placeholder="Walk us through your journey — what worked, what didn't..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Top tip for others</label>
                <textarea value={form.tips} onChange={e => setForm({...form,tips:e.target.value})} rows={2}
                  placeholder="What would you tell a fresher starting today?"
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
              </div>
              <button onClick={submitStory}
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                Share Story →
              </button>
            </div>
          )}

          {/* Empty state */}
          {stories.length === 0 && !showForm && (
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl">
              <div className="text-4xl mb-3">💬</div>
              <div className="font-display font-bold text-lg mb-2">No stories yet</div>
              <p className="text-sm text-[var(--t2)] mb-5">Be the first to share how you landed your role — inspire others!</p>
              <button onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                + Share My Story
              </button>
            </div>
          )}

          {/* Story cards */}
          {stories.map(s => (
            <div key={s.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 hover:border-cyan-500/15 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{s.name}</span>
                    {s.role && <span className="text-xs text-cyan-400 font-semibold">{s.role}</span>}
                    <span className="text-xs text-[var(--t3)]">@</span>
                    <span className="text-xs font-semibold text-purple-400">{s.company}</span>
                    <span className="text-xs text-[var(--t3)] ml-auto">{s.date}</span>
                  </div>
                  <p className="text-sm text-[var(--t2)] mt-2 leading-relaxed">{s.story}</p>
                  {s.tips && (
                    <div className="mt-3 bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-3">
                      <div className="text-xs font-semibold text-yellow-400 mb-1">💡 Top Tip</div>
                      <p className="text-xs text-[var(--t2)]">{s.tips}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
