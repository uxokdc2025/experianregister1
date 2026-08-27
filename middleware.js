import { NextResponse } from 'next/server'

/* ──────────────────────────────────────────────────────────────
   Password gate for the whole site (cookie-based).
   Any request without a valid gate cookie — including search-engine
   crawlers — is redirected to /gate, a neutral password page. The
   Experian-styled pages are never served publicly, so they can't be
   crawled or flagged. Testers enter the password once per browser.
   ────────────────────────────────────────────────────────────── */

const COOKIE = 'demo_gate'
const TOKEN = process.env.DEMO_TOKEN || 'granted-2026'

export const config = {
  // Gate everything except the gate page, its API, and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|gate|api/gate).*)'],
}

export function middleware(req) {
  if (req.cookies.get(COOKIE)?.value === TOKEN) return NextResponse.next()
  const url = req.nextUrl.clone()
  const next = url.pathname + (url.search || '')
  url.pathname = '/gate'
  url.search = `?next=${encodeURIComponent(next)}`
  return NextResponse.redirect(url)
}
