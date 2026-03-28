'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const FEATURES = [
  { icon: '🔍', title: 'Smart Job Search', desc: 'Live jobs from 4 free APIs. Filter by skill, remote, salary. Auto-deduplication removes repeated listings.' },
  { icon: '🤖', title: '12 AI Tools Free', desc: 'Resume score, mock interview, JD analyzer, career path predictor, cover letter, salary coach and more.' },
  { icon: '📄', title: 'Resume Builder', desc: '5-step guided builder with 3 templates. AI enhances your projects. Download ATS-ready resume instantly.' },
  { icon: '📊', title: 'Application Tracker', desc: 'Track Applied → Interview → Offer. Visual analytics, deadline reminders, CSV export.' },
  { icon: '🏆', title: 'XP & Gamification', desc: 'Earn XP for every action. Level up from Fresher to Tech Lead. Anonymous weekly leaderboard.' },
  { icon: '🧮', title: 'CTC Calculator', desc: 'Convert LPA ↔ Monthly ↔ USD ↔ EUR instantly with Indian tax estimation.' },
]

const TOOLS = [
  ['🎯', 'Resume Match'], ['💯', 'Resume Score /100'], ['✅', 'ATS Checker'],
  ['🎤', 'Mock Interview'], ['✉️', 'Cover Letter'], ['📧', 'Cold Email'],
  ['🗺️', 'Career Roadmap'], ['💰', 'Salary Coach'], ['🔍', 'JD Analyzer'],
  ['📝', 'LinkedIn Post'], ['🔮', 'Career Path'], ['🎯', 'Dream Company'],
]

const TIPS = ['Apply Mon–Tue for 40% better response rates', 'ATS filters reject 75% of resumes — let us help you pass', '80% of jobs are filled through referrals — we help you find them']

export default function LandingPage() {
  const [tip, setTip] = useState(0)
  useEffect(() => { const t = setInterval(() => setTip(p => (p + 1) % TIPS.length), 3000); return () => clearInterval(t) }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass border-b border-[var(--bdr)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">TL</div>
          <span className="font-display font-bold text-lg glow-text">TalentLaunch</span>
          <span className="text-[10px] border border-cyan-500/30 text-cyan-400 rounded px-1.5 py-0.5 font-mono">v5</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--t2)]">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#tools" className="hover:text-cyan-400 transition-colors">AI Tools</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--t2)] hover:text-white transition-colors">Login</Link>
          <Link href="/register" className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-sm font-bold px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(0,220,255,0.4)] transition-all">
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          {/* Rotating tip */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-yellow-400 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            💡 {TIPS[tip]}
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-up delay-100">
            Land Your First<br />
            <span className="glow-text">Tech Job with AI</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--t2)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            The all-in-one platform for CS freshers — AI resume scorer, mock interviews, live job search, career path predictor, and application tracker. All free.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-up delay-300">
            <Link href="/register" className="group relative bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold text-base px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,220,255,0.5)] transition-all hover:-translate-y-0.5">
              🚀 Start for Free — No Card Needed
            </Link>
            <Link href="/login" className="border border-[var(--bds)] text-white font-semibold text-base px-8 py-4 rounded-xl hover:border-cyan-400 hover:bg-cyan-400/5 transition-all">
              Sign In →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up delay-400">
            {[['12+','AI Tools'],['4','Live Job APIs'],['100%','Free Forever'],['5min','To Get Started']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="font-display font-extrabold text-3xl glow-text">{n}</div>
                <div className="text-xs text-[var(--t3)] mt-1 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-center mb-4">Your entire job hunt in one place</h2>
          <p className="text-center text-[var(--t2)] mb-14 max-w-xl mx-auto">No more juggling 10 different tools. TalentLaunch puts it all in a fast, beautiful web app.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="group bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-7 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{f.icon}</div>
                <div className="font-display font-bold text-lg mb-2">{f.title}</div>
                <div className="text-sm text-[var(--t2)] leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section id="tools" className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Powered by Groq — Free API</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-center mb-4">12 AI tools, zero cost</h2>
          <p className="text-center text-[var(--t2)] mb-14 max-w-lg mx-auto">Get a free Groq API key at console.groq.com in 60 seconds. No credit card.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TOOLS.map(([icon, name]) => (
              <div key={name} className="flex items-center gap-3 bg-[var(--el)] border border-[var(--bdr)] rounded-xl p-4 hover:border-cyan-500/30 hover:bg-[var(--hov)] transition-all">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-500/5 to-purple-600/5 border border-cyan-500/20 rounded-3xl p-12">
            <div className="text-5xl font-display font-extrabold mb-2 glow-text">$0</div>
            <div className="text-[var(--t2)] mb-8">Forever. No hidden fees. No ads. No data selling.</div>
            <div className="grid grid-cols-2 gap-3 mb-10 text-left">
              {['All 12 AI tools','Live job search','Resume builder','Application tracker','CTC calculator','XP & leaderboard','CSV export','Cloud sync (MongoDB)','6 themes','Gamification'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span> {f}
                </div>
              ))}
            </div>
            <Link href="/register" className="inline-block bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-10 py-4 rounded-xl text-base hover:shadow-[0_0_30px_rgba(0,220,255,0.5)] transition-all">
              Create Free Account →
            </Link>
            <p className="text-xs text-[var(--t3)] mt-4">Only requirement: free Groq API key for AI features</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--bdr)] py-10 px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white">TL</div>
          <span className="font-display font-bold glow-text">TalentLaunch</span>
        </div>
        <div className="flex gap-6 text-sm text-[var(--t3)]">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
          <a href="https://github.com" className="hover:text-cyan-400 transition-colors">GitHub</a>
        </div>
        <div className="text-xs text-[var(--t3)]">© 2025 TalentLaunch · Made for freshers everywhere 🚀</div>
      </footer>
    </div>
  )
}
