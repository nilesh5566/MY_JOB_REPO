'use client'
import { useState, useEffect, useRef } from 'react'

type ResumeData = {
  name: string; email: string; phone: string; location: string
  linkedin: string; github: string; summary: string; skills: string
  experience: { company: string; role: string; period: string; bullets: string }[]
  education:  { school: string; degree: string; year: string; gpa: string }[]
  projects:   { name: string; tech: string; desc: string; url: string }[]
}

const BLANK: ResumeData = {
  name:'', email:'', phone:'', location:'', linkedin:'', github:'', summary:'', skills:'',
  experience: [{ company:'', role:'', period:'', bullets:'' }],
  education:  [{ school:'', degree:'', year:'', gpa:'' }],
  projects:   [{ name:'', tech:'', desc:'', url:'' }],
}

const STEPS = ['Personal', 'Skills', 'Experience', 'Education', 'Projects', 'Preview']

function buildHTML(d: ResumeData): string {
  const skills = d.skills.split(',').map(s => s.trim()).filter(Boolean)
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:13px;color:#111;line-height:1.5;max-width:780px;margin:0 auto;padding:28px 32px}
h1{font-size:22px;font-weight:700}
.contact{color:#555;font-size:12px;margin-top:3px}
.contact a{color:#0066cc;text-decoration:none}
hr{border:none;border-top:1.5px solid #222;margin:10px 0 6px}
h2{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}
.row{display:flex;justify-content:space-between;align-items:baseline}
.co{font-weight:700;font-size:13px}
.role{font-style:italic;color:#444;font-size:12px}
.date{font-size:11px;color:#777}
ul{padding-left:16px;margin-top:3px}
li{font-size:12px;color:#333;margin-bottom:2px}
.tags{display:flex;flex-wrap:wrap;gap:5px}
.tag{background:#f0f0f0;border-radius:3px;padding:2px 7px;font-size:11px;font-weight:600}
.sec{margin-bottom:12px}
</style></head><body>
<h1>${d.name||'Your Name'}</h1>
<div class="contact">${[d.email,d.phone,d.location].filter(Boolean).join(' · ')}${d.linkedin?` · <a href="${d.linkedin}">LinkedIn</a>`:''}${d.github?` · <a href="${d.github}">GitHub</a>`:''}</div>
${d.summary?`<p style="margin-top:7px;font-size:12px;color:#333">${d.summary}</p>`:''}
${skills.length?`<div class="sec"><hr><h2>Skills</h2><div class="tags">${skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>`:''}
${d.experience.some(e=>e.company)?`<div class="sec"><hr><h2>Experience</h2>${d.experience.filter(e=>e.company).map(e=>`<div style="margin-bottom:8px"><div class="row"><div><span class="co">${e.company}</span>${e.role?` — <span class="role">${e.role}</span>`:''}</div><span class="date">${e.period}</span></div>${e.bullets?`<ul>${e.bullets.split('\n').filter(Boolean).map(b=>`<li>${b.replace(/^[-•]\s*/,'')}</li>`).join('')}</ul>`:''}</div>`).join('')}</div>`:''}
${d.projects.some(p=>p.name)?`<div class="sec"><hr><h2>Projects</h2>${d.projects.filter(p=>p.name).map(p=>`<div style="margin-bottom:8px"><span class="co">${p.name}</span>${p.tech?` <span style="color:#0066cc;font-size:11px">| ${p.tech}</span>`:''}${p.url?` <a href="${p.url}" style="font-size:11px;color:#0066cc">[link]</a>`:''} ${p.desc?`<div style="font-size:12px;color:#333;margin-top:2px">${p.desc}</div>`:''}</div>`).join('')}</div>`:''}
${d.education.some(e=>e.school)?`<div class="sec"><hr><h2>Education</h2>${d.education.filter(e=>e.school).map(e=>`<div class="row"><div><span class="co">${e.school}</span>${e.degree?` — <span class="role">${e.degree}</span>`:''}</div><span class="date">${e.year}${e.gpa?` · GPA: ${e.gpa}`:''}</span></div>`).join('')}</div>`:''}
</body></html>`
}

export default function ResumePage() {
  const [step, setStep]       = useState(0)
  const [data, setData]       = useState<ResumeData>(BLANK)
  const [enhancing, setEnh]   = useState<number | null>(null)
  const [toast, setToast]     = useState('')
  const [pdfLoading, setPdf]  = useState(false)
  const [pdfName, setPdfName] = useState('')
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tl_resume_data')
    if (saved) { try { setData(JSON.parse(saved)) } catch {} }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (step === 5 && iframeRef.current) iframeRef.current.srcdoc = buildHTML(data)
  }, [step, data])

  function persist(d: ResumeData) {
    setData(d)
    localStorage.setItem('tl_resume_data', JSON.stringify(d))
    // also save plain text for AI tools
    localStorage.setItem('tl_resume',
      `${d.name}\n${d.email} ${d.phone}\n${d.location}\nSkills: ${d.skills}\n${d.summary}\n` +
      d.experience.filter(e=>e.company).map(e=>`${e.role} at ${e.company} (${e.period})\n${e.bullets}`).join('\n') +
      d.projects.filter(p=>p.name).map(p=>`Project: ${p.name} | ${p.tech}\n${p.desc}`).join('\n')
    )
  }

  function sf(k: keyof ResumeData, v: any) { persist({ ...data, [k]: v }) }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2600) }
  function addXP(n: number) { localStorage.setItem('tl_xp', String(parseInt(localStorage.getItem('tl_xp')||'0') + n)) }

  // PDF upload → /api/parse-resume
  async function uploadPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) { showToast('⚠️ Please select a .pdf file'); return }
    setPdf(true); setPdfName(file.name)
    try {
      const form = new FormData()
      form.append('file', file)
      const res  = await fetch('/api/parse-resume', { method: 'POST', body: form })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      // Try to pre-fill name/email from extracted text
      const text: string = json.text
      const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/)
      const lines = text.split(/\n|\r/).map((l: string) => l.trim()).filter(Boolean)
      const newData = { ...data }
      if (!newData.name && lines[0] && lines[0].length < 50) newData.name = lines[0]
      if (!newData.email && emailMatch) newData.email = emailMatch[0]
      // Store full text as resume for AI
      localStorage.setItem('tl_resume', text)
      const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if (!b.includes('resume_pdf')) localStorage.setItem('tl_badges', JSON.stringify([...b,'resume_pdf']))
      persist(newData)
      showToast(`✅ PDF parsed — ${json.chars} chars extracted. Review & edit below.`)
    } catch (err: any) {
      showToast(`❌ ${err.message}`)
    }
    setPdf(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function aiEnhance(i: number) {
    const exp = data.experience[i]
    if (!exp.role || !exp.company) { showToast('⚠️ Fill company & role first'); return }
    setEnh(i)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 400,
          messages: [{
            role: 'system', content: 'You are a resume expert. Return ONLY bullet points, one per line, starting with •'
          }, {
            role: 'user',
            content: `Rewrite these bullets for "${exp.role} at ${exp.company}" to be stronger, quantified, action-verb-led:\n\n${exp.bullets || '(no bullets yet — write 3 strong ones based on the role)'}`
          }]
        })
      })
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      const enhanced = d.choices?.[0]?.message?.content || ''
      const newExp = [...data.experience]
      newExp[i] = { ...newExp[i], bullets: enhanced }
      persist({ ...data, experience: newExp })
      addXP(10); showToast('✅ Bullets enhanced! +10 XP')
    } catch (err: any) { showToast(`❌ ${err.message}`) }
    setEnh(null)
  }

  function download() {
    const html = buildHTML(data)
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${data.name || 'resume'}-resume.html`; a.click()
    addXP(30)
    const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
    if (!b.includes('resume_built')) localStorage.setItem('tl_badges', JSON.stringify([...b,'resume_built']))
    showToast('✅ Downloaded! +30 XP')
  }

  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-48 bg-[var(--el)] rounded-xl" />
      <div className="h-12 bg-[var(--el)] rounded-2xl" />
      <div className="h-96 bg-[var(--el)] rounded-2xl" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div>
        <h1 className="font-display font-extrabold text-3xl">📄 Resume Builder</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Upload PDF to parse · or build from scratch · AI-enhanced bullets · HTML download</p>
      </div>

      {/* PDF Upload Banner */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
        <div className="text-sm font-semibold mb-3">📎 Upload Existing Resume (PDF)</div>
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept=".pdf" onChange={uploadPDF} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={pdfLoading}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
          >
            {pdfLoading ? '⏳ Parsing PDF...' : '📂 Choose PDF from Device'}
          </button>
          {pdfName && <span className="text-xs text-[var(--t2)]">📄 {pdfName}</span>}
          {!pdfName && <span className="text-xs text-[var(--t3)]">Supports standard PDF resumes — text is extracted and pre-filled below</span>}
        </div>
        {pdfLoading && (
          <div className="mt-3 h-1.5 bg-[var(--el)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse w-3/4" />
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <button onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${step === i ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : i < step ? 'text-green-400' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${step === i ? 'bg-cyan-500 text-white' : i < step ? 'bg-green-500 text-white' : 'bg-[var(--el)] text-[var(--t3)]'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {s}
            </button>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-[var(--bdr)] mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-6">

        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="font-display font-bold text-base">Personal Info</div>
            <div className="grid grid-cols-2 gap-3">
              {([['name','Full Name *','Aman Nayak'],['email','Email *','aman@email.com'],['phone','Phone','+91 9876543210'],['location','Location','Bangalore, India'],['linkedin','LinkedIn URL','linkedin.com/in/aman'],['github','GitHub URL','github.com/aman']] as [keyof ResumeData, string, string][]).map(([k, l, p]) => (
                <div key={k}>
                  <label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                  <input value={String(data[k]||'')} onChange={e => sf(k, e.target.value)} placeholder={p} className={inp} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-[var(--t2)] block mb-1">Professional Summary</label>
              <textarea value={data.summary} onChange={e => sf('summary', e.target.value)} rows={3}
                placeholder="CS fresher passionate about building scalable web apps with React and Node.js..."
                className={inp + ' resize-none'} />
            </div>
          </div>
        )}

        {/* Step 1: Skills */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="font-display font-bold text-base">Technical Skills</div>
            <div>
              <label className="text-xs text-[var(--t2)] block mb-1">Skills (comma-separated)</label>
              <textarea value={data.skills} onChange={e => sf('skills', e.target.value)} rows={4}
                placeholder="React, Node.js, Python, MongoDB, Docker, AWS, TypeScript, Git, SQL..."
                className={inp + ' resize-none'} />
              <p className="text-[10px] text-[var(--t3)] mt-1.5">Include all languages, frameworks, tools, and platforms. These appear as tags in your resume.</p>
            </div>
            {data.skills && (
              <div>
                <div className="text-xs text-[var(--t2)] mb-2">Preview:</div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base">Work Experience</div>
              <button onClick={() => sf('experience', [...data.experience, { company:'', role:'', period:'', bullets:'' }])}
                className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10">+ Add</button>
            </div>
            {data.experience.map((e, i) => (
              <div key={i} className="bg-[var(--el)] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--t2)]">Experience #{i + 1}</span>
                  {data.experience.length > 1 && (
                    <button onClick={() => sf('experience', data.experience.filter((_,j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Company</label>
                    <input value={e.company} onChange={ev => { const x=[...data.experience]; x[i]={...x[i],company:ev.target.value}; sf('experience',x) }} placeholder="Google" className={inp} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Role</label>
                    <input value={e.role} onChange={ev => { const x=[...data.experience]; x[i]={...x[i],role:ev.target.value}; sf('experience',x) }} placeholder="SDE Intern" className={inp} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Period</label>
                    <input value={e.period} onChange={ev => { const x=[...data.experience]; x[i]={...x[i],period:ev.target.value}; sf('experience',x) }} placeholder="Jun 2024 – Aug 2024" className={inp} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[var(--t3)]">Bullet Points (one per line)</label>
                    <button onClick={() => aiEnhance(i)} disabled={enhancing === i}
                      className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 disabled:opacity-60 transition-all">
                      {enhancing === i ? '⏳ AI Enhancing...' : '🤖 AI Enhance'}
                    </button>
                  </div>
                  <textarea value={e.bullets}
                    onChange={ev => { const x=[...data.experience]; x[i]={...x[i],bullets:ev.target.value}; sf('experience',x) }}
                    rows={4} placeholder={'• Built REST API serving 10k+ requests/day\n• Reduced load time 40% with Redis caching\n• Collaborated with 5-person team via Agile'}
                    className={inp + ' resize-none'} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Education */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base">Education</div>
              <button onClick={() => sf('education', [...data.education, { school:'', degree:'', year:'', gpa:'' }])}
                className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10">+ Add</button>
            </div>
            {data.education.map((e, i) => (
              <div key={i} className="bg-[var(--el)] rounded-xl p-4 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-[var(--t3)] block mb-1">School / College</label>
                  <input value={e.school} onChange={ev => { const x=[...data.education]; x[i]={...x[i],school:ev.target.value}; sf('education',x) }} placeholder="IIT Bombay" className={inp} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--t3)] block mb-1">Degree</label>
                  <input value={e.degree} onChange={ev => { const x=[...data.education]; x[i]={...x[i],degree:ev.target.value}; sf('education',x) }} placeholder="B.Tech Computer Science" className={inp} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--t3)] block mb-1">Year</label>
                  <input value={e.year} onChange={ev => { const x=[...data.education]; x[i]={...x[i],year:ev.target.value}; sf('education',x) }} placeholder="2021–2025" className={inp} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--t3)] block mb-1">GPA / %</label>
                  <input value={e.gpa} onChange={ev => { const x=[...data.education]; x[i]={...x[i],gpa:ev.target.value}; sf('education',x) }} placeholder="8.5/10" className={inp} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Projects */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base">Projects</div>
              <button onClick={() => sf('projects', [...data.projects, { name:'', tech:'', desc:'', url:'' }])}
                className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10">+ Add</button>
            </div>
            {data.projects.map((p, i) => (
              <div key={i} className="bg-[var(--el)] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--t2)]">Project #{i + 1}</span>
                  {data.projects.length > 1 && (
                    <button onClick={() => sf('projects', data.projects.filter((_,j) => j !== i))}
                      className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Project Name</label>
                    <input value={p.name} onChange={ev => { const x=[...data.projects]; x[i]={...x[i],name:ev.target.value}; sf('projects',x) }} placeholder="TalentLaunch" className={inp} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Tech Stack</label>
                    <input value={p.tech} onChange={ev => { const x=[...data.projects]; x[i]={...x[i],tech:ev.target.value}; sf('projects',x) }} placeholder="React, Node.js, MongoDB" className={inp} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[var(--t3)] block mb-1">GitHub / Live URL</label>
                    <input value={p.url} onChange={ev => { const x=[...data.projects]; x[i]={...x[i],url:ev.target.value}; sf('projects',x) }} placeholder="github.com/you/project" className={inp} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[var(--t3)] block mb-1">Description</label>
                    <textarea value={p.desc} onChange={ev => { const x=[...data.projects]; x[i]={...x[i],desc:ev.target.value}; sf('projects',x) }}
                      rows={3} placeholder="Built a full-stack job search platform with AI resume scoring, used by 200+ students..."
                      className={inp + ' resize-none'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Preview */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-display font-bold text-base">Live Preview</div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(buildHTML(data))}
                  className="border border-[var(--bdr)] text-[var(--t2)] px-3 py-2 rounded-xl text-xs hover:border-[var(--bds)]">Copy HTML</button>
                <button onClick={download}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2 rounded-xl text-sm hover:shadow-[0_0_16px_rgba(0,220,255,0.3)]">
                  ⬇ Download .html
                </button>
              </div>
            </div>
            <div className="border border-[var(--bdr)] rounded-xl overflow-hidden bg-white" style={{ height: '620px' }}>
              <iframe ref={iframeRef} className="w-full h-full" title="Resume Preview" sandbox="allow-same-origin" />
            </div>
          </div>
        )}

        {/* Step nav */}
        <div className="flex justify-between mt-6 pt-5 border-t border-[var(--bdr)]">
          <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}
            className="px-5 py-2.5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)] disabled:opacity-40">
            ← Back
          </button>
          {step < 5
            ? <button onClick={() => setStep(p => p + 1)}
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-[0_0_16px_rgba(0,220,255,0.3)]">
                Next: {STEPS[step + 1]} →
              </button>
            : <button onClick={download}
                className="bg-gradient-to-r from-green-500 to-cyan-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                ⬇ Download Resume
              </button>
          }
        </div>
      </div>
    </div>
  )
}
