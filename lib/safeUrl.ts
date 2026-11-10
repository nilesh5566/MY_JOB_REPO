/** Only http(s) links are allowed in href. Blocks javascript:, data:, vbscript: and malformed values. */
export function safeUrl(u: unknown): string {
  if (typeof u !== 'string') return '#'
  const s = u.trim()
  if (!s || s.length > 2000) return '#'
  try {
    const p = new URL(s)
    return p.protocol === 'http:' || p.protocol === 'https:' ? p.toString() : '#'
  } catch { return '#' }
}
/** Like safeUrl but returns '' for invalid input (for validating before saving). */
export function cleanUrl(u: unknown): string { const r = safeUrl(u); return r === '#' ? '' : r }
