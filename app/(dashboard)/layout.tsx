'use client'
import { readJSON } from '@/lib/storage'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { sec: 'Start',    href: '/dashboard',       icon: '⚡', label: 'Dashboard' },
  { sec: 'Jobs',     href: '/jobs',            icon: '🔍', label: 'Jobs' },
  { sec: 'Jobs',     href: '/fresher',         icon: '🌱', label: 'Fresher Hub' },
  { sec: 'Jobs',     href: '/match',           icon: '🎯', label: 'Job Match' },
  { sec: 'Jobs',     href: '/tracker',         icon: '📊', label: 'Tracker' },
  { sec: 'AI Tools', href: '/ai',              icon: '🤖', label: 'AI Suite' },
  { sec: 'AI Tools', href: '/resume',          icon: '📄', label: 'Resume' },
  { sec: 'AI Tools', href: '/resume-versions', icon: '📁', label: 'Resume Versions' },
  { sec: 'AI Tools', href: '/roast',           icon: '🔥', label: 'Resume Roast' },
  { sec: 'AI Tools', href: '/voice-interview', icon: '🎙️', label: 'Voice Interview' },
  { sec: 'Grow',     href: '/analytics',       icon: '📈', label: 'Analytics' },
  { sec: 'Grow',     href: '/resources',       icon: '📚', label: 'Resources' },
  { sec: 'Grow',     href: '/salary-reports',  icon: '💰', label: 'Salary Reports' },
  { sec: 'Community', href: '/community',      icon: '🌐', label: 'Community' },
  { sec: 'Community', href: '/referrals',      icon: '🤝', label: 'Referral Market' },
  { sec: 'Community', href: '/study-groups',   icon: '📖', label: 'Study Groups' },
  { sec: 'Community', href: '/confessions',    icon: '💬', label: 'Confessions' },
  { sec: 'Community', href: '/tpo',            icon: '🎓', label: 'TPO Portal' },
  { sec: 'Community', href: '/network',        icon: '🏆', label: 'XP & Network' },
  { sec: 'Account',  href: '/upgrade',         icon: '⭐', label: 'Go Pro' },
  { sec: 'Account',  href: '/profile',         icon: '👤', label: 'My Profile' },
  { sec: 'Account',  href: '/embed',           icon: '🔗', label: 'Job Board Embed' },
]

// Multi-language translations
const LANG_LABELS: Record<string,Record<string,string>> = {
  en: {},
  hi: { Dashboard:'डैशबोर्ड', Jobs:'नौकरियां', 'Fresher Hub':'फ्रेशर हब', 'AI Suite':'AI सूट', Resume:'रिज्यूमे', Tracker:'ट्रैकर', Analytics:'विश्लेषण', Resources:'संसाधन', Community:'समुदाय' },
  ta: { Dashboard:'டாஷ்போர்டு', Jobs:'வேலைகள்', 'Fresher Hub':'புதியர் மையம்', 'AI Suite':'AI தொகுப்பு', Resume:'விண்ணப்பம்', Tracker:'கண்காணிப்பு' },
  te: { Dashboard:'డాష్‌బోర్డ్', Jobs:'ఉద్యోగాలు', 'Fresher Hub':'ఫ్రెషర్ హబ్', 'AI Suite':'AI సూట్', Resume:'రెజ్యూమే', Tracker:'ట్రాకర్' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [sideOpen, setSideOpen]   = useState(false)
  const [theme, setTheme]         = useState('pro')
  const [userRole, setUserRole]   = useState('')
  const [lang, setLang]           = useState('en')

  // Cross-device sync: keeps tracker, notes, resume, XP etc. in MongoDB
  useEffect(() => {
    if (!localStorage.getItem('tl_user')) return
    const SKIP = ['tl_token', 'tl_user', 'tl_role']
    const snapshot = () => {
      const d: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!
        if (k.startsWith('tl_') && !SKIP.includes(k)) d[k] = localStorage.getItem(k) || ''
      }
      return d
    }
    const norm = (d: Record<string, string>) => JSON.stringify(Object.keys(d).sort().map(k => [k, d[k]]))
    let last = ''
    let stop = false
    const push = async () => {
      const d = snapshot(); const str = norm(d)
      if (str === last || stop) return
      try {
        const r = await fetch('/api/sync', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: d }) })
        if (r.ok) last = str
      } catch {}
    }
    ;(async () => {
      try {
        const r = await fetch('/api/sync'); if (!r.ok) return
        const { data } = await r.json()
        let restored = 0
        for (const [k, v] of Object.entries<string>(data || {})) {
          if (k.startsWith('tl_') && !SKIP.includes(k) && localStorage.getItem(k) === null) { localStorage.setItem(k, v); restored++ }
        }
        if (restored > 0 && !sessionStorage.getItem('tl_synced')) { sessionStorage.setItem('tl_synced', '1'); window.location.reload(); return }
        // Baseline = what the SERVER has. Anything on this device that differs (for example edits made before the
        // last reload or a closed tab) is then pushed, instead of being treated as already synced.
        const onServer: Record<string, string> = {}
        for (const [k, v] of Object.entries<string>(data || {})) if (k.startsWith('tl_') && !SKIP.includes(k)) onServer[k] = v
        last = norm(onServer)
        push()
      } catch {}
    })()
    const iv = setInterval(push, 20000)
    const onHide = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onHide)
    return () => { stop = true; clearInterval(iv); document.removeEventListener('visibilitychange', onHide) }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('tl_theme') || 'pro'
    setTheme(savedTheme)
    applyTheme(savedTheme)
    const u = readJSON('tl_user','{}')
    setUserRole(u.role || localStorage.getItem('tl_role') || 'student')
    setLang(localStorage.getItem('tl_lang') || 'en')
    localStorage.removeItem('tl_token') // older versions kept the login token here; it now lives in an httpOnly cookie
    const userData = localStorage.getItem('tl_user')
    if (!userData) { router.push('/login'); return }
    try { setUser(JSON.parse(userData)) } catch { router.push('/login'); return }
    // the cookie is invisible to scripts, so ask the server whether the session is still valid
    fetch('/api/auth/me').then(async r => {
      if (r.status === 401) { ['tl_user', 'tl_role'].forEach(k => localStorage.removeItem(k)); router.push('/login'); return }
      if (r.ok) { const d = await r.json(); const old = readJSON('tl_user', '{}'); d.user = { ...old, id: d.user.id, email: d.user.email, role: d.user.role, plan: d.user.plan, xp: d.user.xp }; localStorage.setItem('tl_user', JSON.stringify(d.user)); localStorage.setItem('tl_role', d.user.role); setUser(d.user); setUserRole(d.user.role) }
    }).catch(() => {})
  }, [router])

  function applyTheme(t: string) {
    const themes: Record<string,Record<string,string>> = {
      dark:  {'--bg':'#05080f','--card':'#0b1120','--el':'#101928','--hov':'#162035','--bdr':'rgba(0,220,255,0.10)','--bds':'rgba(0,220,255,0.22)','--t':'#eef2ff','--t2':'#8b9cbf','--t3':'#4a5a7a'},
      pro:   {},
      neon:  {'--bg':'#0a0014','--card':'#100020','--el':'#180030','--hov':'#200040','--bdr':'rgba(180,0,255,0.20)','--bds':'rgba(180,0,255,0.40)','--t':'#f0e0ff','--t2':'#c09fe0','--t3':'#806099'},
    }
    const root = document.documentElement
    const vars = themes[t] || themes['pro']
    // clear any previous theme, then apply (the professional theme lives in globals.css)
    ;['--bg','--card','--el','--hov','--bdr','--bds','--t','--t2','--t3','--cyan','--purple'].forEach(k => root.style.removeProperty(k))
    Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k,v))
    if (t === 'dark') root.style.setProperty('--cyan', '#60A5FA')
    if (t === 'neon') root.style.setProperty('--cyan', '#c084fc')
    root.dataset.theme = t
  }
  function cycleLang() {
    const order = ['en','hi','ta','te']
    const next = order[(order.indexOf(lang)+1)%order.length]
    setLang(next); localStorage.setItem('tl_lang', next)
  }
  function t(label: string) { return LANG_LABELS[lang]?.[label] || label }
  function cycleTheme() {
    const order = ['pro','dark','neon']
    const next = order[(order.indexOf(theme)+1)%order.length]
    setTheme(next); applyTheme(next); localStorage.setItem('tl_theme',next)
  }
  function logout() {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('tl_token')
    localStorage.removeItem('tl_user')
    localStorage.removeItem('tl_role')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Sidebar */}
      <aside className={`tl-side fixed top-0 left-0 bottom-0 w-64 bg-[var(--card)] border-r border-[var(--bdr)] flex flex-col z-40 transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[var(--bdr)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">TL</div>
            <div>
              <div className="font-display font-bold text-base glow-text leading-none">TalentLaunch</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">CS Career OS</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ sec, href, icon, label }, i) => {
            const showSec = i === 0 || NAV[i - 1].sec !== sec
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <div key={href}>
              {showSec && i > 0 && <div className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--t3)]">{sec}</div>}
              <Link href={href} onClick={() => setSideOpen(false)} aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-400/25'
                  : 'text-[var(--t2)] hover:bg-[var(--el)] hover:text-[var(--t)]'}`}>
                <span className="text-base w-5 text-center">{icon}</span>
                {t(label)}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-[var(--bdr)]">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{user.name}{(user as any).plan === 'pro' ? ' ⭐' : ''}</div>
                <div className="text-xs text-[var(--t3)] truncate">{user.email}</div>
              </div>
            </div>
          )}
          {/* Language toggle */}
          <button onClick={cycleLang} className="mt-1 w-full text-left px-4 py-2 rounded-xl text-xs text-[var(--t3)] hover:bg-[var(--el)] hover:text-[var(--t)] transition-all flex items-center gap-2">
            <span>🌐</span> {lang==='en'?'English':lang==='hi'?'हिन्दी':lang==='ta'?'தமிழ்':'తెలుగు'}
          </button>
          {/* Theme toggle */}
          <button onClick={cycleTheme} className="mt-1 mb-1 w-full text-left px-4 py-2.5 rounded-xl text-xs text-[var(--t3)] hover:bg-[var(--el)] hover:text-[var(--t)] transition-all flex items-center gap-2">
            <span>{theme==='pro'?'☀️':theme==='dark'?'🌙':'🟣'}</span> {theme==='pro'?'Professional':theme==='dark'?'Dark':'Neon'} Theme
          </button>
          {/* Admin link */}
          {(userRole==='admin'||userRole==='recruiter')&&(
            <Link href="/admin" onClick={()=>setSideOpen(false)} className="mb-1 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-yellow-500/8 text-yellow-400 hover:bg-yellow-500/15 transition-all">
              <span>{userRole==='admin'?'⚡':'💼'}</span> {userRole==='admin'?'Admin Panel':'Recruiter Panel'}
            </Link>
          )}
          <button onClick={logout} className="mt-2 w-full text-left px-4 py-2.5 rounded-xl text-xs text-[var(--t3)] hover:bg-[var(--el)] hover:text-red-400 transition-all flex items-center gap-2">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--card)]/90 backdrop-blur border-b border-[var(--bdr)]">
          <button onClick={() => setSideOpen(true)} className="p-2 rounded-lg hover:bg-[var(--el)] transition-colors">
            <div className="space-y-1"><div className="w-5 h-0.5 bg-current" /><div className="w-5 h-0.5 bg-current" /><div className="w-5 h-0.5 bg-current" /></div>
          </button>
          <span className="font-display font-bold glow-text">TalentLaunch</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
