'use client'

/* Soft, brand-colored confetti + a success message.
   Shared by the mobile celebration overlay and the desktop drawer.
   Deterministic (index-based, no Math.random) so SSR/client match. */

const COLORS = ['#BA2F7D', '#26478D', '#632678', '#F5A623', '#00A651', '#406EB3', '#D45EA7', '#F9CB6B']

export function Confetti({ count = 46 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    i,
    left: (i * 61) % 100,
    delay: ((i * 7) % 22) / 10,
    dur: 2.8 + ((i * 3) % 6) * 0.35,
    w: 5 + (i % 4) * 2,
    h: 8 + (i % 3) * 3,
    color: COLORS[i % COLORS.length],
    rot: (((i * 47) % 3) + 1) * 180,
    drift: (((i * 13) % 9) - 4) * 14,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 70 }}>
      {pieces.map(p => (
        <span key={p.i} className="confetti-piece" style={{
          left: `${p.left}%`, width: p.w, height: p.h, background: p.color,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          ['--drift']: `${p.drift}px`, ['--rot']: `${p.rot}deg`,
        }} />
      ))}
    </div>
  )
}

export function SuccessContent({ onDone, cta = 'See my dashboard' }) {
  return (
    <div className="celebrate-pop" style={{ textAlign: 'center', maxWidth: 320, margin: '0 auto' }}>
      <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--color-success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="var(--color-success-500)" /><path d="M12 20.5l5 5 11-11.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, color: 'var(--color-neutral-900)', letterSpacing: '-.02em' }}>You&#39;re all set!</h2>
      <p style={{ fontSize: 15, color: 'var(--color-neutral-600)', lineHeight: 1.55, marginTop: 12 }}>Congratulations — your Experian account is ready and your FICO® Score is unlocked.</p>
      {onDone && <button onClick={onDone} style={{ marginTop: 26, width: '100%', maxWidth: 280, border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', color: '#fff', background: 'var(--color-pink-400)', cursor: 'pointer' }}>{cta}</button>}
    </div>
  )
}
