import { V3_CSS } from './_components/styles'

/* ──────────────────────────────────────────────────────────────
   V3 (Study 2) layout: adds the V3 stylesheet. No demo bars (the
   stylesheet hides the root "Demo prototype" note on V3 pages);
   the restart lives on the Experian logo (RestartLogo).
   ────────────────────────────────────────────────────────────── */

export const metadata = {
  title: 'Passkey prototype',
  robots: { index: false, follow: false },
}

export default function V3Layout({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: V3_CSS }} />
      {children}
    </>
  )
}
