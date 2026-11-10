import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { AdminJob } from '@/lib/models/AdminJob'
import { authUser, rateLimit } from '@/lib/auth'
import { cleanUrl } from '@/lib/safeUrl'
import mongoose from 'mongoose'

const str = (v: any, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function shape(j: any) {
  const o = j.toObject ? j.toObject() : j
  return { ...o, id: String(o._id), source: 'TalentLaunch', posted: 'Recently', createdAt: o.createdAt,
    estimatedSalary: o.salary || 'Competitive', review: { rating: 4.0, wlb: 4.0 } }
}

export async function GET() {
  try {
    await connectDB()
    const jobs = await AdminJob.find().sort({ createdAt: -1 }).limit(200)
    return NextResponse.json({ jobs: jobs.map(shape) })
  } catch { return NextResponse.json({ jobs: [] }) }
}

export async function POST(req: NextRequest) {
  const payload = await authUser(req)
  if (!payload || !['admin', 'recruiter'].includes(payload.role))
    return NextResponse.json({ error: 'Admin or recruiter access required' }, { status: 403 })
  if (!rateLimit('job:' + payload.userId, 20, 60_000)) return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 })
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  // allow-list the fields: no one can set _id, postedBy, timestamps or any other internal field
  const title = str(body.title, 150), company = str(body.company, 100)
  if (!title || !company) return NextResponse.json({ error: 'Title and company are required' }, { status: 400 })
  let applyUrl = ''
  const rawLink = body.url ?? body.applyUrl
  if (rawLink) { applyUrl = cleanUrl(rawLink); if (!applyUrl) return NextResponse.json({ error: 'Apply link must start with http:// or https://' }, { status: 400 }) }
  const tags = Array.isArray(body.tags) ? body.tags.filter((t: any) => typeof t === 'string').map((t: string) => t.trim().slice(0, 40)).filter(Boolean).slice(0, 15) : []
  try {
    await connectDB()
    const job = await AdminJob.create({ title, company, location: str(body.location, 100), type: str(body.type, 40), salary: str(body.salary, 60), description: str(body.description, 5000), url: applyUrl, applyUrl, isRemote: body.isRemote !== false, isFresher: body.isFresher !== false, tags, postedBy: String(payload.userId) })
    return NextResponse.json({ success: true, job: shape(job) })
  } catch { return NextResponse.json({ error: 'Could not save job' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  const payload = await authUser(req)
  if (!payload || !['admin', 'recruiter'].includes(payload.role))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = (await req.json().catch(() => ({}))) as { id?: unknown }
  if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 })
  try {
    await connectDB()
    const job = await AdminJob.findById(id)
    if (job && payload.role !== 'admin' && String(job.postedBy) !== String(payload.userId))
      return NextResponse.json({ error: 'You can delete only your own jobs' }, { status: 403 })
    if (job) await job.deleteOne()
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Could not delete job' }, { status: 500 }) }
}
