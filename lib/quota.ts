import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export const FREE_DAILY = 15
export const PRO_DAILY = 100

export function decide(plan: string, today: string, aiDay: string | undefined, aiUsed: number | undefined) {
  const limit = plan === 'pro' ? PRO_DAILY : FREE_DAILY
  const used = aiDay === today ? (aiUsed || 0) : 0
  return { limit, used, ok: used < limit }
}

export type Quota = { ok: boolean; used: number; limit: number; plan: string }

/** Counts one AI run for this user. If the database is down we allow the request (fail open). */
export async function takeAiRun(userId: string): Promise<Quota> {
  try {
    await connectDB()
    const u: any = await User.findById(userId).select('plan aiDay aiUsed')
    if (!u) return { ok: true, used: 0, limit: FREE_DAILY, plan: 'free' }
    const today = new Date().toISOString().slice(0, 10)
    const d = decide(u.plan || 'free', today, u.aiDay, u.aiUsed)
    if (!d.ok) return { ok: false, used: d.used, limit: d.limit, plan: u.plan || 'free' }
    await User.updateOne({ _id: userId }, { aiDay: today, aiUsed: d.used + 1 })
    return { ok: true, used: d.used + 1, limit: d.limit, plan: u.plan || 'free' }
  } catch { return { ok: true, used: 0, limit: FREE_DAILY, plan: 'free' } }
}

/** Give the run back when the AI providers failed, so users are not charged for errors. */
export async function refundAiRun(userId: string) {
  try { await connectDB(); await User.updateOne({ _id: userId, aiUsed: { $gt: 0 } }, { $inc: { aiUsed: -1 } }) } catch {}
}
