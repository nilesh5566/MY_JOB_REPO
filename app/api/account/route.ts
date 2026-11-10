import { NextRequest, NextResponse } from 'next/server'
import { authUser, rateLimit, clearSession } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

// Permanently deletes the signed-in user's account. Requires the password again.
export async function DELETE(req: NextRequest) {
  const auth = await authUser(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  if (!rateLimit('del:' + auth.userId, 3, 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  try {
    const { password } = await req.json().catch(() => ({}))
    await connectDB()
    const user = await User.findById(auth.userId)
    if (!user || typeof password !== 'string' || !(await user.comparePassword(password))) return NextResponse.json({ error: 'Password is wrong' }, { status: 403 })
    await User.deleteOne({ _id: user._id })
    return clearSession(NextResponse.json({ ok: true }))
  } catch (e: any) {
    console.error('delete account error:', e?.message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
