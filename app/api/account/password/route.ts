import { NextRequest, NextResponse } from 'next/server'
import { authUser, rateLimit, setSession, signToken } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  const auth = await authUser(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  if (!rateLimit('pw:' + auth.userId, 5, 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  try {
    const { current, next } = await req.json()
    if (typeof current !== 'string' || typeof next !== 'string') return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 })
    if (next.length < 8 || next.length > 100) return NextResponse.json({ error: 'New password must be 8 to 100 characters' }, { status: 400 })
    await connectDB()
    const user = await User.findById(auth.userId)
    if (!user || !(await user.comparePassword(current))) return NextResponse.json({ error: 'Current password is wrong' }, { status: 403 })
    user.password = next   // hashed by the model's pre-save hook
    user.tokenVersion = (user.tokenVersion || 0) + 1   // every other device is signed out
    await user.save()
    // keep this device signed in with a fresh token
    return setSession(NextResponse.json({ ok: true }), signToken({ userId: user._id, role: user.role, tv: user.tokenVersion }))
  } catch (e: any) {
    console.error('password error:', e?.message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
