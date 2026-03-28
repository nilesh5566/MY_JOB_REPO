'use client'
import { useState, useRef, useEffect } from 'react'

// ── Tool definitions ────────────────────────────────────────────────────────
const TOOLS = [
  { id:'score',        emoji:'💯', name:'Resume Score',        desc:'Score /100 with breakdown',   group:'Resume' },
  { id:'match',        emoji:'🎯', name:'Resume Match',        desc:'Match % against a JD',        group:'Resume' },
  { id:'ats',          emoji:'✅', name:'ATS Checker',         desc:'Will ATS pass your resume?',  group:'Resume' },
  { id:'linkedin_opt', emoji:'💼', name:'LinkedIn Optimizer',  desc:'Rewrite headline & about',    group:'Resume' },
  { id:'mock',         emoji:'🎤', name:'Mock Interview',      desc:'Live AI roleplay interview',  group:'Interview' },
  { id:'interview',    emoji:'❓', name:'Interview Prep',      desc:'Q&A with hints by role',      group:'Interview' },
  { id:'salary',       emoji:'💰', name:'Salary Coach',        desc:'Negotiation script + range',  group:'Interview' },
  { id:'cover',        emoji:'✉️', name:'Cover Letter',        desc:'4 tone options',              group:'Writing' },
  { id:'cold',         emoji:'📧', name:'Cold Email',          desc:'To hiring manager',           group:'Writing' },
  { id:'post',         emoji:'📝', name:'LinkedIn Post',       desc:'Viral post generator',        group:'Writing' },
  { id:'roadmap',      emoji:'🗺️', name:'Career Roadmap',     desc:'Week-by-week action plan',    group:'Strategy' },
  { id:'jd',           emoji:'🔍', name:'JD Analyzer',         desc:'Red flags & culture hints',   group:'Strategy' },
  { id:'path',         emoji:'🔮', name:'Career Path',         desc:'5-year trajectory',           group:'Strategy' },
  { id:'dream',        emoji:'🏢', name:'Dream Company',       desc:'3-month prep plan',           group:'Strategy' },
  { id:'skillgap',     emoji:'📊', name:'Skill Gap',           desc:'What you\'re missing',        group:'Strategy' },
  { id:'company',      emoji:'🏛️', name:'Company Deep Dive',  desc:'Culture, process, tips',      group:'Strategy' },
  { id:'github_review',emoji:'🐙', name:'GitHub Reviewer',     desc:'Score your profile & repos',  group:'Resume' },
  { id:'offer_compare',emoji:'⚖️', name:'Offer Comparison',    desc:'Compare 2–3 offers, get verdict',group:'Strategy' },
  { id:'portfolio',    emoji:'💡', name:'Project Ideas',        desc:'5 project ideas for your role', group:'Strategy' },
  { id:'followup',     emoji:'📬', name:'Interview Follow-up',  desc:'Thank-you + follow-up email',   group:'Writing' },
  { id:'auto_apply',   emoji:'🤖', name:'Auto-Apply Draft',    desc:'AI fills application form',     group:'Writing' },
  { id:'linkedin_full',emoji:'💼', name:'LinkedIn Full Rewrite',desc:'Complete profile transformation',group:'Resume' },
  { id:'answer_grade',emoji:'🎓', name:'Answer Grader',       desc:'Score + improve your answer',  group:'Interview' },
  { id:'negotiate',   emoji:'💬', name:'Negotiation Sim',     desc:'Live salary negotiation chat',  group:'Interview' },
  { id:'rewrite',      emoji:'✍️', name:'Resume Rewriter',    desc:'Full AI rewrite, ATS-ready',  group:'Resume' },
  { id:'hr_call',      emoji:'📞', name:'HR Call Simulator',  desc:'Practice HR screening live',  group:'Interview' },
  { id:'visa',         emoji:'🌍', name:'Visa & Relocation',  desc:'Best countries for your skills',group:'Strategy' },
  { id:'referral_gen', emoji:'🤝', name:'Referral Email',     desc:'Auto-craft referral outreach', group:'Writing' },
]
const GROUPS = ['Resume', 'Interview', 'Writing', 'Strategy']
const NEEDS_JD    = ['match','ats','cover','cold','salary','jd','skillgap']
const NEEDS_EXTRA: Record<string,string> = {
  score:       'Target role (e.g. "React Developer")',
  mock:        'Company + Role (e.g. "Razorpay – Backend")',
  interview:   'Job title',
  cover:       'Tone: professional / casual / enthusiastic / formal',
  cold:        'Company name',
  post:        'Topic to post about',
  roadmap:     'Weeks or target role (e.g. "4" or "ML Engineer")',
  dream:       'Target company (e.g. Google, Swiggy)',
  company:     'Company name',
  github_review:'Your GitHub username (e.g. "amannayak530")',
  offer_compare:'Paste both offers: Company1|Role|Salary vs Company2|Role|Salary',
  portfolio:    'Target role + tech stack (e.g. "ML Engineer, Python, TensorFlow")',
  followup:     'Interviewer name + Company + Role + interview date',
  answer_grade: 'The question you were asked',
  negotiate:    'Role + Offered salary + Target salary (e.g. SDE-1, ₹12 LPA offered, want ₹16 LPA)',
  auto_apply:   'Job title + Company + Job description (paste JD here)',
  linkedin_full:'Your current LinkedIn URL or paste your about/headline/experience',
  rewrite:     'Target role (e.g. "ML Engineer at Google")',
  hr_call:     'Company + Role (e.g. "Zepto – SDE-1")',
  visa:        'Your skills (e.g. "React, Node.js, 0 years exp")',
  referral_gen:'Name + Company + Role (e.g. "Rahul, Google, SWE")',
  linkedin_opt:'Current headline or target role',
  salary:      'Job title + offered salary (e.g. "SDE-1, ₹12 LPA")',
}

// ── Prompt builder ──────────────────────────────────────────────────────────
function buildPrompt(tool: string, resume: string, jd: string, extra: string) {
  const r = resume.slice(0, 900), j = jd.slice(0, 600)
  const p: Record<string,string> = {
    score:       `Score this resume /100. Return JSON ONLY:\n{"totalScore":72,"breakdown":{"formatting":15,"keywords":18,"impact":14,"completeness":16,"ats":9},"maxScores":{"formatting":20,"keywords":25,"impact":20,"completeness":20,"ats":15},"strengths":["s1"],"improvements":["i1"],"verdict":"2 sentences"}\n\nResume:\n${r}\n\nTarget role: ${extra||'Software Engineer'}`,
    match:       `Rate how well this resume matches the JD. Return JSON ONLY:\n{"matchScore":72,"matchedSkills":["Python"],"missingSkills":["Docker"],"strengths":["Good projects"],"improvements":["Add Docker"],"verdict":"2 sentences"}\n\nResume:\n${r}\n\nJD:\n${j}`,
    ats:         `ATS analysis. Return JSON ONLY:\n{"score":72,"verdict":"Likely to Pass","presentKeywords":["Python"],"missingKeywords":["Docker"],"formattingIssues":["Use standard headers"],"suggestions":["Add Docker to skills"]}\n\nResume:\n${r}\n\nJD:\n${j}`,
    linkedin_opt:`Optimize LinkedIn profile. Return JSON ONLY:\n{"headline":"under 220 chars","about":"3-4 sentences for recruiters","topSkills":["S1","S2","S3","S4","S5"],"tips":["T1","T2","T3"],"keywords":["k1","k2"]}\n\nProfile/Target: ${extra||'CS Fresher'}\nResume: ${r}`,
    mock:        `You are a ${extra||'Software Engineer'} interviewer. Start with a warm intro and your first question based on this resume. Be conversational, 3-4 sentences.\n\nResume:\n${r}`,
    interview:   `Generate interview questions. Return JSON ONLY:\n{"technical":[{"q":"question","hint":"hint"}],"behavioral":[{"q":"question","hint":"hint"}],"roleSpecific":[{"q":"question","hint":"hint"}],"questionsToAsk":["q1"]}\n\nJob: ${extra||'Software Engineer'}\nResume: ${r}\nJD: ${j}`,
    salary:      `Salary negotiation playbook for ${extra||'Software Engineer'}. Give: market range India+US, negotiation script, 3 counter-offer lines, red flags to watch.\n\nResume:\n${r}`,
    cover:       `Write a ${extra||'professional'} cover letter, 3 paragraphs, under 200 words. Reference specific details from both resume and JD.\n\nResume:\n${r}\n\nJD:\n${j}`,
    cold:        `Cold email to hiring manager at ${extra||'the company'}. Format: Subject line + 4-line body. Under 150 words, confident, specific CTA.\n\nResume:\n${r}\n\nRole: ${j||extra}`,
    post:        `Write a LinkedIn post about: "${extra||'my journey in tech'}". Hook → Story → Takeaway → 3-5 hashtags. Max 200 words, authentic.\n\nBackground:\n${r}`,
    roadmap:     `Career roadmap for ${extra||'4'} weeks. Return JSON ONLY:\n{"weeks":[{"week":1,"title":"Foundation","tasks":["T1","T2"],"resources":["R1"],"milestone":"M1"}]}\n\nTarget: ${j||extra}\nCurrent skills: ${r}`,
    jd:          `Analyze this job description. Return JSON ONLY:\n{"redFlags":["f1"],"greenFlags":["f1"],"cultureHints":["h1"],"difficulty":"Medium","requiredSkills":["s1"],"niceToHave":["s1"],"interviewTips":["t1"],"salaryEstimate":"range"}\n\nJD:\n${j||extra}`,
    path:        `5-year career path. Return JSON ONLY:\n{"years":[{"year":"Year 1","title":"Junior SDE","salaries":{"india":"₹6-8 LPA","us":"$70k-85k"},"keySkills":["s1"],"milestone":"Ship first feature"}]}\n\nResume:\n${r}`,
    dream:       `3-month plan for ${extra||'FAANG'}. Return JSON ONLY:\n{"targetCompanies":"${extra||'FAANG'}","months":[{"month":1,"title":"Foundation","focus":"DSA","tasks":["T1","T2"],"resource":"Striver Sheet","checkpoint":"C1"}]}\n\nResume:\n${r}`,
    skillgap:    `Skill gap analysis. Return JSON ONLY:\n{"presentSkills":[{"skill":"Python","level":80}],"missingSkills":[{"skill":"Docker","demand":85,"learnTime":"2 weeks"}],"summary":"2 sentences","quickWins":["W1"]}\n\nResume:\n${r}\n\nTarget: ${j||extra}`,
    github_review:`Review this GitHub profile for a job seeker. Return JSON ONLY: {"overallScore":72,"profileStrength":{"readme":80,"commits":65,"projects":70,"diversity":60},"topRepos":[{"name":"repo-name","strength":"2 words","suggestion":"1 sentence"}],"strengths":["s1","s2"],"improvements":["i1","i2"],"verdict":"2 sentences","topSkillsSeen":["Python","React"]}

GitHub Username: ${extra||'unknown'}
Resume context: ${r.slice(0,300)}`,
    offer_compare:`Compare these job offers and give a verdict. Return JSON ONLY: {"offers":[{"company":"Company1","role":"Role","salary":"₹X LPA","score":78,"pros":["p1"],"cons":["c1"]}],"verdict":"Pick Company X because...","salaryWinner":"Company name","growthWinner":"Company name","cultureWinner":"Company name","finalPick":"Company name","reasoning":"2 sentences"}

Offers: ${extra||jd}`,
    portfolio:    `Generate 5 portfolio project ideas. Return JSON ONLY: {"projects":[{"name":"Project Name","description":"2 sentences","techStack":["React","Node.js"],"difficulty":"Medium","timeToComplete":"2 weeks","impactStatement":"Used by X users / reduces Y by Z%","githubTips":"What to include in README"}]}

Target: ${extra||r.slice(0,200)}`,
    answer_grade: `Grade this interview answer. Return JSON ONLY: {"score":72,"starFormat":{"situation":75,"task":60,"action":80,"result":65},"strengths":["s1"],"improvements":["i1"],"modelAnswer":"A stronger version of this answer in 4-5 sentences","verdict":"Good answer but needs more specifics"}

Question: ${extra||'Tell me about yourself'}
Answer: ${jd||resume}`,
    negotiate:    `You are an HR negotiator at ${extra?.split(',')[0]||'a tech company'}. The candidate wants ${extra?.split(',')[2]||'more'} but you offered ${extra?.split(',')[1]||'market rate'}. Start the negotiation naturally — be firm but professional. 3-4 sentences.`,
    auto_apply:   `You are a job application assistant. Write a complete, ready-to-submit job application for this role. Include: 1) A compelling cover letter (150 words), 2) A "Why this company" paragraph, 3) Key talking points for the application form. Make it specific to the JD.

Role: ${extra}
Resume: ${r}
JD: ${j||extra}`,
    linkedin_full:`Transform this LinkedIn profile into a recruiter magnet. Return JSON ONLY: {"headline":"New headline under 220 chars optimized for search","about":"4-5 sentences - hook + value prop + skills + CTA","experience":[{"role":"Role title","bullets":["Achievement bullet 1","Achievement bullet 2"]}],"skills":["Top skill 1","Top skill 2","Top skill 3","Top skill 4","Top skill 5"],"summary":"2-sentence personal brand statement","featuredPost":"Topic for a viral LinkedIn post","profileTips":["Tip to get 10x more recruiter views","Tip 2","Tip 3"]}

Profile/Resume:
${r||extra}`,
    followup:     `Write a professional interview follow-up email to ${extra||'the interviewer'}. Format: Subject + email body under 120 words. Thank them specifically, reiterate 1 key strength, express enthusiasm.

Context: ${extra}
Resume: ${r.slice(0,300)}`,
    company:     `Research this company. Return JSON ONLY:\n{"overview":"2 sentences","culture":"1 sentence","interviewProcess":"2 sentences","pros":["P1"],"cons":["C1"],"tipForFreshers":"1 tip","salaryRange":"range"}\n\nCompany: ${extra||j}\nRole: ${jd||'Software Engineer'}`,
    rewrite:     `You are an expert resume writer. Completely rewrite this resume for the role "${extra||'Software Engineer'}". Make it ATS-optimised, quantified, strong action verbs. Return ONLY the rewritten resume text — no explanations.\n\nOriginal Resume:\n${r}`,
    hr_call:     `You are an HR screener at ${extra||'a tech company'}. Start the screening call: greet the candidate warmly, ask "Tell me about yourself", then follow up based on their resume. Keep it realistic, 3-4 sentences.\n\nCandidate Resume:\n${r}`,
    visa:        `Visa & relocation guide for a CS professional. Return JSON ONLY:\n{"topCountries":[{"country":"Canada","visa":"Express Entry","difficulty":"Medium","salaryRange":"$70k-$95k CAD","techScene":"Strong","timeToLand":"6-12 months","tips":["Tip1"]}],"summary":"2 sentences","bestPickForFreshers":"Country name + reason"}\n\nSkills: ${extra||r.slice(0,300)}`,
    referral_gen:`Write a referral request message to ${extra||'a contact'}. Format: Subject line + email body. Under 150 words. Mention the specific role, 1 genuine compliment about their work/company, your key skills. End with a clear ask.\n\nYour resume background:\n${r}`,
  }
  return p[tool] || `Help with ${tool}. Resume: ${r}. Context: ${j||extra}`
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AIPage() {
  const [tool, setTool]             = useState('score')
  const [resume, setResume]         = useState('')
  const [jd, setJd]                 = useState('')
  const [extra, setExtra]           = useState('')
  const [result, setResult]         = useState<string|null>(null)
  const [parsed, setParsed]         = useState<any>(null)
  const [loading, setLoading]       = useState(false)
  const [chat, setChat]             = useState<{role:string;text:string}[]>([])
  const [chatInput, setChatInput]   = useState('')
  const [activeGroup, setActiveGroup] = useState('Resume')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfName, setPdfName]       = useState('')
  const [aiReady, setAiReady]       = useState<boolean|null>(null)
  const [initDone, setInitDone]     = useState(false)
  const chatRef   = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  // ── Init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('tl_resume')
    if (saved) setResume(saved)
    // Check server-side AI availability (reads GROQ_API_KEY from .env)
    fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages:[{role:'user',content:'hi'}], max_tokens:5 })
    })
      .then(r => r.json())
      .then(d => setAiReady(d.choices ? true : !String(d.error||'').includes('GROQ_API_KEY') ? true : false))
      .catch(() => setAiReady(false))
      .finally(() => setInitDone(true))
  }, [])

  useEffect(() => { setResult(null); setParsed(null); setChat([]) }, [tool])
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [chat])

  // ── PDF upload → /api/parse-resume ──────────────────────────────────────
  async function uploadPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) { alert('Please select a .pdf file'); return }
    setPdfLoading(true); setPdfName(file.name)
    try {
      const form = new FormData()
      form.append('file', file)
      const res  = await fetch('/api/parse-resume', { method:'POST', body:form })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResume(data.text)
      localStorage.setItem('tl_resume', data.text)
      const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if (!b.includes('resume_pdf')) localStorage.setItem('tl_badges', JSON.stringify([...b,'resume_pdf']))
      alert(`✅ Resume extracted — ${data.chars} characters from "${file.name}"`)
    } catch (err: any) {
      alert(`❌ ${err.message}`)
    }
    setPdfLoading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── AI call → /api/ai (server-side, no key in browser) ─────────────────
  async function callAI(messages: {role:string;content:string}[], max_tokens = 1500) {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, max_tokens }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.choices?.[0]?.message?.content || ''
  }

  // ── Run tool ────────────────────────────────────────────────────────────
  async function run() {
    if (!resume && !['jd','post','dream','company','path'].includes(tool)) {
      setResult('⚠️ Upload your resume PDF first (or paste text below).')
      return
    }
    setLoading(true); setResult(null); setParsed(null)
    const isJSON = !['cover','cold','post','salary','mock','rewrite','hr_call','referral_gen','followup','negotiate','auto_apply'].includes(tool)
    const sys = isJSON
      ? 'You are an expert career advisor. Return ONLY valid JSON — no markdown, no backticks, no extra text.'
      : 'You are an expert career advisor. Be direct, specific, and genuinely helpful.'
    try {
      const text = await callAI([
        { role:'system', content:sys },
        { role:'user',   content:buildPrompt(tool, resume, jd, extra) }
      ])
      if (tool === 'mock' || tool === 'hr_call' || tool === 'negotiate') {
        setChat([{ role:'ai', text }])
      } else if (isJSON) {
        try { setParsed(JSON.parse(text.replace(/```json|```/g,'').trim())) }
        catch { setResult(text) }
      } else {
        setResult(text)
      }
      addXP(10)
    } catch (e: any) { setResult(`❌ ${e.message}`) }
    setLoading(false)
  }

  // ── Mock interview chat ─────────────────────────────────────────────────
  async function sendChat() {
    if (!chatInput.trim()) return
    const userMsg = chatInput; setChatInput('')
    const newChat = [...chat, { role:'user', text:userMsg }]
    setChat(newChat); setLoading(true)
    try {
      const history = newChat.map(m => ({ role:m.role==='ai'?'assistant':'user', content:m.text }))
      const text = await callAI([
        { role:'system', content: tool==='negotiate' ? `You are an HR negotiator. Continue the salary negotiation naturally. Be firm on budget but open to perks. Context: ${extra}` : tool==='hr_call' ? `You are a professional HR screener at ${extra||'a tech company'}. Continue the HR screening call naturally.` : `You are a ${extra||'Software Engineer'} interviewer. Continue naturally.` },
        { role:'user', content:buildPrompt('mock', resume, jd, extra) },
        ...history.slice(1)
      ])
      setChat(p => [...p, { role:'ai', text }])
    } catch (e: any) { setChat(p => [...p, { role:'ai', text:`Error: ${e.message}` }]) }
    setLoading(false)
  }

  function addXP(n: number) {
    localStorage.setItem('tl_xp', String(parseInt(localStorage.getItem('tl_xp')||'0') + n))
    const ac = parseInt(localStorage.getItem('tl_ai_count')||'0') + 1
    localStorage.setItem('tl_ai_count', String(ac))
    if (ac >= 5) {
      const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if (!b.includes('ai_master')) localStorage.setItem('tl_badges', JSON.stringify([...b,'ai_master']))
    }
  }

  const current    = TOOLS.find(t => t.id === tool)!
  const groupTools = TOOLS.filter(t => t.group === activeGroup)

  // ── JSON result renderer ────────────────────────────────────────────────
  function renderJSON() {
    if (!parsed) return null
    switch (tool) {
      case 'score': return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="font-display font-extrabold text-6xl text-cyan-400">{parsed.totalScore}</div>
            <div className="text-sm text-[var(--t2)] mt-1">out of 100</div>
            <div className="text-sm mt-2">{parsed.verdict}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {parsed.breakdown && Object.entries(parsed.breakdown).map(([k,v]) => {
              const max = parsed.maxScores?.[k]||20; const pct = Math.round(Number(v)/Number(max)*100)
              return (
                <div key={k} className="bg-[var(--el)] rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="capitalize text-[var(--t2)]">{k}</span>
                    <span className="font-mono text-cyan-400">{String(v)}/{String(max)}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--card)] rounded-full">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${pct}%`}}/>
                  </div>
                </div>
              )
            })}
          </div>
          {parsed.strengths?.length>0 && <div><div className="text-xs font-semibold text-green-400 mb-1">✅ Strengths</div>{parsed.strengths.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
          {parsed.improvements?.length>0 && <div><div className="text-xs font-semibold text-yellow-400 mb-1">⚠️ Improvements</div>{parsed.improvements.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
        </div>
      )
      case 'match': return (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="font-display font-extrabold text-5xl text-cyan-400">{parsed.matchScore}%</div>
            <div className="text-sm text-[var(--t2)]">{parsed.verdict}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs font-semibold text-green-400 mb-1">✅ Matched</div>{(parsed.matchedSkills||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>
            <div><div className="text-xs font-semibold text-red-400 mb-1">❌ Missing</div>{(parsed.missingSkills||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>
          </div>
          {parsed.improvements?.length>0 && <div><div className="text-xs font-semibold text-yellow-400 mb-1">💡 To Improve</div>{parsed.improvements.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
        </div>
      )
      case 'ats': return (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className={`font-display font-extrabold text-4xl ${parsed.score>=70?'text-green-400':parsed.score>=50?'text-yellow-400':'text-red-400'}`}>{parsed.score}/100</div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-lg ${parsed.score>=70?'bg-green-500/10 text-green-400':'bg-yellow-500/10 text-yellow-400'}`}>{parsed.verdict}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs font-semibold text-green-400 mb-1">✅ Present</div>{(parsed.presentKeywords||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>
            <div><div className="text-xs font-semibold text-red-400 mb-1">❌ Missing</div>{(parsed.missingKeywords||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>
          </div>
          {parsed.suggestions?.length>0 && <div><div className="text-xs font-semibold text-cyan-400 mb-1">💡 Suggestions</div>{parsed.suggestions.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
        </div>
      )
      case 'interview': return (
        <div className="space-y-4">
          {[['🔧 Technical',parsed.technical],['🧠 Behavioral',parsed.behavioral],['🎯 Role Specific',parsed.roleSpecific]].map(([label,qs])=>
            Array.isArray(qs)&&qs.length>0?(
              <div key={String(label)}><div className="text-xs font-semibold text-cyan-400 mb-2">{String(label)}</div>
                {qs.map((q:any,i:number)=>(
                  <div key={i} className="bg-[var(--el)] rounded-xl p-3 mb-2">
                    <div className="text-sm font-semibold mb-1">{q.q}</div>
                    {q.hint&&<div className="text-xs text-[var(--t2)]">💡 {q.hint}</div>}
                  </div>
                ))}
              </div>
            ):null
          )}
          {parsed.questionsToAsk?.length>0&&<div><div className="text-xs font-semibold text-purple-400 mb-2">❓ Ask Them</div>{parsed.questionsToAsk.map((q:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {q}</div>)}</div>}
        </div>
      )
      case 'jd': return (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${parsed.difficulty==='Hard'?'bg-red-500/10 text-red-400':parsed.difficulty==='Easy'?'bg-green-500/10 text-green-400':'bg-yellow-500/10 text-yellow-400'}`}>⚡ {parsed.difficulty}</span>
            {parsed.salaryEstimate&&<span className="text-xs font-semibold text-green-400">{parsed.salaryEstimate}</span>}
          </div>
          {[['🟢 Green Flags',parsed.greenFlags,'text-green-400'],['🔴 Red Flags',parsed.redFlags,'text-red-400'],['🏢 Culture Hints',parsed.cultureHints,'text-purple-400'],['⚡ Required Skills',parsed.requiredSkills,'text-cyan-400'],['💡 Interview Tips',parsed.interviewTips,'text-yellow-400']].map(([l,items,color])=>
            Array.isArray(items)&&items.length>0?(<div key={String(l)}><div className={`text-xs font-semibold ${color} mb-1`}>{String(l)}</div>{(items as string[]).map((s,i)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>):null
          )}
        </div>
      )
      case 'roadmap': return (
        <div className="space-y-3">
          {(parsed.weeks||[]).map((w:any,i:number)=>(
            <div key={i} className="bg-[var(--el)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">{w.week}</div>
                <div className="font-semibold text-sm">{w.title}</div>
              </div>
              {w.tasks?.map((t:string,j:number)=><div key={j} className="text-xs text-[var(--t2)] py-0.5">• {t}</div>)}
              {w.milestone&&<div className="text-xs text-green-400 mt-2">🏁 {w.milestone}</div>}
              {w.resources?.[0]&&<div className="text-xs text-purple-400 mt-1">📚 {w.resources[0]}</div>}
            </div>
          ))}
        </div>
      )
      case 'path': return (
        <div className="space-y-3">
          {(parsed.years||[]).map((y:any,i:number)=>(
            <div key={i} className="bg-[var(--el)] rounded-xl p-4 border-l-2 border-cyan-500/40">
              <div className="font-semibold text-sm text-cyan-400">{y.year}</div>
              <div className="font-bold text-base mt-0.5">{y.title}</div>
              {y.salaries&&<div className="flex gap-3 mt-1 text-xs flex-wrap">{y.salaries.india&&<span className="text-green-400">{y.salaries.india}</span>}{y.salaries.us&&<span className="text-blue-400">{y.salaries.us}</span>}</div>}
              {y.keySkills?.length>0&&<div className="flex flex-wrap gap-1 mt-2">{y.keySkills.map((s:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--bdr)] text-[var(--t2)]">{s}</span>)}</div>}
              {y.milestone&&<div className="text-xs text-yellow-400 mt-2">🏁 {y.milestone}</div>}
            </div>
          ))}
        </div>
      )
      case 'dream': return (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-cyan-400">Target: {parsed.targetCompanies}</div>
          {(parsed.months||[]).map((m:any,i:number)=>(
            <div key={i} className="bg-[var(--el)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">M{m.month}</div>
                <div><div className="font-semibold text-sm">{m.title}</div><div className="text-xs text-[var(--t2)]">{m.focus}</div></div>
              </div>
              {m.tasks?.map((t:string,j:number)=><div key={j} className="text-xs text-[var(--t2)] py-0.5">• {t}</div>)}
              {m.checkpoint&&<div className="text-xs text-green-400 mt-2">✅ {m.checkpoint}</div>}
            </div>
          ))}
        </div>
      )
      case 'linkedin_opt': return (
        <div className="space-y-3">
          {parsed.headline&&<div className="bg-[var(--el)] rounded-xl p-4"><div className="text-xs font-semibold text-cyan-400 mb-1">📌 Headline</div><div className="text-sm font-semibold">{parsed.headline}</div></div>}
          {parsed.about&&<div className="bg-[var(--el)] rounded-xl p-4"><div className="text-xs font-semibold text-cyan-400 mb-1">📝 About</div><div className="text-sm text-[var(--t2)] leading-relaxed">{parsed.about}</div></div>}
          {parsed.topSkills?.length>0&&<div><div className="text-xs font-semibold text-purple-400 mb-2">⭐ Top Skills</div><div className="flex flex-wrap gap-1">{parsed.topSkills.map((s:string,i:number)=><span key={i} className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">{s}</span>)}</div></div>}
          {parsed.tips?.length>0&&<div><div className="text-xs font-semibold text-yellow-400 mb-1">💡 Tips</div>{parsed.tips.map((t:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {t}</div>)}</div>}
          {parsed.keywords?.length>0&&<div><div className="text-xs font-semibold text-green-400 mb-1">🔑 Keywords</div><div className="text-xs text-[var(--t2)]">{parsed.keywords.join(' · ')}</div></div>}
        </div>
      )
      case 'skillgap': return (
        <div className="space-y-3">
          <div className="text-sm text-[var(--t2)]">{parsed.summary}</div>
          {parsed.presentSkills?.length>0&&<div><div className="text-xs font-semibold text-green-400 mb-2">✅ Current Skills</div>
            {parsed.presentSkills.map((s:any,i:number)=>(
              <div key={i} className="flex items-center gap-3 mb-1.5">
                <div className="text-xs text-[var(--t2)] w-24">{s.skill}</div>
                <div className="flex-1 h-1.5 bg-[var(--el)] rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width:`${s.level}%`}}/></div>
                <div className="text-xs text-green-400 w-8">{s.level}%</div>
              </div>
            ))}
          </div>}
          {parsed.missingSkills?.length>0&&<div><div className="text-xs font-semibold text-red-400 mb-2">❌ To Learn</div>
            {parsed.missingSkills.map((s:any,i:number)=>(
              <div key={i} className="bg-[var(--el)] rounded-xl p-3 mb-2">
                <div className="flex justify-between text-sm"><span className="font-semibold">{s.skill}</span><span className="text-red-400 text-xs">{s.demand}% demand</span></div>
                <div className="text-xs text-[var(--t2)] mt-1">⏱ {s.learnTime}</div>
              </div>
            ))}
          </div>}
          {parsed.quickWins?.length>0&&<div><div className="text-xs font-semibold text-cyan-400 mb-1">⚡ Quick Wins</div>{parsed.quickWins.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
        </div>
      )
      case 'company': return (
        <div className="space-y-3">
          {[['📊 Overview',parsed.overview],['🏢 Culture',parsed.culture],['🎤 Interview Process',parsed.interviewProcess],['💰 Salary Range',parsed.salaryRange]].map(([l,v])=>
            v?<div key={String(l)} className="bg-[var(--el)] rounded-xl p-3"><div className="text-xs font-semibold text-cyan-400 mb-1">{String(l)}</div><div className="text-sm text-[var(--t2)]">{String(v)}</div></div>:null
          )}
          <div className="grid grid-cols-2 gap-3">
            {parsed.pros?.length>0&&<div><div className="text-xs font-semibold text-green-400 mb-1">👍 Pros</div>{parsed.pros.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
            {parsed.cons?.length>0&&<div><div className="text-xs font-semibold text-red-400 mb-1">👎 Cons</div>{parsed.cons.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
          </div>
          {parsed.tipForFreshers&&<div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3"><div className="text-xs font-semibold text-yellow-400 mb-1">💡 Tip for Freshers</div><div className="text-sm">{parsed.tipForFreshers}</div></div>}
        </div>
      )
      case 'linkedin_full': return (
        <div className="space-y-4">
          {parsed.headline&&<div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4"><div className="text-xs font-semibold text-blue-400 mb-1">📌 Headline</div><div className="text-sm font-semibold">{parsed.headline}</div></div>}
          {parsed.about&&<div className="bg-[var(--el)] rounded-xl p-4"><div className="text-xs font-semibold text-cyan-400 mb-1">📝 About Section</div><div className="text-sm text-[var(--t2)] leading-relaxed">{parsed.about}</div></div>}
          {parsed.summary&&<div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-3"><div className="text-xs font-semibold text-purple-400 mb-1">⭐ Personal Brand</div><div className="text-sm">{parsed.summary}</div></div>}
          {parsed.skills?.length>0&&<div><div className="text-xs font-semibold text-green-400 mb-2">🛠️ Top Skills to List</div><div className="flex flex-wrap gap-1.5">{parsed.skills.map((s:string,i:number)=><span key={i} className="text-xs px-3 py-1 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">{s}</span>)}</div></div>}
          {parsed.featuredPost&&<div className="bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-3"><div className="text-xs font-semibold text-yellow-400 mb-1">📤 Write This Post (Go Viral)</div><div className="text-sm">{parsed.featuredPost}</div></div>}
          {parsed.profileTips?.length>0&&<div><div className="text-xs font-semibold text-cyan-400 mb-2">🚀 Profile Optimization Tips</div>{parsed.profileTips.map((t:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-1">→ {t}</div>)}</div>}
        </div>
      )
      case 'answer_grade': return (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`font-display font-extrabold text-5xl ${parsed.score>=80?'text-green-400':parsed.score>=60?'text-yellow-400':'text-red-400'}`}>{parsed.score}/100</div>
            <div className="text-sm text-[var(--t2)]">{parsed.verdict}</div>
          </div>
          {parsed.starFormat&&<div className="grid grid-cols-2 gap-2">{Object.entries(parsed.starFormat).map(([k,v])=>(
            <div key={k} className="bg-[var(--el)] rounded-xl p-3">
              <div className="flex justify-between text-xs mb-1"><span className="capitalize font-semibold">{k}</span><span className="font-mono text-cyan-400">{String(v)}%</span></div>
              <div className="h-1.5 bg-[var(--card)] rounded-full"><div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${v}%`}}/></div>
            </div>
          ))}</div>}
          {parsed.strengths?.length>0&&<div><div className="text-xs font-semibold text-green-400 mb-1">✅ Strengths</div>{parsed.strengths.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
          {parsed.improvements?.length>0&&<div><div className="text-xs font-semibold text-yellow-400 mb-1">⚠️ Improve</div>{parsed.improvements.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
          {parsed.modelAnswer&&<div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-4"><div className="text-xs font-semibold text-cyan-400 mb-1">💡 Model Answer</div><div className="text-sm text-[var(--t)] leading-relaxed">{parsed.modelAnswer}</div></div>}
        </div>
      )
      case 'visa': return (
        <div className="space-y-3">
          <div className="text-sm text-[var(--t2)] mb-2">{parsed.summary}</div>
          {parsed.bestPickForFreshers && (
            <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-3">
              <div className="text-xs font-semibold text-green-400 mb-1">🏆 Best Pick for Freshers</div>
              <div className="text-sm">{parsed.bestPickForFreshers}</div>
            </div>
          )}
          {(parsed.topCountries||[]).map((c:any,i:number) => (
            <div key={i} className="bg-[var(--el)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-sm">{c.country}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.difficulty==='Easy'?'bg-green-500/10 text-green-400':c.difficulty==='Hard'?'bg-red-500/10 text-red-400':'bg-yellow-500/10 text-yellow-400'}`}>{c.difficulty}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div><span className="text-[var(--t3)]">Visa: </span><span className="text-cyan-400">{c.visa}</span></div>
                <div><span className="text-[var(--t3)]">Salary: </span><span className="text-green-400">{c.salaryRange}</span></div>
                <div><span className="text-[var(--t3)]">Scene: </span><span>{c.techScene}</span></div>
                <div><span className="text-[var(--t3)]">Timeline: </span><span>{c.timeToLand}</span></div>
              </div>
              {c.tips?.length>0 && c.tips.map((t:string,j:number)=><div key={j} className="text-xs text-[var(--t2)] py-0.5">• {t}</div>)}
            </div>
          ))}
        </div>
      )
      case 'github_review': return (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="font-display font-extrabold text-5xl text-cyan-400">{parsed.overallScore}</div>
            <div className="text-sm text-[var(--t2)]">{parsed.verdict}</div>
          </div>
          {parsed.profileStrength&&<div className="grid grid-cols-2 gap-2">{Object.entries(parsed.profileStrength).map(([k,v])=>(
            <div key={k} className="bg-[var(--el)] rounded-xl p-3">
              <div className="flex justify-between text-xs mb-1"><span className="capitalize text-[var(--t2)]">{k}</span><span className="font-mono text-cyan-400">{String(v)}%</span></div>
              <div className="h-1.5 bg-[var(--card)] rounded-full"><div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{width:`${v}%`}}/></div>
            </div>
          ))}</div>}
          {parsed.topRepos?.length>0&&<div><div className="text-xs font-semibold text-cyan-400 mb-2">📁 Top Repos</div>{parsed.topRepos.map((r:any,i:number)=><div key={i} className="bg-[var(--el)] rounded-xl p-3 mb-2"><div className="flex justify-between"><span className="text-sm font-semibold">{r.name}</span><span className="text-xs text-green-400">{r.strength}</span></div><div className="text-xs text-[var(--t2)] mt-1">💡 {r.suggestion}</div></div>)}</div>}
          {parsed.improvements?.length>0&&<div><div className="text-xs font-semibold text-yellow-400 mb-1">⚠️ Improve</div>{parsed.improvements.map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-0.5">• {s}</div>)}</div>}
        </div>
      )
      case 'offer_compare': return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(parsed.offers||[]).map((o:any,i:number)=>(
              <div key={i} className={`bg-[var(--el)] rounded-xl p-4 border ${o.company===parsed.finalPick?'border-cyan-500/40':'border-[var(--bdr)]'}`}>
                {o.company===parsed.finalPick&&<div className="text-[10px] text-cyan-400 font-bold mb-1">⭐ RECOMMENDED</div>}
                <div className="font-bold text-sm">{o.company}</div>
                <div className="text-xs text-[var(--t2)] mt-0.5">{o.role}</div>
                <div className="text-sm font-mono text-green-400 mt-1">{o.salary}</div>
                <div className="text-xs font-bold text-cyan-400 mt-1">Score: {o.score}/100</div>
                {o.pros?.length>0&&<div className="mt-2">{o.pros.map((p:string,j:number)=><div key={j} className="text-[10px] text-green-400">✅ {p}</div>)}</div>}
                {o.cons?.length>0&&<div className="mt-1">{o.cons.map((c:string,j:number)=><div key={j} className="text-[10px] text-red-400">❌ {c}</div>)}</div>}
              </div>
            ))}
          </div>
          <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-xl p-4"><div className="text-xs font-semibold text-cyan-400 mb-1">🏆 Verdict</div><div className="text-sm">{parsed.verdict}</div><div className="text-xs text-[var(--t2)] mt-2">{parsed.reasoning}</div></div>
        </div>
      )
      case 'portfolio': return (
        <div className="space-y-3">
          {(parsed.projects||[]).map((p:any,i:number)=>(
            <div key={i} className="bg-[var(--el)] rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="font-bold text-sm">#{i+1} {p.name}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.difficulty==='Hard'?'bg-red-500/10 text-red-400':p.difficulty==='Easy'?'bg-green-500/10 text-green-400':'bg-yellow-500/10 text-yellow-400'}`}>{p.difficulty}</span>
              </div>
              <div className="text-xs text-[var(--t2)] mt-1">{p.description}</div>
              <div className="flex flex-wrap gap-1 mt-2">{p.techStack?.map((t:string,j:number)=><span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card)] border border-[var(--bdr)] text-cyan-400">{t}</span>)}</div>
              <div className="mt-2 text-xs text-purple-400">⏱ {p.timeToComplete}</div>
              {p.impactStatement&&<div className="mt-1 text-xs text-green-400">📈 {p.impactStatement}</div>}
              {p.githubTips&&<div className="mt-1 text-xs text-yellow-400">💡 README: {p.githubTips}</div>}
            </div>
          ))}
        </div>
      )
      default: return <pre className="text-xs text-[var(--t2)] whitespace-pre-wrap overflow-auto max-h-80">{JSON.stringify(parsed,null,2)}</pre>
    }
  }

  // ── Init skeleton ───────────────────────────────────────────────────────
  if (!initDone) return (
    <div className="max-w-6xl mx-auto space-y-5 animate-pulse">
      <div className="h-9 w-40 bg-[var(--el)] rounded-xl"/>
      <div className="h-16 bg-[var(--el)] rounded-2xl"/>
      <div className="h-32 bg-[var(--el)] rounded-2xl"/>
      <div className="grid md:grid-cols-4 gap-5">
        <div className="h-96 bg-[var(--el)] rounded-2xl"/>
        <div className="md:col-span-3 h-96 bg-[var(--el)] rounded-2xl"/>
      </div>
    </div>
  )

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-3xl">🤖 AI Suite</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">16 AI tools · server-side Groq · no API key needed in browser</p>
      </div>

      {/* AI status banner */}
      {aiReady === false && (
        <div className="bg-red-500/8 border border-red-500/25 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-red-300 mb-1">Groq API key not configured</div>
            <div className="text-xs text-red-300/70">
              Add <code className="bg-red-500/15 px-1.5 py-0.5 rounded font-mono">GROQ_API_KEY=gsk_...</code> to your{' '}
              <code className="bg-red-500/15 px-1.5 py-0.5 rounded font-mono">.env.local</code>, then restart the dev server.
              Get a free key at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline hover:text-red-200">console.groq.com</a>
            </div>
          </div>
        </div>
      )}
      {aiReady === true && (
        <div className="bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-green-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>
          AI ready · Groq connected · API key is secure in .env (never sent to browser)
        </div>
      )}

      {/* Resume section — PDF upload + paste fallback */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-sm">📄 Your Resume</div>
          {resume
            ? <div className="text-xs text-green-400 font-semibold">✅ Loaded · {resume.length} chars</div>
            : <div className="text-xs text-yellow-400">Upload PDF or paste below</div>
          }
        </div>

        {/* PDF button */}
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept=".pdf" onChange={uploadPDF} className="hidden"/>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={pdfLoading}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/18 text-cyan-400 border border-cyan-500/25 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
          >
            {pdfLoading ? '⏳ Parsing PDF...' : '📎 Upload Resume PDF'}
          </button>
          {pdfName
            ? <span className="text-xs text-green-400">✅ {pdfName}</span>
            : <span className="text-xs text-[var(--t3)]">Reads directly from your local device — no cloud upload</span>
          }
        </div>

        {/* Paste fallback */}
        <div>
          <div className="text-xs text-[var(--t3)] mb-1.5">Or paste resume text (fallback if PDF extraction fails)</div>
          <textarea
            value={resume}
            onChange={e => { setResume(e.target.value); localStorage.setItem('tl_resume', e.target.value) }}
            rows={resume ? 3 : 4}
            placeholder="Paste your resume text here..."
            className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        {/* Tool selector */}
        <div className="md:col-span-1 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-3">
          <div className="flex gap-1 mb-3 flex-wrap">
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all ${activeGroup===g?'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20':'text-[var(--t3)] hover:text-[var(--t2)]'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="space-y-0.5">
            {groupTools.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${tool===t.id?'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15':'hover:bg-[var(--el)] text-[var(--t2)] hover:text-white'}`}>
                <span className="text-sm w-5 text-center">{t.emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{t.name}</div>
                  <div className="text-[10px] text-[var(--t3)] truncate">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{current.emoji}</span>
              <div>
                <div className="font-display font-bold text-lg">{current.name}</div>
                <div className="text-xs text-[var(--t2)]">{current.desc}</div>
              </div>
            </div>

            {NEEDS_JD.includes(tool) && (
              <div className="mb-3">
                <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">Job Description</label>
                <textarea value={jd} onChange={e => setJd(e.target.value)} rows={3}
                  placeholder="Paste the job description here..."
                  className="mt-1.5 w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
              </div>
            )}

            {NEEDS_EXTRA[tool] && (
              <div className="mb-3">
                <label className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider">{NEEDS_EXTRA[tool]}</label>
                <input value={extra} onChange={e => setExtra(e.target.value)} placeholder={NEEDS_EXTRA[tool]}
                  className="mt-1.5 w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
              </div>
            )}

            <button onClick={run} disabled={loading || aiReady === false}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.3)] transition-all disabled:opacity-50">
              {loading ? '⏳ Generating...' : aiReady===false ? '⚠️ Configure GROQ_API_KEY in .env.local' : `Run ${current.name} →`}
            </button>
          </div>

          {/* Results */}
          {(result || parsed || chat.length > 0 || loading) && (
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Result</div>
                {(result||parsed) && (
                  <button onClick={() => navigator.clipboard.writeText(result||JSON.stringify(parsed,null,2))}
                    className="text-xs text-[var(--t3)] hover:text-cyan-400 transition-colors">Copy ↗</button>
                )}
              </div>

              {/* Mock interview / HR call chat */}
              {(tool === 'mock' || tool === 'hr_call') && (
                <>
                  <div ref={chatRef} className="space-y-3 max-h-72 overflow-y-auto mb-3 pr-1">
                    {chat.map((m,i) => (
                      <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role==='user'?'bg-cyan-500/20 text-cyan-100':'bg-[var(--el)]'}`}>
                          {m.role==='ai'&&<div className="text-[10px] text-cyan-400 font-semibold mb-1">🎤 Interviewer</div>}
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {loading&&<div className="flex justify-start"><div className="bg-[var(--el)] rounded-2xl px-4 py-3 text-sm text-[var(--t3)] animate-pulse">Thinking...</div></div>}
                  </div>
                  <div className="flex gap-2">
                    <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendChat()}
                      placeholder="Type your answer... (Enter to send)"
                      className="flex-1 bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50"/>
                    <button onClick={sendChat} disabled={loading}
                      className="bg-cyan-500 text-white font-bold px-4 rounded-xl text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50">Send</button>
                  </div>
                </>
              )}

              {/* JSON result */}
              {parsed && tool !== 'mock' && (
                <div className="overflow-y-auto max-h-[520px]">{renderJSON()}</div>
              )}

              {/* Text result */}
              {result && (
                <div className="bg-[var(--el)] rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
