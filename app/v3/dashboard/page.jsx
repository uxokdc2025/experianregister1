'use client'

/* ──────────────────────────────────────────────────────────────
   /v3/dashboard — the unlocked end-of-flow dashboard from V2.

   Source: /start/apply (desktop: app/v2/register/page.jsx Dashboard
   at step dash-unlocked; mobile: app/v2/mobile/page.jsx MDash at
   step "dash"). V2 files are unchanged except for additive
   exports. Fake data only. The V2 logos already go to / without
   clearing state, which is what V3 wants.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { Dashboard } from '../../v2/register/page'
import { MDash, MobileShell } from '../../v2/mobile/page'

const MOBILE_MAX = 767

export default function V3DashboardPage() {
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const apply = () => setMode(mq.matches ? 'mobile' : 'desktop')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (mode === null) return <div style={{ minHeight: '100dvh', background: '#fff' }} />

  if (mode === 'mobile') {
    return (
      <MobileShell>
        <MDash unlocked showStatusBar={false} />
      </MobileShell>
    )
  }

  return (
    <main id="main-content" style={{ minHeight: '100vh', background: '#fff' }}>
      <Dashboard unlocked onGetStarted={() => {}} />
    </main>
  )
}
