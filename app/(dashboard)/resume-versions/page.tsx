'use client'
import { useState, useEffect } from 'react'

type ResumeVersion = { id:string; name:string; targetRole:string; content:string; createdAt:string; updatedAt:string; score?:number; tags:string[] }

const ROLE_TAGS = ['Full Stack','Backend','Frontend','ML/AI','Data Science','DevOps','Android','iOS','Product','Research']

export default function ResumeVersionsPage() {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [active, setActive] = useState<ResumeVersion | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:'', targetRole:'', content:'', tags:[] as string[] })
  const [toast, setToast] = useState('')
  const [comparing, setComparing] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tl_resume_versions') || '[]')
    // Seed with current resume if exists
    if (saved.length === 0) {
      const current = localStorage.getItem('tl_resume') || ''
      if (current.length > 50) {
        const defaultV: ResumeVersion = {
          id: `rv_default`, name: 'Master Resume', targetRole: 'Software Engineer',
          content: current, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['Full Stack']
        }
        setVersions([defaultV])
        setActive(defaultV)
        localStorage.setItem('tl_resume_versions', JSON.stringify([defaultV]))
      }
    } else {
      setVersions(saved)
      setActive(saved[0])
    }
    setLoading(false)
  }, [])

  function save(list: ResumeVersion[]) {
    setVersions(list)
    localStorage.setItem('tl_resume_versions', JSON.stringify(list))
  }

  function createVersion() {
    if (!form.name || !form.content) { showToast('⚠️ Name and resume content required'); return }
    const v: ResumeVersion = {
      id: `rv_${Date.now()}`, ...form,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    const updated = [v, ...versions]
    save(updated); setActive(v)
    setForm({ name:'', targetRole:'', content:'', tags:[] })
    setEditing(false)
    showToast('✅ Version saved!')
  }

  function updateVersion() {
    if (!active) return
    const updated = versions.map(v => v.id === active.id
      ? { ...v, ...form, updatedAt: new Date().toISOString() }
      : v
    )
    save(updated)
    setActive(updated.find(v => v.id === active.id)!)
    setEditing(false)
    showToast('✅ Updated!')
  }

  function deleteVersion(id: string) {
    const updated = versions.filter(v => v.id !== id)
    save(updated)
    if (active?.id === id) setActive(updated[0] || null)
    showToast('🗑️ Deleted')
  }

  function setAsActive(v: ResumeVersion) {
    setActive(v)
    localStorage.setItem('tl_resume', v.content)
    showToast(`✅ "${v.name}" set as active resume for all AI tools`)
  }

  function startEdit(v: ResumeVersion) {
    setForm({ name: v.name, targetRole: v.targetRole, content: v.content, tags: v.tags || [] })
    setActive(v); setEditing(true)
  }

  function toggleCompare(id: string) {
    setComparing(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 2 ? [...p, id] : [p[1], id])
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  function toggleTag(t: string) { setForm(p => ({ ...p, tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t] })) }

  const inp = 'w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]'
  const compareVersions = comparing.map(id => versions.find(v => v.id === id)).filter(Boolean) as ResumeVersion[]

  if (loading) return <div className="animate-pulse space-y-4 max-w-5xl mx-auto"><div className="h-9 w-56 bg-[var(--el)] rounded-xl"/><div className="grid md:grid-cols-3 gap-5"><div className="h-96 bg-[var(--el)] rounded-2xl"/><div className="md:col-span-2 h-96 bg-[var(--el)] rounded-2xl"/></div></div>

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">📁 Resume Versions</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">Save different versions per role — switch with one click</p>
        </div>
        <div className="flex gap-2">
          {comparing.length === 2 && <button onClick={() => setComparing([])} className="border border-[var(--bdr)] text-[var(--t2)] px-4 py-2 rounded-xl text-sm hover:border-[var(--bds)]">Clear compare</button>}
          <button onClick={() => { setEditing(true); setActive(null); setForm({ name:'', targetRole:'', content:'', tags:[] }) }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">+ New Version</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Version list */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--t2)] uppercase tracking-wider mb-2">{versions.length} saved versions</div>
          {versions.length === 0 && !editing && (
            <div className="text-center py-10 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-xs">No versions yet.<br/>Create your first!</div>
            </div>
          )}
          {versions.map(v => (
            <div key={v.id} onClick={() => { setActive(v); setEditing(false) }}
              className={`bg-[var(--card)] border rounded-2xl p-3 cursor-pointer hover:border-cyan-500/20 transition-all ${active?.id === v.id && !editing ? 'border-cyan-500/35' : 'border-[var(--bdr)]'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{v.name}</div>
                  <div className="text-xs text-cyan-400 mt-0.5 truncate">{v.targetRole}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {v.tags?.slice(0,2).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--el)] border border-[var(--bdr)] text-[var(--t3)]">{t}</span>)}
                  </div>
                  <div className="text-[10px] text-[var(--t3)] mt-1">{v.content.length} chars · {new Date(v.updatedAt).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}</div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleCompare(v.id) }}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-all ${comparing.includes(v.id) ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'border-[var(--bdr)] text-[var(--t3)]'}`}>
                    {comparing.includes(v.id) ? '⚖️ Cmp' : '⚖️'}
                  </button>
                </div>
              </div>
              {active?.id === v.id && !editing && (
                <div className="flex gap-1 mt-2 pt-2 border-t border-[var(--bdr)]">
                  <button onClick={e => { e.stopPropagation(); setAsActive(v) }} className="flex-1 text-[10px] bg-cyan-500/10 text-cyan-400 py-1 rounded-lg hover:bg-cyan-500/20">Use for AI</button>
                  <button onClick={e => { e.stopPropagation(); startEdit(v) }} className="flex-1 text-[10px] bg-[var(--el)] text-[var(--t2)] py-1 rounded-lg hover:text-white">Edit</button>
                  <button onClick={e => { e.stopPropagation(); deleteVersion(v.id) }} className="flex-1 text-[10px] bg-red-500/10 text-red-400 py-1 rounded-lg hover:bg-red-500/20">Del</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Editor / Viewer */}
        <div className="md:col-span-2">
          {/* Compare mode */}
          {comparing.length === 2 && (
            <div className="bg-[var(--card)] border border-purple-500/20 rounded-2xl p-5 mb-4">
              <div className="font-display font-bold text-base text-purple-400 mb-3">⚖️ Comparing Versions</div>
              <div className="grid grid-cols-2 gap-4">
                {compareVersions.map(v => (
                  <div key={v.id}>
                    <div className="font-semibold text-sm mb-1">{v.name}</div>
                    <div className="text-xs text-cyan-400 mb-2">{v.targetRole}</div>
                    <div className="bg-[var(--el)] rounded-xl p-3 text-xs text-[var(--t2)] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">{v.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor */}
          {editing && (
            <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="font-display font-bold text-base">{active ? 'Edit Version' : 'New Resume Version'}</div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-[var(--t2)] block mb-1">Version Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. ML Engineer v2" className={inp}/></div>
                <div><label className="text-xs text-[var(--t2)] block mb-1">Target Role</label><input value={form.targetRole} onChange={e=>setForm(p=>({...p,targetRole:e.target.value}))} placeholder="e.g. ML Engineer at Google" className={inp}/></div>
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Role Tags</label>
                <div className="flex flex-wrap gap-1">
                  {ROLE_TAGS.map(t=><button key={t} onClick={()=>toggleTag(t)} className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${form.tags.includes(t)?'bg-cyan-500/15 border-cyan-500/35 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:text-white'}`}>{t}</button>)}
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--t2)] block mb-1">Resume Content *</label>
                <textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={12}
                  placeholder="Paste your resume text here (or it will auto-load from your current resume)..."
                  className={inp+' resize-none font-mono text-xs'}/>
                <div className="text-[10px] text-[var(--t3)] mt-1">{form.content.length} characters</div>
              </div>
              {!form.content && localStorage.getItem('tl_resume') && (
                <button onClick={() => setForm(p => ({ ...p, content: localStorage.getItem('tl_resume') || '' }))}
                  className="text-xs text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10">↓ Load current resume</button>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setEditing(false) }} className="px-5 border border-[var(--bdr)] text-[var(--t2)] rounded-xl text-sm py-2.5 hover:border-[var(--bds)]">Cancel</button>
                <button onClick={active ? updateVersion : createVersion}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">
                  {active ? 'Save Changes' : 'Create Version →'}
                </button>
              </div>
            </div>
          )}

          {/* View mode */}
          {!editing && active && (
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="font-display font-bold text-lg">{active.name}</div>
                  <div className="text-sm text-cyan-400 mt-0.5">{active.targetRole}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {active.tags?.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">{t}</span>)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAsActive(active)}
                    className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20">🤖 Use for AI Tools</button>
                  <button onClick={() => startEdit(active)}
                    className="text-xs border border-[var(--bdr)] text-[var(--t2)] px-3 py-1.5 rounded-lg hover:border-[var(--bds)]">Edit</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[var(--el)] rounded-xl p-3"><div className="text-[10px] text-[var(--t3)] mb-1">Created</div><div className="text-xs">{new Date(active.createdAt).toLocaleDateString('en-IN',{dateStyle:'medium'})}</div></div>
                <div className="bg-[var(--el)] rounded-xl p-3"><div className="text-[10px] text-[var(--t3)] mb-1">Length</div><div className="text-xs">{active.content.length} chars · ~{Math.round(active.content.split(' ').length/250)} pages</div></div>
              </div>
              <div className="bg-[var(--el)] rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-[var(--t2)] whitespace-pre-wrap leading-relaxed font-mono">{active.content}</pre>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(active.content)} className="flex-1 border border-[var(--bdr)] text-[var(--t2)] py-2.5 rounded-xl text-sm hover:border-[var(--bds)]">Copy Text</button>
                <button onClick={() => deleteVersion(active.id)} className="px-4 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/10">Delete</button>
              </div>
            </div>
          )}

          {!editing && !active && versions.length === 0 && (
            <div className="text-center py-20 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl text-[var(--t3)]">
              <div className="text-4xl mb-3">📁</div>
              <div className="text-sm font-semibold">No resume versions yet</div>
              <div className="text-xs mt-1 mb-4">Create tailored versions for different roles</div>
              <button onClick={() => setEditing(true)} className="text-xs text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-xl hover:bg-cyan-500/10">+ Create First Version</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
