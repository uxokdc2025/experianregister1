'use client'

import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { answerSim, subscribeSim } from '../lib/passkey'

/* ──────────────────────────────────────────────────────────────
   Simulated passkey prompt — ONLY for devices that can't create a
   real passkey (or ?pk=sim). Experian-styled and labelled "Demo";
   it must never look like an Apple / Google / Microsoft dialog.
   Centered dialog on desktop, bottom sheet on mobile (Modal CSS).
   ────────────────────────────────────────────────────────────── */

const COPY = {
  create: {
    title: 'Create a passkey for Experian',
    body: 'Your device would now ask you to confirm with your face, fingerprint or screen lock. This device can’t do that, so this is a demo step.',
  },
  get: {
    title: 'Sign in with your passkey',
    body: 'Your device would now ask you to confirm with your face, fingerprint or screen lock. This device can’t do that, so this is a demo step.',
  },
}

export function SimPrompt() {
  const [req, setReq] = useState(null)
  useEffect(() => subscribeSim(setReq), [])
  if (!req) return null
  const copy = COPY[req.kind] || COPY.create
  return (
    <Modal labelledBy="v3-sim-title" onClose={() => answerSim(false)}>
      <span
        style={{
          display: 'inline-block',
          background: '#FFF4D6',
          color: '#7A5A00',
          border: '1px solid #F2D27A',
          borderRadius: 9999,
          padding: '2px 10px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.04em',
        }}
      >
        DEMO
      </span>
      <h2 id="v3-sim-title" className="v3-sub" style={{ marginTop: 12, fontSize: 20 }}>
        {copy.title}
      </h2>
      <p className="v3-body" style={{ marginTop: 10 }}>
        {copy.body}
      </p>
      <div className="v3-modal-actions" style={{ gap: 10 }}>
        <button type="button" className="v3-btn v3-btn-pink v3-modal-cta" onClick={() => answerSim(false)}>
          Cancel
        </button>
        <button type="button" className="v3-btn v3-btn-primary v3-modal-cta" onClick={() => answerSim(true)}>
          Continue
        </button>
      </div>
    </Modal>
  )
}
