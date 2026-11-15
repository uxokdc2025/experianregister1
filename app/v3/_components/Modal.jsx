'use client'

import { useEffect, useRef } from 'react'

/* ──────────────────────────────────────────────────────────────
   Accessible dialog used by D3/M3. Esc and the backdrop close
   it, Tab is trapped inside, and focus returns to whatever
   opened it (the Learn More link) when it unmounts.
   ────────────────────────────────────────────────────────────── */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function Modal({ labelledBy, onClose, children }) {
  const panel = useRef(null)

  useEffect(() => {
    const node = panel.current
    const opener = document.activeElement
    const list = () => Array.from(node ? node.querySelectorAll(FOCUSABLE) : []).filter((el) => !el.disabled)

    const firstEl = list()[0]
    if (firstEl) firstEl.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
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
  }, [onClose])

  return (
    <div className="v3-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="v3-modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={panel}>
        {children}
      </div>
    </div>
  )
}
