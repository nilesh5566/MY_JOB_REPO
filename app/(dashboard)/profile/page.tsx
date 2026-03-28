'use client'
import { useState, useEffect, useRef } from 'react'

const LEVELS = [{name:'🌱 Fresher',min:0},{name:'💻 Junior Dev',min:100},{name:'⚡ Mid Engineer',min:300},{name:'🚀 Senior Dev',min:600},{name:'🏆 Tech Lead',min:1000}]
const ALL_BADGES = [
  {id:'first_search',name:'First Search',emoji:'🔍'},{id:'first_save',name:'Job Saver',emoji:'🔖'},
  {id:'first_apply',name:'First Apply',emoji:'📨'},{id:'resume_built',name:'Resume Pro',emoji:'📄'},
  {id:'ai_master',name:'AI Master',emoji:'🤖'},{id:'mock_done',name:'Interview Ready',emoji:'🎤'},
  {id:'streak_3',name:'On a Roll',emoji:'🔥'},{id:'streak_7',name:'Week Warrior',emoji:'⚡'},
  {id:'offer',name:'Offer Getter',emoji:'🏆'},{id:'resume_pdf',name:'PDF Master',emoji:'📎'},
]

function getLevel(xp:number){
  let lvl=LEVELS[0]
  for(const l of LEVELS){if(xp>=l.min)lvl=l}
  const next=LEVELS[LEVELS.indexOf(lvl)+1]
  return{...lvl,pct:next?Math.round(((xp-lvl.min)/(next.min-lvl.min))*100):100,nextName:next?.name||'Max'}
}

export default function ProfilePage(){
  const [user,setUser]     = useState<any>({})
  const [xp,setXp]         = useState(0)
  const [streak,setStreak] = useState(0)
  const [badges,setBadges] = useState<string[]>([])
  const [skills,setSkills] = useState<string[]>([])
  const [targetRole,setTargetRole] = useState('')
  const [college,setCollege]       = useState('')
  const [apps,setApps]     = useState<any[]>([])
  const [editing,setEditing] = useState(false)
  const [form,setForm]     = useState({name:'',college:'',targetRole:'',bio:'',github:'',linkedin:'',skills:''})
  const [copied,setCopied] = useState(false)
  const [shareImg,setShareImg] = useState(false)
  const [toast,setToast]   = useState('')
  const [loading,setLoading] = useState(true)
  const [referralCode,setReferralCode] = useState('')
  const [referrals,setReferrals] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    const xpVal = parseInt(localStorage.getItem('tl_xp')||'0')
    const streakVal = parseInt(localStorage.getItem('tl_streak')||'0')
    const badgeList = JSON.parse(localStorage.getItem('tl_badges')||'[]')
    const skillList = (localStorage.getItem('tl_skills')||'').split(',').filter(Boolean)
    const appsData  = JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const role = localStorage.getItem('tl_target_role')||u.targetRole||''
    const coll = localStorage.getItem('tl_college')||u.college||''
    // Generate referral code from user name
    const code = (u.name||'user').toLowerCase().replace(/\s+/g,'')+Math.floor(Math.random()*1000)
    const savedCode = localStorage.getItem('tl_referral_code') || code
    if(!localStorage.getItem('tl_referral_code')) localStorage.setItem('tl_referral_code', savedCode)
    setUser(u); setXp(xpVal); setStreak(streakVal); setBadges(badgeList)
    setSkills(skillList); setTargetRole(role); setCollege(coll); setApps(appsData)
    setReferralCode(savedCode)
    setReferrals(parseInt(localStorage.getItem('tl_referral_count')||'0'))
    setForm({name:u.name||'',college:coll,targetRole:role,bio:localStorage.getItem('tl_bio')||'',github:localStorage.getItem('tl_github')||'',linkedin:localStorage.getItem('tl_linkedin_url')||'',skills:skillList.join(', ')})
    setLoading(false)
  },[])

  function saveProfile(){
    const u = JSON.parse(localStorage.getItem('tl_user')||'{}')
    u.name = form.name
    localStorage.setItem('tl_user', JSON.stringify(u))
    localStorage.setItem('tl_college', form.college)
    localStorage.setItem('tl_target_role', form.targetRole)
    localStorage.setItem('tl_bio', form.bio)
    localStorage.setItem('tl_github', form.github)
    localStorage.setItem('tl_linkedin_url', form.linkedin)
    localStorage.setItem('tl_skills', form.skills)
    setUser(u); setCollege(form.college); setTargetRole(form.targetRole)
    setSkills(form.skills.split(',').map(s=>s.trim()).filter(Boolean))
    setEditing(false)
    showToast('✅ Profile saved!')
  }

  function generateShareCard(){
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d'); if(!ctx) return
    canvas.width=1200; canvas.height=630
    // Background
    const bg=ctx.createLinearGradient(0,0,1200,630)
    bg.addColorStop(0,'#05080f'); bg.addColorStop(0.6,'#0b1120'); bg.addColorStop(1,'#0d1830')
    ctx.fillStyle=bg; ctx.fillRect(0,0,1200,630)
    // Glow
    const glow=ctx.createRadialGradient(200,315,0,200,315,350)
    glow.addColorStop(0,'rgba(0,220,255,0.12)'); glow.addColorStop(1,'rgba(0,0,0,0)')
    ctx.fillStyle=glow; ctx.fillRect(0,0,1200,630)
    // Border
    ctx.strokeStyle='rgba(0,220,255,0.35)'; ctx.lineWidth=2
    roundRect(ctx,12,12,1176,606,20); ctx.stroke()
    // Logo
    const logo=ctx.createLinearGradient(48,40,108,100)
    logo.addColorStop(0,'#00dcff'); logo.addColorStop(1,'#7c3aed')
    ctx.fillStyle=logo; roundRect(ctx,48,40,60,60,14); ctx.fill()
    ctx.fillStyle='#000'; ctx.font='bold 24px Arial'; ctx.textAlign='center'; ctx.fillText('TL',78,80)
    ctx.fillStyle='rgba(0,220,255,0.9)'; ctx.font='bold 18px Arial'; ctx.textAlign='left'
    ctx.fillText('TalentLaunch',126,78)
    // Avatar circle
    ctx.fillStyle='rgba(0,220,255,0.15)'; ctx.beginPath(); ctx.arc(140,315,80,0,Math.PI*2); ctx.fill()
    ctx.strokeStyle='rgba(0,220,255,0.4)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(140,315,80,0,Math.PI*2); ctx.stroke()
    ctx.fillStyle='#00dcff'; ctx.font='bold 64px Arial'; ctx.textAlign='center'
    ctx.fillText((user.name||'U')[0].toUpperCase(),140,337)
    // Name & role
    ctx.fillStyle='#ffffff'; ctx.font='bold 48px Arial'; ctx.textAlign='left'
    ctx.fillText(user.name||'CS Fresher',260,290)
    ctx.fillStyle='rgba(0,220,255,0.8)'; ctx.font='24px Arial'
    ctx.fillText(targetRole||'Software Engineer',260,335)
    if(college){ctx.fillStyle='rgba(139,156,191,0.8)'; ctx.font='18px Arial'; ctx.fillText('📍 '+college,260,370)}
    // Level badge
    const lvl=getLevel(xp)
    ctx.fillStyle='rgba(0,220,255,0.15)'; roundRect(ctx,260,395,220,44,12); ctx.fill()
    ctx.strokeStyle='rgba(0,220,255,0.3)'; ctx.lineWidth=1; roundRect(ctx,260,395,220,44,12); ctx.stroke()
    ctx.fillStyle='#00dcff'; ctx.font='bold 16px Arial'
    ctx.fillText(`${lvl.name} · ${xp} XP`,272,422)
    // Stats
    const statsX=700, statsY=220
    ctx.fillStyle='rgba(255,255,255,0.06)'; roundRect(ctx,statsX,statsY,440,260,16); ctx.fill()
    const stats=[
      {label:'XP Earned',val:String(xp),color:'#00dcff'},
      {label:'Badges',val:String(badges.length),color:'#a78bfa'},
      {label:'Applications',val:String(apps.filter(a=>a.status!=='saved').length),color:'#34d399'},
      {label:'Offers 🎉',val:String(apps.filter(a=>a.status==='offer').length),color:'#fbbf24'},
    ]
    stats.forEach((s,i)=>{
      const col=i%2, row=Math.floor(i/2)
      const x=statsX+20+col*210, y=statsY+20+row*110
      ctx.fillStyle='rgba(255,255,255,0.06)'; roundRect(ctx,x,y,190,90,10); ctx.fill()
      ctx.fillStyle=s.color; ctx.font='bold 36px Arial'; ctx.textAlign='center'
      ctx.fillText(s.val,x+95,y+52)
      ctx.fillStyle='rgba(139,156,191,0.8)'; ctx.font='13px Arial'
      ctx.fillText(s.label,x+95,y+74)
    })
    // Earned badges row
    if(badges.length>0){
      ctx.fillStyle='rgba(139,156,191,0.6)'; ctx.font='14px Arial'; ctx.textAlign='left'
      ctx.fillText('BADGES EARNED',260,530)
      const earnedBadges=ALL_BADGES.filter(b=>badges.includes(b.id)).slice(0,8)
      earnedBadges.forEach((b,i)=>{
        ctx.font='28px Arial'; ctx.fillStyle='white'
        ctx.fillText(b.emoji,260+i*50,565)
      })
    }
    // Footer
    ctx.fillStyle='rgba(139,156,191,0.4)'; ctx.font='14px Arial'; ctx.textAlign='center'
    ctx.fillText('talentlaunch.app · CS Career OS — AI-powered job search & placement prep',600,605)
    // Download
    canvas.toBlob(blob=>{
      if(!blob)return
      const url=URL.createObjectURL(blob)
      const a=document.createElement('a'); a.href=url; a.download=`${user.name||'profile'}-talentlaunch.png`; a.click()
    },'image/png')
    showToast('🎉 Share card downloaded! Post on LinkedIn for max reach.')
  }

  function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
    ctx.beginPath(); ctx.moveTo(x+r,y)
    ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r)
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r)
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath()
  }

  function copyReferral(){
    const url = `${window.location.origin}/register?ref=${referralCode}`
    navigator.clipboard.writeText(url)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
    showToast('🔗 Referral link copied! Share with batchmates for bonus XP')
  }

  function showToast(msg:string){setToast(msg);setTimeout(()=>setToast(''),3000)}

  const level = getLevel(xp)
  const offers = apps.filter(a=>a.status==='offer').length
  const applied = apps.filter(a=>a.status!=='saved').length
  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'

  if(loading) return <div className="max-w-4xl mx-auto animate-pulse space-y-4"><div className="h-48 bg-[var(--el)] rounded-2xl"/><div className="h-32 bg-[var(--el)] rounded-2xl"/></div>

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}
      <canvas ref={canvasRef} className="hidden"/>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">👤 My Profile</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Your public career identity · shareable link</p>
        </div>
        <div className="flex gap-2">
          <button onClick={generateShareCard} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all">🎨 Generate Share Card</button>
          <button onClick={()=>setEditing(p=>!p)} className="border border-[var(--bdr)] text-[var(--t2)] px-4 py-2 rounded-xl text-sm hover:border-[var(--bds)]">{editing?'× Cancel':'✏️ Edit'}</button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-[var(--card)] to-[var(--el)] border border-[var(--bdr)] rounded-3xl p-6">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-display font-extrabold text-4xl text-white flex-shrink-0">
            {(user.name||'U')[0]?.toUpperCase()}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display font-bold text-2xl">{user.name||'Your Name'}</h2>
              <span className="text-sm bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-semibold">{level.name}</span>
              {offers>0&&<span className="text-sm bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">🎉 {offers} Offer{offers>1?'s':''}</span>}
            </div>
            {targetRole&&<div className="text-[var(--t2)] mt-1">🎯 {targetRole}</div>}
            {college&&<div className="text-[var(--t2)] text-sm mt-0.5">🎓 {college}</div>}
            {localStorage.getItem('tl_bio')&&<div className="text-sm text-[var(--t2)] mt-2 leading-relaxed">{localStorage.getItem('tl_bio')}</div>}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {localStorage.getItem('tl_github')&&<a href={localStorage.getItem('tl_github')!} target="_blank" rel="noreferrer" className="text-xs text-[var(--t2)] hover:text-white flex items-center gap-1">⚫ GitHub</a>}
              {localStorage.getItem('tl_linkedin_url')&&<a href={localStorage.getItem('tl_linkedin_url')!} target="_blank" rel="noreferrer" className="text-xs text-[var(--t2)] hover:text-white flex items-center gap-1">💼 LinkedIn</a>}
              <span className="text-xs text-[var(--t3)]">🔥 {streak} day streak</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-5 pt-5 border-t border-[var(--bdr)]">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[var(--t2)]">{level.name}</span>
            <span className="font-mono text-cyan-400 font-bold">{xp} XP · {level.pct}% to {level.nextName}</span>
          </div>
          <div className="h-2.5 bg-[var(--el)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" style={{width:`${level.pct}%`}}/>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing&&(
        <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
          <div className="font-display font-bold text-base">✏️ Edit Profile</div>
          <div className="grid md:grid-cols-2 gap-4">
            {[['name','Full Name','Aman Nayak'],['college','College','IIT Bombay'],['targetRole','Target Role','ML Engineer'],['github','GitHub URL','https://github.com/you'],['linkedin','LinkedIn URL','https://linkedin.com/in/you']].map(([k,l,p])=>(
              <div key={k}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                <input value={(form as any)[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className={inp}/></div>
            ))}
            <div className="md:col-span-2"><label className="text-xs text-[var(--t2)] block mb-1">Bio (2-3 sentences)</label>
              <textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={3} placeholder="CS final year at IIT Bombay. Passionate about ML and distributed systems. Open to SDE-1 and ML Engineer roles." className={inp+' resize-none'}/></div>
            <div className="md:col-span-2"><label className="text-xs text-[var(--t2)] block mb-1">Skills (comma-separated)</label>
              <input value={form.skills} onChange={e=>setForm(p=>({...p,skills:e.target.value}))} placeholder="React, Python, AWS, ML..." className={inp}/></div>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setEditing(false)} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm py-2.5">Cancel</button>
            <button onClick={saveProfile} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">Save Profile →</button>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:'XP Earned',v:xp,c:'text-cyan-400',b:'bg-cyan-500/8 border-cyan-500/15'},
          {l:'Applications',v:applied,c:'text-purple-400',b:'bg-purple-500/8 border-purple-500/15'},
          {l:'Offers 🎉',v:offers,c:'text-green-400',b:'bg-green-500/8 border-green-500/15'},
          {l:'Badges',v:badges.length,c:'text-yellow-400',b:'bg-yellow-500/8 border-yellow-500/15'}].map(s=>(
          <div key={s.l} className={`border rounded-2xl p-4 text-center ${s.b}`}>
            <div className={`font-display font-extrabold text-3xl ${s.c}`}>{s.v}</div>
            <div className="text-xs text-[var(--t2)] mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {skills.length>0&&(
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
          <div className="font-display font-bold text-base mb-3">🛠️ Skills</div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s=><span key={s} className="text-sm px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">{s}</span>)}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
        <div className="font-display font-bold text-base mb-3">🏅 Badges ({badges.length}/{ALL_BADGES.length})</div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {ALL_BADGES.map(b=>{
            const earned=badges.includes(b.id)
            return(<div key={b.id} title={b.name} className={`text-center p-2 rounded-xl border ${earned?'bg-cyan-500/8 border-cyan-500/20':'bg-[var(--el)] border-[var(--bdr)] opacity-30'}`}>
              <div className={`text-2xl ${!earned?'grayscale':''}`}>{b.emoji}</div>
              <div className="text-[9px] text-[var(--t3)] mt-0.5 truncate">{b.name}</div>
            </div>)
          })}
        </div>
      </div>

      {/* Ambassador / Referral Program */}
      <div className="bg-gradient-to-br from-purple-500/8 to-cyan-500/8 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <div className="font-display font-bold text-lg">🎖️ Campus Ambassador</div>
            <p className="text-sm text-[var(--t2)] mt-0.5">Invite batchmates → earn XP → unlock exclusive badge</p>
          </div>
          <div className="text-right">
            <div className="font-display font-extrabold text-2xl text-purple-400">{referrals}</div>
            <div className="text-xs text-[var(--t3)]">referrals</div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {[['5 referrals','Campus Star badge + 100 XP','🌟'],['15 referrals','Campus Lead badge + 300 XP','👑'],['30 referrals','Ambassador badge + 600 XP','🎖️']].map(([m,r,e])=>(
            <div key={m} className={`bg-[var(--el)] border rounded-xl p-3 text-center ${referrals>=parseInt(m)?'border-green-500/30':'border-[var(--bdr)]'}`}>
              <div className="text-2xl mb-1">{e}</div>
              <div className="text-xs font-bold">{m}</div>
              <div className="text-[10px] text-[var(--t3)] mt-0.5">{r}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm font-mono text-cyan-400 truncate">
            {typeof window!=='undefined'?`${window.location.origin}/register?ref=${referralCode}`:`talentlaunch.app/register?ref=${referralCode}`}
          </div>
          <button onClick={copyReferral} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${copied?'bg-green-500/10 border-green-500/30 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
            {copied?'✅ Copied':'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
