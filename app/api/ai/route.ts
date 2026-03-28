import { NextRequest, NextResponse } from 'next/server'

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
  const body = await req.json()
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
      return NextResponse.json({ ...parsed, _provider: provider.name })
    } catch (e: any) {
      errors.push(`${provider.name}: ${e.message}`)
    }
  }

  const configured = PROVIDERS.filter(p => !!p.key())
  if (configured.length === 0) {
    return NextResponse.json({
      error: 'No AI API key configured. Add at least one to .env.local: GROQ_API_KEY (free at console.groq.com), GEMINI_API_KEY (free at aistudio.google.com), COHERE_API_KEY (free at cohere.com), MISTRAL_API_KEY, or OPENAI_API_KEY'
    }, { status: 500 })
  }
  return NextResponse.json({ error: `All providers failed: ${errors.join(' | ')}` }, { status: 500 })
}
