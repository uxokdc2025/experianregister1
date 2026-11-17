/* ──────────────────────────────────────────────────────────────
   V3 passkeys — the REAL browser/OS prompt (card 2), plus a
   clearly-labelled simulated "Demo" prompt for devices that can't
   make passkeys. No backend: nothing is sent anywhere, attestation
   and assertions are never verified (design prototype). We keep
   only the credential id, a created date and a label (the tester's phone).

   Contract: callers invoke startPasskeyCreation() / startPasskeySignIn()
   SYNCHRONOUSLY inside the click handler — no await before it —
   so Safari/iOS keep the user gesture. Support is probed on page
   load with probePasskeySupport(), never inside the handler.

   Modes (?pk=…, saved in exp_v3.pkMode):
     real      (default) real prompt; Demo prompt only if unsupported
     sim       always the Demo prompt
     real-only real prompt; unsupported devices → /v3/passkey/unsupported
   ────────────────────────────────────────────────────────────── */

import {
  PASSKEY_CREATED_HREF,
  PASSKEY_EXISTS_HREF,
  PASSKEY_NOT_CREATED_HREF,
  PASSKEY_UNSUPPORTED_HREF,
  go,
} from './routes'
import { PERSONA, formatPhone, logEvent, readState, writeState } from './state'

/* ─── base64url ─── */
export function toB64url(buf) {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
export function fromB64url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4)
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}
const randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n))

/* ─── support probe (page load) ─── */
let support = null // null = not probed yet; else { real, platform, hybrid, conditional }

export function probePasskeySupport() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  const PKC = window.PublicKeyCredential
  if (!window.isSecureContext || !PKC || !navigator.credentials) {
    support = { real: false, platform: false, hybrid: false, conditional: false }
    return Promise.resolve(support)
  }
  const uvpaa = PKC.isUserVerifyingPlatformAuthenticatorAvailable
    ? PKC.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false)
    : Promise.resolve(false)
  const caps = PKC.getClientCapabilities ? PKC.getClientCapabilities().catch(() => ({})) : Promise.resolve({})
  const cond = PKC.isConditionalMediationAvailable
    ? PKC.isConditionalMediationAvailable().catch(() => false)
    : Promise.resolve(false)
  return Promise.all([uvpaa, caps, cond]).then(([platform, c, conditional]) => {
    const hybrid = Boolean(c && (c.hybridTransport || c['hybrid-transport']))
    support = { real: Boolean(platform) || hybrid, platform: Boolean(platform), hybrid, conditional: Boolean(conditional) }
    return support
  })
}

/* Reads ?pk= once and persists it; default real. */
export function pkMode() {
  if (typeof window === 'undefined') return 'real'
  const fromUrl = new URLSearchParams(window.location.search).get('pk')
  if (fromUrl === 'real' || fromUrl === 'sim' || fromUrl === 'real-only') {
    writeState({ pkMode: fromUrl })
    return fromUrl
  }
  return readState().pkMode || 'real'
}

/* 'real' | 'sim' | 'unsupported'. Never 'sim' on a device that can do the real thing (unless ?pk=sim). */
export function promptKind() {
  const mode = pkMode()
  if (mode === 'sim') return 'sim'
  // Not probed yet (click within ms of load): trust the API's presence.
  const real = support ? support.real : Boolean(typeof window !== 'undefined' && window.PublicKeyCredential && window.isSecureContext)
  if (real) return 'real'
  return mode === 'real-only' ? 'unsupported' : 'sim'
}

/* ─── simulated "Demo" prompt: a tiny store the SimPrompt component renders ─── */
let simRequest = null // { kind: 'create' | 'get', resolve }
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn(simRequest))
export function subscribeSim(fn) {
  listeners.add(fn)
  fn(simRequest)
  return () => listeners.delete(fn)
}
export function answerSim(ok) {
  const req = simRequest
  simRequest = null
  emit()
  if (req) req.resolve(ok)
}
function askSim(kind) {
  return new Promise((resolve) => {
    simRequest = { kind, resolve }
    emit()
  })
}

function userId() {
  const s = readState()
  if (s.userId) return fromB64url(s.userId)
  const id = randomBytes(16)
  writeState({ userId: toB64url(id) })
  return id
}

/* Phone shown in the OS passkey prompt (user.name / displayName) and as
   the default stored passkey label. Uses what the tester typed, formatted
   like (941) 992-9182; falls back to the persona number if none is saved. */
function passkeyUserName() {
  return formatPhone(readState().phone) || PERSONA.phone
}


/**
 * Start passkey creation. CALL SYNCHRONOUSLY FROM THE CLICK HANDLER.
 * @returns {Promise<{ ok: boolean, mode: 'real'|'sim', id?: string, reason?: string }>}
 */
export function startPasskeyCreation() {
  const kind = promptKind()
  if (kind === 'unsupported') return Promise.resolve({ ok: false, mode: 'real', reason: 'Unsupported' })
  if (kind === 'sim') {
    return askSim('create').then((ok) =>
      ok ? { ok: true, mode: 'sim', id: `sim-${toB64url(randomBytes(12))}` } : { ok: false, mode: 'sim', reason: 'NotAllowedError' }
    )
  }
  const stored = readState().passkey
  const exclude = stored && stored.mode === 'real' && stored.id ? [{ type: 'public-key', id: fromB64url(stored.id) }] : []
  let call
  try {
    call = navigator.credentials.create({
      publicKey: {
        rp: { id: window.location.hostname, name: 'Experian' },
        user: { id: userId(), name: passkeyUserName(), displayName: passkeyUserName() },
        challenge: randomBytes(32),
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        // No authenticatorAttachment: the browser offers this device first,
        // plus "use a phone or tablet" (hybrid) where it supports it.
        authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
        hints: ['client-device', 'hybrid'],
        excludeCredentials: exclude,
        attestation: 'none',
        timeout: 120000,
      },
    })
  } catch (err) {
    call = Promise.reject(err)
  }
  return call.then(
    (cred) => (cred ? { ok: true, mode: 'real', id: toB64url(cred.rawId) } : { ok: false, mode: 'real', reason: 'NoCredential' }),
    (err) => ({ ok: false, mode: 'real', reason: (err && err.name) || 'Error' })
  )
}

/* Save + route after creation. NotAllowedError on /not-created just stays there (onStay). */
export function finishCreation(result, { onStay } = {}) {
  if (result.ok) {
    const now = new Date().toISOString()
    // creating it needed the user's face / fingerprint / PIN, so it counts as used today;
    // smsPending makes the account page show the X1 SMS notice once
    writeState({ passkey: { id: result.id, name: passkeyUserName(), createdAt: now, lastUsed: now, mode: result.mode }, smsPending: now })
    logEvent('passkey_created', result.mode)
    go(PASSKEY_CREATED_HREF)
    return
  }
  logEvent('passkey_not_created', result.reason)
  if (result.reason === 'InvalidStateError') return go(PASSKEY_EXISTS_HREF)
  if (result.reason === 'Unsupported') return go(PASSKEY_UNSUPPORTED_HREF)
  if (onStay) return onStay(result)
  go(PASSKEY_NOT_CREATED_HREF)
}

/* ─── sign in with a passkey ─── */
let conditional = null // AbortController for the autofill request

export function abortConditional() {
  if (conditional) {
    conditional.abort()
    conditional = null
  }
}

/* Autofill (conditional mediation) — started on page load when supported. */
export function startConditionalSignIn() {
  if (!support || !support.conditional || pkMode() === 'sim') return null
  abortConditional()
  conditional = new AbortController()
  return navigator.credentials
    .get({
      mediation: 'conditional',
      signal: conditional.signal,
      publicKey: { challenge: randomBytes(32), rpId: window.location.hostname, userVerification: 'required' },
    })
    .then(
      (cred) => (cred ? { ok: true, mode: 'real', id: toB64url(cred.rawId) } : null),
      () => null // aborted or dismissed: quietly ignore
    )
}

/**
 * Modal "Sign in with a passkey". CALL SYNCHRONOUSLY FROM THE CLICK HANDLER.
 * @returns {Promise<{ ok: boolean, mode: string, id?: string, reason?: string }>}
 */
export function startPasskeySignIn() {
  abortConditional()
  const stored = readState().passkey
  if (!stored) return Promise.resolve({ ok: false, mode: 'none', reason: 'NoPasskey' })
  if (stored.mode === 'sim' || promptKind() !== 'real') {
    return askSim('get').then((ok) => (ok ? { ok: true, mode: 'sim', id: stored.id } : { ok: false, mode: 'sim', reason: 'NotAllowedError' }))
  }
  let call
  try {
    call = navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        rpId: window.location.hostname,
        allowCredentials: [{ type: 'public-key', id: fromB64url(stored.id) }],
        userVerification: 'required',
        timeout: 120000,
      },
    })
  } catch (err) {
    call = Promise.reject(err)
  }
  return call.then(
    (cred) => (cred ? { ok: true, mode: 'real', id: toB64url(cred.rawId) } : { ok: false, mode: 'real', reason: 'NoCredential' }),
    (err) => ({ ok: false, mode: 'real', reason: (err && err.name) || 'Error' })
  )
}

export function recordPasskeySignIn(result) {
  const s = readState()
  const now = new Date().toISOString()
  if (s.passkey) writeState({ passkey: { ...s.passkey, lastUsed: now }, signedIn: true })
  // After a restart (state wiped) the passkey still lives on the device; autofill
  // can sign in with it, so re-list it (creation date unknown in this browser).
  else writeState({ passkey: { id: result.id, name: passkeyUserName(), createdAt: null, lastUsed: now, mode: result.mode }, signedIn: true })
  logEvent('passkey_sign_in', result.mode)
}

/* Best-effort: tell the browser / password manager this credential is gone
   (Chrome + Google Password Manager can then hide or delete it). Never throws. */
export function signalRemoved(id) {
  try {
    const PKC = typeof window !== 'undefined' && window.PublicKeyCredential
    if (PKC && PKC.signalUnknownCredential && id && !String(id).startsWith('sim-')) {
      PKC.signalUnknownCredential({ rpId: window.location.hostname, credentialId: id }).catch(() => {})
    }
  } catch {
    /* ignore */
  }
}

/* End of study: ask the password manager to drop every passkey for this user. */
export function signalStudyOver() {
  try {
    const PKC = typeof window !== 'undefined' && window.PublicKeyCredential
    const uid = readState().userId
    if (PKC && PKC.signalAllAcceptedCredentials && uid) {
      PKC.signalAllAcceptedCredentials({ rpId: window.location.hostname, userId: uid, allAcceptedCredentialIds: [] }).catch(() => {})
    }
  } catch {
    /* ignore */
  }
}

/* The host name testers see in the browser prompt (for disclosure copy). */
export function siteHost() {
  return typeof window === 'undefined' ? 'this site' : window.location.hostname
}
