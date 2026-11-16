'use client'

/* ──────────────────────────────────────────────────────────────
   D5 / M5 — Enter your code (/v3/code), which becomes the
   D6 / M6 "Setting up your passkey…" state in place.

   Any 6 digits pass — there are no error states in this study.
   On flow=create the Verify click starts passkey creation
   SYNCHRONOUSLY (see app/v3/lib/passkey.js): card 2 swaps the
   stub for navigator.credentials.create() and the user gesture
   has to survive, so nothing may be awaited before that call.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react'
import { VerifyTopBar, DesktopActionBar, ExperianHeader, ExperianFooter } from '../_components/Chrome'
import { Field } from '../_components/Form'
import { SettingUp } from '../_components/SettingUp'
import { PhoneSignal } from '../_components/Art'
import { startPasskeyCreation } from '../lib/passkey'
import {
  ACCOUNT_HREF,
  CREATE_PASSKEY_HREF,
  PASSKEY_CREATED_HREF,
  PASSKEY_NOT_CREATED_HREF,
  SIGN_IN_HREF,
  go,
} from '../lib/routes'
import { DEFAULT_LAST4, deviceLabel, last4, logEvent, readState, writeState } from '../lib/state'

const FORM_ID = 'v3-code-form'

export default function CodePage() {
  const [phase, setPhase] = useState('code') // 'code' | 'setting-up'
  const [code, setCode] = useState('')
  const [flow, setFlow] = useState('create')
  const [tail, setTail] = useState(DEFAULT_LAST4)
  const [resent, setResent] = useState(false)
  const [signinState, setSigninState] = useState('idle') // 'idle' | 'loading' | 'done'
  const signinTimers = useRef([])
  const stubFail = useRef(false)
  const resentTimer = useRef(null)

  useEffect(() => {
    const saved = readState()
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('flow')
    setFlow(fromUrl === 'signin' || fromUrl === 'create' ? fromUrl : saved.flow || 'create')
    setTail(last4(saved.phone))
    /* dev-only: ?stub=fail drives the D8/M8 screen until card 2 lands */
    stubFail.current = params.get('stub') === 'fail'
    return () => {
      clearTimeout(resentTimer.current)
      signinTimers.current.forEach(clearTimeout)
    }
  }, [])

  const ready = code.length === 6

  const onVerify = () => {
    if (!ready) return

    if (flow !== 'create') {
      if (signinState !== 'idle') return
      logEvent('otp_verified', 'signin')
      /* Sign-in success: spinner in the CTA (~1.2s), then a check mark
         (~0.8s), then the passkey offer floats in (D2/M2). Testers who
         already made a passkey, or chose "Not now" / "Continue with
         phone", go to the account page instead. */
      const s = readState()
      const next = s.passkey || s.offerDeclined ? ACCOUNT_HREF : `${CREATE_PASSKEY_HREF}?from=signin`
      writeState({ signedIn: true })
      setSigninState('loading')
      signinTimers.current.push(
        setTimeout(() => setSigninState('done'), 1200),
        setTimeout(() => go(next), 2000),
      )
      return
    }

    /* First statement, no await before it — card 2 depends on this. */
    const creation = startPasskeyCreation({ fail: stubFail.current })
    setPhase('setting-up')
    logEvent('passkey_creation_started')

    creation.then((result) => {
      if (result.ok) {
        const now = new Date().toISOString()
        writeState({
          passkey: { id: result.id, name: deviceLabel(), createdAt: now, lastUsed: now, mode: result.mode },
        })
        logEvent('passkey_created', result.mode)
        go(PASSKEY_CREATED_HREF)
      } else {
        logEvent('passkey_not_created', result.reason)
        go(PASSKEY_NOT_CREATED_HREF)
      }
    })
  }

  const onResend = () => {
    logEvent('otp_resent')
    setResent(true)
    clearTimeout(resentTimer.current)
    resentTimer.current = setTimeout(() => setResent(false), 2500)
  }

  if (phase === 'setting-up') return <SettingUp />

  const verifyButton = (className) => (
    <button
      type="submit"
      form={FORM_ID}
      className={`${className}${signinState !== 'idle' ? ' v3-btn-busy' : ''}`}
      disabled={!ready}
      aria-busy={signinState === 'loading'}
    >
      {signinState === 'loading' ? (
        <span className="v3-btn-spin" role="status" aria-label="Signing in" />
      ) : signinState === 'done' ? (
        <span className="v3-btn-check" role="status" aria-label="Signed in">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : (
        'Verify'
      )}
    </button>
  )

  return (
    <div className="v3-page">
      <VerifyTopBar className="v3-desk" title="Verify identity" onClose={() => go(SIGN_IN_HREF)} />
      <ExperianHeader className="v3-mob" />

      <main id="main-content" className="v3-main">
        <div className="v3-col v3-col-verify">
          <div className="v3-ctr">
            <div className="v3-art">
              <PhoneSignal />
            </div>

            <h1 className="v3-h1" style={{ marginTop: 20 }}>
              Enter your code
            </h1>
            <p className="v3-body" style={{ marginTop: 10 }}>
              We sent a 6-digit verification code to (***) ***-<strong style={{ color: '#1E1E35' }}>{tail}</strong>
            </p>
          </div>

          {/* both Verify buttons submit this form — the desktop one lives in the
              bottom bar, outside it, which is what the form attribute is for */}
          <form id={FORM_ID} style={{ marginTop: 26 }} onSubmit={(e) => { e.preventDefault(); onVerify() }}>
            <Field
              label="Verification code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            />
          </form>

          {/* the phone puts Verify right under the field; desktop uses the bottom bar */}
          <div className="v3-mob" style={{ marginTop: 16 }}>
            {verifyButton('v3-btn v3-btn-primary')}
          </div>

          <div className="v3-ctr" style={{ marginTop: 18 }}>
            <p className="v3-note">Haven’t received it yet?</p>
            <button type="button" className="v3-linkbtn v3-linkbtn-pink" onClick={onResend}>
              Resend code
            </button>
            {/* keyed so the fade replays each time a code is 'sent' */}
            <p
              key={resent ? 'sent' : 'idle'}
              className="v3-note v3-toast"
              role="status"
              style={{ minHeight: 20, color: '#35354E' }}
            >
              {resent ? 'Code sent' : ''}
            </p>
          </div>
        </div>
      </main>

      <DesktopActionBar>{verifyButton('v3-btn v3-btn-primary v3-btn-auto')}</DesktopActionBar>
      <ExperianFooter className="v3-mob" />
    </div>
  )
}
