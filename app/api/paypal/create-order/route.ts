import { NextRequest, NextResponse } from 'next/server'
import { authUser } from '@/lib/auth'
import { createOrder, paypalConfigured } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  const user = await authUser(req)
  if (!user) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  if (!paypalConfigured()) return NextResponse.json({ error: 'PayPal is not configured on the server' }, { status: 503 })
  try {
    const id = await createOrder(String(user.userId))
    return NextResponse.json({ id })
  } catch (e: any) {
    console.error('paypal create-order:', e?.message)
    return NextResponse.json({ error: 'Could not start the payment' }, { status: 502 })
  }
}
