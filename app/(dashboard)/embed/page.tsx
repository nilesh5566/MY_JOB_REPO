'use client'
import { useState } from 'react'

export default function EmbedPage() {
  const [config, setConfig] = useState({ theme:'dark', limit:'10', fresherOnly:'true', width:'100%', height:'600' })
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://talentlaunch.app'
  const params = new URLSearchParams({ theme:config.theme, limit:config.limit, fresher:config.fresherOnly })
  const iframeCode = `<iframe\n  src="${baseUrl}/embed/jobs?${params}"\n  width="${config.width}"\n  height="${config.height}px"\n  style="border:none;border-radius:12px;"\n  title="TalentLaunch Job Board"\n></iframe>`

  function copy() {
    navigator.clipboard.writeText(iframeCode)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const inp = 'bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-3xl">🔗 Job Board Embed</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Embed TalentLaunch on your college website, placement blog, or Discord</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-4">
          <div className="font-display font-bold text-base">⚙️ Configure Widget</div>
          <div>
            <label className="text-xs text-[var(--t2)] block mb-1">Theme</label>
            <div className="flex gap-2">
              {['dark','light','neon'].map(t=>(
                <button key={t} onClick={()=>setConfig(p=>({...p,theme:t}))}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold capitalize transition-all ${config.theme===t?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div><label className="text-xs text-[var(--t2)] block mb-1">Number of Jobs</label>
            <select value={config.limit} onChange={e=>setConfig(p=>({...p,limit:e.target.value}))} className={inp+' w-full'}>
              {['5','10','20','50'].map(n=><option key={n} value={n}>{n} jobs</option>)}
            </select>
          </div>
          <div><label className="text-xs text-[var(--t2)] block mb-1">Fresher Jobs Only</label>
            <div className="flex gap-2">
              {[['Yes','true'],['No','false']].map(([l,v])=>(
                <button key={v} onClick={()=>setConfig(p=>({...p,fresherOnly:v}))}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${config.fresherOnly===v?'bg-cyan-500/10 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t2)]'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-[var(--t2)] block mb-1">Width</label><input value={config.width} onChange={e=>setConfig(p=>({...p,width:e.target.value}))} placeholder="100%" className={inp+' w-full'}/></div>
            <div><label className="text-xs text-[var(--t2)] block mb-1">Height (px)</label><input value={config.height} onChange={e=>setConfig(p=>({...p,height:e.target.value}))} placeholder="600" className={inp+' w-full'}/></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-display font-bold text-base">📋 Embed Code</div>
              <button onClick={copy} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${copied?'bg-green-500/10 border-green-500/25 text-green-400':'border-[var(--bdr)] text-[var(--t2)] hover:border-[var(--bds)]'}`}>
                {copied?'✅ Copied!':'Copy Code'}
              </button>
            </div>
            <pre className="bg-[var(--el)] rounded-xl p-4 text-xs text-cyan-400 overflow-x-auto whitespace-pre-wrap font-mono">{iframeCode}</pre>
          </div>

          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-3">📍 Where to use it</div>
            <div className="space-y-2">
              {[['🎓 College TPO website','Add to placement page for students'],['💬 Discord server','Pin in #jobs channel'],['📝 Blog / Medium post','Embed in your career blog'],['🌐 GitHub README','Show open positions'],['📱 WhatsApp/Telegram bot','Share link in placement group']].map(([l,d])=>(
                <div key={String(l)} className="flex items-start gap-3 p-3 bg-[var(--el)] rounded-xl">
                  <span className="text-base">{String(l).split(' ')[0]}</span>
                  <div><div className="text-xs font-semibold">{String(l).slice(2)}</div><div className="text-[10px] text-[var(--t3)]">{d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
