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

/* V3-only site mode (SITE_MODE=v3, set only on the experian-passkey
   Vercel project). No gate; "/" serves the V3 homepage; everything
   outside /v3 (and the /uploads assets V3 uses) goes back to "/", so
   V1/V2 and the earlier study can't be reached from that site.
   When SITE_MODE is unset this branch never runs. */
const V3_ONLY = process.env.SITE_MODE === 'v3'

function v3OnlySite(req) {
  const { pathname } = req.nextUrl
  if (pathname === '/') return NextResponse.rewrite(new URL('/v3', req.url))
  // /v3 itself (logo restart, account "home" button) shows as the clean "/".
  if (pathname === '/v3') return NextResponse.redirect(new URL('/', req.url))
  if (pathname.startsWith('/v3/') || pathname.startsWith('/uploads/')) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', req.url))
}

export const config = {
  // Gate everything except the gate page, its API, and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|gate|api/gate).*)'],
}

export function middleware(req) {
  if (V3_ONLY) return v3OnlySite(req)
  if (req.cookies.get(COOKIE)?.value === TOKEN) return NextResponse.next()
  const url = req.nextUrl.clone()
  const next = url.pathname + (url.search || '')
  url.pathname = '/gate'
  url.search = `?next=${encodeURIComponent(next)}`
  return NextResponse.redirect(url)
}
