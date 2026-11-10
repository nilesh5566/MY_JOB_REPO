

























































































































































































































import { NextRequest, NextResponse } from 'next/server'

const SAL: Record<string, Record<string, string>> = {
  'AI/ML':         { in:'₹6–14 LPA',  us:'$75k–$130k', eu:'€50k–€85k',  remote:'$60k–$110k' },
  'Data Science':  { in:'₹5–12 LPA',  us:'$65k–$110k', eu:'€42k–€75k',  remote:'$55k–$92k'  },
  'Full Stack':    { in:'₹4–10 LPA',  us:'$60k–$100k', eu:'€40k–€70k',  remote:'$52k–$88k'  },
  'Cloud/DevOps':  { in:'₹6–14 LPA',  us:'$75k–$130k', eu:'€50k–€88k',  remote:'$65k–$105k' },
  'Android/iOS':   { in:'₹4–10 LPA',  us:'$65k–$108k', eu:'€42k–€72k',  remote:'$56k–$92k'  },
  'Blockchain':    { in:'₹6–16 LPA',  us:'$80k–$145k', eu:'€55k–€92k',  remote:'$70k–$125k' },
  'Cybersecurity': { in:'₹5–13 LPA',  us:'$72k–$125k', eu:'€48k–€83k',  remote:'$62k–$105k' },
  'QA/Testing':    { in:'₹3–8 LPA',   us:'$55k–$95k',  eu:'€35k–€62k',  remote:'$45k–$78k'  },
  'UI/UX':         { in:'₹4–9 LPA',   us:'$60k–$100k', eu:'€38k–€68k',  remote:'$50k–$85k'  },
  'Software Dev':  { in:'₹4–11 LPA',  us:'$65k–$108k', eu:'€40k–€72k',  remote:'$54k–$90k'  },
}
const SKILL_MAP: Record<string, string[]> = {
  'AI/ML':        ['machine learning','deep learning','nlp','tensorflow','pytorch','ai','ml','llm','generative','gpt','computer vision','langchain','rag','diffusion'],
  'Data Science': ['data science','data analyst','pandas','sql','analytics','tableau','spark','statistics','bi','looker','dbt','airflow','databricks'],
  'Full Stack':   ['full stack','fullstack','frontend','backend','react','node','javascript','typescript','vue','angular','next.js','svelte','remix'],
  'Cloud/DevOps': ['aws','azure','gcp','kubernetes','docker','devops','terraform','cloud','ci/cd','sre','platform engineer','ansible','helm','infra'],
  'Android/iOS':  ['android','ios','flutter','kotlin','swift','mobile','react native','xamarin','jetpack','compose'],
  'Blockchain':   ['blockchain','web3','solidity','ethereum','smart contract','defi','nft','crypto','polygon'],
  'Cybersecurity':['security','cyber','penetration','soc','siem','firewall','vulnerability','devsecops','ctf','appsec'],
  'QA/Testing':   ['qa','quality assurance','testing','selenium','cypress','jest','playwright','automation test','pytest'],
  'UI/UX':        ['ui/ux','ux designer','ui designer','figma','sketch','product design','user research'],
}
const RATINGS: Record<string, [number, number]> = {
  google:[4.5,4.0],microsoft:[4.3,4.1],amazon:[3.7,3.2],meta:[4.1,3.8],apple:[4.2,4.0],
  netflix:[4.4,4.2],stripe:[4.4,4.2],shopify:[4.4,4.3],atlassian:[4.3,4.4],spotify:[4.3,4.2],
  github:[4.2,4.3],figma:[4.2,4.1],notion:[4.1,4.0],cloudflare:[4.3,4.1],nvidia:[4.4,3.9],
  openai:[4.4,3.8],anthropic:[4.5,4.2],salesforce:[4.1,3.9],adobe:[4.1,4.0],oracle:[3.5,3.2],
  uber:[3.9,3.4],airbnb:[4.2,4.1],linkedin:[4.2,4.0],snap:[3.7,3.5],pinterest:[3.8,3.7],
  razorpay:[4.2,3.9],swiggy:[3.9,3.5],zepto:[3.8,3.3],meesho:[3.9,3.7],groww:[4.1,3.8],
  phonepe:[3.8,3.6],freshworks:[4.0,4.1],zoho:[3.8,3.6],tcs:[3.6,3.3],infosys:[3.5,3.2],
  wipro:[3.4,3.1],cognizant:[3.6,3.2],hcl:[3.5,3.2],accenture:[3.8,3.4],ibm:[3.7,3.5],
  samsung:[3.9,3.6],intel:[4.0,3.8],qualcomm:[4.0,3.8],amd:[4.1,3.9],arm:[4.2,4.0],
  deloitte:[3.7,3.5],pwc:[3.8,3.6],capgemini:[3.6,3.3],thoughtworks:[4.2,4.1],
  gitlab:[4.2,4.3],hashicorp:[4.1,4.2],automattic:[4.3,4.4],basecamp:[4.4,4.5],
  canva:[4.3,4.2],duolingo:[4.2,4.1],discord:[4.1,4.0],twilio:[3.9,3.8],
  zalando:[4.0,3.9],booking:[4.1,4.0],revolut:[3.8,3.5],adyen:[4.2,4.1],
  grab:[3.8,3.6],sea:[3.9,3.7],coinbase:[4.0,3.8],databricks:[4.4,4.1],
  reddit:[4.0,3.9],doordash:[3.8,3.5],brex:[4.2,4.0],ramp:[4.3,4.2],
  plaid:[4.2,4.0],vercel:[4.4,4.3],linear:[4.5,4.4],supabase:[4.4,4.3],
  posthog:[4.4,4.4],sentry:[4.2,4.1],grafana:[4.3,4.2],sourcegraph:[4.3,4.2],
  datadog:[4.2,4.0],confluent:[4.3,4.1],mongodb:[4.1,4.0],elastic:[4.0,4.0],
  groq:[4.2,4.0],huggingface:[4.4,4.2],cohere:[4.2,4.0],mistral:[4.3,4.1],
  perplexity:[4.4,4.2],rippling:[4.2,4.0],lattice:[4.1,4.0],postman:[4.2,4.1],
  juspay:[4.1,3.9],sprinklr:[3.9,3.7],browserstack:[4.1,4.0],
}

function getReview(name: string) {
  const n = (name || '').toLowerCase()
  for (const [k, v] of Object.entries(RATINGS)) { if (n.includes(k)) return { rating: v[0], wlb: v[1] } }
  const h = [...n].reduce((a, c) => a + c.charCodeAt(0), 0)
  return { rating: +(3.2 + (h % 18) / 10).toFixed(1), wlb: +(3.1 + ((h + 3) % 19) / 10).toFixed(1) }
}

function estSal(title: string, tags: string[], loc: string, sal: string | null) {
  if (sal && sal !== '—' && sal.trim()) return sal
  const t = `${title} ${tags.join(' ')}`.toLowerCase()
  const l = (loc || '').toLowerCase()
  let r = 'remote'
  if (/india|bangalore|bengaluru|mumbai|hyderabad|pune|delhi|chennai|kolkata|noida|gurgaon|gurugram|ahmedabad|jaipur/.test(l)) r = 'in'
  else if (/\bus\b|usa|united states|new york|san francisco|seattle|austin|boston|chicago|los angeles|denver/.test(l)) r = 'us'
  else if (/uk|united kingdom|london|europe|germany|berlin|paris|amsterdam|stockholm|dublin|warsaw/.test(l)) r = 'eu'
  else if (/canada|toronto|vancouver|montreal/.test(l)) r = 'us'
  else if (/australia|sydney|melbourne/.test(l)) r = 'us'
  let d = 'Software Dev'
  for (const [s, kws] of Object.entries(SKILL_MAP)) { if (kws.some(k => t.includes(k))) { d = s; break } }
  return SAL[d]?.[r] || SAL['Software Dev'][r]
}

function relDate(d: string | number) {
  try {
    const str = String(d || '')
    const ms = /^\d{9,}$/.test(str) ? parseInt(str) * 1000 : new Date(str).getTime()
    if (!ms || isNaN(ms)) return 'Recently'
    const days = Math.floor((Date.now() - ms) / 86400000)
    if (days <= 0) return 'Today'; if (days === 1) return '1d ago'
    if (days <= 6) return `${days}d ago`; if (days <= 29) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  } catch { return 'Recently' }
}

const FK = ['intern','internship','fresher','entry level','entry-level','junior','graduate','trainee','new grad','0-1 year','0-2 year','campus','associate','early career','recent graduate','apprentice','grad 2025','grad 2026','university hire','college hire','fresh grad','undergraduate']

function isFresh(title: string, tags: string[], desc: string) {
  return FK.some(k => `${title} ${tags.join(' ')} ${desc}`.toLowerCase().includes(k))
}

function strip(h: string) {
  return (h || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
}

function mkJob(id: string, title: string, co: string, loc: string, type: string, url: string, posted: string, src: string, tags: string[], remote: boolean, sal: string | null, desc = '') {
  if (!title?.trim() || !co?.trim() || !url?.trim() || url === '#') return null
  return {
    id, title: title.trim(), company: co.trim(), location: loc || 'Global', type: type || 'Full-time',
    url, posted, source: src, tags: tags.filter(Boolean).map(t => String(t).trim()).slice(0, 6),
    isRemote: remote, salary: sal, description: strip(desc),
    estimatedSalary: estSal(title, tags, loc, sal),
    review: getReview(co), isFresher: isFresh(title, tags, desc),
  }
}

async function sf(url: string, opts: any = {}, timeoutMs = 6000): Promise<Response> {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), timeoutMs)
  try { const r = await fetch(url, { ...opts, signal: ac.signal }); clearTimeout(t); return r }
  catch (e) { clearTimeout(t); throw e }
}


async function fetchRemotive(): Promise<any[]> {
  const cats = ['software-dev', 'data', 'devops-sysadmin', 'product', 'design', 'all-others']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(cats.map(c =>
      sf(`https://remotive.com/api/remote-jobs?category=${c}&limit=50`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`rem_${j.id}`, j.title, j.company_name, j.candidate_required_location || 'Remote', j.job_type || 'Full-time', j.url, relDate(j.publication_date), 'Remotive', (j.tags || []).slice(0, 6), true, j.salary || null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchRemotiveSearch(): Promise<any[]> {
  const searches = ['engineer', 'developer', 'python', 'react', 'java', 'golang', 'machine learning', 'data', 'cloud', 'mobile', 'security', 'qa']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(searches.map(q =>
      sf(`https://remotive.com/api/remote-jobs?limit=30&search=${encodeURIComponent(q)}`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`rems_${j.id}`, j.title, j.company_name, j.candidate_required_location || 'Remote', j.job_type || 'Full-time', j.url, relDate(j.publication_date), 'Remotive+', (j.tags || []).slice(0, 6), true, j.salary || null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchArbeitnow(): Promise<any[]> {
  const results: any[] = []
  try {
    const pages = await Promise.allSettled([1, 2, 3, 4, 5].map(p =>
      sf(`https://www.arbeitnow.com/api/job-board-api?page=${p}`).then(r => r.json())
    ))
    pages.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.data || []).forEach((j: any) => {
        const posted = typeof j.created_at === 'number' ? relDate(String(j.created_at)) : relDate(j.created_at || '')
        const job = mkJob(`arb_${j.slug}`, j.title, j.company_name, j.location || 'Europe', (j.job_types || ['Full-time'])[0], j.url, posted, 'Arbeitnow', (j.tags || []).slice(0, 6), !!j.remote, null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchArbeitnowFeatured(): Promise<any[]> {
  try {
    const r = await sf('https://arbeitnow.com/api/job-board-api?featured=true')
    const d = await r.json()
    return (d.data || []).map((j: any) => mkJob(`arbf_${j.slug}`, j.title, j.company_name, j.location || 'Europe', (j.job_types || ['Full-time'])[0], j.url, typeof j.created_at === 'number' ? relDate(String(j.created_at)) : relDate(j.created_at || ''), 'Arbeitnow Pro', (j.tags || []).slice(0, 6), !!j.remote, null, j.description || '')).filter(Boolean)
  } catch { return [] }
}

async function fetchJobicy(): Promise<any[]> {
  const tags = ['developer', 'engineer', 'python', 'javascript', 'typescript', 'data', 'devops', 'machine-learning', 'react', 'backend', 'frontend', 'fullstack', 'golang', 'rust', 'java']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(tags.map(t =>
      sf(`https://jobicy.com/api/v2/remote-jobs?count=25&tag=${t}`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const jt = [...(j.jobIndustry || []), ...(j.jobLevel || [])].slice(0, 6)
        const job = mkJob(`jcy_${j.id}`, j.jobTitle, j.companyName, j.jobGeo || 'Remote', j.jobType || 'Full-time', j.url, relDate(j.pubDate), 'Jobicy', jt, true, j.annualSalaryMin ? `$${j.annualSalaryMin}k–$${j.annualSalaryMax}k` : null, j.jobDescription || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchRemoteOK(): Promise<any[]> {
  try {
    const r = await sf('https://remoteok.com/api', { headers: { 'User-Agent': 'Mozilla/5.0 TalentLaunch/3.0' } }, 10000)
    const d = await r.json(); const seen = new Set<string>(); const results: any[] = []
    ;(Array.isArray(d) ? d : []).filter((j: any) => j.id && j.position).slice(0, 100).forEach((j: any) => {
      if (seen.has(String(j.id))) return; seen.add(String(j.id))
      const job = mkJob(`rok_${j.id}`, j.position, j.company || 'Remote Co', 'Remote Worldwide', 'Full-time', j.url || `https://remoteok.com/l/${j.id}`, relDate(j.date), 'RemoteOK', (j.tags || []).slice(0, 6), true, j.salary_min ? `$${Math.round(j.salary_min / 1000)}k–$${Math.round((j.salary_max || j.salary_min * 1.4) / 1000)}k` : null, j.description || '')
      if (job) results.push(job)
    })
    return results
  } catch { return [] }
}

async function fetchHNHiring(): Promise<any[]> {
  try {
    const now = new Date()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    let postId: string | undefined
    for (const label of [`${months[now.getMonth()]} ${now.getFullYear()}`, `${months[prev.getMonth()]} ${prev.getFullYear()}`]) {
      const s = await sf(`https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent('Ask HN: Who is hiring? (' + label + ')')}&tags=ask_hn&hitsPerPage=1`)
      const sd = await s.json(); postId = sd.hits?.[0]?.objectID; if (postId) break
    }
    if (!postId) return []
    const cs = await sf(`https://hn.algolia.com/api/v1/search?tags=comment,story_${postId}&hitsPerPage=100`)
    const cd = await cs.json(); const results: any[] = []
    ;(cd.hits || []).filter((c: any) => (c.comment_text?.length || 0) > 80).slice(0, 100).forEach((c: any, i: number) => {
      const text = (c.comment_text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      const parts = text.split('|').map((p: string) => p.trim())
      const job = mkJob(`hn_${postId}_${i}`, (parts[1] || 'Software Engineer').slice(0, 70), (parts[0] || 'Tech Company').slice(0, 50), (parts[2] || 'Remote').slice(0, 50), 'Full-time', `https://news.ycombinator.com/item?id=${c.objectID}`, 'Recently', 'HN Hiring', ['Engineering'], /remote/i.test(parts[2] || ''), null, text.slice(0, 400))
      if (job) results.push(job)
    })
    return results
  } catch { return [] }
}

async function fetchHimalayas(): Promise<any[]> {
  try {
    const r = await sf('https://himalayas.app/jobs/api?limit=100'); const d = await r.json()
    return (d.jobs || []).map((j: any) => mkJob(`him_${j.id}`, j.title, j.company?.name || 'Unknown', 'Remote / Global', j.type || 'Full-time', j.applicationUrl || j.applyUrl || j.url || 'https://himalayas.app/jobs', relDate(j.createdAt || j.created_at || ''), 'Himalayas', [...(j.skills || []), ...(j.categories || [])].slice(0, 6), true, j.salary || null, j.description || '')).filter(Boolean)
  } catch { return [] }
}

async function fetchTheMuse(): Promise<any[]> {
  const combos = ['level=Entry+Level&category=Engineering', 'level=Internship&category=Engineering', 'level=Entry+Level&category=Data+%26+Analytics', 'level=Entry+Level&category=IT', 'level=Entry+Level&category=Science+%26+Engineering']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(combos.map(q => sf(`https://www.themuse.com/api/public/jobs?page=1&${q}&descending=true`).then(r => r.json())))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.results || []).slice(0, 25).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const locs = (j.locations || []).map((l: any) => l.name).join(', ') || 'USA'
        const job = mkJob(`muse_${j.id}`, j.name, j.company?.name || 'Unknown', locs, 'Full-time', `https://www.themuse.com${j.refs?.landing_page || '/jobs'}`, relDate(j.publication_date), 'The Muse', [j.categories?.[0]?.name || 'Engineering'], /remote|flexible/i.test(locs), null, j.contents || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchWorkingNomads(): Promise<any[]> {
  const cats = ['development', 'data', 'design', 'devops', 'product', 'mobile', 'testing', 'management', 'backend', 'frontend']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(cats.map(c =>
      sf(`https://www.workingnomads.com/api/exposed_jobs/?category=${c}&limit=40`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`wn_${j.id}`, j.title, j.company_name || j.company || 'Remote Co', j.region || 'Remote Worldwide', 'Full-time', j.url, relDate(j.pub_date), 'Working Nomads', [j.category || 'Development'], true, null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}


async function fetchGreenhouse(): Promise<any[]> {
  const boards = [
    { b: 'anthropic', co: 'Anthropic' }, { b: 'openai', co: 'OpenAI' }, { b: 'figma', co: 'Figma' },
    { b: 'notion', co: 'Notion' }, { b: 'discord', co: 'Discord' }, { b: 'duolingo', co: 'Duolingo' },
    { b: 'linear', co: 'Linear' }, { b: 'ramp', co: 'Ramp' }, { b: 'brex', co: 'Brex' },
    { b: 'plaid', co: 'Plaid' }, { b: 'gusto', co: 'Gusto' }, { b: 'airtable', co: 'Airtable' },
    { b: 'amplitude', co: 'Amplitude' }, { b: 'databricks', co: 'Databricks' }, { b: 'asana', co: 'Asana' },
    { b: 'benchling', co: 'Benchling' }, { b: 'checkr', co: 'Checkr' }, { b: 'mixpanel', co: 'Mixpanel' },
    { b: 'segment', co: 'Segment' }, { b: 'twilio', co: 'Twilio' }, { b: 'zendesk', co: 'Zendesk' },
    { b: 'mongodb', co: 'MongoDB' }, { b: 'elastic', co: 'Elastic' }, { b: 'hashicorp', co: 'HashiCorp' },
    { b: 'confluent', co: 'Confluent' }, { b: 'datadog', co: 'Datadog' }, { b: 'cloudflare', co: 'Cloudflare' },
    { b: 'okta', co: 'Okta' }, { b: 'carta', co: 'Carta' }, { b: 'chime', co: 'Chime' },
    { b: 'stripe', co: 'Stripe' }, { b: 'razorpay', co: 'Razorpay' }, { b: 'phonepe', co: 'PhonePe' },
    { b: 'meesho', co: 'Meesho' }, { b: 'freshworks', co: 'Freshworks' }, { b: 'zepto', co: 'Zepto' },
    { b: 'sprinklr', co: 'Sprinklr' }, { b: 'flipkart', co: 'Flipkart' }, { b: 'postman', co: 'Postman' },
    { b: 'clevertap', co: 'CleverTap' },
  ]
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(boards.map(b =>
      sf(`https://boards-api.greenhouse.io/v1/boards/${b.b}/jobs?content=false`).then(r => r.json()).then(d => ({ d, co: b.co, board: b.b }))
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      const { d, co, board } = res.value
      ;(d.jobs || []).slice(0, 12).forEach((j: any) => {
        const key = `${j.title}|${co}`; if (seen.has(key)) return; seen.add(key)
        const loc = j.location?.name || 'Remote'
        const isSalary = co === 'Razorpay' ? '₹18–28 LPA' : co === 'PhonePe' ? '₹14–22 LPA' : co === 'Meesho' ? '₹14–22 LPA' : co === 'Flipkart' ? '₹18–35 LPA' : co === 'Freshworks' ? '₹12–18 LPA' : null
        const job = mkJob(`gh_${board}_${j.id}`, j.title, co, loc, 'Full-time', j.absolute_url || `https://boards.greenhouse.io/${board}`, 'Recently', 'Greenhouse', (j.departments?.map((d: any) => d.name) || []).slice(0, 5), /remote|worldwide|anywhere/i.test(loc), isSalary, '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchLever(): Promise<any[]> {
  const companies = [
    { s: 'netflix', co: 'Netflix' }, { s: 'airbnb', co: 'Airbnb' }, { s: 'lyft', co: 'Lyft' },
    { s: 'stripe', co: 'Stripe' }, { s: 'reddit', co: 'Reddit' }, { s: 'coinbase', co: 'Coinbase' },
    { s: 'robinhood', co: 'Robinhood' }, { s: 'dropbox', co: 'Dropbox' }, { s: 'instacart', co: 'Instacart' },
    { s: 'databricks', co: 'Databricks' }, { s: 'doordash', co: 'DoorDash' }, { s: 'figma', co: 'Figma' },
    { s: 'vercel', co: 'Vercel' }, { s: 'hashicorp', co: 'HashiCorp' }, { s: 'rippling', co: 'Rippling' },
    { s: 'lattice', co: 'Lattice' }, { s: 'watershed', co: 'Watershed' }, { s: 'scale', co: 'Scale AI' },
    { s: 'perplexity', co: 'Perplexity AI' }, { s: 'cohere', co: 'Cohere' }, { s: 'anyscale', co: 'Anyscale' },
    { s: 'modal-labs', co: 'Modal Labs' }, { s: 'together-ai', co: 'Together AI' }, { s: 'retool', co: 'Retool' },
    { s: 'cloudflare', co: 'Cloudflare' }, { s: 'groww', co: 'Groww' }, { s: 'cred', co: 'CRED' },
    { s: 'swiggy', co: 'Swiggy' }, { s: 'juspay', co: 'Juspay' }, { s: 'postman', co: 'Postman' },
  ]
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(companies.map(c =>
      sf(`https://api.lever.co/v0/postings/${c.s}?mode=json`).then(r => r.json()).then(d => ({ d, co: c.co }))
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      const { d, co } = res.value
      ;(Array.isArray(d) ? d : []).slice(0, 10).forEach((j: any) => {
        const key = `${j.text}|${co}`; if (seen.has(key)) return; seen.add(key)
        const loc = j.categories?.location || j.workplaceType || 'Remote'
        const tags = [j.categories?.team, j.categories?.department, j.categories?.commitment].filter(Boolean) as string[]
        const sal = co === 'Groww' ? '₹12–20 LPA' : co === 'CRED' ? '₹15–25 LPA' : co === 'Swiggy' ? '₹14–22 LPA' : co === 'Juspay' ? '₹12–22 LPA' : null
        const job = mkJob(`lev_${j.id}`, j.text, co, loc, j.categories?.commitment || 'Full-time', j.hostedUrl || `https://jobs.lever.co/${co.toLowerCase()}/${j.id}`, relDate(new Date(j.createdAt || Date.now()).toISOString()), 'Lever', tags, /remote|anywhere/i.test(loc), sal, strip(j.description || '').slice(0, 400))
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchWorkable(): Promise<any[]> {
  const companies = [
    { sub: 'openai', co: 'OpenAI' }, { sub: 'huggingface', co: 'Hugging Face' }, { sub: 'mistral', co: 'Mistral AI' },
    { sub: 'replit', co: 'Replit' }, { sub: 'sourcegraph', co: 'Sourcegraph' }, { sub: 'clickhouse', co: 'ClickHouse' },
    { sub: 'temporal', co: 'Temporal' }, { sub: 'sentry', co: 'Sentry' }, { sub: 'posthog', co: 'PostHog' },
    { sub: 'grafana', co: 'Grafana Labs' }, { sub: 'mattermost', co: 'Mattermost' }, { sub: 'retool', co: 'Retool' },
    { sub: 'coreweave', co: 'CoreWeave' }, { sub: 'groq', co: 'Groq' }, { sub: 'modal', co: 'Modal Labs' },
    { sub: 'perplexity', co: 'Perplexity AI' }, { sub: 'browserstack', co: 'BrowserStack' }, { sub: 'zoho', co: 'Zoho' },
    { sub: 'wingify', co: 'Wingify' }, { sub: 'leadsquared', co: 'LeadSquared' },
  ]
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(companies.map(c =>
      sf(`https://apply.workable.com/api/v3/accounts/${c.sub}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 12, details: false }) }).then(r => r.json()).then(d => ({ d, co: c.co, sub: c.sub }))
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      const { d, co, sub } = res.value
      ;(d.results || []).slice(0, 10).forEach((j: any) => {
        const key = `${j.title}|${co}`; if (seen.has(key)) return; seen.add(key)
        const loc = j.location?.city ? `${j.location.city}, ${j.location.country}` : (j.remote ? 'Remote' : 'Global')
        const sal = co === 'BrowserStack' ? '₹12–20 LPA' : co === 'Zoho' ? '₹5–12 LPA' : co === 'Wingify' ? '₹10–18 LPA' : co === 'LeadSquared' ? '₹8–15 LPA' : null
        const job = mkJob(`wk_${sub}_${j.shortcode}`, j.title, co, loc, j.employment_type || 'Full-time', `https://apply.workable.com/${sub}/j/${j.shortcode}/`, relDate(j.published_on || j.created_at || ''), 'Workable', [j.department || 'Engineering'], !!j.remote || /remote/i.test(loc), sal, '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchWeWorkRemotely(): Promise<any[]> {
  const feeds = [
    { url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss', tag: 'Programming' },
    { url: 'https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss', tag: 'DevOps' },
    { url: 'https://weworkremotely.com/categories/remote-data-science-ai-statistics-jobs.rss', tag: 'Data/AI' },
    { url: 'https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss', tag: 'Full Stack' },
    { url: 'https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss', tag: 'Frontend' },
    { url: 'https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss', tag: 'Backend' },
    { url: 'https://weworkremotely.com/categories/remote-management-finance-jobs.rss', tag: 'Management' },
    { url: 'https://weworkremotely.com/categories/remote-design-jobs.rss', tag: 'Design' },
  ]
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(feeds.map(f =>
      sf(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 TalentLaunch/3.0', 'Accept': 'application/rss+xml, text/xml, */*' } }, 10000).then(r => r.text()).then(text => ({ text, tag: f.tag }))
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      const { text, tag } = res.value
      const itemRx = /<item>([\s\S]*?)<\/item>/gi; let m: RegExpExecArray | null
      while ((m = itemRx.exec(text)) !== null) {
        const b = m[1]
        const getTag = (t: string) => { const rx = new RegExp(`<${t}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${t}>|<${t}[^>]*>([^<]*)<\\/${t}>`, 'i'); const x = rx.exec(b); return x ? (x[1] || x[2] || '').trim() : '' }
        const title = getTag('title').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        const coMatch = title.match(/^([^:]+):\s*(.+)$/)
        const co = coMatch ? coMatch[1].trim() : 'Remote Co'
        const role = coMatch ? coMatch[2].trim() : title
        const link = (/<link>([^<]+)<\/link>/.exec(b)?.[1] || /<guid[^>]*>([^<]+)<\/guid>/.exec(b)?.[1] || '').trim()
        const pub = getTag('pubDate')
        const key = `${role}|${co}`; if (seen.has(key) || !role || !link) continue; seen.add(key)
        const job = mkJob(`wwr_${seen.size}`, role, co, 'Remote Worldwide', 'Full-time', link, pub ? relDate(pub) : 'Recently', 'We Work Remotely', [tag], true, null, getTag('description').slice(0, 400))
        if (job) results.push(job)
      }
    })
  } catch { }
  return results
}

async function fetchJSearchFree(): Promise<any[]> {
  const key = process.env.RAPIDAPI_KEY; if (!key) return []
  const queries = ['software engineer india', 'data scientist remote', 'frontend developer remote', 'backend engineer', 'devops engineer', 'machine learning engineer']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(queries.slice(0, 4).map(q =>
      sf(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(q)}&num_pages=3&date_posted=month`, { headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' } }).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.data || []).forEach((j: any) => {
        if (seen.has(j.job_id)) return; seen.add(j.job_id)
        const job = mkJob(`js_${j.job_id}`, j.job_title, j.employer_name, `${j.job_city || ''}${j.job_country ? ', ' + j.job_country : ''}`, j.job_employment_type || 'Full-time', j.job_apply_link, relDate(j.job_posted_at_datetime_utc), 'JSearch', (j.job_required_skills || []).slice(0, 6), !!j.job_is_remote, j.job_min_salary ? `$${j.job_min_salary}–$${j.job_max_salary}` : null, j.job_description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchJobicyGeo(): Promise<any[]> {
  const geos = ['india', 'uk', 'europe', 'canada', 'australia', 'singapore']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(geos.map(geo =>
      sf(`https://jobicy.com/api/v2/remote-jobs?count=30&geo=${geo}`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const jt = [...(j.jobIndustry || []), ...(j.jobLevel || [])].slice(0, 6)
        const job = mkJob(`jcyg_${j.id}`, j.jobTitle, j.companyName, j.jobGeo || 'Remote', j.jobType || 'Full-time', j.url, relDate(j.pubDate), 'Jobicy Global', jt, true, j.annualSalaryMin ? `$${j.annualSalaryMin}k–$${j.annualSalaryMax}k` : null, j.jobDescription || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchHimalayasSkills(): Promise<any[]> {
  const skills = ['python', 'javascript', 'java', 'go', 'rust', 'react', 'node', 'aws', 'ml', 'data']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(skills.map(s =>
      sf(`https://himalayas.app/jobs/api?limit=30&skills=${s}`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`hims_${j.id}`, j.title, j.company?.name || 'Unknown', 'Remote / Global', j.type || 'Full-time', j.applicationUrl || j.applyUrl || j.url || 'https://himalayas.app/jobs', relDate(j.createdAt || j.created_at || ''), 'Himalayas+', [...(j.skills || []), ...(j.categories || [])].slice(0, 6), true, j.salary || null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchArbeitnowSearch(): Promise<any[]> {
  const keywords = ['software', 'engineer', 'developer', 'python', 'java', 'react', 'data', 'devops', 'machine learning', 'cloud']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(keywords.map(kw =>
      sf(`https://arbeitnow.com/api/job-board-api?search=${encodeURIComponent(kw)}&page=1`).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.data || []).slice(0, 15).forEach((j: any) => {
        if (seen.has(j.slug)) return; seen.add(j.slug)
        const posted = typeof j.created_at === 'number' ? relDate(String(j.created_at)) : relDate(j.created_at || '')
        const job = mkJob(`arbs_${j.slug}`, j.title, j.company_name, j.location || 'Europe', (j.job_types || ['Full-time'])[0], j.url, posted, 'Arbeitnow Search', (j.tags || []).slice(0, 6), !!j.remote, null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchRemotiveByCount(): Promise<any[]> {
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled([
      sf('https://remotive.com/api/remote-jobs?limit=100&category=software-dev').then(r => r.json()),
      sf('https://remotive.com/api/remote-jobs?limit=100&category=data').then(r => r.json()),
      sf('https://remotive.com/api/remote-jobs?limit=100&category=devops-sysadmin').then(r => r.json()),
    ])
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`reml_${j.id}`, j.title, j.company_name, j.candidate_required_location || 'Remote', j.job_type || 'Full-time', j.url, relDate(j.publication_date), 'Remotive Live', (j.tags || []).slice(0, 6), true, j.salary || null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchFindwork(): Promise<any[]> {
  const key = process.env.FINDWORK_API_KEY || ''
  if (!key) return []
  const searches = ['python', 'react', 'backend', 'devops', 'machine learning', 'java']
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(searches.map(q =>
      sf(`https://findwork.dev/api/jobs/?search=${encodeURIComponent(q)}&sort_by=date`, { headers: { Authorization: `Token ${key}` } }).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.results || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`fw_${j.id}`, j.role, j.company_name, j.location || 'Remote', j.employment_type || 'Full-time', j.url, relDate(j.date_posted), 'Findwork', (j.keywords || []).slice(0, 6), j.remote || /remote/i.test(j.location || ''), null, j.text || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchAdzuna(): Promise<any[]> {
  const appId = process.env.ADZUNA_APP_ID; const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return []
  const targets = [
    { cc: 'in', q: 'software engineer' }, { cc: 'in', q: 'data engineer' },
    { cc: 'gb', q: 'software engineer' }, { cc: 'us', q: 'software engineer' },
    { cc: 'us', q: 'machine learning engineer' }, { cc: 'au', q: 'software engineer' },
    { cc: 'de', q: 'software engineer' }, { cc: 'ca', q: 'software developer' },
    { cc: 'in', q: 'frontend developer' }, { cc: 'in', q: 'backend developer' },
  ]
  const results: any[] = []; const seen = new Set<string>()
  try {
    const rs = await Promise.allSettled(targets.map(({ cc, q }) =>
      sf(`https://api.adzuna.com/v1/api/jobs/${cc}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(q)}&sort_by=date&content-type=application/json`).then(r => r.json()).then(d => ({ d, cc }))
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      const { d, cc } = res.value
      ;(d.results || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`adz_${j.id}`, j.title, j.company?.display_name || 'Unknown', j.location?.display_name || cc.toUpperCase(), j.contract_time?.includes('full') ? 'Full-time' : 'Part-time', j.redirect_url, relDate(j.created), 'Adzuna', [j.category?.label || 'Engineering'], /remote/i.test(j.description || ''), j.salary_min ? `${cc === 'in' ? '₹' : cc === 'gb' ? '£' : '$'}${Math.round(j.salary_min / 1000)}k–${Math.round(j.salary_max / 1000)}k` : null, j.description || '')
        if (job) results.push(job)
      })
    })
  } catch { }
  return results
}

async function fetchReed(): Promise<any[]> {
  const key = process.env.REED_API_KEY; if (!key) return []
  try {
    const creds = Buffer.from(`${key}:`).toString('base64')
    const searches = ['software engineer', 'data analyst', 'frontend developer', 'python developer', 'backend engineer', 'devops engineer', 'machine learning', 'cloud engineer']
    const results: any[] = []; const seen = new Set<string>()
    const rs = await Promise.allSettled(searches.map(kw =>
      sf(`https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(kw)}&resultsToTake=25`, { headers: { Authorization: `Basic ${creds}` } }).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.results || []).forEach((j: any) => {
        if (seen.has(String(j.jobId))) return; seen.add(String(j.jobId))
        const job = mkJob(`reed_${j.jobId}`, j.jobTitle, j.employerName, j.locationName || 'UK', 'Full-time', j.jobUrl, relDate(j.date), 'Reed UK', [], /remote/i.test(j.jobDescription || ''), j.minimumSalary ? `£${j.minimumSalary}–£${j.maximumSalary}` : null, j.jobDescription || '')
        if (job) results.push(job)
      })
    })
    return results
  } catch { return [] }
}

async function fetchJooble(): Promise<any[]> {
  const key = process.env.JOOBLE_API_KEY; if (!key) return []
  try {
    const searches = [
      { keywords: 'software engineer', location: '' },
      { keywords: 'data scientist', location: 'india' },
      { keywords: 'backend developer', location: 'remote' },
      { keywords: 'frontend developer', location: '' },
      { keywords: 'machine learning', location: '' },
    ]
    const results: any[] = []; const seen = new Set<string>()
    const rs = await Promise.allSettled(searches.map(s =>
      sf(`https://jooble.org/api/${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) }).then(r => r.json())
    ))
    rs.forEach(res => {
      if (res.status !== 'fulfilled') return
      ;(res.value.jobs || []).forEach((j: any) => {
        if (seen.has(String(j.id))) return; seen.add(String(j.id))
        const job = mkJob(`joo_${j.id}`, j.title, j.company, j.location || 'Various', j.type || 'Full-time', j.link, relDate(j.updated), 'Jooble', [], /remote/i.test(j.location || ''), j.salary || null, j.snippet || '')
        if (job) results.push(job)
      })
    })
    return results
  } catch { return [] }
}

async function fetchGoogleCareers(): Promise<any[]> {
  try {
    const r = await sf('https://careers.google.com/api/v3/search/?page_size=20&jlo=en_US&location=India&distance=50&q=software+engineer', { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 TalentLaunch/3.0' } })
    if (!r.ok) return []
    const d = await r.json()
    return (d.jobs || []).map((j: any, i: number) => {
      const locs = (j.locations || []).map((l: any) => l.display || l.address || 'India').join(', ')
      return mkJob(`goog_${j.id || i}`, j.title, 'Google', locs || 'India', j.employment_type || 'Full-time', j.apply_url || `https://careers.google.com/jobs/results/${j.id}`, relDate(j.published_date || ''), 'Google Careers', (j.categories || []).slice(0, 5), /remote/i.test(locs), null, j.summary || '')
    }).filter(Boolean)
  } catch { return [] }
}

async function fetchMicrosoftCareers(): Promise<any[]> {
  try {
    const r = await sf('https://gcsservices.careers.microsoft.com/search/api/v1/search?q=software+engineer&lc=India&exp=Students+and+graduates&pgSz=20&pg=0&so=Most+relevant&mkt=en-US', { headers: { 'Accept': 'application/json', 'User-Agent': 'TalentLaunch/3.0' } })
    if (!r.ok) return []
    const d = await r.json()
    return (d.operationResult?.result?.jobs || []).map((j: any, i: number) => mkJob(`msft_${j.jobId || i}`, j.title, 'Microsoft', j.primaryWork?.location || 'India', j.type || 'Full-time', `https://jobs.careers.microsoft.com/global/en/job/${j.jobId}`, relDate(j.postedDate || ''), 'Microsoft Careers', [], /remote|virtual/i.test(j.primaryWork?.location || ''), '₹40–55 LPA', j.summary || '')).filter(Boolean)
  } catch { return [] }
}

async function fetchAmazonJobs(): Promise<any[]> {
  try {
    const r = await sf('https://www.amazon.jobs/en/search.json?base_query=software+engineer&loc_query=India&job_count=25&result_limit=25&category=software-development', { headers: { 'User-Agent': 'Mozilla/5.0 TalentLaunch/3.0', 'Accept': 'application/json' } })
    if (!r.ok) return []
    const d = await r.json()
    return (d.jobs || []).map((j: any, i: number) => mkJob(`amz_${j.id_icims || i}`, j.title, 'Amazon', j.location || 'India', j.job_schedule_type || 'Full-time', `https://www.amazon.jobs${j.job_path}`, relDate(j.posted_date || ''), 'Amazon Jobs', j.job_category ? [j.job_category] : [], /virtual|remote/i.test(j.location || ''), '₹32–50 LPA', j.description_short || '')).filter(Boolean)
  } catch { return [] }
}

async function fetchAppleJobs(): Promise<any[]> {
  try {
    const r = await sf('https://jobs.apple.com/api/role/search?query=software+engineer&filters=TEAMS.SFTWR&page=1&locale=en-US', { headers: { 'Accept': 'application/json', 'User-Agent': 'TalentLaunch/3.0' } })
    if (!r.ok) return []
    const d = await r.json()
    return (d.searchResults || []).slice(0, 20).map((j: any, i: number) => mkJob(`apl_${j.positionId || i}`, j.postingTitle, 'Apple', j.locations?.map((l: any) => l.name).join(', ') || 'Cupertino', j.employmentType || 'Full-time', `https://jobs.apple.com/en-us/details/${j.positionId}`, relDate(j.postDateInGMT || ''), 'Apple Jobs', [j.team?.name || 'Engineering'], /remote/i.test(j.locations?.[0]?.name || ''), null, j.jobSummary || '')).filter(Boolean)
  } catch { return [] }
}

function getCurated(): any[] {
  const RAW = [
    { id:'g01',t:'Software Engineer Intern 2026',co:'Google',l:'Hyderabad, India',ty:'Internship',url:'https://careers.google.com/jobs/results/?q=intern&experience=INTERN',tg:['C++','Python','DSA'],sal:'₹1L/mo' },
    { id:'g02',t:'STEP Intern',co:'Google',l:'Bangalore, India',ty:'Internship',url:'https://careers.google.com/programs/students/',tg:['Python','Algorithms'],sal:'₹1L+/mo' },
    { id:'g03',t:'SWE New Grad 2026',co:'Microsoft',l:'Hyderabad, India',ty:'Full-time',url:'https://careers.microsoft.com/students/',tg:['C#','Azure','TypeScript'],sal:'₹40–55 LPA' },
    { id:'g04',t:'SDE-1 University Hire',co:'Amazon',l:'Hyderabad / Bangalore',ty:'Full-time',url:'https://www.amazon.jobs/en/teams/university-tech',tg:['Java','AWS','Distributed Systems'],sal:'₹32–50 LPA' },
    { id:'g05',t:'Software Engineer Intern',co:'Meta',l:'Hyderabad / Singapore',ty:'Internship',url:'https://www.metacareers.com/careerprograms/university',tg:['C++','Python','React'],sal:'$8k/mo' },
    { id:'g06',t:'SWE Intern',co:'Apple',l:'Hyderabad / Remote',ty:'Internship',url:'https://jobs.apple.com/en-us/search?team=internships',tg:['Swift','iOS','ML'],sal:'₹1L+/mo' },
    { id:'g07',t:'Research Scientist Intern',co:'OpenAI',l:'San Francisco / Remote',ty:'Internship',url:'https://openai.com/careers',tg:['Python','PyTorch','LLM','RL'],sal:'$8k–$10k/mo' },
    { id:'g08',t:'AI Safety Engineer',co:'Anthropic',l:'Remote / San Francisco',ty:'Full-time',url:'https://www.anthropic.com/careers',tg:['Python','ML','Safety'],sal:'$120k–$200k' },
    { id:'g09',t:'AI/ML Engineer New Grad',co:'NVIDIA',l:'Hyderabad / Pune',ty:'Full-time',url:'https://nvidia.wd5.myworkdayjobs.com/',tg:['CUDA','C++','Deep Learning'],sal:'₹35–55 LPA' },
    { id:'g10',t:'Graduate Software Engineer',co:'Salesforce',l:'Hyderabad / Bangalore',ty:'Full-time',url:'https://careers.salesforce.com/',tg:['Java','Apex','Lightning'],sal:'₹22–35 LPA' },
    { id:'s01',t:'Software Engineer',co:'Stripe',l:'Remote / Dublin',ty:'Full-time',url:'https://stripe.com/jobs/university',tg:['Ruby','Go','TypeScript'],sal:'$90k–$140k' },
    { id:'s02',t:'Product Engineer',co:'Vercel',l:'Remote / Global',ty:'Full-time',url:'https://vercel.com/careers',tg:['Next.js','TypeScript','Edge'],sal:'$100k–$150k' },
    { id:'s03',t:'Frontend Engineer',co:'Linear',l:'Remote',ty:'Full-time',url:'https://linear.app/careers',tg:['React','TypeScript','GraphQL'],sal:'$130k–$180k' },
    { id:'s04',t:'SWE New Grad',co:'Cursor',l:'San Francisco',ty:'Full-time',url:'https://cursor.com/careers',tg:['TypeScript','Python','LLM'],sal:'$100k–$160k' },
    { id:'s05',t:'Backend Engineer Intern',co:'Supabase',l:'Remote / APAC',ty:'Internship',url:'https://supabase.com/careers',tg:['PostgreSQL','TypeScript','Go'],sal:'$3k–$5k/mo' },
    { id:'s06',t:'ML Research Intern',co:'Hugging Face',l:'Remote / Global',ty:'Internship',url:'https://apply.workable.com/huggingface/',tg:['Python','PyTorch','NLP'],sal:'$5k–$7k/mo' },
    { id:'s07',t:'Full Stack Engineer',co:'Notion',l:'Remote / NYC',ty:'Full-time',url:'https://www.notion.so/careers',tg:['React','Node.js','TypeScript'],sal:'$120k–$160k' },
    { id:'s08',t:'ML Engineer',co:'Cohere',l:'Remote / Toronto',ty:'Full-time',url:'https://cohere.com/careers',tg:['Python','LLM','PyTorch'],sal:'$100k–$160k' },
    { id:'s09',t:'Research Engineer',co:'Groq',l:'Remote / Mountain View',ty:'Full-time',url:'https://groq.com/careers/',tg:['C++','Python','LLM Inference'],sal:'$120k–$200k' },
    { id:'s10',t:'AI Engineer',co:'Mistral AI',l:'Paris / Remote',ty:'Full-time',url:'https://mistral.ai/company/careers/',tg:['Python','LLM','Inference'],sal:'€60k–€100k' },
    { id:'s11',t:'ML Researcher',co:'DeepMind',l:'London / Remote',ty:'Full-time',url:'https://deepmind.com/careers',tg:['Python','JAX','RL','Research'],sal:'£80k–£140k' },
    { id:'s12',t:'Data Scientist',co:'Scale AI',l:'Remote / USA',ty:'Full-time',url:'https://scale.com/careers',tg:['Python','ML','RLHF','Data'],sal:'$100k–$160k' },
    { id:'s13',t:'Research Engineer',co:'xAI',l:'San Francisco / Remote',ty:'Full-time',url:'https://x.ai/careers',tg:['Python','C++','CUDA','LLM'],sal:'$130k–$250k' },
    { id:'c01',t:'Software Engineer',co:'Spotify',l:'Stockholm / Remote',ty:'Full-time',url:'https://lifeatspotify.com/jobs',tg:['Python','Java','Scala','ML'],sal:'€60k–€90k' },
    { id:'c02',t:'SWE Intern',co:'Cloudflare',l:'Remote / Austin',ty:'Internship',url:'https://www.cloudflare.com/careers/',tg:['Go','Rust','Networking'],sal:'$7k/mo' },
    { id:'c03',t:'Software Engineer',co:'Figma',l:'Remote / SF',ty:'Full-time',url:'https://www.figma.com/careers/',tg:['C++','TypeScript','WebGL'],sal:'$130k–$190k' },
    { id:'c04',t:'Full Stack Engineer',co:'Canva',l:'Remote / Sydney',ty:'Full-time',url:'https://www.canva.com/careers/',tg:['Java','React','PostgreSQL'],sal:'A$90k–$130k' },
    { id:'c05',t:'Platform Engineer',co:'GitHub',l:'Remote / Global',ty:'Full-time',url:'https://github.com/about/careers',tg:['Ruby','Go','TypeScript'],sal:'$120k–$170k' },
    { id:'c06',t:'Software Engineer',co:'Atlassian',l:'Remote / Sydney',ty:'Full-time',url:'https://www.atlassian.com/company/careers',tg:['Kotlin','AWS','React'],sal:'A$100k–$150k' },
    { id:'c07',t:'Backend Engineer',co:'Shopify',l:'Remote / Global',ty:'Full-time',url:'https://www.shopify.com/careers',tg:['Ruby','Go','React'],sal:'$80k–$130k' },
    { id:'c08',t:'Data Scientist',co:'Airbnb',l:'Remote / SF',ty:'Full-time',url:'https://careers.airbnb.com/',tg:['Python','SQL','ML','Spark'],sal:'$130k–$180k' },
    { id:'c09',t:'Mobile Engineer',co:'Duolingo',l:'Pittsburgh / Remote',ty:'Full-time',url:'https://careers.duolingo.com/',tg:['Swift','Kotlin','React Native'],sal:'$120k–$170k' },
    { id:'c10',t:'ML Platform Engineer',co:'Netflix',l:'Remote / LA',ty:'Full-time',url:'https://jobs.netflix.com/',tg:['Python','Spark','Kubernetes'],sal:'$150k–$300k' },
    { id:'c11',t:'SWE New Grad',co:'Discord',l:'Remote / SF',ty:'Full-time',url:'https://discord.com/jobs',tg:['Python','Rust','React','Elixir'],sal:'$120k–$160k' },
    { id:'c12',t:'Software Engineer',co:'Coinbase',l:'Remote / USA',ty:'Full-time',url:'https://www.coinbase.com/careers',tg:['Go','React','Blockchain'],sal:'$120k–$200k' },
    { id:'c13',t:'Software Engineer',co:'Grab',l:'Singapore / Remote',ty:'Full-time',url:'https://grab.careers/',tg:['Go','Kotlin','AWS','Maps'],sal:'S$70k–$120k' },
    { id:'c14',t:'Full Stack Engineer',co:'GitLab',l:'Remote / Global',ty:'Full-time',url:'https://about.gitlab.com/jobs/',tg:['Ruby','Go','Vue.js'],sal:'$60k–$100k' },
    { id:'c15',t:'Engineer',co:'Wise',l:'Remote / London',ty:'Full-time',url:'https://www.wise.com/us/jobs/',tg:['Java','Python','FinTech','AWS'],sal:'£50k–£90k' },
    { id:'i01',t:'SDE-1',co:'Razorpay',l:'Bangalore',ty:'Full-time',url:'https://razorpay.com/jobs/',tg:['Java','Go','Microservices'],sal:'₹18–28 LPA' },
    { id:'i02',t:'SDE-1',co:'Swiggy',l:'Bangalore',ty:'Full-time',url:'https://careers.swiggy.com/',tg:['Java','Python','Kafka'],sal:'₹14–22 LPA' },
    { id:'i03',t:'SDE Intern',co:'Flipkart',l:'Bangalore',ty:'Internship',url:'https://www.flipkartcareers.com/',tg:['Java','React','Distributed'],sal:'₹60k–80k/mo' },
    { id:'i04',t:'SDE-1',co:'CRED',l:'Bangalore',ty:'Full-time',url:'https://careers.cred.club/',tg:['iOS','Android','Backend'],sal:'₹15–25 LPA' },
    { id:'i05',t:'SDE-1',co:'PhonePe',l:'Bangalore',ty:'Full-time',url:'https://www.phonepe.com/careers/',tg:['Java','Kotlin','FinTech'],sal:'₹14–22 LPA' },
    { id:'i06',t:'Data Engineer',co:'Groww',l:'Bangalore',ty:'Full-time',url:'https://groww.in/open-positions',tg:['Python','Spark','Airflow'],sal:'₹12–20 LPA' },
    { id:'i07',t:'Backend Intern',co:'Postman',l:'Bangalore',ty:'Internship',url:'https://www.postman.com/company/careers/',tg:['Node.js','TypeScript','Go'],sal:'₹30k–40k/mo' },
    { id:'i08',t:'Full Stack Intern',co:'BrowserStack',l:'Mumbai',ty:'Internship',url:'https://www.browserstack.com/careers',tg:['React','Node.js','Testing'],sal:'₹25k–35k/mo' },
    { id:'i09',t:'SDE-1',co:'ShareChat',l:'Bangalore',ty:'Full-time',url:'https://sharechat.com/careers',tg:['Go','Java','Video'],sal:'₹12–20 LPA' },
    { id:'i10',t:'Software Engineer',co:'Freshworks',l:'Chennai / Bangalore',ty:'Full-time',url:'https://careers.freshworks.com/',tg:['Ruby','React','MySQL'],sal:'₹12–18 LPA' },
    { id:'i11',t:'ML Engineer',co:'Meesho',l:'Bangalore',ty:'Full-time',url:'https://meesho.io/jobs',tg:['Python','TensorFlow','Recommendation'],sal:'₹14–22 LPA' },
    { id:'i12',t:'Graduate Trainee',co:'Zoho',l:'Chennai',ty:'Trainee',url:'https://careers.zohocorp.com/',tg:['Java','C++','Web Dev'],sal:'₹5–8 LPA' },
    { id:'i13',t:'SDE Intern',co:'Ola',l:'Bangalore',ty:'Internship',url:'https://www.olacabs.com/careers',tg:['Java','Kotlin','Maps'],sal:'₹20k–30k/mo' },
    { id:'i14',t:'SDE-1',co:'Zepto',l:'Mumbai',ty:'Full-time',url:'https://www.zepto.com/careers',tg:['Backend','Node.js','Go'],sal:'₹14–22 LPA' },
    { id:'i15',t:'Software Engineer',co:'InMobi',l:'Bangalore',ty:'Full-time',url:'https://www.inmobi.com/company/careers/',tg:['Java','Python','AdTech'],sal:'₹12–20 LPA' },
    { id:'i16',t:'SDE-1',co:'MakeMyTrip',l:'Gurgaon / Remote',ty:'Full-time',url:'https://careers.makemytrip.com/',tg:['Java','Node.js','React'],sal:'₹10–18 LPA' },
    { id:'i17',t:'Data Analyst',co:'Zomato',l:'Gurgaon',ty:'Full-time',url:'https://careers.zomato.com/',tg:['SQL','Python','Tableau','BI'],sal:'₹8–15 LPA' },
    { id:'i18',t:'ML Research Intern',co:'Wadhwani AI',l:'Mumbai / Remote',ty:'Internship',url:'https://www.wadhwaniai.org/careers/',tg:['Python','PyTorch','CV'],sal:'₹20k–35k/mo' },
    { id:'i19',t:'SDE-1',co:'Juspay',l:'Bangalore',ty:'Full-time',url:'https://juspay.in/careers',tg:['Haskell','Java','FinTech'],sal:'₹12–22 LPA' },
    { id:'i20',t:'Software Engineer',co:'Sprinklr',l:'Gurgaon / Bangalore',ty:'Full-time',url:'https://www.sprinklr.com/careers/',tg:['Java','React','SaaS'],sal:'₹15–28 LPA' },
    { id:'e01',t:'Software Engineer',co:'Zalando',l:'Berlin, Germany',ty:'Full-time',url:'https://jobs.zalando.com/',tg:['Kotlin','Python','AWS'],sal:'€45k–€75k' },
    { id:'e02',t:'Backend Engineer',co:'Booking.com',l:'Amsterdam',ty:'Full-time',url:'https://careers.booking.com/',tg:['Perl','Python','React'],sal:'€50k–€80k' },
    { id:'e03',t:'Full Stack Engineer',co:'Revolut',l:'Remote / London',ty:'Full-time',url:'https://www.revolut.com/careers/',tg:['Kotlin','React','AWS'],sal:'£60k–£100k' },
    { id:'e04',t:'Backend Developer',co:'Bolt',l:'Tallinn / Remote',ty:'Full-time',url:'https://bolt.eu/en/careers/',tg:['Python','Go','Postgres'],sal:'€35k–€70k' },
    { id:'e05',t:'Software Engineer',co:'Skyscanner',l:'Edinburgh / Remote',ty:'Full-time',url:'https://www.skyscanner.net/jobs/',tg:['Python','React','AWS'],sal:'£50k–£80k' },
    { id:'e06',t:'ML Engineer',co:'BlaBlaCar',l:'Paris / Remote',ty:'Full-time',url:'https://www.blablacar.com/blog/recruitment',tg:['Python','ML','TensorFlow'],sal:'€45k–€75k' },
    { id:'a01',t:'Software Engineer',co:'Carousell',l:'Singapore',ty:'Full-time',url:'https://carousell.careers/',tg:['Go','React','PostgreSQL'],sal:'S$70k–$100k' },
    { id:'a02',t:'Backend Engineer',co:'Lazada',l:'Singapore / Bangkok',ty:'Full-time',url:'https://www.lazada.com/en/careers/',tg:['Java','Go','eCommerce'],sal:'S$60k–$90k' },
    { id:'a03',t:'Software Engineer',co:'Gojek',l:'Bangalore / Jakarta',ty:'Full-time',url:'https://www.gojek.com/careers/',tg:['Go','Python','Kotlin'],sal:'₹18–35 LPA' },
    { id:'r01',t:'Full Stack Engineer',co:'Buffer',l:'Remote / Global',ty:'Full-time',url:'https://buffer.com/journey',tg:['React','Node.js','PostgreSQL'],sal:'$65k–$110k' },
    { id:'r02',t:'Software Engineer',co:'Basecamp',l:'Remote / Global',ty:'Full-time',url:'https://basecamp.com/about/jobs',tg:['Ruby','Stimulus','MySQL'],sal:'$75k–$120k' },
    { id:'r03',t:'Full Stack Dev',co:'Netlify',l:'Remote / Global',ty:'Full-time',url:'https://www.netlify.com/careers/',tg:['React','Node.js','Go'],sal:'$80k–$130k' },
    { id:'r04',t:'Software Engineer',co:'Automattic',l:'Remote / Global',ty:'Full-time',url:'https://automattic.com/work-with-us/',tg:['PHP','React','WordPress'],sal:'$70k–$120k' },
    { id:'m01',t:'Systems Engineer',co:'TCS',l:'Pan India',ty:'Full-time',url:'https://nextstep.tcs.com',tg:['Java','Testing','SQL'],sal:'₹3.36–7 LPA' },
    { id:'m02',t:'Systems Engineer',co:'Infosys',l:'Pan India',ty:'Full-time',url:'https://www.infosys.com/careers/',tg:['Java','SQL','Testing'],sal:'₹3.6–8 LPA' },
    { id:'m03',t:'Engineer Trainee',co:'Wipro',l:'Pan India',ty:'Trainee',url:'https://careers.wipro.com/',tg:['Java','SQL','Cloud'],sal:'₹3.5–6.5 LPA' },
    { id:'m04',t:'Prog Analyst Trainee',co:'Cognizant',l:'Pan India',ty:'Trainee',url:'https://www.cognizant.com/in/en/careers',tg:['Java','SQL','Testing'],sal:'₹4–5 LPA' },
    { id:'m05',t:'Technology Analyst',co:'Deloitte',l:'Pan India',ty:'Full-time',url:'https://careers.deloitte.com/',tg:['Java','SAP','Cloud'],sal:'₹7–12 LPA' },
    { id:'m06',t:'Associate SWE',co:'Accenture',l:'Pan India',ty:'Full-time',url:'https://www.accenture.com/in-en/careers',tg:['Java','Cloud','React'],sal:'₹4.5–8 LPA' },
    { id:'m07',t:'Software Engineer',co:'Goldman Sachs',l:'Bangalore / Hyderabad',ty:'Full-time',url:'https://www.goldmansachs.com/careers/',tg:['Java','Python','FinTech'],sal:'₹18–30 LPA' },
    { id:'m08',t:'SDE',co:'Walmart Global Tech',l:'Bangalore',ty:'Full-time',url:'https://careers.walmart.com/',tg:['Java','Spark','React'],sal:'₹15–25 LPA' },
    { id:'m09',t:'SDE Intern',co:'Samsung R&D',l:'Bangalore / Noida',ty:'Internship',url:'https://research.samsung.com/careers',tg:['C++','Android','Tizen'],sal:'₹20k–30k/mo' },
    { id:'m10',t:'Technology Analyst',co:'JPMorgan Chase',l:'Hyderabad / Bangalore',ty:'Full-time',url:'https://careers.jpmorgan.com/',tg:['Java','Python','Finance'],sal:'₹18–28 LPA' },
    { id:'m11',t:'Software Engineer',co:'IBM',l:'Bangalore / Hyderabad',ty:'Full-time',url:'https://www.ibm.com/employment/',tg:['Java','Python','Cloud','AI'],sal:'₹8–15 LPA' },
    { id:'m12',t:'Graduate Engineer',co:'HCLTech',l:'Pan India',ty:'Full-time',url:'https://www.hcltech.com/careers',tg:['Java','SAP','Cloud'],sal:'₹3.5–6 LPA' },
    { id:'m13',t:'Associate',co:'Capgemini',l:'Pan India',ty:'Full-time',url:'https://www.capgemini.com/careers/',tg:['Java','SAP','Testing'],sal:'₹3.8–6 LPA' },
    { id:'m14',t:'SDE',co:'Mastercard',l:'Pune / Bangalore',ty:'Full-time',url:'https://careers.mastercard.com/',tg:['Java','Spring','Payments'],sal:'₹12–20 LPA' },
    { id:'m15',t:'SDE Intern',co:'Oracle',l:'Hyderabad / Bangalore',ty:'Internship',url:'https://www.oracle.com/corporate/careers/',tg:['Java','Cloud','SQL'],sal:'₹15k–25k/mo' },
  ]
  return RAW.map(j => {
    const src = ['g01','g02','g03','g04','g05','g06','g07','g08','g09','g10'].includes(j.id) ? 'Big Tech' : j.id.startsWith('s') ? 'YC Startup' : j.id.startsWith('c') ? 'Global Tech' : j.id.startsWith('i') ? 'India Startup' : j.id.startsWith('e') ? 'Europe' : j.id.startsWith('a') ? 'Asia / MENA' : j.id.startsWith('r') ? 'Remote-first' : 'Mass Hiring'
    return mkJob(`cur_${j.id}`, j.t, j.co, j.l, j.ty, j.url, 'Recently', src, j.tg, /remote|global|worldwide/i.test(j.l), j.sal || null, '')
  }).filter(Boolean)
}

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Slow sources must not block the whole page: each source gets a hard deadline.
const dl = (p: Promise<any[]>, ms = 7000): Promise<any[]> =>
  Promise.race([p.catch(() => [] as any[]), new Promise<any[]>(res => setTimeout(() => res([]), ms))])

// Cache live results for 10 minutes so every visitor does not trigger ~25 upstream calls.
let liveCache: { t: number; all: any[] } | null = null
const CACHE_MS = 10 * 60 * 1000

export async function GET(req: NextRequest) {
  let all: any[]
  if (liveCache && Date.now() - liveCache.t < CACHE_MS) {
    all = [...liveCache.all]
  } else {
  const allSettled = await Promise.allSettled([
    dl(fetchRemotive()),           // ~300 jobs (Remotive API — most reliable)
    dl(fetchRemotiveSearch()),     // ~360 jobs (keyword searches)
    dl(fetchRemotiveByCount()),    // ~300 more (limit=100 queries)
    dl(fetchArbeitnow()),          // ~500 jobs (5 pages)
    dl(fetchArbeitnowFeatured()),  // ~50 extra featured
    dl(fetchArbeitnowSearch()),    // ~150 more via keyword search
    dl(fetchJobicy()),             // ~375 jobs (15 tags × 25)
    dl(fetchJobicyGeo()),          // ~180 more (geo filters)
    dl(fetchRemoteOK()),           // ~100 jobs
    dl(fetchHNHiring()),           // ~100 jobs (HN monthly)
    dl(fetchHimalayas()),          // ~100 jobs
    dl(fetchHimalayasSkills()),    // ~300 more (skill filters)
    dl(fetchTheMuse()),            // ~125 entry-level/intern
    dl(fetchWorkingNomads()),      // ~400 jobs (10 cats × 40)
    dl(fetchWeWorkRemotely()),     // ~200 jobs (8 RSS feeds, server-side)

    dl(fetchGreenhouse()),         // ~480 jobs (40 companies × 12)
    dl(fetchLever()),              // ~300 jobs (30 companies × 10)
    dl(fetchWorkable()),           // ~200 jobs (20 companies × 10)

    dl(fetchGoogleCareers()),
    dl(fetchMicrosoftCareers()),
    dl(fetchAmazonJobs()),
    dl(fetchAppleJobs()),

    dl(fetchAdzuna()),             // needs ADZUNA_APP_ID + ADZUNA_APP_KEY (free)
    dl(fetchReed()),               // needs REED_API_KEY (free)
    dl(fetchJooble()),             // needs JOOBLE_API_KEY (free)
    dl(fetchJSearchFree()),        // needs RAPIDAPI_KEY (500 req/month free)
    dl(fetchFindwork()),           // needs FINDWORK_API_KEY (free tier)
  ])

  const extract = (r: PromiseSettledResult<any[]>) => r.status === 'fulfilled' ? r.value.filter(Boolean) : []
  all = allSettled.flatMap(extract)
  if (all.length > 0) liveCache = { t: Date.now(), all: [...all] }
  else if (liveCache) all = [...liveCache.all]
  }

  try {
    const { connectDB } = await import('@/lib/db')
    const { AdminJob } = await import('@/lib/models/AdminJob')
    const aj: any[] = await Promise.race([
      connectDB().then(() => AdminJob.find().sort({ createdAt: -1 }).limit(200)),
      new Promise<any[]>((_, rej) => setTimeout(() => rej(new Error('db timeout')), 2500)),
    ])
    aj.forEach((x: any) => { const o = x.toObject(); all.push({ ...o, id: String(o._id), source: 'TalentLaunch', posted: 'Recently', estimatedSalary: o.salary || 'Competitive', review: { rating: 4.0, wlb: 4.0 } }) })
  } catch { /* database not available: skip recruiter jobs */ }

  getCurated().forEach(j => { if (j) all.push(j) })

  const seenKeys = new Set<string>()
  const unique = all.filter(job => {
    if (!job?.title || !job?.company) return false
    const k = `${job.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().slice(0, 40)}|${job.company.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)}`
    if (seenKeys.has(k)) return false; seenKeys.add(k); return true
  })

  const ORDER: Record<string, number> = { Today: 0, '1d ago': 1, '2d ago': 2, '3d ago': 3, '4d ago': 4, '5d ago': 5, '6d ago': 6, Recently: 50 }
  unique.sort((a, b) => {
    if (a.source === 'TalentLaunch') return -1
    if (b.source === 'TalentLaunch') return 1
    const ca = a.id.startsWith('cur_') ? 1 : 0
    const cb = b.id.startsWith('cur_') ? 1 : 0
    if (ca !== cb) return ca - cb
    return (ORDER[a.posted] ?? 10) - (ORDER[b.posted] ?? 10)
  })

  const jobs = unique.slice(0, 1500)
  const srcCounts: Record<string, number> = {}
  jobs.forEach(j => { srcCounts[j.source] = (srcCounts[j.source] || 0) + 1 })

  const FREE_APIS = ['Remotive', 'Remotive+', 'Remotive Live', 'Remotive AI', 'Remotive India', 'Arbeitnow', 'Arbeitnow Pro', 'Arbeitnow Search', 'Jobicy', 'Jobicy Global', 'Jobicy India', 'RemoteOK', 'HN Hiring', 'Himalayas', 'Himalayas+', 'The Muse', 'Working Nomads', 'We Work Remotely', 'Greenhouse', 'Lever', 'Workable', 'Tech Jobs Board']
  const PAID_APIS = ['Adzuna', 'Reed UK', 'Jooble', 'JSearch', 'Findwork']
  const CAREER_PAGES = ['Google Careers', 'Microsoft Careers', 'Amazon Jobs', 'Apple Jobs', 'Meta Careers']
  const CURATED_SRC  = ['Big Tech', 'India Startup', 'YC Startup', 'Global Tech', 'Europe', 'Asia / MENA', 'Remote-first', 'Mass Hiring', 'TalentLaunch']

  const freeActive  = Object.keys(srcCounts).filter(s => FREE_APIS.includes(s))
  const paidActive  = Object.keys(srcCounts).filter(s => PAID_APIS.includes(s))
  const careerActive = Object.keys(srcCounts).filter(s => CAREER_PAGES.includes(s))

  return NextResponse.json({
    jobs,
    count: jobs.length,
    fresherCount:   jobs.filter(j => j.isFresher).length,
    remoteCount:    jobs.filter(j => j.isRemote).length,
    liveApiJobs:    jobs.filter(j => !j.id.startsWith('cur_')).length,
    curatedJobs:    jobs.filter(j => j.id.startsWith('cur_')).length,
    sources: srcCounts,
    keysConfigured: {
      adzuna:   !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
      reed:     !!process.env.REED_API_KEY,
      jsearch:  !!process.env.RAPIDAPI_KEY,
      jooble:   !!process.env.JOOBLE_API_KEY,
      findwork: !!process.env.FINDWORK_API_KEY,
    },
    apiSummary: {
      free: {
        configured: FREE_APIS.length,
        active: freeActive.length,
        sources: freeActive,
        totalJobs: jobs.filter(j => FREE_APIS.includes(j.source)).length,
      },
      paid: {
        configured: PAID_APIS.length,
        active: paidActive.length,
        sources: paidActive,
        note: 'All have free tiers — see Sources tab for signup links',
      },
      careerPages: {
        configured: CAREER_PAGES.length,
        active: careerActive.length,
        sources: careerActive,
      },
      curated: {
        count: jobs.filter(j => CURATED_SRC.includes(j.source)).length,
      },
    },
    timestamp: new Date().toISOString(),
  })
}
