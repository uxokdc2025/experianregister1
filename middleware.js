import { NextResponse } from 'next/server'

/* ──────────────────────────────────────────────────────────────
   Password gate for the whole site.
   Anyone (including search-engine crawlers) without the shared
   credentials gets a 401 login prompt instead of the demo — so the
   Experian-styled pages are never publicly crawlable or flaggable.
   Testers enter the shared login once per browser session.
   ────────────────────────────────────────────────────────────── */

const USER = process.env.DEMO_USER || 'experian'
const PASS = process.env.DEMO_PASS || 'usertest2026'

export const config = {
  // Gate everything except Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}

export function middleware(req) {
  const header = req.headers.get('authorization')
  if (header) {
    const [scheme, encoded] = header.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded)
      const idx = decoded.indexOf(':')
      const user = decoded.slice(0, idx)
      const pass = decoded.slice(idx + 1)
      if (user === USER && pass === PASS) return NextResponse.next()
    }
  }
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Demo — user testing only", charset="UTF-8"' },
  })
}
