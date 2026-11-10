import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, rateLimit } from '@/lib/auth'
import { takeAiRun, refundAiRun } from '@/lib/quota'

// ── Provider configs ──────────────────────────────────────────────────────
const PROVIDERS = [
  {
    name: 'Groq',
    key: () => process.env.GROQ_API_KEY,
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    format: (body: any, key: string) => ({
      url: 'https://api.groq.com/openai/v1/chat/completions',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', max_tokens: body.max_tokens || 1500, messages: body.messages, temperature: 0.7 }),
    }),
    parse: (d: any) => d,
  },
  {
    name: 'Gemini',
    key: () => process.env.GEMINI_API_KEY,
    format: (body: any, key: string) => {
      const msgs = body.messages || []
      const systemMsg = msgs.find((m: any) => m.role === 'system')?.content || ''
      const userMsgs = msgs.filter((m: any) => m.role !== 'system')
      const contents = userMsgs.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))
      if (systemMsg && contents.length > 0) contents[0].parts[0].text = systemMsg + '\n\n' + contents[0].parts[0].text
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: body.max_tokens || 1500, temperature: 0.7 } }),
      }
    },
    parse: (d: any) => ({
      choices: [{ message: { content: d.candidates?.[0]?.content?.parts?.[0]?.text || '' } }]
    }),
  },
  {
    name: 'Cohere',
    key: () => process.env.COHERE_API_KEY,
    format: (body: any, key: string) => {
      const msgs = body.messages || []
      const system = msgs.find((m: any) => m.role === 'system')?.content || ''
      const history = msgs.filter((m: any) => m.role !== 'system' && m.role !== 'user').map((m: any) => ({ role: m.role === 'assistant' ? 'CHATBOT' : 'USER', message: m.content }))
      const lastUser = [...msgs].reverse().find((m: any) => m.role === 'user')?.content || ''
      return {
        url: 'https://api.cohere.com/v1/chat',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: 'command-r', message: lastUser, preamble: system, chat_history: history, max_tokens: body.max_tokens || 1500 }),
      }
    },
    parse: (d: any) => ({
      choices: [{ message: { content: d.text || '' } }]
    }),
  },
  {
    name: 'Mistral',
    key: () => process.env.MISTRAL_API_KEY,
    format: (body: any, key: string) => ({
      url: 'https://api.mistral.ai/v1/chat/completions',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: body.max_tokens || 1500, messages: body.messages }),
    }),
    parse: (d: any) => d,
  },
  {
    name: 'OpenAI',
    key: () => process.env.OPENAI_API_KEY,
    format: (body: any, key: string) => ({
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: body.max_tokens || 1500, messages: body.messages }),
    }),
    parse: (d: any) => d,
  },
]

export async function GET() {
  // Return which providers are configured
  const configured = PROVIDERS.filter(p => !!p.key()).map(p => p.name)
  return NextResponse.json({ providers: configured, active: configured[0] || null })
}

export async function POST(req: NextRequest) {
  // Only logged-in users may spend the free AI quota, and not too fast
  const auth = verifyAuth(req)
  if (!auth) return NextResponse.json({ error: 'Please log in to use the AI tools' }, { status: 401 })
  if (!rateLimit('ai:' + auth.userId, 20, 60_000)) return NextResponse.json({ error: 'Too many AI requests. Please wait a minute.' }, { status: 429 })
  const body = await req.json().catch(() => null)
  if (!body || !Array.isArray(body.messages)) return NextResponse.json({ error: 'messages array required' }, { status: 400 })
  if (JSON.stringify(body.messages).length > 30000) return NextResponse.json({ error: 'Input is too long' }, { status: 413 })
  body.max_tokens = Math.min(Number(body.max_tokens) || 1500, 2000)
  const quota = await takeAiRun(String(auth.userId))
  if (!quota.ok) return NextResponse.json({
    error: quota.plan === 'pro'
      ? `You used all ${quota.limit} AI runs for today. They reset tomorrow.`
      : `You used all ${quota.limit} free AI runs for today. Upgrade to Pro for ${100} runs a day, or come back tomorrow.`,
    _quota: quota,
  }, { status: 429 })
  const preferredProvider = body.provider // optional: client can request specific provider

  // Try each configured provider in order
  const ordered = preferredProvider
    ? [...PROVIDERS.filter(p => p.name === preferredProvider), ...PROVIDERS.filter(p => p.name !== preferredProvider)]
    : PROVIDERS

  const errors: string[] = []
  for (const provider of ordered) {
    const key = provider.key()
    if (!key) continue
    try {
      const req_config = provider.format(body, key)
      const res = await fetch(req_config.url, {
        method: 'POST',
        headers: req_config.headers,
        body: req_config.body,
      })
      const data = await res.json()
      if (data.error || data.errors) {
        errors.push(`${provider.name}: ${data.error?.message || JSON.stringify(data.errors)}`)
        continue
      }
      const parsed = provider.parse(data)
      if (!parsed.choices?.[0]?.message?.content) {
        errors.push(`${provider.name}: empty response`)
        continue
      }
      return NextResponse.json({ ...parsed, _provider: provider.name, _quota: quota })
    } catch (e: any) {
      errors.push(`${provider.name}: ${e.message}`)
    }
  }

  const configured = PROVIDERS.filter(p => !!p.key())
  if (configured.length === 0) {
    await refundAiRun(String(auth.userId))
    console.error('AI: no provider key configured (set GROQ_API_KEY, GEMINI_API_KEY, COHERE_API_KEY, MISTRAL_API_KEY or OPENAI_API_KEY)')
    return NextResponse.json({ error: 'AI tools are not available right now. Please try again later.'}, { status: 503 })
  }
  await refundAiRun(String(auth.userId))
  console.error('AI: all providers failed:', errors.join(' | '))
  return NextResponse.json({ error: 'The AI is busy right now. Please try again in a minute. (This run was not counted.)' }, { status: 503 })
}
