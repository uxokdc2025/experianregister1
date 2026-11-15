/* ──────────────────────────────────────────────────────────────
   V3 passkey creation.

   CARD 1 = STUB. This resolves on a timer so the whole flow is
   clickable end to end; no WebAuthn call is made yet. Card 2
   replaces the body of startPasskeyCreation() with the real
   navigator.credentials.create() call.

   Contract that card 2 depends on — do not change it:
   callers invoke this SYNCHRONOUSLY inside the click handler
   (no await before it) and render the "Setting up your passkey…"
   state while the returned promise is pending. Awaiting anything
   first would drop the user gesture that Safari/iOS require.
   ────────────────────────────────────────────────────────────── */

const STUB_DELAY_MS = 1500

/**
 * @param {{ fail?: boolean, delay?: number }} [options]
 *   fail  — dev-only switch (?stub=fail) to exercise the D8/M8 screen
 * @returns {Promise<{ ok: boolean, mode: string, id?: string, reason?: string }>}
 */
export function startPasskeyCreation(options = {}) {
  const { fail = false, delay = STUB_DELAY_MS } = options
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        fail
          ? { ok: false, mode: 'stub', reason: 'NotAllowedError' }
          : { ok: true, mode: 'stub', id: `stub-${Date.now().toString(36)}` }
      )
    }, delay)
  })
}
