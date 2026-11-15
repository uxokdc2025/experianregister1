/* ──────────────────────────────────────────────────────────────
   V3 illustrations. Decorative only (aria-hidden) — every screen
   states its meaning in the heading next to the art.
   ────────────────────────────────────────────────────────────── */

/* D2 / M2 / modal header — face + fingerprint badges. */
export function PasskeyBadges({ size = 1 }) {
  const w = 104 * size
  return (
    <svg aria-hidden="true" width={w} height={w * (62 / 104)} viewBox="0 0 104 62" fill="none">
      <rect x="2" y="12" width="46" height="46" rx="13" fill="#1E3A6E" />
      <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28v-4a2 2 0 012-2h4M36 28v-4a2 2 0 00-2-2h-4M14 42v4a2 2 0 002 2h4M36 42v4a2 2 0 01-2 2h-4" />
        <path d="M21 32v2M29 32v2M21.5 40c1.6 1.8 5.4 1.8 7 0" />
      </g>
      <rect x="44" y="2" width="56" height="56" rx="16" fill="#C2177F" />
      <g stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M60 24a12 12 0 0124 0v8" />
        <path d="M66 25a6 6 0 0112 0v11" />
        <path d="M72 27v12" />
        <path d="M60 32v6a16 16 0 002 8" />
        <path d="M66 40v3a12 12 0 002 6" />
        <path d="M78 36v6a10 10 0 01-1 5" />
      </g>
    </svg>
  )
}

/* D4 / D6 / D7 — shield with a green check. */
export function ShieldCheck({ size = 76 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 76 76" fill="none">
      <path d="M38 7l27 9.4V37c0 14.6-10.9 25.9-27 31.6C21.9 62.9 11 51.6 11 37V16.4L38 7z" fill="#1A6B80" />
      <path d="M38 7l27 9.4V37c0 14.6-10.9 25.9-27 31.6V7z" fill="#123C57" />
      <path d="M23 37.5l10.5 10.5L64 17" stroke="#3CC37B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* D5 / M5 / M6 / M7 — phone receiving a code. */
export function PhoneSignal({ size = 68 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 68 68" fill="none">
      <g stroke="#0FAE9B" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M14 26a9 9 0 000 16" />
        <path d="M7 21a17 17 0 000 26" />
        <path d="M54 26a9 9 0 010 16" />
        <path d="M61 21a17 17 0 010 26" />
      </g>
      <rect x="22" y="10" width="24" height="48" rx="5" fill="#123C57" />
      <rect x="24.5" y="16" width="19" height="34" rx="2" fill="#4CCFC3" />
      <circle cx="34" cy="54" r="2" fill="#fff" />
    </svg>
  )
}

/* D8 / M8 — deliberately neutral: no success check, no alarm. */
export function NeutralKey({ size = 80 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="6" y="6" width="68" height="68" rx="20" fill="#EFEFF5" />
      <circle cx="31" cy="34" r="11" stroke="#26478D" strokeWidth="4.5" fill="none" />
      <path d="M39.5 42.5L56 59" stroke="#26478D" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M48 51l-5 5M53.5 56.5l-4 4" stroke="#8E8EA8" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  )
}

/* D1 / M1 — the "free Experian app" panel graphic: a phone holding a
   decorative QR block. Static, and it scans to nothing. */
export function AppQrPhone({ width = 108 }) {
  const N = 17
  const cells = []
  const finder = (r, c) => (r < 6 && c < 6) || (r < 6 && c >= N - 6) || (r >= N - 6 && c < 6)
  for (let r = 0; r < N; r += 1) {
    for (let c = 0; c < N; c += 1) {
      let on = false
      if (finder(r, c)) {
        const lr = r < 6 ? r : r - (N - 6)
        const lc = c < 6 ? c : c - (N - 6)
        on = lr === 0 || lr === 5 || lc === 0 || lc === 5 || (lr >= 2 && lr <= 3 && lc >= 2 && lc <= 3)
      } else {
        on = (r * 7 + c * 13 + (r ^ c) * 5) % 3 === 0
      }
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * 4} y={r * 4} width="4" height="4" fill="#1E1E35" />)
    }
  }
  return (
    <svg aria-hidden="true" width={width} height={width * (196 / 108)} viewBox="0 0 108 196" fill="none">
      <rect x="2" y="2" width="104" height="192" rx="16" fill="#fff" stroke="#1E1E35" strokeWidth="4" />
      <rect x="38" y="8" width="32" height="5" rx="2.5" fill="#1E1E35" />
      <g transform="translate(20, 62)">{cells}</g>
      <rect x="36" y="178" width="36" height="3" rx="1.5" fill="#1E1E35" />
    </svg>
  )
}
