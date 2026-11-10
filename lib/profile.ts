// Profile data model, migration from older saved shapes, and scoring helpers (pure, testable)
import { extractSkills } from './match'

export type Skill = { name: string; cat: string; level: string; years: string }
export type Education = { college: string; degree: string; specialization: string; courseType: string; startYear: string; endYear: string; cgpa: string; status: string; coursework: string; achievements: string }
export type Experience = { company: string; title: string; type: string; location: string; start: string; end: string; current: boolean; desc: string; achievements: string; tech: string }
export type Project = { title: string; desc: string; tech: string; repo: string; demo: string; duration: string; team: string; role: string; achievements: string }
export type Cert = { name: string; org: string; issued: string; expires: string; credId: string; url: string }
export type Award = { title: string; kind: string; year: string; desc: string }
export type Lang = { name: string; read: string; write: string; speak: string; native: boolean }

export type Profile = {
  name: string; headline: string; designation: string; phone: string; dob: string; gender: string
  city: string; state: string; country: string; pin: string; address: string; photo: string; cover: string
  bio: string; objective: string; empStatus: string; totalExp: string; company: string; industry: string; interests: string
  isFresher: boolean
  education: Education[]; experience: Experience[]; skills: Skill[]; projects: Project[]
  certs: Cert[]; awards: Award[]; languages: Lang[]
  links: Record<string, string>
  prefs: { openToWork: boolean; roles: string; companies: string; industries: string; locations: string; modes: string[]; types: string[]; minSalary: string; maxSalary: string; notice: string; availability: string; relocate: string; schedule: string }
  privacy: { visibility: 'public' | 'recruiters' | 'private'; showPhone: boolean; showEmail: boolean; showSalary: boolean; resumeVisible: boolean; discoverable: boolean; blocked: string }
  notify: Record<string, boolean>
}

export const LINK_FIELDS: [string, string][] = [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['gitlab', 'GitLab'], ['stackoverflow', 'Stack Overflow'], ['leetcode', 'LeetCode'], ['hackerrank', 'HackerRank'], ['codechef', 'CodeChef'], ['codeforces', 'Codeforces'], ['portfolio', 'Portfolio'], ['website', 'Personal website'], ['blog', 'Personal blog'], ['behance', 'Behance'], ['dribbble', 'Dribbble']]
export const SKILL_CATS = ['Programming language', 'Framework', 'Database', 'Developer tool', 'Cloud', 'Soft skill']
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
export const NOTIFY_FIELDS: [string, string][] = [['jobAlerts', 'Job recommendation alerts'], ['status', 'Application status updates'], ['interview', 'Interview invitations'], ['messages', 'Recruiter messages'], ['resume', 'Resume feedback'], ['views', 'Profile view notifications'], ['reminders', 'Saved job reminders'], ['matching', 'New matching job alerts'], ['system', 'System notifications']]

export const EMPTY: Profile = {
  name: '', headline: '', designation: '', phone: '', dob: '', gender: '', city: '', state: '', country: 'India', pin: '', address: '', photo: '', cover: 'blue',
  bio: '', objective: '', empStatus: 'Student', totalExp: '', company: '', industry: '', interests: '', isFresher: true,
  education: [], experience: [], skills: [], projects: [], certs: [], awards: [], languages: [],
  links: {},
  prefs: { openToWork: true, roles: '', companies: '', industries: '', locations: '', modes: [], types: ['Full-time'], minSalary: '', maxSalary: '', notice: '', availability: 'Immediately', relocate: 'Yes', schedule: '' },
  privacy: { visibility: 'recruiters', showPhone: false, showEmail: true, showSalary: false, resumeVisible: true, discoverable: true, blocked: '' },
  notify: { jobAlerts: true, status: true, interview: true, messages: true, resume: true, views: false, reminders: true, matching: true, system: true },
}

const arr = <T,>(v: any): T[] => (Array.isArray(v) ? v : [])
const str = (v: any) => (typeof v === 'string' ? v : v == null ? '' : String(v))

/** Accepts anything stored by this or the previous (simpler) profile page and returns a complete Profile. */
export function migrate(raw: any, legacy: { name?: string; college?: string; role?: string; bio?: string; github?: string; linkedin?: string; skills?: string[] } = {}): Profile {
  const r = raw && typeof raw === 'object' ? raw : {}
  const p: Profile = {
    ...EMPTY, ...r,
    prefs: { ...EMPTY.prefs, ...(r.prefs || {}) },
    privacy: { ...EMPTY.privacy, ...(r.privacy || {}) },
    notify: { ...EMPTY.notify, ...(r.notify || {}) },
    links: { ...(r.links || {}) },
    education: arr<Education>(r.education), experience: arr<Experience>(r.experience),
    certs: arr<Cert>(r.certs), awards: arr<Award>(r.awards), languages: arr<Lang>(r.languages),
  }
  // v1 profile: skills were strings, projects were {name, link, desc}, flat link fields
  p.skills = arr<any>(r.skills).map(s => typeof s === 'string' ? { name: s, cat: 'Developer tool', level: '', years: '' } : { name: str(s.name), cat: str(s.cat) || 'Developer tool', level: str(s.level), years: str(s.years) }).filter(s => s.name)
  p.projects = arr<any>(r.projects).map(x => ({ title: str(x.title || x.name), desc: str(x.desc), tech: str(x.tech), repo: str(x.repo || x.link), demo: str(x.demo), duration: str(x.duration), team: str(x.team) || 'Individual', role: str(x.role), achievements: str(x.achievements) }))
  if (r.github && !p.links.github) p.links.github = r.github
  if (r.linkedin && !p.links.linkedin) p.links.linkedin = r.linkedin
  if (r.portfolio && !p.links.portfolio) p.links.portfolio = r.portfolio
  if (r.leetcode && !p.links.leetcode) p.links.leetcode = r.leetcode
  if (!p.education.length && (r.college || legacy.college)) p.education = [{ college: str(r.college || legacy.college), degree: str(r.degree) || 'B.Tech', specialization: str(r.branch) || 'Computer Science', courseType: 'Full-time', startYear: '', endYear: str(r.gradYear), cgpa: str(r.cgpa), status: 'Pursuing', coursework: '', achievements: '' }]
  if (r.openToWork === false) p.prefs.openToWork = false
  if (Array.isArray(r.jobTypes) && r.jobTypes.length) p.prefs.types = r.jobTypes
  if (r.prefLocations && !p.prefs.locations) p.prefs.locations = str(r.prefLocations)
  if (r.expectedSalary && !p.prefs.maxSalary) p.prefs.maxSalary = str(r.expectedSalary)
  if (!p.name) p.name = legacy.name || ''
  if (!p.headline) p.headline = legacy.role || ''
  if (!p.bio) p.bio = legacy.bio || ''
  if (!p.links.github && legacy.github) p.links.github = legacy.github
  if (!p.links.linkedin && legacy.linkedin) p.links.linkedin = legacy.linkedin
  if (!p.skills.length && legacy.skills?.length) p.skills = legacy.skills.map(n => ({ name: n, cat: 'Developer tool', level: '', years: '' }))
  if (!p.city && r.location) p.city = str(r.location)
  return p
}

export type CheckItem = { ok: boolean; label: string; tab: string }

export function completion(p: Profile, hasResume: boolean): { pct: number; items: CheckItem[] } {
  const items: CheckItem[] = [
    { ok: !!p.name.trim(), label: 'Full name', tab: 'personal' },
    { ok: !!p.headline.trim(), label: 'Professional headline', tab: 'personal' },
    { ok: !!p.phone.trim(), label: 'Phone number', tab: 'personal' },
    { ok: !!(p.city || p.state), label: 'Location', tab: 'personal' },
    { ok: p.bio.trim().length >= 40, label: 'About me (40+ characters)', tab: 'summary' },
    { ok: p.education.some(e => e.college.trim()), label: 'Education', tab: 'education' },
    { ok: p.isFresher || p.experience.length > 0, label: 'Experience (or mark yourself a fresher)', tab: 'experience' },
    { ok: p.skills.length >= 5, label: '5 or more skills', tab: 'skills' },
    { ok: p.projects.some(x => x.title.trim()), label: 'At least one project', tab: 'projects' },
    { ok: p.certs.length + p.awards.length > 0, label: 'A certification or achievement', tab: 'achievements' },
    { ok: p.languages.length > 0, label: 'Languages', tab: 'languages' },
    { ok: !!(p.links.github || p.links.linkedin), label: 'GitHub or LinkedIn link', tab: 'links' },
    { ok: !!p.prefs.roles.trim(), label: 'Preferred job roles', tab: 'preferences' },
    { ok: hasResume, label: 'Resume added', tab: 'resume' },
  ]
  return { pct: Math.round((items.filter(i => i.ok).length / items.length) * 100), items }
}

/** Quality is about substance, not just presence: detail in descriptions, links on projects, skill levels. */
export function quality(p: Profile): { pct: number; tips: string[] } {
  const tips: string[] = []
  let pts = 0
  const add = (ok: boolean, n: number, tip: string) => { if (ok) pts += n; else tips.push(tip) }
  add(p.bio.trim().length >= 150, 15, 'Write a longer About section (150+ characters): who you are, what you build, what you want.')
  add(p.projects.length >= 2, 15, 'Add at least 2 projects. Recruiters judge freshers mainly on projects.')
  add(p.projects.length > 0 && p.projects.every(x => x.repo || x.demo), 15, 'Give every project a GitHub or live demo link.')
  add(p.projects.length > 0 && p.projects.every(x => x.desc.trim().length >= 60), 10, 'Describe each project in 60+ characters: what it does and which tech you used.')
  add(p.skills.length >= 8, 10, 'List 8 or more skills so job matching has something to work with.')
  add(p.skills.length > 0 && p.skills.every(s => s.level), 10, 'Set a level for each skill, honestly.')
  add(!!p.links.github && !!p.links.linkedin, 10, 'Add both GitHub and LinkedIn.')
  add(p.experience.some(e => e.achievements.trim() || e.desc.trim().length > 40) || p.isFresher && p.certs.length > 0, 10, 'Add an internship, freelance work or certificate with a result you can point to.')
  add(!!p.photo, 5, 'Add a profile photo.')
  return { pct: Math.min(100, pts), tips }
}

/** Skills a target role usually asks for, used by the skill-gap view. Kept small and honest: it is a starting point. */
export const ROLE_SKILLS: Record<string, string[]> = {
  'frontend': ['javascript', 'typescript', 'react', 'html', 'css', 'git', 'rest', 'testing'],
  'backend': ['node', 'express', 'sql', 'mongodb', 'rest', 'docker', 'git', 'redis'],
  'full stack': ['javascript', 'typescript', 'react', 'node', 'sql', 'mongodb', 'git', 'docker', 'rest'],
  'data': ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'excel', 'power bi', 'tableau'],
  'machine learning': ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'sql'],
  'devops': ['linux', 'docker', 'kubernetes', 'aws', 'ci/cd', 'git', 'python'],
  'android': ['kotlin', 'java', 'android', 'git', 'rest'],
  'java': ['java', 'spring', 'sql', 'oop', 'data structures', 'algorithms', 'git'],
  'python': ['python', 'django', 'flask', 'sql', 'git', 'rest', 'data structures'],
}
export function roleSkills(roleText: string): string[] {
  const t = roleText.toLowerCase()
  for (const k of Object.keys(ROLE_SKILLS)) if (t.includes(k)) return ROLE_SKILLS[k]
  if (/software|sde|developer|engineer|intern/.test(t)) return ['data structures', 'algorithms', 'oop', 'git', 'sql', 'rest', 'testing']
  return []
}
export function skillGap(p: Profile): { role: string; needed: string[]; have: string[]; missing: string[] } {
  const role = p.prefs.roles.split(',')[0]?.trim() || p.headline
  const needed = roleSkills(role)
  const mine = new Set(p.skills.map(s => s.name.toLowerCase()).concat(extractSkills(p.skills.map(s => s.name).join(' '))))
  const have = needed.filter(s => mine.has(s) || [...mine].some(m => m.includes(s)))
  return { role, needed, have, missing: needed.filter(s => !have.includes(s)) }
}

/** A rough, rule-based resume check. It is NOT a real ATS: it only looks for things most parsers need. */
export function atsCheck(text: string): { score: number; checks: { ok: boolean; label: string }[] } {
  const t = text || ''
  const low = t.toLowerCase()
  const checks = [
    { ok: /[\w.+-]+@[\w-]+\.[\w.]+/.test(t), label: 'Contains an email address' },
    { ok: /(\+?\d[\d\s-]{8,})/.test(t), label: 'Contains a phone number' },
    { ok: /education|b\.?tech|bachelor|degree|university|college/.test(low), label: 'Has an education section' },
    { ok: /skills|technologies|tech stack/.test(low), label: 'Has a skills section' },
    { ok: /project/.test(low), label: 'Has a projects section' },
    { ok: /experience|intern|work history/.test(low), label: 'Has experience or internship section' },
    { ok: /\d+\s?%|\d+\+|\b\d{2,}\b/.test(t), label: 'Uses numbers to show results' },
    { ok: /github\.com|linkedin\.com/.test(low), label: 'Links to GitHub or LinkedIn' },
    { ok: t.length >= 600 && t.length <= 8000, label: 'Sensible length (not too short or long)' },
    { ok: extractSkills(t).length >= 5, label: 'Mentions 5+ recognised technical skills' },
  ]
  return { score: Math.round((checks.filter(c => c.ok).length / checks.length) * 100), checks }
}

/** Overall readiness: a transparent blend of profile completeness, quality, resume strength and activity. */
export function readiness(completionPct: number, qualityPct: number, atsPct: number, applied: number): number {
  const activity = Math.min(100, applied * 10)
  return Math.round(completionPct * 0.3 + qualityPct * 0.3 + atsPct * 0.25 + activity * 0.15)
}
