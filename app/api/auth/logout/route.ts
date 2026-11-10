import { NextRequest, NextResponse } from 'next/server'
import { authUser, clearSession } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

// Signs out this browser. With { all: true } it also revokes every other session (all devices).
export async function POST(req: NextRequest) {
  const res = clearSession(NextResponse.json({ ok: true }))
  const body = await req.json().catch(() => ({}))
  if (body?.all === true) {
    const a = await authUser(req)
    if (!a) return res
    try { await connectDB(); await User.updateOne({ _id: a.userId }, { $inc: { tokenVersion: 1 } }) } catch { return NextResponse.json({ error: 'Could not sign out everywhere right now' }, { status: 503 }) }
  }
  return res
}
