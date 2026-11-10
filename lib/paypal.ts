// PayPal REST (Orders v2). Uses the SANDBOX by default.
export const PRO_PRICE = '2.00'
export const PRO_CURRENCY = 'USD'

function base() {
  if (process.env.PAYPAL_API_BASE) return process.env.PAYPAL_API_BASE
  return process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
}

export function paypalConfigured() {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
}

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_CLIENT_SECRET
  if (!id || !secret) throw new Error('PayPal is not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET missing)')
  const r = await fetch(base() + '/v1/oauth2/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const d = await r.json()
  if (!r.ok || !d.access_token) throw new Error('PayPal auth failed: ' + (d.error_description || r.status))
  return d.access_token
}

export async function createOrder(userId: string) {
  const token = await accessToken()
  const r = await fetch(base() + '/v2/checkout/orders', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ custom_id: userId, description: 'TalentLaunch Pro (sandbox)', amount: { currency_code: PRO_CURRENCY, value: PRO_PRICE } }],
    }),
  })
  const d = await r.json()
  if (!r.ok || !d.id) throw new Error('PayPal create order failed: ' + (d.message || r.status))
  return d.id as string
}

export async function captureOrder(orderId: string) {
  const token = await accessToken()
  const r = await fetch(base() + '/v2/checkout/orders/' + encodeURIComponent(orderId) + '/capture', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  })
  const d = await r.json()
  if (!r.ok) throw new Error('PayPal capture failed: ' + (d.message || r.status))
  return d
}
