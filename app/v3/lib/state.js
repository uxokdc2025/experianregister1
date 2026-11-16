/* ──────────────────────────────────────────────────────────────
   V3 (Study 2) — prototype state.

   Everything lives in a single localStorage key, in this browser
   only. No backend, no network calls, no analytics. The persona is
   fictional: never treat these fields as a real person's data.
   ────────────────────────────────────────────────────────────── */

export const STORAGE_KEY = 'exp_v3'

/* The only identity used anywhere in V3. */
export const PERSONA = {
  name: 'Jordan Lee',
  displayName: 'JORDAN LEE',
  firstName: 'Jordan',
  username: 'jordanlee82',
  email: 'jordan.lee@example.com',
  phone: '(555) 010-4567',
  address: '123 SAMPLE ST, SPRINGFIELD, IL 62701',
}

/* Fallback used in masks when the tester never typed a number. */
export const DEFAULT_LAST4 = '4567'

export function readState() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function writeState(patch) {
  if (typeof window === 'undefined') return {}
  const next = { ...readState(), ...patch }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* private mode / storage full — the prototype still works, it just forgets */
  }
  return next
}

/* Wipes every piece of V3 demo state in this browser: all exp_v3*
   keys in localStorage and sessionStorage, and any exp_v3* cookie.
   (It can't remove a passkey from the device's password manager.) */
export function clearState() {
  if (typeof window === 'undefined') return
  for (const store of ['localStorage', 'sessionStorage']) {
    try {
      const s = window[store]
      Object.keys(s)
        .filter((k) => k.startsWith(STORAGE_KEY))
        .forEach((k) => s.removeItem(k))
    } catch {
      /* private mode — ignore */
    }
  }
  try {
    document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((name) => name.startsWith(STORAGE_KEY))
      .forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/`
      })
  } catch {
    /* ignore */
  }
}

/* Logo click: clear the demo and start over on the V3 homepage. */
export function restartDemo() {
  clearState()
  window.location.assign('/v3')
}

/* Study events stay local; nothing is ever sent anywhere. */
export function logEvent(name, detail) {
  if (typeof window === 'undefined') return
  const prev = readState()
  const events = Array.isArray(prev.events) ? prev.events : []
  events.push({ t: new Date().toISOString(), name, ...(detail === undefined ? {} : { detail }) })
  writeState({ events: events.slice(-50) })
}

/* ─── phone helpers ─── */

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 10)
}

/* Progressive US format: 555 → (555) 010 → (555) 010-4567 */
export function formatPhone(value) {
  const d = digitsOnly(value)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function isCompletePhone(value) {
  return digitsOnly(value).length === 10
}

export function last4(value) {
  const d = digitsOnly(value)
  return d.length >= 4 ? d.slice(-4) : DEFAULT_LAST4
}

/* (***) ***-4567 — last 4 of what the tester typed, else 4567. */
export function maskPhone(value) {
  return `(***) ***-${last4(value)}`
}

/* "Nov 15, 2026" */
export function formatDate(date = new Date()) {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/* Default passkey name, e.g. "Chrome on Mac" or "iPhone". Card 3 lets
   the tester rename it; nothing here identifies the person. */
export function deviceLabel() {
  if (typeof navigator === 'undefined') return 'This device'
  const ua = navigator.userAgent || ''
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'Browser'
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua)) return `${browser} on Android`
  if (/Mac OS X|Macintosh/.test(ua)) return `${browser} on Mac`
  if (/Windows/.test(ua)) return `${browser} on Windows`
  return browser
}
