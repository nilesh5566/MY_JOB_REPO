import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, rateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req)
  if (!auth) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })
  if (!rateLimit('pdf:' + auth.userId, 10, 60_000)) return NextResponse.json({ error: 'Too many uploads. Please wait a minute.' }, { status: 429 })
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (!file.name.toLowerCase().endsWith('.pdf'))
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })

    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'PDF is too large (max 4 MB)' }, { status: 413 })
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') return NextResponse.json({ error: 'This file is not a real PDF' }, { status: 400 })

    let text = ''

    // 1) unpdf (modern pdf.js build) reads far more real-world PDFs than the old pdf-parse
    try {
      const { extractText, getDocumentProxy } = await import('unpdf')
      const doc = await getDocumentProxy(new Uint8Array(buffer))
      const r = await extractText(doc, { mergePages: true })
      text = (Array.isArray(r.text) ? r.text.join('\n') : r.text) || ''
    } catch { /* try the next reader */ }

    // 2) pdf-parse as a second opinion
    if (text.trim().length < 50) {
      try {
        const pdfParse = (await import('pdf-parse')).default
        text = (await pdfParse(buffer)).text || ''
      } catch { /* try the last reader */ }
    }

    // 3) very small manual reader for simple, uncompressed PDFs
    if (text.trim().length < 50) text = extractManual(buffer)

    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{4,}/g, '\n\n').trim()

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. Try a text-based PDF (not a scanned image), or paste your resume text manually.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ text, chars: text.length })
  } catch (e: any) {
    console.error('parse-resume error:', e?.message)
    return NextResponse.json({ error: 'Could not read this PDF. Try another file or paste the text.' }, { status: 500 })
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

  return '' // nothing readable: the caller asks the person to paste their text instead
}
