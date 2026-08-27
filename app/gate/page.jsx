/* Neutral password page — no Experian branding, safe for crawlers to see. */

export const metadata = {
  title: { absolute: 'Demo access' },
  description: 'Password-protected prototype for user testing.',
  applicationName: 'Demo access',
  keywords: [],
  authors: [],
  creator: undefined,
  publisher: undefined,
  openGraph: { title: 'Demo access', description: 'Password-protected prototype for user testing.', images: [] },
  twitter: { title: 'Demo access', description: 'Password-protected prototype for user testing.' },
  robots: { index: false, follow: false },
}

export default async function GatePage({ searchParams }) {
  const sp = (await searchParams) || {}
  const next = typeof sp.next === 'string' && sp.next.startsWith('/') ? sp.next : '/start'
  const error = sp.error === '1'

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#0D0D1F',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <form
        action="/api/gate"
        method="post"
        style={{
          width: '100%',
          maxWidth: 340,
          background: '#1A1A2E',
          border: '1px solid #2A2A44',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Demo access</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#A9A9C4', margin: '0 0 20px' }}>
          This prototype is for user testing only. Enter the access password to continue.
        </p>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="pw" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#C9C9E0', marginBottom: 6 }}>
          Password
        </label>
        <input
          id="pw"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          style={{
            width: '100%',
            height: 46,
            boxSizing: 'border-box',
            borderRadius: 10,
            border: `1.5px solid ${error ? '#E5484D' : '#3A3A5C'}`,
            background: '#0D0D1F',
            color: '#fff',
            fontSize: 15,
            padding: '0 14px',
            outline: 'none',
          }}
        />
        {error && (
          <div style={{ color: '#E5484D', fontSize: 12.5, marginTop: 8 }}>Incorrect password. Try again.</div>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            height: 46,
            marginTop: 18,
            border: 'none',
            borderRadius: 10,
            background: '#BA2F7D',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </form>
    </main>
  )
}
