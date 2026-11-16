'use client'

/* ──────────────────────────────────────────────────────────────
   D7 / M7 — Passkey created (/v3/passkey/created)

   We never draw a fake "Done" system sheet here: the real
   browser/OS sheet (card 2) has already closed by this point.
   ────────────────────────────────────────────────────────────── */

import { useEffect } from 'react'
import { PageShell } from '../../_components/Chrome'
import { ShieldCheck, PhoneSignal } from '../../_components/Art'
import { ACCOUNT_HREF, DASHBOARD_HREF, go } from '../../lib/routes'
import { logEvent } from '../../lib/state'

export default function PasskeyCreatedPage() {
  useEffect(() => {
    logEvent('passkey_created_screen_shown')
  }, [])

  return (
    <PageShell>
      <div className="v3-ctr">
        <div className="v3-art v3-desk">
          <ShieldCheck />
        </div>
        <div className="v3-art v3-mob">
          <PhoneSignal />
        </div>

        <h1 className="v3-h1" style={{ marginTop: 22 }}>
          Passkey created
        </h1>
        <p className="v3-body" style={{ marginTop: 14 }}>
          Your passkey is saved on this device. Next time, choose your passkey when you sign in — no password needed.
          You can rename or remove it anytime in your account settings.
        </p>

        <button type="button" className="v3-btn v3-btn-primary" style={{ marginTop: 26 }} onClick={() => go(ACCOUNT_HREF)}>
          Go to my account
        </button>

        <button type="button" className="v3-btn v3-btn-pink" style={{ marginTop: 12 }} onClick={() => go(DASHBOARD_HREF)}>
          Continue to my dashboard
        </button>
      </div>
    </PageShell>
  )
}
