import { NextRequest, NextResponse } from 'next/server'
import { authUser } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

const MAX = 300_000 // bytes of JSON per user

export async function GET(req: NextRequest) {
  const auth = await authUser(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  try {
    await connectDB()
    const u = await User.findById(auth.userId).select('syncData plan')
    return NextResponse.json({ data: u?.syncData || {}, plan: u?.plan || 'free' })
  } catch { return NextResponse.json({ error: 'Sync unavailable' }, { status: 503 }) }
}

export async function PUT(req: NextRequest) {
  const auth = await authUser(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const data = body?.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ error: 'data object required' }, { status: 400 })
  // keep only tl_* string values, never tokens or account info
  const clean: Record<string, string> = {}
  if (JSON.stringify(data).length > MAX * 2) return NextResponse.json({ error: 'Data is too large to sync' }, { status: 413 })
  for (const [k, v] of Object.entries(data)) {
    // simple key names only: dots or $ in a key would break MongoDB, and nothing else is ever stored by the app
    if (/^tl_[a-z0-9_]{1,60}$/.test(k) && !['tl_token', 'tl_user', 'tl_role'].includes(k) && typeof v === 'string' && Object.keys(clean).length < 200) clean[k] = v
  }
  try {
    await connectDB()
    // merge, never replace: a device that has not loaded everything yet must not wipe keys it does not know about
    const existing: any = (await User.findById(auth.userId).select('syncData').lean() as any)?.syncData || {}
    const merged = { ...existing, ...clean }
    if (JSON.stringify(merged).length > MAX) return NextResponse.json({ error: 'Data is too large to sync' }, { status: 413 })
    await User.findByIdAndUpdate(auth.userId, { syncData: merged })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Sync unavailable' }, { status: 503 }) }
}
