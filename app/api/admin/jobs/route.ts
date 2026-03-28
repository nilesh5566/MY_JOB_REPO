import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const adminJobs: any[] = []

function verifyAuth(req: NextRequest) {
  try {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
    return jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret') as any
  } catch { return null }
}

export async function GET() {
  return NextResponse.json({ jobs: adminJobs })
}

export async function POST(req: NextRequest) {
  const payload = verifyAuth(req)
  if (!payload || !['admin','recruiter'].includes(payload.role))
    return NextResponse.json({ error: 'Admin or recruiter access required' }, { status: 403 })
  const body = await req.json()
  const job = {
    id:`admin_${Date.now()}`, ...body,
    source:'TalentLaunch', posted:'Today',
    postedBy:payload.userId, createdAt:new Date().toISOString(),
    estimatedSalary:body.salary||'Competitive',
    review:{rating:4.0,wlb:4.0},
  }
  adminJobs.unshift(job)
  return NextResponse.json({ success:true, job })
}

export async function DELETE(req: NextRequest) {
  const payload = verifyAuth(req)
  if (!payload || !['admin','recruiter'].includes(payload.role))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await req.json()
  const idx = adminJobs.findIndex(j => j.id === id)
  if (idx !== -1) adminJobs.splice(idx,1)
  return NextResponse.json({ success:true })
}
