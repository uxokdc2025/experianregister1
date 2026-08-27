'use client'

/* ──────────────────────────────────────────────────────────────
   /start — the single adaptive experience.
   Below the phone breakpoint we render the crafted mobile flow;
   above it, the desktop flow. Same registration journey either way.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { MobileApp } from '../v2/mobile/page'
import DesktopFlow from '../v2/register/page'

const MOBILE_MAX = 767 // ≤ this width → mobile-crafted screens

export default function StartPage() {
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const apply = () => setMode(mq.matches ? 'mobile' : 'desktop')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Avoid an SSR/first-paint guess; decide once we know the viewport.
  if (mode === null) return <div style={{ minHeight: '100dvh', background: '#fff' }} />
  return mode === 'mobile' ? <MobileApp /> : <DesktopFlow />
}
