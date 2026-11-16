import { V3_CSS } from './_components/styles'

/* ──────────────────────────────────────────────────────────────
   V3 (Study 2) layout: adds the V3 stylesheet. No demo bars (the
   stylesheet hides the root "Demo prototype" note on V3 pages).
   The Experian logo goes home without clearing state; Reset on the
   homepage (next to Global Sites) wipes this browser's demo data.
   ────────────────────────────────────────────────────────────── */

/* Head metadata for every /v3 route. Visible on-page Experian mockup
   branding is unchanged. WebAuthn rp.name is not set here. */
export const metadata = {
  title: {
    default: 'Usertesting Passkey',
    template: '%s · Usertesting Passkey',
  },
  description: 'A UX research prototype for passkey sign-in usability testing.',
  applicationName: 'Usertesting Passkey',
  appleWebApp: { title: 'Usertesting Passkey' },
  robots: { index: false, follow: false },
}

/* Same as the root viewport plus viewport-fit=cover, so the pinned
   bottom bar can pad for the iPhone home indicator (safe-area). */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#BA2F7D',
  colorScheme: 'light',
}

export default function V3Layout({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: V3_CSS }} />
      {children}
    </>
  )
}
