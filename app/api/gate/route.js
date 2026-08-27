import { NextResponse } from 'next/server'

const COOKIE = 'demo_gate'
const TOKEN = process.env.DEMO_TOKEN || 'granted-2026'
const PASS = process.env.DEMO_PASS || 'usertest2026'

export async function POST(req) {
  const form = await req.formData()
  const password = form.get('password')
  const nextRaw = form.get('next')
  const next = typeof nextRaw === 'string' && nextRaw.startsWith('/') ? nextRaw : '/start'

  if (password === PASS) {
    const res = NextResponse.redirect(new URL(next, req.url), { status: 303 })
    res.cookies.set(COOKIE, TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return res
  }

  const back = new URL('/gate', req.url)
  back.searchParams.set('next', next)
  back.searchParams.set('error', '1')
  return NextResponse.redirect(back, { status: 303 })
}
