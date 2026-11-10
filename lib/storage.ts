// Safe localStorage helpers: a broken value must never crash a page.
export function readJSON<T = any>(key: string, fallback: string = 'null'): T {
  try { return JSON.parse(localStorage.getItem(key) || fallback) } catch { try { return JSON.parse(fallback) } catch { return null as any } }
}
export function writeJSON(key: string, value: any) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
