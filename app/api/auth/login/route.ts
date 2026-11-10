import { NextRequest, NextResponse } from 'next/server'
import { setSession, signToken, rateLimit, clientIp } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  if (!rateLimit('login:' + clientIp(req), 10, 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  try {
    const body = await req.json().catch(() => null)
    const rawEmail = body?.email, password = body?.password
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!email || typeof password !== 'string' || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (email.length > 254 || password.length > 200) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    await connectDB()
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const token = signToken({ userId: user._id, role: user.role, tv: user.tokenVersion || 0 })
    return setSession(NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, skills: user.skills, targetRole: user.targetRole, xp: user.xp, plan: user.plan || 'free' }
    }), token)
  } catch (e: any) {
    console.error('login error:', e?.message)
    return NextResponse.json({ error: e?.message?.includes('not set') ? 'Server is not configured (missing environment variables)' : 'Server error' }, { status: 500 })
  }
}
