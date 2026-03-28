'use client'
import { useState } from 'react'

const RESOURCES = {
  DSA: [
    {name:'Striver A2Z DSA Sheet',url:'https://takeuforward.org/strivers-a2z-dsa-course/',desc:'Most comprehensive DSA roadmap for placements. 450+ problems organized by topic.',tag:'🔥 Best Overall',free:true},
    {name:'NeetCode 150',url:'https://neetcode.io/',desc:'150 curated LeetCode problems with video solutions. Best for FAANG prep.',tag:'⭐ FAANG',free:true},
    {name:'LeetCode',url:'https://leetcode.com/',desc:'Industry standard. Filter by company (Google, Amazon, etc.) and difficulty.',tag:'💻 Practice',free:true},
    {name:'Codeforces',url:'https://codeforces.com/',desc:'Competitive programming contests. Improves speed and problem-solving.',tag:'🏆 CP',free:true},
    {name:'CodeChef DSA Learning',url:'https://www.codechef.com/learn/course/cpp-beginner',desc:'Structured DSA learning path with contests and ratings.',tag:'📚 Learn',free:true},
    {name:'GeeksForGeeks DSA',url:'https://www.geeksforgeeks.org/data-structures/',desc:'Reference articles for every DSA concept with implementations.',tag:'📖 Reference',free:true},
  ],
  'System Design': [
    {name:'Grokking System Design',url:'https://www.designgurus.io/course/grokking-the-system-design-interview',desc:'Best system design course. Covers URL shortener, Netflix, WhatsApp, etc.',tag:'🔥 Must Do',free:false},
    {name:'System Design Primer (GitHub)',url:'https://github.com/donnemartin/system-design-primer',desc:'Free 50k+ star GitHub repo. Covers every SD concept with diagrams.',tag:'⭐ Free',free:true},
    {name:'ByteByteGo',url:'https://bytebytego.com/',desc:'Alex Xu\'s SD newsletter + book. Visual explanations of complex systems.',tag:'📚 Newsletter',free:false},
    {name:'High Scalability Blog',url:'http://highscalability.com/',desc:'Real architecture case studies from Netflix, Uber, Twitter.',tag:'🏗️ Case Studies',free:true},
    {name:'Arpit Bhayani SD',url:'https://arpitbhayani.me/system-design',desc:'Deep-dive system design articles by ex-Freshworks engineer.',tag:'🇮🇳 India',free:true},
    {name:'Exponent SD',url:'https://www.tryexponent.com/courses/system-design-interview',desc:'Mock SD interviews with ex-FAANG engineers.',tag:'🎤 Practice',free:false},
  ],
  Projects: [
    {name:'40 Python Projects',url:'https://www.freecodecamp.org/news/python-projects-for-beginners/',desc:'Beginner to advanced Python projects. Web scraper, chatbot, ML models.',tag:'🐍 Python',free:true},
    {name:'Full Stack Open',url:'https://fullstackopen.com/en/',desc:'Helsinki University\'s free full-stack course: React, Node, GraphQL, TypeScript.',tag:'🌐 Full Stack',free:true},
    {name:'The Odin Project',url:'https://www.theodinproject.com/',desc:'Free full-stack curriculum. Build real projects from day 1.',tag:'💻 Web',free:true},
    {name:'Build 30 JS Projects',url:'https://javascript30.com/',desc:'30-day JS challenge — build 30 projects in vanilla JS. No frameworks.',tag:'⚡ JS',free:true},
    {name:'ML Project Ideas (Kaggle)',url:'https://www.kaggle.com/learn',desc:'Real datasets + notebooks. Build ML projects that stand out.',tag:'🤖 ML',free:true},
    {name:'DevPost Hackathons',url:'https://devpost.com/hackathons',desc:'Online hackathons with prizes. Great for resume projects + networking.',tag:'🏆 Hackathon',free:true},
  ],
  'Interview Prep': [
    {name:'Blind 75',url:'https://leetcode.com/discuss/general-discussion/460599/',desc:'75 must-solve LeetCode problems. Covers all patterns needed for FAANG.',tag:'🎯 FAANG',free:true},
    {name:'Pramp',url:'https://www.pramp.com/',desc:'Free peer-to-peer mock technical interviews. Practice with real candidates.',tag:'🎤 Mock',free:true},
    {name:'InterviewBit',url:'https://www.interviewbit.com/',desc:'Structured interview prep with company-specific questions and mock rounds.',tag:'🏢 Companies',free:true},
    {name:'Glassdoor Interview Q',url:'https://www.glassdoor.co.in/Interview/',desc:'Real interview questions from actual candidates at specific companies.',tag:'👁️ Real Q&A',free:true},
    {name:'STAR Method Guide',url:'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique',desc:'Master behavioral interviews using the Situation-Task-Action-Result method.',tag:'🧠 Behavioral',free:true},
    {name:'Tech Interview Handbook',url:'https://www.techinterviewhandbook.org/',desc:'Free comprehensive guide: algorithms, behavioral, offers, negotiation.',tag:'📖 All-in-one',free:true},
  ],
  'OS / DBMS / CN': [
    {name:'OS by GATE Smashers',url:'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',desc:'Complete OS playlist for interviews. Covers processes, threading, deadlocks.',tag:'📺 Video',free:true},
    {name:'DBMS by Sanchit Jain',url:'https://www.youtube.com/playlist?list=PLmXKhU9VNmkPHWDzmEXxiGk26PZnX7dNH',desc:'DBMS for CS interviews — normalization, SQL, transactions explained simply.',tag:'📺 Video',free:true},
    {name:'Computer Networks Kurose',url:'https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm',desc:'Free lecture slides + videos from the CN textbook authors.',tag:'📚 Academic',free:true},
    {name:'SQL Zoo',url:'https://sqlzoo.net/',desc:'Interactive SQL tutorials with exercises. From basics to window functions.',tag:'🗄️ SQL',free:true},
  ],
  'Resume & Career': [
    {name:'Harvard Resume Template',url:'https://ocs.fas.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf',desc:'Clean, ATS-friendly format used by Harvard CS students.',tag:'📄 Template',free:true},
    {name:'Overleaf LaTeX Resume',url:'https://www.overleaf.com/gallery/tagged/cv',desc:'Professional LaTeX resume templates. Looks great and beats Word templates.',tag:'✨ LaTeX',free:true},
    {name:'Levels.fyi',url:'https://www.levels.fyi/',desc:'Real salary data from self-reported FAANG and startup employees.',tag:'💰 Salary',free:true},
    {name:'Glassdoor Salaries',url:'https://www.glassdoor.co.in/Salaries/index.htm',desc:'Company-specific salary data by role and location.',tag:'💰 Salary',free:true},
    {name:'LinkedIn Learning',url:'https://www.linkedin.com/learning/',desc:'Professional courses. Many free with LinkedIn Premium trial.',tag:'🎓 Courses',free:false},
    {name:'Coursera (audit)',url:'https://www.coursera.org/',desc:'Audit most courses for free. Stanford ML, IBM Data Science, Google certs.',tag:'🎓 Certs',free:true},
  ],
}

type Category = keyof typeof RESOURCES

export default function ResourcesPage() {
  const [tab, setTab] = useState<Category>('DSA')
  const [freeOnly, setFreeOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tl_bookmarks') || '[]') : []
  )

  function toggleBookmark(name: string) {
    const updated = bookmarks.includes(name) ? bookmarks.filter(b => b !== name) : [...bookmarks, name]
    setBookmarks(updated)
    localStorage.setItem('tl_bookmarks', JSON.stringify(updated))
  }

  const categories = Object.keys(RESOURCES) as Category[]
  const current = RESOURCES[tab].filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase())
    const matchFree = !freeOnly || r.free
    return matchSearch && matchFree
  })

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-3xl">📚 Resource Library</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Curated DSA, System Design, projects, interview prep — all in one place</p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources..."
          className="flex-1 min-w-48 bg-[var(--card)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
        <button onClick={() => setFreeOnly(p=>!p)}
          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold transition-all ${freeOnly?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
          ✅ Free Only
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl overflow-x-auto">
        {categories.map(c => (
          <button key={c} onClick={() => setTab(c)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===c?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{c}</button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="grid md:grid-cols-2 gap-3">
        {current.map(r => (
          <div key={r.name} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 hover:border-cyan-500/15 transition-all group">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="font-semibold text-sm hover:text-cyan-400 transition-colors">{r.name}</a>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--el)] text-[var(--t2)] border border-[var(--bdr)]">{r.tag}</span>
                  {r.free
                    ? <span className="text-[10px] font-bold text-green-400">FREE</span>
                    : <span className="text-[10px] font-bold text-yellow-400">PAID</span>
                  }
                </div>
                <p className="text-xs text-[var(--t2)] mt-1.5 leading-relaxed">{r.desc}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => toggleBookmark(r.name)}
                  className={`text-base transition-all hover:scale-110 ${bookmarks.includes(r.name)?'':'opacity-25 hover:opacity-80'}`}>🔖</button>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <a href={r.url} target="_blank" rel="noreferrer"
                className="flex-1 text-center text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 py-2 rounded-lg transition-colors">Open Resource →</a>
            </div>
          </div>
        ))}
        {current.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-[var(--t3)]">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-sm">No resources match your search</div>
          </div>
        )}
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="bg-[var(--card)] border border-yellow-500/15 rounded-2xl p-5">
          <div className="font-display font-bold text-base mb-3">🔖 Your Bookmarks ({bookmarks.length})</div>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map(b => {
              const res = Object.values(RESOURCES).flat().find(r => r.name === b)
              return res ? (
                <a key={b} href={res.url} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/15 transition-colors">
                  {b}
                </a>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
