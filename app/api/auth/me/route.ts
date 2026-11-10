import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, clearSession } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

// "Who am I?" for the browser. The session cookie is httpOnly, so the page cannot read it and has to ask.
export async function GET(req: NextRequest) {
  const p = verifyAuth(req)
  if (!p) return clearSession(NextResponse.json({ error: 'Not signed in' }, { status: 401 }))
  try {
    await connectDB()
    const u: any = await User.findById(p.userId).select('-password -syncData').lean()
    if (!u || (u.tokenVersion || 0) !== (p.tv || 0)) return clearSession(NextResponse.json({ error: 'Session ended' }, { status: 401 }))
    return NextResponse.json({ user: { id: String(u._id), name: u.name, email: u.email, role: u.role, college: u.college, skills: u.skills, targetRole: u.targetRole, xp: u.xp, plan: u.plan || 'free' } })
  } catch {
    // database down: the token itself is valid, so say "unavailable" instead of signing the person out
    return NextResponse.json({ error: 'Account service unavailable' }, { status: 503 })
  }
}
