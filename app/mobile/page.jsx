'use client'

/* ──────────────────────────────────────────────────────────────
   Mobile flow — placeholder.
   Desktop is being built first; the mobile-first screens land here next.
   ────────────────────────────────────────────────────────────── */

const go = (href) => window.location.assign(href)

export default function MobilePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div style={{ height: 6, background: 'var(--gradient-brand)' }} />
        <div style={{ padding: '40px 32px 34px' }}>
          <img
            src="/uploads/Experian.png"
            alt="Experian"
            style={{ height: 30, width: 'auto', margin: '0 auto 20px' }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-neutral-800)', marginBottom: 10 }}>
            Mobile flow coming soon
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-neutral-600)', marginBottom: 26 }}>
            The mobile-first version of Registration Re-imagined is up next. The desktop flow is ready now.
          </p>
          <button
            onClick={() => go('/')}
            style={{
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 14.5,
              padding: '11px 22px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-blue-600)',
              background: 'transparent',
              color: 'var(--color-blue-600)',
              cursor: 'pointer',
            }}
          >
            Back to start
          </button>
        </div>
      </div>
    </main>
  )
}
