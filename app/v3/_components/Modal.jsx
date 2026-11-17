'use client'

import { useEffect, useRef } from 'react'

/* ──────────────────────────────────────────────────────────────
   Accessible dialog used by D3/M3. Esc and the backdrop close
   it, Tab is trapped inside, and focus returns to whatever
   opened it (the Learn More link) when it unmounts.

   Nov 17 2026 fix: callers pass an inline onClose (a new function
   every render). The effect used to depend on [onClose], so every
   keystroke in Rename re-ran it: cleanup + "focus the first
   focusable" moved focus to the X close button after each letter.
   onClose now lives in a ref and the effect runs once per open.
   ────────────────────────────────────────────────────────────── */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({ labelledBy, onClose, children }) {
  const panel = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const node = panel.current
    const opener = document.activeElement
    const list = () => Array.from(node ? node.querySelectorAll(FOCUSABLE) : []).filter((el) => !el.disabled)

    // a text field (Rename's Passkey Name) gets focus on open; otherwise the first control
    const firstEl = (node && node.querySelector('[data-autofocus], input:not([type="hidden"]):not(:disabled)')) || list()[0]
    if (firstEl) firstEl.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = list()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (opener && typeof opener.focus === 'function') opener.focus()
    }
  }, [])

  return (
    <div className="v3-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeRef.current() }}>
      <div className="v3-modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panel}>
        {children}
      </div>
    </div>
  )
}
