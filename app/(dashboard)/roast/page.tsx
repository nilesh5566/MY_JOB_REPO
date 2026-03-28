'use client'
import { useState, useEffect, useRef } from 'react'

export default function RoastPage(){
  const [resume,setResume]   = useState('')
  const [pdfLoading,setPdfLoading] = useState(false)
  const [roasting,setRoasting]     = useState(false)
  const [roast,setRoast]           = useState<any>(null)
  const [toast,setToast]           = useState('')
  const [copied,setCopied]         = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const saved = localStorage.getItem('tl_resume')
    if(saved) setResume(saved)
  },[])

  async function uploadPDF(e:React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]; if(!file) return
    setPdfLoading(true)
    const form = new FormData(); form.append('file',file)
    try{
      const res = await fetch('/api/parse-resume',{method:'POST',body:form})
      const d   = await res.json()
      if(d.error) throw new Error(d.error)
      setResume(d.text); localStorage.setItem('tl_resume',d.text)
      showToast(`✅ Resume loaded (${d.chars} chars)`)
    }catch(err:any){ showToast(`❌ ${err.message}`) }
    setPdfLoading(false)
    if(fileRef.current) fileRef.current.value=''
  }

  async function getRoasted(){
    if(!resume.trim()){ showToast('⚠️ Add your resume first!'); return }
    setRoasting(true); setRoast(null)
    try{
      const res = await fetch('/api/ai',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          max_tokens:1200,
          messages:[{
            role:'system',
            content:'You are a brutally honest (but secretly helpful) senior engineer reviewing resumes. Be savage with the roast but give real actionable fixes. Return ONLY valid JSON.'
          },{
            role:'user',
            content:`Roast this resume brutally but helpfully. Return JSON ONLY:
{"overallScore":42,"verdict":"One savage sentence verdict","roastLines":["Brutal roast line 1","Roast line 2","Roast line 3","Roast line 4","Roast line 5"],"seriousIssues":["Real issue 1","Real issue 2","Real issue 3"],"actualFixes":["Concrete fix 1","Concrete fix 2","Concrete fix 3"],"oneThingDoneWell":"The one thing that doesn't suck","recruitersThink":"What a recruiter actually thinks in 1 sentence"}

Resume:
${resume.slice(0,1200)}`
          }]
        })
      })
      const d = await res.json()
      if(d.error) throw new Error(d.error)
      const text = d.choices?.[0]?.message?.content||''
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setRoast(parsed)
      // XP
      localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+15))
    }catch(e:any){ showToast(`❌ ${e.message}`) }
    setRoasting(false)
  }

  function generateShareCard(){
    if(!roast) return
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return
    canvas.width=1200; canvas.height=630
    // Dark bg
    ctx.fillStyle='#05080f'; ctx.fillRect(0,0,1200,630)
    const g=ctx.createLinearGradient(0,0,1200,630)
    g.addColorStop(0,'rgba(239,68,68,0.1)'); g.addColorStop(1,'rgba(5,8,15,0)')
    ctx.fillStyle=g; ctx.fillRect(0,0,1200,630)
    // Border
    ctx.strokeStyle='rgba(239,68,68,0.4)'; ctx.lineWidth=2
    ctx.strokeRect(12,12,1176,606)
    // Header
    ctx.fillStyle='#ef4444'; ctx.font='bold 20px Arial'; ctx.textAlign='left'
    ctx.fillText('🔥 RESUME ROASTED · TalentLaunch',48,55)
    // Score circle
    const scoreColor=roast.overallScore>=70?'#22c55e':roast.overallScore>=50?'#f59e0b':'#ef4444'
    ctx.fillStyle=scoreColor; ctx.font='bold 96px Arial'; ctx.textAlign='center'
    ctx.fillText(String(roast.overallScore),140,300)
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='18px Arial'
    ctx.fillText('/100',140,335)
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='14px Arial'
    ctx.fillText('Resume Score',140,360)
    // Verdict
    ctx.fillStyle='#ffffff'; ctx.font='bold 28px Arial'; ctx.textAlign='left'
    const verdict=roast.verdict||''
    const words=verdict.split(' ')
    let line='',y=140,lineH=38
    words.forEach((w:string)=>{
      const test=line+w+' '
      if(ctx.measureText(test).width>680&&line){ ctx.fillText(line,260,y); line=w+' '; y+=lineH }
      else line=test
    })
    if(line)ctx.fillText(line,260,y)
    // Roast lines
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='16px Arial'
    ;(roast.roastLines||[]).slice(0,4).forEach((l:string,i:number)=>{
      ctx.fillText(`🔥 ${l.slice(0,80)}`,260,230+i*38)
    })
    // Fixes
    ctx.fillStyle='rgba(34,197,94,0.8)'; ctx.font='bold 14px Arial'
    ctx.fillText('💡 TO ACTUALLY FIX IT:',260,420)
    ;(roast.actualFixes||[]).slice(0,3).forEach((f:string,i:number)=>{
      ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='14px Arial'
      ctx.fillText(`${i+1}. ${f.slice(0,85)}`,260,445+i*28)
    })
    // Footer
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='14px Arial'; ctx.textAlign='center'
    ctx.fillText('Get your resume roasted free at talentlaunch.app 🔥',600,610)
    canvas.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='resume-roast.png';a.click()},'image/png')
    showToast('🔥 Roast card saved! Share on LinkedIn for laughs + engagement')
  }

  function copyRoast(){
    if(!roast) return
    const text=`🔥 MY RESUME ROAST (${roast.overallScore}/100)\n\n${roast.verdict}\n\n${(roast.roastLines||[]).map((l:string)=>`• ${l}`).join('\n')}\n\n✅ What to fix:\n${(roast.actualFixes||[]).map((f:string)=>`→ ${f}`).join('\n')}\n\nRoast your resume free: talentlaunch.app 🔥`
    navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000)
    showToast('📋 Copied! Paste to LinkedIn or Twitter')
  }

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(''),3000)}

  const scoreColor=roast?(roast.overallScore>=70?'text-green-400':roast.overallScore>=50?'text-yellow-400':'text-red-400'):'text-[var(--t2)]'

  return(
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}
      <canvas ref={canvasRef} className="hidden"/>

      <div>
        <h1 className="font-display font-extrabold text-3xl">🔥 Resume Roast</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Brutally honest AI feedback. Shareable. Actually useful.</p>
      </div>

      {/* Upload */}
      <div className="bg-[var(--card)] border border-red-500/20 rounded-2xl p-6 space-y-4">
        <div className="text-sm font-semibold text-red-400">⚠️ Warning: AI will not be nice. It will be honest.</div>
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept=".pdf" onChange={uploadPDF} className="hidden"/>
          <button onClick={()=>fileRef.current?.click()} disabled={pdfLoading}
            className="bg-[var(--el)] border border-[var(--bdr)] text-[var(--t2)] px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-[var(--bds)] disabled:opacity-50">
            {pdfLoading?'⏳ Reading...':'📎 Upload PDF'}
          </button>
          {resume&&<span className="text-xs text-green-400">✅ Resume loaded ({resume.length} chars)</span>}
        </div>
        <textarea value={resume} onChange={e=>{setResume(e.target.value);localStorage.setItem('tl_resume',e.target.value)}}
          rows={resume?3:5} placeholder="Or paste resume text here..."
          className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-500/50 resize-none placeholder:text-[var(--t3)]"/>
        <button onClick={getRoasted} disabled={roasting||!resume.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 text-sm">
          {roasting?'🔥 Roasting your resume...':'🔥 Roast My Resume'}
        </button>
      </div>

      {/* Results */}
      {roast&&(
        <div className="space-y-4">
          {/* Score + verdict */}
          <div className="bg-gradient-to-br from-red-500/8 to-orange-500/8 border border-red-500/25 rounded-2xl p-6">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-center flex-shrink-0">
                <div className={`font-display font-extrabold text-7xl ${scoreColor}`}>{roast.overallScore}</div>
                <div className="text-sm text-[var(--t2)] mt-1">out of 100</div>
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-xl text-red-300 mb-2">🔥 The Verdict</div>
                <div className="text-base leading-relaxed italic">&ldquo;{roast.verdict}&rdquo;</div>
                {roast.recruitersThink&&<div className="mt-3 text-sm text-[var(--t2)] bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-4 py-2">💭 <em>What a recruiter actually thinks: &ldquo;{roast.recruitersThink}&rdquo;</em></div>}
              </div>
            </div>
          </div>

          {/* Roast lines */}
          <div className="bg-[var(--card)] border border-red-500/20 rounded-2xl p-5">
            <div className="font-display font-bold text-base text-red-400 mb-3">🔥 The Roast</div>
            <div className="space-y-2">
              {(roast.roastLines||[]).map((l:string,i:number)=>(
                <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <span className="text-red-400 font-bold flex-shrink-0">🔥</span>
                  <span className="text-sm">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actual fixes */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--card)] border border-red-500/15 rounded-2xl p-5">
              <div className="font-display font-bold text-base text-red-400 mb-3">❌ Serious Problems</div>
              {(roast.seriousIssues||[]).map((s:string,i:number)=>(
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--t2)] py-1.5 border-b border-[var(--bdr)] last:border-0">
                  <span className="text-red-400 flex-shrink-0">→</span>{s}
                </div>
              ))}
            </div>
            <div className="bg-[var(--card)] border border-green-500/15 rounded-2xl p-5">
              <div className="font-display font-bold text-base text-green-400 mb-3">✅ Actually Fix These</div>
              {(roast.actualFixes||[]).map((f:string,i:number)=>(
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--t2)] py-1.5 border-b border-[var(--bdr)] last:border-0">
                  <span className="text-green-400 flex-shrink-0 font-bold">{i+1}.</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* One good thing */}
          {roast.oneThingDoneWell&&(
            <div className="bg-cyan-500/8 border border-cyan-500/20 rounded-2xl px-5 py-4">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">💡 The One Thing That Doesn't Suck</div>
              <div className="text-sm">{roast.oneThingDoneWell}</div>
            </div>
          )}

          {/* Share buttons */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={generateShareCard} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl text-sm hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]">🎨 Download Roast Card</button>
            <button onClick={copyRoast} className={`px-5 border font-semibold py-3 rounded-xl text-sm transition-all ${copied?'border-green-500/30 text-green-400 bg-green-500/10':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
              {copied?'✅ Copied':'📋 Copy for LinkedIn'}
            </button>
            <button onClick={()=>{setRoast(null)}} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm hover:border-[var(--bds)]">Roast Again</button>
          </div>
          <p className="text-center text-xs text-[var(--t3)]">💡 Share on LinkedIn with caption "The AI didn't spare me 💀" for massive engagement</p>
        </div>
      )}
    </div>
  )
}
