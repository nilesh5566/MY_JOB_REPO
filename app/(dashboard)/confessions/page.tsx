'use client'
import { useState, useEffect } from 'react'

type Post = { id:string; text:string; type:'rejection'|'offer'|'vent'|'win'; company?:string; upvotes:number; replies:number; time:string; emoji:string }

const SEED_POSTS: Post[] = [
  {id:'s1',text:"Got rejected by Amazon after 5 rounds of interviews. The HR didn't even email me. Found out by logging into the portal 3 weeks later. Still going. 💪",type:'rejection',company:'Amazon',upvotes:847,replies:43,time:'2h ago',emoji:'💪'},
  {id:'s2',text:"JUST GOT MY GOOGLE OFFER. 47 rejections over 8 months. Applied every week. Used TalentLaunch AI mock interviews every day. It's possible. Don't give up. 🎉",type:'offer',company:'Google',upvotes:2341,replies:127,time:'4h ago',emoji:'🎉'},
  {id:'s3',text:"Why do companies make you do 6 rounds and then say 'we went with a candidate who had more experience'? The job said 0-2 years. I had 1 year. WHAT.",type:'vent',upvotes:1203,replies:89,time:'6h ago',emoji:'😤'},
  {id:'s4',text:"Tip: Apply on Monday/Tuesday morning. I applied same role same company twice. Monday application got a call. Friday one — silence. Timing matters.",type:'win',upvotes:456,replies:31,time:'8h ago',emoji:'💡'},
  {id:'s5',text:"Just got my 10th rejection this month. My parents think I have a job already because I'm too embarrassed to tell them. This is harder than I thought.",type:'rejection',upvotes:934,replies:67,time:'1d ago',emoji:'😔'},
  {id:'s6',text:"Razorpay SDE-1 offer received! ₹22 LPA. 3 months of prep. The mock interviews on this app literally asked the exact same design question. I kid you not.",type:'offer',company:'Razorpay',upvotes:1567,replies:94,time:'1d ago',emoji:'🚀'},
  {id:'s7',text:"Interviewer asked me to reverse a linked list then spent 40 minutes on a deep dive about their company culture and never told me if I passed. 3 weeks later — ghosted.",type:'vent',upvotes:789,replies:52,time:'2d ago',emoji:'👻'},
  {id:'s8',text:"Resume tip: Changed 'Worked on' to 'Built', 'Helped with' to 'Led', 'Made' to 'Architected'. Same resume, 3x more callbacks in 1 week.",type:'win',upvotes:2109,replies:115,time:'2d ago',emoji:'📝'},
  {id:'s9',text:"Day 143 of applying. Still no offer. Still applying. If you're reading this struggling too — we got this. 💙",type:'rejection',upvotes:3421,replies:201,time:'3d ago',emoji:'💙'},
  {id:'s10',text:"Microsoft New Grad! ₹42 LPA! Tier-3 college. 0 projects on my resume when I started. 8 months of consistent grinding. Your college doesn't define you.",type:'offer',company:'Microsoft',upvotes:4102,replies:312,time:'3d ago',emoji:'🏆'},
]

const TYPE_CONFIG = {
  rejection:{ label:'Rejection', emoji:'💪', bg:'bg-red-500/8 border-red-500/20',    badge:'bg-red-500/15 text-red-400'    },
  offer:    { label:'Offer!',    emoji:'🎉', bg:'bg-green-500/8 border-green-500/20', badge:'bg-green-500/15 text-green-400'  },
  vent:     { label:'Vent',      emoji:'😤', bg:'bg-yellow-500/8 border-yellow-500/15',badge:'bg-yellow-500/15 text-yellow-400'},
  win:      { label:'Tip/Win',   emoji:'💡', bg:'bg-cyan-500/8 border-cyan-500/15',   badge:'bg-cyan-500/15 text-cyan-400'   },
}

export default function ConfessionsPage(){
  const [posts,setPosts]     = useState<Post[]>(SEED_POSTS)
  const [filter,setFilter]   = useState<'all'|'rejection'|'offer'|'vent'|'win'>('all')
  const [form,setForm]       = useState({text:'',type:'rejection' as Post['type'],company:''})
  const [showForm,setShowForm] = useState(false)
  const [upvoted,setUpvoted] = useState<string[]>([])
  const [toast,setToast]     = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const custom = JSON.parse(localStorage.getItem('tl_confessions')||'[]')
    const uv = JSON.parse(localStorage.getItem('tl_upvoted_conf')||'[]')
    setPosts([...custom,...SEED_POSTS])
    setUpvoted(uv)
    setLoading(false)
  },[])

  function submit(){
    if(form.text.trim().length<20){ showToast('⚠️ Write at least 20 characters'); return }
    const emojis={'rejection':'💪','offer':'🎉','vent':'😤','win':'💡'}
    const post:Post={
      id:`c_${Date.now()}`,text:form.text.trim(),type:form.type,
      company:form.company||undefined,upvotes:0,replies:0,
      time:'Just now',emoji:emojis[form.type]
    }
    const custom=JSON.parse(localStorage.getItem('tl_confessions')||'[]')
    localStorage.setItem('tl_confessions',JSON.stringify([post,...custom]))
    setPosts(p=>[post,...p])
    setForm({text:'',type:'rejection',company:''})
    setShowForm(false)
    showToast('✅ Posted anonymously! 🎭')
  }

  function upvote(id:string){
    if(upvoted.includes(id))return
    setPosts(p=>p.map(post=>post.id===id?{...post,upvotes:post.upvotes+1}:post))
    const uv=[...upvoted,id]
    setUpvoted(uv); localStorage.setItem('tl_upvoted_conf',JSON.stringify(uv))
  }

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(''),2500)}

  const filtered = filter==='all'?posts:posts.filter(p=>p.type===filter)
  const sorted   = [...filtered].sort((a,b)=>b.upvotes-a.upvotes)

  if(loading) return <div className="animate-pulse space-y-3 max-w-3xl mx-auto">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-[var(--el)] rounded-2xl"/>)}</div>

  return(
    <div className="max-w-3xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl">💬 Confessions</h1>
          <p className="text-[var(--t2)] text-sm mt-0.5">100% anonymous · vent about rejections · celebrate offers</p>
        </div>
        <button onClick={()=>setShowForm(p=>!p)}
          className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-4 py-2 rounded-xl text-sm">
          {showForm?'× Cancel':'✍️ Post Anonymously'}
        </button>
      </div>

      {/* Post form */}
      {showForm&&(
        <div className="bg-[var(--card)] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
          <div className="text-sm font-semibold text-cyan-400">🎭 100% Anonymous — no name, email, or IP stored</div>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(TYPE_CONFIG) as Post['type'][]).map(t=>(
              <button key={t} onClick={()=>setForm(p=>({...p,type:t}))}
                className={`text-sm px-3 py-1.5 rounded-xl border font-semibold transition-all ${form.type===t?TYPE_CONFIG[t].badge+' border-current':' border-[var(--bdr)] text-[var(--t2)]'}`}>
                {TYPE_CONFIG[t].emoji} {TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
          <textarea value={form.text} onChange={e=>setForm(p=>({...p,text:e.target.value}))} rows={4}
            placeholder={form.type==='offer'?"I just got an offer at ___ after ___ rejections. Here's what worked..."
              :form.type==='rejection'?"Got rejected by ___ after ___ rounds. Here's what happened..."
              :form.type==='vent'?"I can't believe companies actually..."
              :"Tip that actually works: ..."
            }
            className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none placeholder:text-[var(--t3)]"/>
          <div className="flex gap-3">
            {(form.type==='offer'||form.type==='rejection')&&(
              <input value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} placeholder="Company (optional)"
                className="flex-1 bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 placeholder:text-[var(--t3)]"/>
            )}
            <button onClick={submit} className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm">Post →</button>
          </div>
          <div className="text-xs text-[var(--t3)]">{form.text.length} chars · minimum 20</div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(TYPE_CONFIG) as Post['type'][]).map(t=>(
          <div key={t} className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${filter===t?TYPE_CONFIG[t].bg:'bg-[var(--card)] border-[var(--bdr)] hover:border-[var(--bds)]'}`}
            onClick={()=>setFilter(filter===t?'all':t)}>
            <div className="text-xl">{TYPE_CONFIG[t].emoji}</div>
            <div className="text-xs font-semibold mt-0.5">{posts.filter(p=>p.type===t).length}</div>
            <div className="text-[9px] text-[var(--t3)]">{TYPE_CONFIG[t].label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[var(--el)] p-1 rounded-xl w-fit">
        {['all','offer','rejection','vent','win'].map(f=>(
          <button key={f} onClick={()=>setFilter(f as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter===f?'bg-[var(--card)] text-white shadow':'text-[var(--t2)] hover:text-white'}`}>{f==='all'?'🔥 Top':f}</button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {sorted.map(post=>{
          const cfg = TYPE_CONFIG[post.type]
          return(
            <div key={post.id} className={`border rounded-2xl p-5 ${cfg.bg}`}>
              <div className="flex items-start gap-3">
                <button onClick={()=>upvote(post.id)}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border min-w-[48px] transition-all ${upvoted.includes(post.id)?'bg-cyan-500/15 border-cyan-500/30 text-cyan-400':'border-[var(--bdr)] text-[var(--t3)] hover:border-[var(--bds)]'}`}>
                  <span className="text-sm">▲</span>
                  <span className="text-xs font-bold">{post.upvotes}</span>
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.emoji} {cfg.label}</span>
                    {post.company&&<span className="text-[10px] font-semibold text-cyan-400">{post.company}</span>}
                    <span className="text-[10px] text-[var(--t3)] ml-auto">{post.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{post.text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
