'use client'

import { useId, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   V3 form controls. The label is a real <label> at every size —
   it just moves to the top of the box once the field is focused
   or filled, which is how the Figma frames read.
   ────────────────────────────────────────────────────────────── */

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
  maxLength,
  name,
  describedBy,
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const active = focused || String(value ?? '').length > 0
  return (
    <div className={`v3-field${active ? ' is-active' : ''}`}>
      <label className="v3-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        className="v3-field-input"
        type={type}
        value={value}
        placeholder={label}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

function RadioDot({ checked }) {
  return (
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        width: 21,
        height: 21,
        borderRadius: '50%',
        marginTop: 1,
        border: checked ? '2px solid #BA2F7D' : '2px solid #B3B3C4',
        background: checked ? '#BA2F7D' : '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} /> : null}
    </span>
  )
}

export function RadioRow({ name, value, checked, onSelect, children }) {
  return (
    <label className={`v3-radio${checked ? ' is-on' : ''}`}>
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
      />
      <RadioDot checked={checked} />
      <span style={{ minWidth: 0 }}>{children}</span>
    </label>
  )
}
