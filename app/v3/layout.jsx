import { V3_CSS } from './_components/styles'
import { DemoBar } from './_components/DemoBar'

/* ──────────────────────────────────────────────────────────────
   V3 (Study 2) layout. Nests inside the root layout, so the
   global "Demo prototype — user testing only" bar still sits on
   top; this adds the V3 stylesheet and the ↺ Restart control.
   ────────────────────────────────────────────────────────────── */

export const metadata = {
  title: 'Passkey prototype',
  robots: { index: false, follow: false },
}

export default function V3Layout({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: V3_CSS }} />
      <DemoBar />
      {children}
    </>
  )
}
