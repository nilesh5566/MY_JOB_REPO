'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/dashboard',      icon: '⚡', label: 'Dashboard' },
  { href: '/jobs',           icon: '🔍', label: 'Jobs' },
  { href: '/fresher',        icon: '🌱', label: 'Fresher Hub' },
  { href: '/ai',             icon: '🤖', label: 'AI Suite' },
  { href: '/resume',         icon: '📄', label: 'Resume' },
  { href: '/resume-versions',icon: '📁', label: 'Resume Versions' },
  { href: '/tracker',        icon: '📊', label: 'Tracker' },
  { href: '/analytics',      icon: '📈', label: 'Analytics' },
  { href: '/resources',      icon: '📚', label: 'Resources' },
  { href: '/salary-reports', icon: '💰', label: 'Salary Reports' },
  { href: '/community',      icon: '🌐', label: 'Community' },
  { href: '/embed',          icon: '🔗', label: 'Job Board Embed' },
  { href: '/profile',        icon: '👤', label: 'My Profile' },
  { href: '/roast',          icon: '🔥', label: 'Resume Roast' },
  { href: '/voice-interview',icon: '🎙️', label: 'Voice Interview' },
  { href: '/referrals',      icon: '🤝', label: 'Referral Market' },
  { href: '/confessions',    icon: '💬', label: 'Confessions' },
  { href: '/study-groups',   icon: '📖', label: 'Study Groups' },
  { href: '/tpo',            icon: '🎓', label: 'TPO Portal' },
  { href: '/network',        icon: '🏆', label: 'XP & Network' },
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
  const [theme, setTheme]         = useState('dark')
  const [userRole, setUserRole]   = useState('')
  const [lang, setLang]           = useState('en')

  useEffect(() => {
    const savedTheme = localStorage.getItem('tl_theme') || 'dark'
    setTheme(savedTheme)
    applyTheme(savedTheme)
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    setUserRole(u.role || localStorage.getItem('tl_role') || 'student')
    setLang(localStorage.getItem('tl_lang') || 'en')
    const token = localStorage.getItem('tl_token')
    const userData = localStorage.getItem('tl_user')
    if (!token) { router.push('/login'); return }
    if (userData) setUser(JSON.parse(userData))
  }, [router])

  function applyTheme(t: string) {
    const themes: Record<string,Record<string,string>> = {
      dark:  {'--bg':'#05080f','--card':'#0b1120','--el':'#101928','--hov':'#162035','--bdr':'rgba(0,220,255,0.10)','--bds':'rgba(0,220,255,0.22)','--t':'#eef2ff','--t2':'#8b9cbf','--t3':'#4a5a7a'},
      light: {'--bg':'#f0f4ff','--card':'#ffffff','--el':'#e8edf8','--hov':'#dce3f5','--bdr':'rgba(0,0,0,0.10)','--bds':'rgba(0,0,0,0.25)','--t':'#0f1729','--t2':'#4a5a7a','--t3':'#8b9cbf'},
      neon:  {'--bg':'#0a0014','--card':'#100020','--el':'#180030','--hov':'#200040','--bdr':'rgba(180,0,255,0.20)','--bds':'rgba(180,0,255,0.40)','--t':'#f0e0ff','--t2':'#c09fe0','--t3':'#806099'},
    }
    const vars = themes[t] || themes['dark']
    Object.entries(vars).forEach(([k,v]) => document.documentElement.style.setProperty(k,v))
  }
  function cycleLang() {
    const order = ['en','hi','ta','te']
    const next = order[(order.indexOf(lang)+1)%order.length]
    setLang(next); localStorage.setItem('tl_lang', next)
  }
  function t(label: string) { return LANG_LABELS[lang]?.[label] || label }
  function cycleTheme() {
    const order = ['dark','light','neon']
    const next = order[(order.indexOf(theme)+1)%order.length]
    setTheme(next); applyTheme(next); localStorage.setItem('tl_theme',next)
  }
  function logout() {
    localStorage.removeItem('tl_token')
    localStorage.removeItem('tl_user')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[var(--card)] border-r border-[var(--bdr)] flex flex-col z-40 transition-transform duration-300 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[var(--bdr)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">TL</div>
            <div>
              <div className="font-display font-bold text-base glow-text leading-none">GoUpfer.com</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">CS Career OS</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-[var(--t2)] hover:bg-[var(--el)] hover:text-white'}`}>
                <span className="text-base w-5 text-center">{icon}</span>
                {t(label)}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </Link>
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
                <div className="text-sm font-semibold truncate">{user.name}</div>
                <div className="text-xs text-[var(--t3)] truncate">{user.email}</div>
              </div>
            </div>
          )}
          {/* Language toggle */}
          <button onClick={cycleLang} className="mt-1 w-full text-left px-4 py-2 rounded-xl text-xs text-[var(--t3)] hover:bg-[var(--el)] hover:text-white transition-all flex items-center gap-2">
            <span>🌐</span> {lang==='en'?'English':lang==='hi'?'हिन्दी':lang==='ta'?'தமிழ்':'తెలుగు'}
          </button>
          {/* Theme toggle */}
          <button onClick={cycleTheme} className="mt-1 mb-1 w-full text-left px-4 py-2.5 rounded-xl text-xs text-[var(--t3)] hover:bg-[var(--el)] hover:text-white transition-all flex items-center gap-2">
            <span>{theme==='dark'?'🌙':theme==='light'?'☀️':'🟣'}</span> {theme==='dark'?'Dark':theme==='light'?'Light':'Neon'} Theme
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--card)]/90 backdrop-blur border-b border-[var(--bdr)]">
          <button onClick={() => setSideOpen(true)} className="p-2 rounded-lg hover:bg-[var(--el)] transition-colors">
            <div className="space-y-1"><div className="w-5 h-0.5 bg-current" /><div className="w-5 h-0.5 bg-current" /><div className="w-5 h-0.5 bg-current" /></div>
          </button>
          <span className="font-display font-bold glow-text">TalentLaunch</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
