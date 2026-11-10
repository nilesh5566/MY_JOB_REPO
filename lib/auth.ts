import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export function getSecret(): string {
  const s = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not set in the environment')
  if (process.env.NODE_ENV === 'production' && s.length < 16) throw new Error('NEXTAUTH_SECRET is not set to a strong value (use 32+ random characters)')
  return s
}

export function signToken(payload: object) {
  return jwt.sign(payload, getSecret(), { algorithm: 'HS256', expiresIn: '30d' })
}

export const COOKIE = 'tl_session'
const MAX_AGE = 30 * 24 * 60 * 60

/** Put the session token in an httpOnly cookie: page scripts (and so any XSS) can never read it. */
export function setSession(res: NextResponse, token: string) {
  res.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE })
  return res
}
export function clearSession(res: NextResponse) {
  res.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}

/** Browsers always send Origin (or Sec-Fetch-Site) on cross-site writes. A cookie-authenticated write must come from our own site. */
function sameSiteWrite(req: NextRequest): boolean {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const origin = req.headers.get('origin')
  if (origin) { try { return new URL(origin).host === host } catch { return false } }
  const sfs = req.headers.get('sec-fetch-site')
  return sfs === 'same-origin' || sfs === 'none'
}

/** Reads the session from the cookie (browser) or an Authorization header (scripts). Signature and expiry only; see authUser for the database check. */
export function verifyAuth(req: NextRequest): any | null {
  try {
    const bearer = /^Bearer\s+(\S+)$/i.exec(req.headers.get('authorization') || '')?.[1]
    const cookie = req.cookies.get(COOKIE)?.value
    const token = bearer || cookie
    if (!token) return null
    // a cookie is sent automatically by the browser, so writes made with one must be same-site (CSRF defence)
    if (!bearer && !['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !sameSiteWrite(req)) return null
    // pin the algorithm so a forged token can never choose "none" or another scheme
    const p: any = jwt.verify(token, getSecret(), { algorithms: ['HS256'] })
    if (!p || typeof p !== 'object' || !p.userId || !['student', 'recruiter', 'admin'].includes(p.role)) return null
    return p
  } catch { return null }
}

/**
 * Full check for routes that change data or money: valid token AND the user still exists AND the
 * token was not revoked (password change / "log out everywhere"). The role comes from the database,
 * so demoting someone takes effect immediately.
 */
export async function authUser(req: NextRequest): Promise<any | null> {
  const p = verifyAuth(req); if (!p) return null
  try {
    const { connectDB } = await import('./db'); const { User } = await import('./models/User')
    await connectDB()
    const u: any = await User.findById(p.userId).select('role tokenVersion').lean()
    if (!u || (u.tokenVersion || 0) !== (p.tv || 0)) return null
    return { ...p, role: u.role }
  } catch { return null } // database unreachable: these routes need it anyway, so refuse rather than trust the token alone
}

// Very small in-memory rate limiter (per server instance). Old entries are swept so memory cannot grow without bound.
const hits = new Map<string, { n: number; t: number }>()
let lastSweep = 0
export function rateLimit(key: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  if (now - lastSweep > 60_000) {
    lastSweep = now
    hits.forEach((v, k) => { if (now - v.t > 10 * 60_000) hits.delete(k) })
    if (hits.size > 50_000) hits.clear()
  }
  const h = hits.get(key)
  if (!h || now - h.t > windowMs) { hits.set(key, { n: 1, t: now }); return true }
  h.n++
  return h.n <= max
}
export function clientIp(req: NextRequest) {
  return (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim().slice(0, 64)
}
