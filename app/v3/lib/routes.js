/* ──────────────────────────────────────────────────────────────
   Every V3 route in one place.

   HOME_CTA_HREF is where the homepage's "Sign in", "Sign up",
   "Let's get started" and sticky-bar CTAs all land. David may
   split sign-up off later — change it here only.
   ────────────────────────────────────────────────────────────── */

export const HOME_HREF = '/v3'
export const SIGN_IN_HREF = '/v3/sign-in'
export const HOME_CTA_HREF = SIGN_IN_HREF
export const CREATE_PASSKEY_HREF = '/v3/create-passkey'
export const VERIFY_HREF = '/v3/verify'
export const CODE_HREF = '/v3/code'
export const PASSKEY_CREATED_HREF = '/v3/passkey/created'
export const PASSKEY_NOT_CREATED_HREF = '/v3/passkey/not-created'
export const ACCOUNT_HREF = '/v3/account'

/* Plain assignment keeps these prototype hops simple and lets a
   tester use the browser's Back button exactly as they'd expect. */
export function go(href) {
  if (typeof window !== 'undefined') window.location.assign(href)
}
