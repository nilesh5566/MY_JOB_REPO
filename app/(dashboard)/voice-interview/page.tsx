'use client'
import { useState, useEffect, useRef } from 'react'

const QUESTIONS = [
  'Tell me about yourself.',
  'Why do you want to work here?',
  'What is your greatest strength?',
  'What is your greatest weakness?',
  'Describe a challenging project you worked on.',
  'Where do you see yourself in 5 years?',
  'Why are you leaving your current role?',
  'Tell me about a time you worked in a team.',
  'How do you handle tight deadlines?',
  'What makes you the best candidate for this role?',
]

type Message = { role: 'interviewer'|'user'; text: string; score?: number }

export default function VoiceInterviewPage(){
  const [role,setRole]         = useState('Software Engineer')
  const [company,setCompany]   = useState('Google')
  const [started,setStarted]   = useState(false)
  const [messages,setMessages] = useState<Message[]>([])
  const [listening,setListening] = useState(false)
  const [transcript,setTranscript] = useState('')
  const [loading,setLoading]   = useState(false)
  const [grading,setGrading]   = useState(false)
  const [grade,setGrade]       = useState<any>(null)
  const [qIndex,setQIndex]     = useState(0)
  const [micSupported,setMicSupported] = useState(true)
  const [toast,setToast]       = useState('')
  const recognitionRef = useRef<any>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesisUtterance|null>(null)

  useEffect(()=>{
    if(typeof window==='undefined') return
    if(!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)){
      setMicSupported(false)
    }
    return()=>{ recognitionRef.current?.stop(); window.speechSynthesis?.cancel() }
  },[])

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  },[messages])

  function speak(text:string){
    if(!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.9; utt.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const english = voices.find(v=>v.lang.startsWith('en'))
    if(english) utt.voice = english
    synthRef.current = utt
    window.speechSynthesis.speak(utt)
  }

  async function startInterview(){
    setStarted(true); setMessages([]); setGrade(null); setQIndex(0)
    setLoading(true)
    try{
      const res = await fetch('/api/ai',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          max_tokens:250,
          messages:[{role:'system',content:'You are a professional interviewer. Be warm but professional.'},{role:'user',content:`Start a ${role} interview at ${company}. Give a warm greeting and ask your first question. Keep it under 60 words.`}]
        })
      })
      const d = await res.json()
      const text = d.choices?.[0]?.message?.content || `Hello! Welcome to your ${role} interview at ${company}. I'm excited to learn more about you. Let's start — ${QUESTIONS[0]}`
      const msg:Message = {role:'interviewer',text}
      setMessages([msg])
      speak(text)
    }catch{
      const fallback = `Welcome! I'm your ${role} interviewer at ${company}. Let's begin. ${QUESTIONS[0]}`
      setMessages([{role:'interviewer',text:fallback}])
      speak(fallback)
    }
    setLoading(false)
  }

  function startListening(){
    if(!micSupported){ showToast('❌ Microphone not supported. Use Chrome.'); return }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (e:any) => {
      const t = Array.from(e.results).map((r:any)=>r[0].transcript).join('')
      setTranscript(t)
    }
    recognition.onend = () => { setListening(false) }
    recognition.onerror = () => { setListening(false); showToast('❌ Mic error. Try again.') }
    recognitionRef.current = recognition
    recognition.start()
    setListening(true); setTranscript('')
  }

  function stopListening(){
    recognitionRef.current?.stop()
    setListening(false)
  }

  async function submitAnswer(){
    if(!transcript.trim()){ showToast('⚠️ No answer detected — speak clearly'); return }
    const userMsg:Message = {role:'user', text:transcript}
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs); setTranscript(''); setLoading(true)
    const nextQ = qIndex + 1
    if(nextQ >= 6){
      // End interview
      setMessages(prev=>[...prev,{role:'interviewer',text:"That's all I have for now. Thank you so much for your time! We'll be in touch. How are you feeling about the interview?"}])
      speak("That's all I have. Thank you! We'll be in touch.")
      setLoading(false)
      gradeInterview(newMsgs)
      return
    }
    try{
      const history = newMsgs.map(m=>({role:m.role==='interviewer'?'assistant':'user',content:m.text}))
      const res = await fetch('/api/ai',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          max_tokens:200,
          messages:[{role:'system',content:`You are a ${role} interviewer at ${company}. Ask question ${nextQ+1} of 6. React briefly to the answer then ask the next question. Keep it conversational and under 60 words.`},...history]
        })
      })
      const d = await res.json()
      const text = d.choices?.[0]?.message?.content || QUESTIONS[nextQ]
      const msg:Message = {role:'interviewer',text}
      setMessages(prev=>[...prev,msg])
      speak(text)
      setQIndex(nextQ)
    }catch{ showToast('❌ AI error'); }
    setLoading(false)
  }

  async function gradeInterview(msgs:Message[]){
    setGrading(true)
    const transcript = msgs.map(m=>`${m.role==='interviewer'?'Interviewer':'You'}: ${m.text}`).join('\n\n')
    try{
      const res = await fetch('/api/ai',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          max_tokens:800,
          messages:[{role:'system',content:'You are an interview coach. Return ONLY valid JSON.'},{role:'user',content:`Grade this ${role} interview. Return JSON ONLY:
{"overallScore":72,"communication":80,"technicalDepth":65,"confidence":75,"clarity":78,"fillerWords":["um","like","basically"],"strengths":["Good eye contact analogy","Specific examples"],"improvements":["Add more metrics","Reduce filler words","Be more concise"],"bestAnswer":"Question X was answered best","worstAnswer":"Question Y needs work","verdict":"Ready for interviews with practice","starRating":4}

Interview:
${transcript.slice(0,1500)}`}]
        })
      })
      const d = await res.json()
      const text = d.choices?.[0]?.message?.content||''
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim())
      setGrade(parsed)
      localStorage.setItem('tl_xp',String(parseInt(localStorage.getItem('tl_xp')||'0')+25))
      const b=JSON.parse(localStorage.getItem('tl_badges')||'[]')
      if(!b.includes('mock_done'))localStorage.setItem('tl_badges',JSON.stringify([...b,'mock_done']))
    }catch(e:any){ showToast('❌ Grading failed: '+e.message) }
    setGrading(false)
  }

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(''),3000)}

  return(
    <div className="max-w-4xl mx-auto space-y-5">
      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--card)] border border-[var(--bds)] rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl">{toast}</div>}

      <div>
        <h1 className="font-display font-extrabold text-3xl">🎙️ Voice Mock Interview</h1>
        <p className="text-[var(--t2)] text-sm mt-0.5">Speak your answers aloud · AI listens, responds & grades you</p>
      </div>

      {!micSupported&&(
        <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-2xl p-4 text-sm text-yellow-200/80">
          ⚠️ Voice recognition requires Chrome or Edge browser. On other browsers, type your answers below.
        </div>
      )}

      {!started?(
        <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-8 space-y-6 text-center">
          <div className="text-6xl">🎙️</div>
          <div>
            <div className="font-display font-bold text-xl mb-2">AI-Powered Voice Interview</div>
            <p className="text-sm text-[var(--t2)] max-w-md mx-auto">The AI will play the role of an interviewer. Speak your answers naturally. Get graded on communication, confidence, technical depth, and more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            <div>
              <label className="text-xs text-[var(--t2)] block mb-1">Role</label>
              <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Software Engineer"
                className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50"/>
            </div>
            <div>
              <label className="text-xs text-[var(--t2)] block mb-1">Company</label>
              <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Google"
                className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50"/>
            </div>
          </div>
          <div className="bg-[var(--el)] rounded-xl p-4 max-w-md mx-auto text-left">
            <div className="text-xs font-semibold text-[var(--t2)] mb-2">How it works:</div>
            <div className="space-y-1 text-xs text-[var(--t3)]">
              <div>1. AI asks you 6 interview questions (speaks + shows text)</div>
              <div>2. Click 🎙️ Speak to record your answer</div>
              <div>3. Click ✅ Submit when done speaking</div>
              <div>4. After 6 questions, get a detailed scorecard</div>
            </div>
          </div>
          <button onClick={startInterview} disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold px-10 py-4 rounded-xl hover:shadow-[0_0_24px_rgba(0,220,255,0.4)] transition-all text-base disabled:opacity-50">
            {loading?'⏳ Starting...':'🎙️ Start Voice Interview'}
          </button>
        </div>
      ):(
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4 flex items-center gap-4">
            <div className="font-display font-bold text-sm">{role} @ {company}</div>
            <div className="flex-1 h-2 bg-[var(--el)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all" style={{width:`${Math.min(100,(qIndex/6)*100)}%`}}/>
            </div>
            <div className="text-xs text-[var(--t2)]">Q{qIndex+1}/6</div>
            <button onClick={()=>window.speechSynthesis?.cancel()} className="text-xs text-[var(--t3)] hover:text-white">🔇 Mute</button>
          </div>

          {/* Chat */}
          <div ref={chatRef} className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-4 max-h-80 overflow-y-auto">
            {messages.map((m,i)=>(
              <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role==='user'?'bg-cyan-500/20 text-cyan-100':'bg-[var(--el)]'}`}>
                  {m.role==='interviewer'&&<div className="text-[10px] font-semibold text-cyan-400 mb-1">🤖 Interviewer</div>}
                  {m.text}
                </div>
              </div>
            ))}
            {loading&&<div className="flex justify-start"><div className="bg-[var(--el)] rounded-2xl px-4 py-3 text-sm text-[var(--t3)] animate-pulse">Thinking...</div></div>}
          </div>

          {/* Voice input */}
          {!grade&&!grading&&(
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-5 space-y-3">
              {transcript&&(
                <div className="bg-[var(--el)] rounded-xl p-3 text-sm text-[var(--t)] min-h-12 leading-relaxed">
                  <span className="text-[10px] text-cyan-400 font-semibold block mb-1">Your answer:</span>
                  {transcript}
                  {listening&&<span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"/>}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={listening?stopListening:startListening}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all ${listening?'bg-red-500 text-white hover:bg-red-400 animate-pulse':'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-[0_0_16px_rgba(0,220,255,0.4)]'}`}>
                  {listening?<><span className="w-3 h-3 rounded-full bg-white animate-ping"/>Stop Listening</>:<>🎙️ Speak Your Answer</>}
                </button>
                {transcript&&!listening&&(
                  <button onClick={submitAnswer} disabled={loading}
                    className="px-6 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50">✅ Submit</button>
                )}
              </div>
              {!micSupported&&(
                <textarea value={transcript} onChange={e=>setTranscript(e.target.value)} rows={3}
                  placeholder="Type your answer here (voice not available)..."
                  className="w-full bg-[var(--el)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-cyan-500/50 resize-none"/>
              )}
            </div>
          )}

          {/* Grading spinner */}
          {grading&&(
            <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3 animate-bounce">📊</div>
              <div className="font-display font-bold text-lg">Grading your performance...</div>
              <div className="text-sm text-[var(--t2)] mt-1">Analysing communication, confidence, technical depth</div>
            </div>
          )}

          {/* Grade card */}
          {grade&&(
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-cyan-500/8 to-purple-500/8 border border-cyan-500/20 rounded-2xl p-6">
                <div className="font-display font-bold text-xl mb-4">📊 Interview Scorecard</div>
                <div className="flex items-center gap-6 mb-5">
                  <div className="text-center">
                    <div className={`font-display font-extrabold text-6xl ${grade.overallScore>=70?'text-green-400':grade.overallScore>=50?'text-yellow-400':'text-red-400'}`}>{grade.overallScore}</div>
                    <div className="text-sm text-[var(--t2)]">Overall Score</div>
                    <div className="text-2xl mt-1">{'⭐'.repeat(grade.starRating||3)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-1">{grade.verdict}</div>
                    {grade.bestAnswer&&<div className="text-xs text-green-400 mt-2">✅ Best: {grade.bestAnswer}</div>}
                    {grade.worstAnswer&&<div className="text-xs text-red-400 mt-1">⚠️ Weakest: {grade.worstAnswer}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[['Communication',grade.communication,'text-cyan-400'],['Technical',grade.technicalDepth,'text-purple-400'],['Confidence',grade.confidence,'text-yellow-400'],['Clarity',grade.clarity,'text-green-400']].map(([l,v,c])=>(
                    <div key={String(l)} className="bg-[var(--el)] rounded-xl p-3 text-center">
                      <div className={`font-bold text-lg ${c}`}>{v}/100</div>
                      <div className="text-[10px] text-[var(--t3)] mt-0.5">{l}</div>
                      <div className="h-1 bg-[var(--card)] rounded-full mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${c.replace('text-','bg-')}`} style={{width:`${v}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4">
                  <div className="text-xs font-semibold text-green-400 mb-2">✅ Strengths</div>
                  {(grade.strengths||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-1">• {s}</div>)}
                </div>
                <div className="bg-[var(--card)] border border-[var(--bdr)] rounded-2xl p-4">
                  <div className="text-xs font-semibold text-yellow-400 mb-2">⚠️ Improve</div>
                  {(grade.improvements||[]).map((s:string,i:number)=><div key={i} className="text-xs text-[var(--t2)] py-1">• {s}</div>)}
                  {grade.fillerWords?.length>0&&<div className="text-xs text-red-400 mt-2">🚫 Filler words: {grade.fillerWords.join(', ')}</div>}
                </div>
              </div>
              <button onClick={()=>{setStarted(false);setMessages([]);setGrade(null);setQIndex(0)}}
                className="w-full border border-[var(--bdr)] text-[var(--t2)] py-3 rounded-xl text-sm hover:border-[var(--bds)]">🔄 Start New Interview</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
