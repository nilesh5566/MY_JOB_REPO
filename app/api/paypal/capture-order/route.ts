import { NextRequest, NextResponse } from 'next/server'
import { authUser } from '@/lib/auth'
import { captureOrder, paypalConfigured, PRO_PRICE, PRO_CURRENCY } from '@/lib/paypal'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  const auth = await authUser(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  if (!paypalConfigured()) return NextResponse.json({ error: 'PayPal is not configured on the server' }, { status: 503 })
  const { orderId } = await req.json().catch(() => ({}))
  if (!orderId || typeof orderId !== 'string') return NextResponse.json({ error: 'orderId required' }, { status: 400 })
  try {
    await connectDB()
    // An order can upgrade an account only once
    if (await User.findOne({ paypalOrderId: orderId })) return NextResponse.json({ error: 'This payment was already used' }, { status: 409 })
    const data = await captureOrder(orderId)
    const unit = data.purchase_units?.[0]
    const cap = unit?.payments?.captures?.[0]
    const ok = data.status === 'COMPLETED' && cap?.status === 'COMPLETED' &&
      cap?.amount?.value === PRO_PRICE && cap?.amount?.currency_code === PRO_CURRENCY &&
      unit?.custom_id === String(auth.userId)
    if (!ok) return NextResponse.json({ error: 'Payment was not completed' }, { status: 402 })
    const user = await User.findByIdAndUpdate(auth.userId, { plan: 'pro', paypalOrderId: orderId, proSince: new Date(), $inc: { xp: 100 } }, { new: true })
    return NextResponse.json({ success: true, plan: 'pro', xp: user?.xp })
  } catch (e: any) {
    console.error('paypal capture-order:', e?.message)
    return NextResponse.json({ error: 'Could not confirm the payment' }, { status: 502 })
  }
}
