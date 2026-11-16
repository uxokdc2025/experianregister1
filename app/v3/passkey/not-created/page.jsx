'use client'

/* ──────────────────────────────────────────────────────────────
   D8 / M8 — Your passkey wasn't created (/v3/passkey/not-created)

   Deliberately neutral: a key, not the green-check shield (which
   reads as success) and not a red X. Nothing failed about the
   account — only the passkey step didn't finish.

   "Try again" re-runs creation straight from this click handler,
   the same way the Verify button does, and shows the D6/M6 state
   while it is pending. Cancelling again just returns here.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { PageShell } from '../../_components/Chrome'
import { SettingUp } from '../../_components/SettingUp'
import { NeutralKey } from '../../_components/Art'
import { finishCreation, probePasskeySupport, startPasskeyCreation } from '../../lib/passkey'
import { VERIFY_HREF, go } from '../../lib/routes'
import { logEvent, writeState } from '../../lib/state'

export default function PasskeyNotCreatedPage() {
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    probePasskeySupport()
    logEvent('passkey_not_created_screen_shown')
  }, [])

  const onTryAgain = () => {
    /* First statement, no await before it — re-opens the real prompt in this click. */
    const creation = startPasskeyCreation()
    setBusy(true)
    logEvent('passkey_creation_retried')
    creation.then((result) => finishCreation(result, { onStay: () => setBusy(false) }))
  }

  if (busy) return <SettingUp />

  return (
    <PageShell>
      <div className="v3-ctr">
        <div className="v3-art">
          <NeutralKey />
        </div>

        <h1 className="v3-h1" style={{ marginTop: 22 }}>
          Your passkey wasn’t created
        </h1>
        <p className="v3-body" style={{ marginTop: 14 }}>
          No changes were made to your account. You can try again, or continue with your phone number. We&#39;ll text you
          a code to confirm it&#39;s you.
        </p>

        <button type="button" className="v3-btn v3-btn-primary" style={{ marginTop: 26 }} onClick={onTryAgain}>
          Try again
        </button>

        <div style={{ marginTop: 12 }}>
          <button type="button" className="v3-linkbtn" onClick={() => { writeState({ offerDeclined: true }); go(`${VERIFY_HREF}?flow=signin`) }}>
            Continue with phone
          </button>
        </div>
      </div>
    </PageShell>
  )
}
