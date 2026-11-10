import { NextRequest, NextResponse } from 'next/server'
import { setSession, signToken, rateLimit, clientIp } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  if (!rateLimit('reg:' + clientIp(req), 10, 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const { name: rawName, email: rawEmail, password, role: reqRole, college: rawCollege, skills: rawSkills, targetRole: rawTarget } = body as any
    const name = typeof rawName === 'string' ? rawName.trim().slice(0, 100) : ''
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    const college = typeof rawCollege === 'string' ? rawCollege.trim().slice(0, 150) : ''
    const targetRole = typeof rawTarget === 'string' ? rawTarget.trim().slice(0, 100) : ''
    const skills = Array.isArray(rawSkills) ? rawSkills.filter((x: any) => typeof x === 'string').map((x: string) => x.trim().slice(0, 40)).filter(Boolean).slice(0, 40) : []
    // Only student/recruiter can self-register. Admin is granted only via the ADMIN_EMAILS env var.
    const adminList = (process.env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean)
    const role = adminList.includes(email) ? 'admin' : (reqRole === 'recruiter' ? 'recruiter' : 'student')
    if (!name || !email || typeof password !== 'string' || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    // bcrypt only uses the first 72 bytes, so longer passwords are refused instead of silently cut
    if (password.length < 8 || Buffer.byteLength(password) > 72) return NextResponse.json({ error: 'Password must be 8 to 72 characters' }, { status: 400 })

    await connectDB()
    if (await User.findOne({ email })) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const user = await User.create({ name, email, password, role, college, skills, targetRole })
    const token = signToken({ userId: user._id, role: user.role, tv: user.tokenVersion || 0 })
    return setSession(NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, skills: user.skills, targetRole: user.targetRole, xp: 0 }
    }), token)
  } catch (e: any) {
    console.error('register error:', e?.message)
    return NextResponse.json({ error: e?.message?.includes('not set') ? 'Server is not configured (missing environment variables)' : 'Server error' }, { status: 500 })
  }
}
