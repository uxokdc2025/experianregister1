'use client'

/* ──────────────────────────────────────────────────────────────
   V3 dashboard profile menu (Nov 17 2026 — Jose's review, David:
   "to access passkeys, you need to create the dropdown profile
   icon that would have it").

   Avatar button → menu with My account, Manage passkeys (the
   account page's Passkeys section, where Rename / Remove live)
   and Sign out (V3 home; the stored passkey is kept so the next
   sign-in can use it). Fake persona only.

   Keyboard: Enter/Space/ArrowDown open and focus the first item,
   ArrowUp/ArrowDown/Home/End move, Escape closes and returns focus
   to the button, Tab closes. Outside click / tap closes.
   ────────────────────────────────────────────────────────────── */

import { useEffect, useId, useRef, useState } from 'react'
import { ACCOUNT_HREF, HOME_HREF, go } from '../lib/routes'
import { PERSONA, logEvent } from '../lib/state'

const initials = PERSONA.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

export function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const btn = useRef(null)
  const menu = useRef(null)
  const menuId = useId()

  const items = () => Array.from(menu.current ? menu.current.querySelectorAll('[role="menuitem"]') : [])
  const focusItem = (i) => {
    const list = items()
    if (!list.length) return
    list[(i + list.length) % list.length].focus()
  }

  const close = (refocus) => {
    setOpen(false)
    if (refocus && btn.current) btn.current.focus()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const openMenu = (focusIndex) => {
    setOpen(true)
    logEvent('dashboard_profile_menu_opened')
    if (focusIndex != null) requestAnimationFrame(() => focusItem(focusIndex))
  }

  const onBtnKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu(0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openMenu(-1)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      close(true)
    }
  }

  const onMenuKey = (e) => {
    const list = items()
    const i = list.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1) }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0) }
    else if (e.key === 'End') { e.preventDefault(); focusItem(-1) }
    else if (e.key === 'Escape') { e.preventDefault(); close(true) }
    else if (e.key === 'Tab') setOpen(false)
  }

  const pick = (event, href) => {
    logEvent(event)
    setOpen(false)
    go(href)
  }

  return (
    <div className="v3-pm" ref={wrap}>
      <button
        ref={btn}
        type="button"
        className="v3-pm-btn"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : openMenu(null))}
        onKeyDown={onBtnKey}
      >
        <span className="v3-pm-avatar" aria-hidden="true">{initials}</span>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="v3-pm-menu" id={menuId} role="menu" aria-label="Profile" ref={menu} onKeyDown={onMenuKey}>
          <div className="v3-pm-head" role="presentation">
            <div className="v3-pm-name">{PERSONA.name}</div>
            <div className="v3-pm-sub">{PERSONA.phone}</div>
          </div>
          <a role="menuitem" tabIndex={-1} className="v3-pm-item" href={ACCOUNT_HREF}
            onClick={(e) => { e.preventDefault(); pick('dashboard_menu_my_account', ACCOUNT_HREF) }}>
            My account
          </a>
          <a role="menuitem" tabIndex={-1} className="v3-pm-item" href={`${ACCOUNT_HREF}#passkeys`}
            onClick={(e) => { e.preventDefault(); pick('dashboard_menu_manage_passkeys', `${ACCOUNT_HREF}#passkeys`) }}>
            Manage passkeys
          </a>
          <div className="v3-pm-sep" role="separator" />
          <button role="menuitem" tabIndex={-1} type="button" className="v3-pm-item"
            onClick={() => pick('dashboard_menu_sign_out', HOME_HREF)}>
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
