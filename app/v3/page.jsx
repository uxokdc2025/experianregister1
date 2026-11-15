'use client'

/* ──────────────────────────────────────────────────────────────
   /v3 — the Study 2 homepage, and where every tester starts.
   Adaptive at the same 767px breakpoint as /start: the phone
   gets the crafted mobile landing, anything wider gets the
   desktop landing. Both send "Sign in" (and every other CTA)
   to /v3/sign-in, where the passkey journey begins.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { V3DesktopLanding } from './home/desktop'
import { V3MobileLanding } from './home/mobile'

const MOBILE_MAX = 767 // ≤ this width → mobile-crafted screens

export default function V3HomePage() {
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const apply = () => setMode(mq.matches ? 'mobile' : 'desktop')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (mode === null) return <div style={{ minHeight: '100dvh', background: '#fff' }} />
  return mode === 'mobile' ? <V3MobileLanding /> : <V3DesktopLanding />
}
