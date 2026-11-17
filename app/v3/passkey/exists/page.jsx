'use client'

/* /v3/passkey/exists — create() threw InvalidStateError: this device
   already holds a passkey for this site (excludeCredentials matched). */

import { useEffect } from 'react'
import { OutcomePage } from '../../_components/OutcomePage'
import { ACCOUNT_HREF, SIGN_IN_HREF, go } from '../../lib/routes'
import { logEvent } from '../../lib/state'

export default function PasskeyExistsPage() {
  useEffect(() => logEvent('passkey_exists_screen_shown'), [])
  return (
    <OutcomePage
      title="You already have a passkey on this device"
      body="You can use it the next time you sign in."
      primary="Go to my account"
      onPrimary={() => go(ACCOUNT_HREF)}
      link="Back to sign in"
      onLink={() => go(SIGN_IN_HREF)}
    />
  )
}
