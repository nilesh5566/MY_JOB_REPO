'use client'
import { useState, useEffect, useRef } from 'react'

type Review  = {id:string;name:string;role:string;resume:string;feedback:string[];score:number;date:string}
type Interview = {id:string;name:string;company:string;role:string;rounds:string;result:'Got Offer'|'Rejected'|'Ongoing';tips:string;date:string}

// Seeded leaderboard with realistic users
function buildLeaderboard(myName:string, myXP:number) {
  const seed = [
    {name:'Arjun M.',xp:1840,level:'🚀 Senior Dev',streak:14,badges:9,location:'Bangalore'},
    {name:'Priya S.',xp:1520,level:'🚀 Senior Dev',streak:8, badges:8,location:'Mumbai'},
    {name:'Rahul K.',xp:1380,level:'⚡ Mid Engineer',streak:12,badges:7,location:'Hyderabad'},
    {name:'Sneha T.',xp:1250,level:'⚡ Mid Engineer',streak:5, badges:7,location:'Pune'},
    {name:'Vikram R.',xp:1180,level:'⚡ Mid Engineer',streak:9, badges:6,location:'Chennai'},
    {name:'Ananya B.',xp:980, level:'⚡ Mid Engineer',streak:3, badges:5,location:'Delhi'},
    {name:'Dev P.',  xp:860,  level:'💻 Junior Dev',  streak:7, badges:5,location:'Remote'},
    {name:'Kavya M.',xp:720,  level:'💻 Junior Dev',  streak:4, badges:4,location:'Kolkata'},
    {name:'Rohan S.',xp:580,  level:'💻 Junior Dev',  streak:2, badges:3,location:'Bangalore'},
  ]
  const me = {name:myName||'You',xp:myXP,level:'💻 Junior Dev',streak:parseInt(localStorage.getItem('tl_streak')||'0'),badges:JSON.parse(localStorage.getItem('tl_badges')||'[]').length,location:'You',isMe:true}
  const all = [...seed.map(u=>({...u,isMe:false})),me]
  return all.sort((a,b)=>b.xp-a.xp).map((u,i)=>({...u,rank:i+1}))
}

export default function CommunityPage() {
  const [tab, setTab]             = useState<'leaderboard'|'achievement'|'reviews'|'interviews'>('leaderboard')
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [reviews, setReviews]     = useState<Review[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [myName, setMyName]       = useState('')
  const [myXP, setMyXP]           = useState(0)
  const [initDone, setInitDone]   = useState(false)
  const [toast, setToast]         = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Forms
  const [showRvForm, setShowRvForm] = useState(false)
  const [showIvForm, setShowIvForm] = useState(false)
  const [rvForm, setRvForm] = useState({name:'',role:'',resume:'',feedback:'',score:'70'})
  const [ivForm, setIvForm] = useState({name:'',company:'',role:'',rounds:'',result:'Got Offer' as const,tips:''})

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    const xp = parseInt(localStorage.getItem('tl_xp')||'0')
    setMyName(u.name||'You'); setMyXP(xp)
    setLeaderboard(buildLeaderboard(u.name||'You', xp))
    setReviews(JSON.parse(localStorage.getItem('tl_peer_reviews')||'[]'))
    setInterviews(JSON.parse(localStorage.getItem('tl_interview_exp')||'[]'))
    setInitDone(true)
  },[])

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),2800)}

  // Achievement card generator
  function generateCard() {
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return
    canvas.width=1200; canvas.height=630

    // Background gradient
    const grad = ctx.createLinearGradient(0,0,1200,630)
    grad.addColorStop(0,'#05080f'); grad.addColorStop(0.5,'#0b1120'); grad.addColorStop(1,'#0d1528')
    ctx.fillStyle=grad; ctx.fillRect(0,0,1200,630)

    // Cyan glow circle
    const glow = ctx.createRadialGradient(600,315,0,600,315,400)
    glow.addColorStop(0,'rgba(0,220,255,0.08)'); glow.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=glow; ctx.fillRect(0,0,1200,630)

    // Border
    ctx.strokeStyle='rgba(0,220,255,0.3)'; ctx.lineWidth=2
    ctx.strokeRect(16,16,1168,598)

    // TL Logo badge
    const badgeGrad = ctx.createLinearGradient(60,60,120,120)
    badgeGrad.addColorStop(0,'#00dcff'); badgeGrad.addColorStop(1,'#7c3aed')
    ctx.fillStyle=badgeGrad
    roundRect(ctx,60,60,60,60,12); ctx.fill()
    ctx.fillStyle='#000'; ctx.font='bold 22px Arial'; ctx.textAlign='center'
    ctx.fillText('TL',90,100)

    // TalentLaunch text
    ctx.fillStyle='rgba(0,220,255,0.8)'; ctx.font='bold 18px Arial'; ctx.textAlign='left'
    ctx.fillText('TalentLaunch',140,100)

    // Main title
    const badges = JSON.parse(localStorage.getItem('tl_badges')||'[]')
    const apps   = JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const offers = apps.filter((a:any)=>a.status==='offer').length
    const title = offers>0?`🎉 Got ${offers} Offer${offers>1?'s':''}!`:`🚀 ${myXP} XP Earned`
    ctx.fillStyle='#ffffff'; ctx.font='bold 72px Arial'; ctx.textAlign='center'
    ctx.fillText(title,600,280)

    // Subtitle
    ctx.fillStyle='rgba(139,156,191,0.9)'; ctx.font='28px Arial'
    ctx.fillText(myName||'CS Fresher',600,340)

    // Stats row
    const stats = [
      {label:'XP',val:String(myXP)},{label:'Badges',val:String(badges.length)},{label:'Applied',val:String(apps.filter((a:any)=>a.status!=='saved').length)},
    ]
    stats.forEach((s,i)=>{
      const x=300+(i*200)
      ctx.fillStyle='rgba(0,220,255,0.15)'; roundRect(ctx,x-80,400,160,80,12); ctx.fill()
      ctx.fillStyle='#00dcff'; ctx.font='bold 32px Arial'; ctx.fillText(s.val,x,445)
      ctx.fillStyle='rgba(139,156,191,0.7)'; ctx.font='16px Arial'; ctx.fillText(s.label,x,470)
    })

    // Footer
    ctx.fillStyle='rgba(139,156,191,0.4)'; ctx.font='18px Arial'; ctx.textAlign='center'
    ctx.fillText('talentlaunch.app · Built with TalentLaunch AI Career OS',600,580)

    // Download
    const link=document.createElement('a')
    link.download=`${myName||'achievement'}-card.png`
    link.href=canvas.toDataURL('image/png')
    link.click()
    showToast('🎉 Achievement card downloaded!')
  }

  function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
    ctx.beginPath(); ctx.moveTo(x+r,y)
    ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r)
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r)
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath()
  }

  function submitReview(){
    if(!rvForm.name||!rvForm.resume){showToast('⚠️ Name & resume required'); return}
    const r:Review={
      id:`rv_${Date.now()}`,name:rvForm.name,role:rvForm.role,resume:rvForm.resume,
      feedback:rvForm.feedback.split('\n').filter(Boolean),score:parseInt(rvForm.score)||70,
      date:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),
    }
    const updated=[r,...reviews]; setReviews(updated)
    localStorage.setItem('tl_peer_reviews',JSON.stringify(updated))
    setRvForm({name:'',role:'',resume:'',feedback:'',score:'70'}); setShowRvForm(false)
    showToast('✅ Review submitted!')
  }

  function submitInterview(){
    if(!ivForm.company||!ivForm.role){showToast('⚠️ Company & role required'); return}
    const iv:Interview={...ivForm,id:`iv_${Date.now()}`,date:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'})}
    const updated=[iv,...interviews]; setInterviews(updated)
    localStorage.setItem('tl_interview_exp',JSON.stringify(updated))
    setIvForm({name:'',company:'',role:'',rounds:'',result:'Got Offer',tips:''}); setShowIvForm(false)
    showToast('🎤 Experience shared!')
  }

  if(!initDone) return (
    <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
      <div className="h-9 w-40 bg-[var(--el)] rounded-xl"/>
      <div className="h-16 bg-[var(--el)] rounded-2xl"/>
      <div className="h-96 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  const inputCls = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}
      <canvas ref={canvasRef} className="hidden"/>

      <div>
        <h1 className="font-display font-extrabold text-3xl">🌐 Community</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Compete, share achievements, review resumes, post interview experiences</p>
      </div>

      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit overflow-x-auto">
        {([['leaderboard','🏆 Leaderboard'],['achievement','📤 Achievement Card'],['reviews','👥 Resume Reviews'],['interviews','🎯 Interview Board']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{l}</button>
        ))}
      </div>

      {/* ── LEADERBOARD ── */}
      {tab==='leaderboard'&&(
        <div className="space-y-3">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center justify-between">
              <div className="font-display font-bold text-base">🏆 XP Leaderboard</div>
              <div className="text-xs text-[var(--t2)]">Your rank: #{leaderboard.find(u=>u.isMe)?.rank||'—'}</div>
            </div>
            {leaderboard.map((u,i)=>(
              <div key={u.name} className={`flex items-center gap-4 px-5 py-4 border-b border-[var(--bdr)]/50 last:border-0 transition-colors ${u.isMe?'bg-cyan-500/5':'hover:bg-[var(--el)]/50'}`}>
                {/* Rank */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-extrabold text-sm flex-shrink-0 ${i===0?'bg-yellow-500/20 text-yellow-400':i===1?'bg-gray-400/20 text-gray-300':i===2?'bg-orange-500/20 text-orange-400':'bg-[var(--el)] text-[var(--t3)]'}`}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':u.rank}
                </div>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${u.isMe?'bg-gradient-to-br from-cyan-500 to-purple-600 text-white':'bg-gradient-to-br from-[var(--el)] to-[var(--hov)] text-[var(--t2)]'}`}>
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${u.isMe?'text-cyan-400':''}`}>{u.name}</span>
                    {u.isMe&&<span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded font-bold">YOU</span>}
                  </div>
                  <div className="text-xs text-[var(--t2)] mt-0.5">{u.level} · 🔥 {u.streak}d streak · 🏅 {u.badges} badges</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-extrabold text-lg text-cyan-400">{u.xp}</div>
                  <div className="text-[10px] text-[var(--t3)]">XP</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cyan-500/8 border border-cyan-500/15 rounded-xl p-4 text-xs text-cyan-200/70">
            💡 Earn XP by applying to jobs (+20), using AI tools (+10), mock interviews (+25), building your resume (+30). Streak bonuses unlock at 3 and 7 days!
          </div>
        </div>
      )}

      {/* ── ACHIEVEMENT CARD ── */}
      {tab==='achievement'&&(
        <div className="space-y-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-6 space-y-4">
            <div className="font-display font-bold text-base">📤 Generate Achievement Card</div>
            <p className="text-sm text-[var(--t2)]">Create a beautiful LinkedIn-ready card showing your career progress. Download as PNG and share on LinkedIn!</p>

            {/* Preview */}
            <div className="bg-gradient-to-br from-[#05080f] to-[#0d1528] border-2 border-cyan-500/30 rounded-2xl p-8 text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">TL</div>
                <span className="font-display font-bold glow-text text-lg">TalentLaunch</span>
              </div>
              {(()=>{
                const apps=JSON.parse(localStorage.getItem('tl_applications')||'[]')
                const offers=apps.filter((a:any)=>a.status==='offer').length
                const badges=JSON.parse(localStorage.getItem('tl_badges')||'[]')
                return (<>
                  <div className="font-display font-extrabold text-4xl">{offers>0?`🎉 Got ${offers} Offer${offers>1?'s':''}!`:`🚀 ${myXP} XP Earned`}</div>
                  <div className="text-[var(--t2)] text-lg">{myName||'CS Fresher'}</div>
                  <div className="flex justify-center gap-6 mt-4">
                    {[['XP',myXP],['Badges',badges.length],['Applied',apps.filter((a:any)=>a.status!=='saved').length]].map(([l,v])=>(
                      <div key={String(l)} className="bg-cyan-500/10 border border-cyan-500/15 rounded-xl px-4 py-3 text-center">
                        <div className="font-display font-extrabold text-2xl text-cyan-400">{v}</div>
                        <div className="text-xs text-[var(--t2)] mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </>)
              })()}
            </div>

            <button onClick={generateCard}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,220,255,0.3)] transition-all text-sm">
              ⬇ Download as PNG — Share on LinkedIn
            </button>
            <p className="text-xs text-center text-[var(--t3)]">1200×630px · Perfect for LinkedIn posts</p>
          </div>
        </div>
      )}

      {/* ── PEER RESUME REVIEWS ── */}
      {tab==='reviews'&&(
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg">👥 Peer Resume Reviews</h2>
              <p className="text-xs text-[var(--t2)] mt-0.5">Share your resume, get community feedback</p>
            </div>
            <button onClick={()=>setShowRvForm(p=>!p)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
              {showRvForm?'× Cancel':'+ Submit Resume'}
            </button>
          </div>

          {showRvForm&&(
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--t2)] block mb-1">Name (or Anonymous)</label><input value={rvForm.name} onChange={e=>setRvForm({...rvForm,name:e.target.value})} placeholder="Aman N." className={inputCls}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">Target Role</label><input value={rvForm.role} onChange={e=>setRvForm({...rvForm,role:e.target.value})} placeholder="ML Engineer" className={inputCls}/></div>
              </div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Resume (paste text)</label>
                <textarea value={rvForm.resume} onChange={e=>setRvForm({...rvForm,resume:e.target.value})} rows={4} placeholder="Paste your resume text here..." className={inputCls+' resize-none'}/></div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Your Feedback / Questions (optional)</label>
                <textarea value={rvForm.feedback} onChange={e=>setRvForm({...rvForm,feedback:e.target.value})} rows={2} placeholder="Specific areas you want feedback on..." className={inputCls+' resize-none'}/></div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Self-score /100</label>
                <input type="range" min="30" max="100" value={rvForm.score} onChange={e=>setRvForm({...rvForm,score:e.target.value})} className="w-full accent-cyan-400"/>
                <div className="text-xs text-cyan-400 text-right">{rvForm.score}/100</div>
              </div>
              <button onClick={submitReview} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Submit for Review →</button>
            </div>
          )}

          {reviews.length===0?(
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">👥</div>
              <div className="text-sm font-semibold">No reviews yet</div>
              <div className="text-xs mt-1">Be the first to share your resume for community feedback</div>
            </div>
          ):(
            reviews.map(r=>(
              <div key={r.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">{r.name[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-xs text-purple-400">→ {r.role}</span>
                      <span className="text-xs text-cyan-400 font-mono ml-auto">Self: {r.score}/100</span>
                    </div>
                    <div className="mt-2 bg-[var(--el)] rounded-xl p-3 text-xs text-[var(--t2)] max-h-24 overflow-y-auto">{r.resume.slice(0,300)}...</div>
                    {r.feedback.length>0&&<div className="mt-2">{r.feedback.map((f,i)=><div key={i} className="text-xs text-yellow-200/70 py-0.5">💬 {f}</div>)}</div>}
                    <div className="text-[10px] text-[var(--t3)] mt-2">{r.date}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── INTERVIEW EXPERIENCE BOARD ── */}
      {tab==='interviews'&&(
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg">🎯 Interview Experiences</h2>
              <p className="text-xs text-[var(--t2)] mt-0.5">Share your rounds to help the community</p>
            </div>
            <button onClick={()=>setShowIvForm(p=>!p)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
              {showIvForm?'× Cancel':'+ Share Experience'}
            </button>
          </div>

          {showIvForm&&(
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--t2)] block mb-1">Name (or Anonymous)</label><input value={ivForm.name} onChange={e=>setIvForm({...ivForm,name:e.target.value})} placeholder="Priya S." className={inputCls}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">Company</label><input value={ivForm.company} onChange={e=>setIvForm({...ivForm,company:e.target.value})} placeholder="Google" className={inputCls}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">Role</label><input value={ivForm.role} onChange={e=>setIvForm({...ivForm,role:e.target.value})} placeholder="SDE Intern" className={inputCls}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">Result</label>
                  <select value={ivForm.result} onChange={e=>setIvForm({...ivForm,result:e.target.value as any})} className={inputCls}>
                    {['Got Offer','Rejected','Ongoing'].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Interview Rounds (describe briefly)</label>
                <textarea value={ivForm.rounds} onChange={e=>setIvForm({...ivForm,rounds:e.target.value})} rows={3} placeholder="Round 1: DSA on HackerRank (30min, 2 problems). Round 2: System design. Round 3: HR..." className={inputCls+' resize-none'}/></div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Tips for others</label>
                <textarea value={ivForm.tips} onChange={e=>setIvForm({...ivForm,tips:e.target.value})} rows={2} placeholder="What would you tell someone preparing for this?" className={inputCls+' resize-none'}/></div>
              <button onClick={submitInterview} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Share Experience →</button>
            </div>
          )}

          {interviews.length===0?(
            <div className="text-center py-16 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-sm font-semibold">No experiences shared yet</div>
              <div className="text-xs mt-1">Share your interview experience to help other freshers prepare</div>
            </div>
          ):(
            interviews.map(iv=>(
              <div key={iv.id} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 hover:border-cyan-500/15 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-[var(--bdr)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(iv.name||'A')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{iv.name||'Anonymous'}</span>
                      <span className="text-xs text-cyan-400 font-semibold">{iv.role}</span>
                      <span className="text-xs text-[var(--t3)]">@</span>
                      <span className="text-xs text-purple-400 font-semibold">{iv.company}</span>
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${iv.result==='Got Offer'?'bg-green-500/10 text-green-400':iv.result==='Rejected'?'bg-red-500/10 text-red-400':'bg-yellow-500/10 text-yellow-400'}`}>
                        {iv.result}
                      </span>
                    </div>
                    {iv.rounds&&<div className="mt-2 text-xs text-[var(--t2)] leading-relaxed bg-[var(--el)] rounded-xl p-3">{iv.rounds}</div>}
                    {iv.tips&&<div className="mt-2 bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-3"><div className="text-[10px] font-semibold text-yellow-400 mb-1">💡 Tips</div><div className="text-xs text-[var(--t2)]">{iv.tips}</div></div>}
                    <div className="text-[10px] text-[var(--t3)] mt-2">{iv.date}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
