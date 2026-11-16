'use client'

/* ──────────────────────────────────────────────────────────────
   D2 / M2 — Create a passkey (/v3/create-passkey)
   plus D3 / M3 — the "What is a passkey?" modal.

   Nothing is created here: the tester confirms their number,
   verifies by one-time code, and creation starts from the
   Verify click on /v3/code (so the user gesture survives).
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { PageShell } from '../_components/Chrome'
import { Field } from '../_components/Form'
import { Modal } from '../_components/Modal'
import { PasskeyBadges } from '../_components/Art'
import { ACCOUNT_HREF, SIGN_IN_HREF, VERIFY_HREF, go } from '../lib/routes'
import { formatPhone, logEvent, readState, writeState } from '../lib/state'

const STEPS = [
  {
    lead: 'Sign in as usual.',
    body: ' Sign in to your Experian account one more time so we know it’s really you.',
  },
  {
    lead: 'Confirm with your device',
    body: ' When your phone or computer asks, use your face, fingerprint or device PIN. That creates your passkey.',
  },
  {
    lead: 'Sign in with your device',
    body: ' Next time, skip the password. Just confirm with your face, fingerprint or PIN.',
  },
]

function WhatIsAPasskey({ onClose }) {
  return (
    <Modal labelledBy="v3-what-is-a-passkey" onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <PasskeyBadges size={0.62} />
        <button type="button" className="v3-close" onClick={onClose} aria-label="Close">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h2 id="v3-what-is-a-passkey" className="v3-h1" style={{ marginTop: 18 }}>
        What is a passkey?
      </h2>
      <p className="v3-body" style={{ marginTop: 10 }}>
        A passkey is a simpler, safer way to sign in to your Experian account. Instead of typing a password, you confirm
        it’s you with your face, fingerprint or device PIN — the same way you unlock your phone or computer. Your passkey
        is kept in your device’s password manager (like iCloud Keychain or Google Password Manager) and can sync to your
        other devices on the same account.
      </p>

      <h3 style={{ margin: '22px 0 0', fontSize: 15, fontWeight: 700, color: '#1E1E35' }}>How passkeys work</h3>
      <ol style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {STEPS.map((step, i) => (
          <li key={step.lead} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1.5px solid #26478D',
                color: '#26478D',
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i + 1}
            </span>
            <p className="v3-body" style={{ fontSize: 15 }}>
              <strong style={{ color: '#1E1E35' }}>{step.lead}</strong>
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="v3-modal-actions">
        <button type="button" className="v3-btn v3-btn-primary v3-modal-cta" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  )
}

export default function CreatePasskeyPage() {
  const [phone, setPhone] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    const s = readState()
    if (s.phone) setPhone(formatPhone(s.phone))
    setSignedIn(Boolean(s.signedIn))
  }, [])

  const onContinue = () => {
    writeState({ phone, flow: 'create' })
    logEvent('create_passkey_phone_submitted')
    go(`${VERIFY_HREF}?flow=create`)
  }

  const note = (
    <p className="v3-note" style={{ marginTop: 18 }}>
      Only create a passkey on a device you don’t share.
    </p>
  )

  return (
    <PageShell>
      {/* the passkey offer floats in (V2's intro-rise motion), most visibly
          right after the sign-in spinner → check on /v3/code */}
      <div className="intro-rise">
      <div className="v3-ctr-mobleft">
        <div className="v3-art v3-art-mobleft">
          <PasskeyBadges size={0.86} />
        </div>

        <h1 className="v3-h1" style={{ marginTop: 22 }}>
          Create a passkey
        </h1>
        <p className="v3-sub" style={{ marginTop: 8 }}>
          First, let’s confirm it’s you.
        </p>
        <p className="v3-body" style={{ marginTop: 16 }}>
          A passkey lets you sign in to Experian with your face, fingerprint or device PIN — the same way you unlock your
          phone or computer. No password to remember.
        </p>

        {/* D2 puts the warning above the field; M2 puts it at the end */}
        <div className="v3-desk">{note}</div>
      </div>

      <div style={{ marginTop: 24 }}>
        {/* one field, so Enter — and the phone keyboard's Go key — continues */}
        <form onSubmit={(e) => { e.preventDefault(); onContinue() }}>
          <Field
            label="Mobile number on your Experian account"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(v) => setPhone(formatPhone(v))}
          />

          <button type="submit" className="v3-btn v3-btn-primary" style={{ marginTop: 16 }}>
            Continue
          </button>
        </form>

        <div className="v3-ctr" style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span>
            <button
              type="button"
              className="v3-linkbtn"
              onClick={() => {
                logEvent('learn_more_opened')
                setModalOpen(true)
              }}
            >
              Learn More
            </button>
          </span>
          <span>
            {signedIn ? (
              <button
                type="button"
                className="v3-linkbtn"
                onClick={() => {
                  writeState({ offerDeclined: true })
                  logEvent('passkey_offer_skipped')
                  go(ACCOUNT_HREF)
                }}
              >
                Not now
              </button>
            ) : (
              <button type="button" className="v3-linkbtn" onClick={() => go(SIGN_IN_HREF)}>
                Back to sign in
              </button>
            )}
          </span>
        </div>

        <div className="v3-mob v3-ctr">{note}</div>
      </div>
      </div>

      {modalOpen ? <WhatIsAPasskey onClose={() => setModalOpen(false)} /> : null}
    </PageShell>
  )
}
