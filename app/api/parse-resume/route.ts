import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!file.name.toLowerCase().endsWith('.pdf'))
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let text = ''

    // Try pdf-parse first (best quality)
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      text = data.text || ''
    } catch {
      // Fallback: manual PDF text extraction via BT...ET blocks
      text = extractManual(buffer)
    }

    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{4,}/g, '\n\n').trim()

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. Try a text-based PDF (not a scanned image), or paste your resume text manually.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ text, chars: text.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

function extractManual(buffer: Buffer): string {
  const str = buffer.toString('latin1')
  const chunks: string[] = []

  // BT...ET blocks
  const btEt = /BT([\s\S]*?)ET/g
  let m: RegExpExecArray | null
  while ((m = btEt.exec(str)) !== null) {
    const block = m[1]
    // Tj strings
    const tj = /\(([^)]*)\)\s*Tj/g
    let p: RegExpExecArray | null
    while ((p = tj.exec(block)) !== null) {
      const s = p[1].replace(/\\n/g, ' ').replace(/\\r/g, ' ').replace(/\\([()\\])/g, '$1').trim()
      if (s) chunks.push(s)
    }
    // TJ arrays
    const tjArr = /\[([\s\S]*?)\]\s*TJ/g
    let t: RegExpExecArray | null
    while ((t = tjArr.exec(block)) !== null) {
      const parts = /\(([^)]*)\)/g
      let pt: RegExpExecArray | null
      while ((pt = parts.exec(t[1])) !== null) {
        const s = pt[1].replace(/\\([()\\])/g, '$1').trim()
        if (s) chunks.push(s)
      }
    }
  }

  if (chunks.length > 10) return chunks.join(' ').replace(/\s+/g, ' ')

  // Last resort: raw ASCII run extraction
  let out = '', run = ''
  for (let i = 0; i < buffer.length; i++) {
    const c = buffer[i]
    if (c >= 32 && c <= 126) run += String.fromCharCode(c)
    else { if (run.length > 4) out += run + ' '; run = '' }
  }
  return out.split(/\s{3,}/).filter(s => s.trim().length > 3).join('\n').slice(0, 10000)
}
