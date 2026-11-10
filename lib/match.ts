// Shared skill matching used by the Job Match page and the Jobs list
export const SKILLS = ['javascript','typescript','react','next.js','node','express','mongodb','sql','mysql','postgres','python','java','c++','django','flask','fastapi','html','css','tailwind','git','github','docker','kubernetes','aws','azure','gcp','linux','rest','api','graphql','redis','machine learning','deep learning','tensorflow','pytorch','nlp','pandas','numpy','data science','power bi','tableau','excel','figma','agile','testing','jest','ci/cd','devops','android','kotlin','swift','flutter','c#','.net','php','spring','mern','full stack','backend','frontend','ai','data structures','algorithms','oop']

export function extractSkills(text: string): string[] {
  const t = ' ' + (text || '').toLowerCase().replace(/[^a-z0-9+#./ ]/g, ' ') + ' '
  return SKILLS.filter(s => t.includes(' ' + s + ' ') || t.includes(' ' + s + '.') || t.includes(' ' + s + ','))
}

/** 0-100 match between the user's skills and a job, or null when we cannot tell. */
export function matchScore(mySkills: string[], job: { title: string; tags?: string[]; description?: string }): number | null {
  if (!mySkills.length) return null
  const jobSkills = extractSkills(`${job.title} ${(job.tags || []).join(' ')} ${(job.description || '').slice(0, 1500)}`)
  if (!jobSkills.length) return null
  const mine = new Set(mySkills.map(s => s.toLowerCase()))
  const have = jobSkills.filter(s => mine.has(s)).length
  // jobs that name only 1-2 skills should not look like a perfect match
  return Math.round((have / Math.max(jobSkills.length, 3)) * 100)
}
