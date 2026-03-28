'use client'
import { useState, useEffect } from 'react'

type App = { id:string; company:string; role:string; status:'saved'|'applied'|'interview'|'offer'|'rejected'; date:string; salary?:string; notes?:string; url?:string; contact?:string }

const STATUS_CFG = {
  saved:     { label:'Saved',     emoji:'🔖', color:'bg-gray-500/10 border-gray-500/25 text-gray-400',    dot:'bg-gray-400'    },
  applied:   { label:'Applied',   emoji:'📨', color:'bg-blue-500/10 border-blue-500/25 text-blue-400',    dot:'bg-blue-400'    },
  interview: { label:'Interview', emoji:'🎤', color:'bg-purple-500/10 border-purple-500/25 text-purple-400', dot:'bg-purple-400' },
  offer:     { label:'Offer 🎉',  emoji:'🏆', color:'bg-green-500/10 border-green-500/25 text-green-400',  dot:'bg-green-400'   },
  rejected:  { label:'Rejected',  emoji:'❌', color:'bg-red-500/10 border-red-500/25 text-red-400',       dot:'bg-red-400'     },
}
const STATUSES = Object.keys(STATUS_CFG) as App['status'][]

export default function TrackerPage() {
  const [apps, setApps] = useState<App[]>([])
  const [view, setView] = useState<'kanban'|'list'|'analytics'>('kanban')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<App|null>(null)
  const [form, setForm] = useState<Partial<App>>({ status:'applied', date:new Date().toISOString().slice(0,10) })
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('tl_applications')
    setApps(stored ? JSON.parse(stored) : [])
    setLoading(false)
  }, [])

  function save(list: App[]) { setApps(list); localStorage.setItem('tl_applications', JSON.stringify(list)) }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500) }
  function openAdd() { setEditing(null); setForm({ status:'applied', date:new Date().toISOString().slice(0,10) }); setModal(true) }
  function openEdit(a: App) { setEditing(a); setForm({...a}); setModal(true) }

  function submitForm() {
    if (!form.company || !form.role) { showToast('⚠️ Company & role required'); return }
    if (editing) {
      save(apps.map(a => a.id === editing.id ? {...a,...form} as App : a))
      showToast('✅ Updated')
    } else {
      save([{...form as App, id:`app_${Date.now()}`}, ...apps])
      // XP + badge
      localStorage.setItem('tl_xp', String(parseInt(localStorage.getItem('tl_xp')||'0')+20))
      const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if (!b.includes('first_apply')) localStorage.setItem('tl_badges', JSON.stringify([...b,'first_apply']))
      showToast('✅ Logged! +20 XP')
    }
    setModal(false)
  }

  function deleteApp(id: string) { save(apps.filter(a => a.id !== id)); showToast('Deleted') }
  function updateStatus(id: string, status: App['status']) {
    save(apps.map(a => a.id === id ? {...a,status} : a))
    if (status === 'offer') {
      localStorage.setItem('tl_xp', String(parseInt(localStorage.getItem('tl_xp')||'0')+30))
      const b = JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if (!b.includes('offer')) localStorage.setItem('tl_badges', JSON.stringify([...b,'offer']))
    }
    showToast(`→ ${STATUS_CFG[status].label}`)
  }

  function exportPDF() {
    const apps_data:{company:string;role:string;status:string;date:string;salary?:string;notes?:string}[] = JSON.parse(localStorage.getItem('tl_applications')||'[]')
    const html = `<!DOCTYPE html><html><head><style>body{font-family:Arial;padding:24px;color:#111}h1{color:#0066cc}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#0066cc;color:#fff;padding:8px 12px;text-align:left;font-size:12px}td{padding:8px 12px;border-bottom:1px solid #eee;font-size:12px}.badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:bold}.applied{background:#dbeafe;color:#1d4ed8}.interview{background:#ede9fe;color:#7c3aed}.offer{background:#dcfce7;color:#15803d}.rejected{background:#fee2e2;color:#b91c1c}.saved{background:#f3f4f6;color:#374151}</style></head><body><h1>🚀 TalentLaunch — Application Tracker</h1><p>Exported on ${new Date().toLocaleDateString('en-IN',{dateStyle:'full'})}</p><p><strong>${apps_data.length}</strong> total applications · <strong>${apps_data.filter(a=>a.status==='offer').length}</strong> offers</p><table><thead><tr><th>#</th><th>Company</th><th>Role</th><th>Status</th><th>Date</th><th>Salary</th><th>Notes</th></tr></thead><tbody>${apps_data.map((a,i)=>`<tr><td>${i+1}</td><td>${a.company}</td><td>${a.role}</td><td><span class="badge ${a.status}">${a.status}</span></td><td>${a.date}</td><td>${a.salary||'—'}</td><td>${a.notes||'—'}</td></tr>`).join('')}</tbody></table></body></html>`
    const blob = new Blob([html],{type:'text/html'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='talentlaunch-applications.html'; a.click()
    showToast('📄 Exported as HTML (open in browser, print as PDF)')
  }
  function exportCSV() {
    if (apps.length === 0) { showToast('No applications to export'); return }
    const rows = apps.map(a => [a.company,a.role,a.status,a.date,a.salary||'',( a.notes||'').replace(/,/g,';'),a.url||'',a.contact||''].join(','))
    const blob = new Blob(['Company,Role,Status,Date,Salary,Notes,URL,Contact\n'+rows.join('\n')],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='applications.csv'; a.click()
    showToast('📥 CSV exported!')
  }

  const counts = STATUSES.reduce((acc,s) => ({...acc,[s]:apps.filter(a=>a.status===s).length}),{} as Record<string,number>)
  const applied = apps.filter(a => a.status !== 'saved').length
  const offerRate = applied > 0 ? Math.round((counts.offer/applied)*100) : 0

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-56 bg-[var(--el)] rounded-xl"/>
      <div className="grid grid-cols-5 gap-3">{[...Array(5)].map((_,i)=><div key={i} className="h-16 bg-[var(--el)] rounded-xl"/>)}</div>
      <div className="h-96 bg-[var(--el)] rounded-2xl"/>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">📊 Application Tracker</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">{apps.length} applications · {offerRate}% offer rate</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="border border-[var(--bdr)] text-[var(--t2)] px-4 py-2 rounded-xl text-sm hover:border-[var(--bds)]">📥 Export CSV</button>
          <button onClick={openAdd} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2 rounded-xl text-sm hover:shadow-[0_0_16px_rgba(0,220,255,0.3)]">+ Add Application</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {STATUSES.map(s => (
          <div key={s} className={`border rounded-xl p-3 text-center ${STATUS_CFG[s].color}`}>
            <div className="font-display font-extrabold text-2xl">{counts[s]||0}</div>
            <div className="text-[10px] font-semibold mt-0.5">{STATUS_CFG[s].label}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit">
        {(['kanban','list','analytics'] as const).map(v => (
          <button key={v} onClick={()=>setView(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${view===v?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{v}</button>
        ))}
      </div>

      {/* Empty state */}
      {apps.length === 0 && (
        <div className="text-center py-20 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl">
          <div className="text-5xl mb-4">📋</div>
          <div className="font-display font-bold text-xl mb-2">No applications yet</div>
          <p className="text-sm text-[var(--t2)] mb-6 max-w-xs mx-auto">Start tracking every job you apply to. Log saved jobs, applications, interviews, and offers.</p>
          <button onClick={openAdd} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-6 py-3 rounded-xl">+ Log First Application</button>
        </div>
      )}

      {/* KANBAN */}
      {view==='kanban' && apps.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STATUSES.map(s => {
            const col = apps.filter(a=>a.status===s)
            return (
              <div key={s} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${STATUS_CFG[s].dot}`}/>
                  <span className="text-xs font-semibold text-[var(--t2)]">{STATUS_CFG[s].label}</span>
                  <span className="ml-auto text-xs font-mono text-[var(--t3)]">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map(a=>(
                    <div key={a.id} onClick={()=>openEdit(a)} className="bg-[var(--el)] border border-[var(--bdr)] rounded-xl p-3 cursor-pointer hover:border-[var(--bds)]">
                      <div className="font-semibold text-xs leading-tight">{a.company}</div>
                      <div className="text-[10px] text-[var(--t2)] mt-0.5 truncate">{a.role}</div>
                      {a.salary&&<div className="text-[10px] text-green-400 mt-1 font-mono">{a.salary}</div>}
                      <div className="text-[10px] text-[var(--t3)] mt-1">{a.date}</div>
                    </div>
                  ))}
                  {col.length===0&&<div className="text-[10px] text-[var(--t3)] text-center py-4">Empty</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LIST */}
      {view==='list' && apps.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--bdr)] text-[var(--t3)] text-xs">
              {['Company','Role','Status','Date','Salary','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {apps.map(a=>(
                <tr key={a.id} className="border-b border-[var(--bdr)]/50 hover:bg-[var(--el)]">
                  <td className="px-4 py-3 font-semibold">{a.company}</td>
                  <td className="px-4 py-3 text-[var(--t2)] max-w-[140px] truncate">{a.role}</td>
                  <td className="px-4 py-3">
                    <select value={a.status} onChange={e=>updateStatus(a.id,e.target.value as App['status'])}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer bg-transparent outline-none ${STATUS_CFG[a.status].color}`}>
                      {STATUSES.map(s=><option key={s} value={s} className="bg-[var(--card)]">{STATUS_CFG[s].emoji} {STATUS_CFG[s].label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--t3)] text-xs">{a.date}</td>
                  <td className="px-4 py-3 text-green-400 font-mono text-xs">{a.salary||'—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(a)} className="text-xs text-cyan-400 hover:text-cyan-300">Edit</button>
                      <button onClick={()=>deleteApp(a.id)} className="text-xs text-red-400 hover:text-red-300">Del</button>
                      {a.url&&<a href={a.url} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300">Link</a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ANALYTICS */}
      {view==='analytics' && apps.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-4">📊 Funnel</div>
            {STATUSES.map(s => {
              const pct = apps.length>0 ? Math.round((counts[s]/apps.length)*100) : 0
              return (
                <div key={s} className="flex items-center gap-3 mb-3">
                  <div className="text-sm w-20 text-[var(--t2)]">{STATUS_CFG[s].label}</div>
                  <div className="flex-1 h-6 bg-[var(--el)] rounded-lg overflow-hidden">
                    <div className={`h-full rounded-lg flex items-center px-2 ${STATUS_CFG[s].dot} opacity-80`} style={{width:`${Math.max(pct,4)}%`}}>
                      {counts[s]>0&&<span className="text-[10px] font-bold text-white">{counts[s]}</span>}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[var(--t3)] w-8 text-right">{pct}%</div>
                </div>
              )
            })}
          </div>
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
            <div className="font-display font-bold text-base mb-4">📈 Metrics</div>
            <div className="grid grid-cols-2 gap-3">
              {[{l:'Total Applied',v:applied,c:'text-cyan-400'},{l:'Offer Rate',v:`${offerRate}%`,c:'text-green-400'},{l:'Interviewing',v:counts.interview||0,c:'text-purple-400'},{l:'Offers',v:counts.offer||0,c:'text-yellow-400'},{l:'Rejected',v:counts.rejected||0,c:'text-red-400'},{l:'Pipeline',v:counts.saved||0,c:'text-gray-400'}].map(m=>(
                <div key={m.l} className="bg-[var(--el)] rounded-xl p-3 text-center">
                  <div className={`font-display font-extrabold text-2xl ${m.c}`}>{m.v}</div>
                  <div className="text-[10px] text-[var(--t3)] mt-0.5">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
          {apps.filter(a=>a.notes).length > 0 && (
            <div className="md:col-span-2 bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5">
              <div className="font-display font-bold text-base mb-3">📝 Notes</div>
              <div className="space-y-2">
                {apps.filter(a=>a.notes).map(a=>(
                  <div key={a.id} className="bg-[var(--el)] rounded-xl p-3 flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_CFG[a.status].dot}`}/>
                    <div><div className="text-sm font-semibold">{a.company} — {a.role}</div><div className="text-xs text-[var(--t2)] mt-0.5">{a.notes}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--bds)] rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg">{editing?'Edit Application':'Log Application'}</h3>
              <button onClick={()=>setModal(false)} className="text-[var(--t3)] hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-3">
              {[['company','Company *','e.g. Google'],['role','Role *','e.g. SDE Intern'],['salary','Salary','e.g. ₹18 LPA'],['url','Job URL','https://...'],['contact','Contact/HR','Name or email']].map(([k,l,p])=>(
                <div key={k}><label className="text-xs text-[var(--t2)] block mb-1">{l}</label>
                  <input value={(form as any)[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={p}
                    className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50"/>
                </div>
              ))}
              <div><label className="text-xs text-[var(--t2)] block mb-1">Status</label>
                <select value={form.status||'applied'} onChange={e=>setForm({...form,status:e.target.value as App['status']})}
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50">
                  {STATUSES.map(s=><option key={s} value={s}>{STATUS_CFG[s].emoji} {STATUS_CFG[s].label}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Date Applied</label>
                <input type="date" value={form.date||''} onChange={e=>setForm({...form,date:e.target.value})}
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50"/>
              </div>
              <div><label className="text-xs text-[var(--t2)] block mb-1">Notes</label>
                <textarea value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} placeholder="Interview notes, contacts..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {editing&&<button onClick={()=>{deleteApp(editing.id);setModal(false)}} className="px-4 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10">Delete</button>}
              <button onClick={()=>setModal(false)} className="flex-1 border border-[var(--bdr)] text-[var(--t2)] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={submitForm} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold py-2.5 rounded-xl text-sm">{editing?'Save':'Log +20 XP'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
