'use client'

/* /v3/passkey/unsupported — only with ?pk=real-only on a device that
   can't create a passkey (normally such devices get the Demo prompt). */

import { useEffect } from 'react'
import { OutcomePage } from '../../_components/OutcomePage'
import { SIGN_IN_HREF, VERIFY_HREF, go } from '../../lib/routes'
import { logEvent, writeState } from '../../lib/state'

export default function PasskeyUnsupportedPage() {
  useEffect(() => logEvent('passkey_unsupported_screen_shown'), [])
  return (
    <OutcomePage
      title="This device can’t create a passkey right now"
      body="You can continue with your phone number, or try again on another device."
      primary="Continue with phone"
      onPrimary={() => {
        writeState({ offerDeclined: true })
        go(`${VERIFY_HREF}?flow=signin`)
      }}
      link="Back to sign in"
      onLink={() => go(SIGN_IN_HREF)}
    />
  )
}
