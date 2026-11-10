import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, createClerkClient } from '@clerk/nextjs/server'
import crypto from 'crypto'
import { setSession, signToken, rateLimit, clientIp } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

// Secondary sign-in: the browser proves a Clerk session, we verify it server-side
// and hand back the same TalentLaunch token the email/password login returns.
export async function POST(req: NextRequest) {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Clerk sign-in is not configured' }, { status: 501 })
  if (!rateLimit('clerk:' + clientIp(req), 10, 60_000)) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!bearer) return NextResponse.json({ error: 'Missing Clerk session' }, { status: 401 })
  try {
    const claims: any = await verifyToken(bearer, { secretKey })
    const clerkId = String(claims?.sub || '')
    if (!clerkId) return NextResponse.json({ error: 'Invalid Clerk session' }, { status: 401 })

    const cu = await createClerkClient({ secretKey }).users.getUser(clerkId)
    const primary = cu.emailAddresses.find(e => e.id === cu.primaryEmailAddressId)
    // Only trust an email Clerk has verified, otherwise anyone could claim someone else's account
    if (!primary || primary.verification?.status !== 'verified') return NextResponse.json({ error: 'Your email is not verified with Clerk yet' }, { status: 403 })
    const email = primary.emailAddress.toLowerCase()
    const name = [cu.firstName, cu.lastName].filter(Boolean).join(' ') || email.split('@')[0]

    await connectDB()
    let user = await User.findOne({ email })
    if (user) {
      if (user.clerkId && user.clerkId !== clerkId) return NextResponse.json({ error: 'This email is linked to a different Clerk account' }, { status: 409 })
      if (!user.clerkId) { user.clerkId = clerkId; await user.save() }
    } else {
      // Clerk-only users get an unguessable password; they can set one later from Account settings
      user = await User.create({ name, email, password: crypto.randomBytes(32).toString('hex'), role: 'student', clerkId })
    }
    const token = signToken({ userId: user._id, role: user.role, tv: user.tokenVersion || 0 })
    return setSession(NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, skills: user.skills, targetRole: user.targetRole, xp: user.xp, plan: user.plan || 'free' } }), token)
  } catch (e: any) {
    console.error('clerk sign-in error:', e?.message)
    return NextResponse.json({ error: e?.message?.includes('not set') ? 'Server is not configured (missing environment variables)' : 'Could not verify your Clerk sign-in' }, { status: 401 })
  }
}
