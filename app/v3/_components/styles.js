/* ──────────────────────────────────────────────────────────────
   V3 stylesheet, injected once by app/v3/layout.jsx.

   Only the bits inline styles can't express live here: the 767px
   desktop/mobile switch, hover/focus states, the spinner
   keyframes and the reduced-motion opt-out. Nothing global
   changes — every selector is namespaced .v3-*.
   ────────────────────────────────────────────────────────────── */

export const V3_CSS = `
/* ── shell ── */
.v3-page { min-height: 100dvh; display: flex; flex-direction: column; background: #fff; }
.v3-main { flex: 1 0 auto; width: 100%; }
.v3-col { width: 100%; max-width: 480px; margin: 0 auto; padding: 64px 24px 88px; }
@media (max-width: 767px) { .v3-col { padding: 24px 20px 44px; } }
/* D4/D5 sit under a title bar, so they need less room above */
.v3-col-verify { padding-top: 56px; }
@media (max-width: 767px) { .v3-col-verify { padding-top: 14px; } }

/* ── 767px switch: every screen ships both layouts ── */
.v3-desk, .v3-mob { display: block; }
.v3-desk-i, .v3-mob-i { display: inline; }
/* Hide rules are !important so a class (.v3-art) or an inline
   display (VerifyTopBar, footer) can never leak the other layout. */
@media (min-width: 768px) { .v3-mob, .v3-mob-i { display: none !important; } }
@media (max-width: 767px) { .v3-desk, .v3-desk-i { display: none !important; } }

/* V3 has no demo bars: hide the root layout's "Demo prototype" note
   on V3 pages only (this stylesheet is only loaded under /v3). */
body > div[role="note"] { display: none !important; }

/* Experian logo = restart (clears V3 demo state, back to the homepage) */
.v3-logo-btn { display: inline-flex; align-items: center; background: none; border: 0; padding: 0; margin: 0; cursor: pointer; line-height: 0; }
.v3-logo-btn:focus-visible { outline: 3px solid #3361A0; outline-offset: 3px; border-radius: 4px; }

/* ── type ── */
.v3-h1 { margin: 0; font-size: 34px; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; color: #1E1E35; }
.v3-sub { margin: 0; font-size: 18px; font-weight: 700; line-height: 1.35; color: #1E1E35; }
.v3-body { margin: 0; font-size: 16px; line-height: 1.5; color: #55556E; }
.v3-note { margin: 0; font-size: 14px; line-height: 1.5; color: #55556E; }
@media (max-width: 767px) { .v3-h1 { font-size: 30px; } }
.v3-ctr { text-align: center; }
/* centred on desktop (D2), left-aligned on the phone (M2) */
.v3-ctr-mobleft { text-align: center; }
@media (max-width: 767px) { .v3-ctr-mobleft { text-align: left; } }

.v3-topbar-title { font-size: 17px; font-weight: 700; color: #1E1E35; }
@media (max-width: 767px) { .v3-topbar-title { font-size: 16px; font-weight: 500; } }

/* ── fields ──
   Same float-label input as the earlier prototype (V2 register
   FloatField): 58px box, 1.5px neutral-200 border, pink on focus,
   label floats to 11px/700 at the top once focused or filled. */
.v3-field { position: relative; display: block; width: 100%; min-width: 0; }
.v3-field-label { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; white-space: nowrap; font-size: 14.5px; font-weight: 500; color: var(--color-neutral-500); letter-spacing: 0; transition: top .15s var(--ease-default, ease), font-size .15s var(--ease-default, ease), color .15s; }
.v3-field.is-active .v3-field-label { top: 9px; transform: none; font-size: 11px; font-weight: 700; letter-spacing: .01em; }
.v3-field.is-focused .v3-field-label { color: var(--color-pink-400); }
.v3-field-input { display: block; width: 100%; height: 58px; border: 1.5px solid var(--color-neutral-200); background: #fff; border-radius: 8px; padding: 0 14px; font-family: inherit; font-size: 14.5px; color: var(--color-neutral-800, #1E1E35); outline: none; transition: border-color .15s; }
.v3-field.is-active .v3-field-input { padding: 22px 14px 0; }
.v3-field.is-focused .v3-field-input { border-color: var(--color-pink-400); }
.v3-field-input::placeholder { color: transparent; }
/* iOS zooms into inputs under 16px; keep the V2 look but stop the zoom on phones */
@media (max-width: 767px) { .v3-field-input { font-size: 16px; } }

/* ── pinned bottom action bar (D4/D5 desktop, M4 phone) ──
   Sticky to the bottom of the viewport like V2's fixed StickyBar,
   but in flow, so content never hides behind it. */
.v3-actionbar { position: sticky; bottom: 0; z-index: 30; flex-shrink: 0; background: #fff; border-top: 1px solid #EAEAEF; box-shadow: 0 -2px 14px rgba(13,13,31,.08); padding: 16px 40px calc(16px + env(safe-area-inset-bottom, 0px)); }
.v3-actionbar-mob { padding: 12px 20px calc(16px + env(safe-area-inset-bottom, 0px)); }

/* ── buttons ── */
/* sign-in success inside the CTA: spinner → check (keeps the button's size) */
.v3-btn-busy, .v3-btn-busy:disabled { background: #BA2F7D !important; color: #fff; cursor: default; pointer-events: none; }
.v3-btn-spin { display: inline-block; width: 22px; height: 22px; border-radius: 50%; border: 3px solid rgba(255,255,255,.35); border-top-color: #fff; animation: v3spin .8s linear infinite; }
.v3-btn-check { display: inline-flex; animation: popIn .28s cubic-bezier(.22,.61,.36,1) both; }
@media (prefers-reduced-motion: reduce) {
  .v3-btn-spin { animation: none; border-color: #fff; border-top-color: rgba(255,255,255,.35); }
  .v3-btn-check, .intro-rise { animation: none !important; }
}
.v3-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; min-height: 50px; padding: 13px 24px; border: 0; border-radius: 8px; font-family: inherit; font-size: 16px; font-weight: 700; line-height: 1.2; cursor: pointer; transition: background-color .12s ease, color .12s ease; }
.v3-btn-primary { background: #BA2F7D; color: #fff; }
.v3-btn-primary:hover:not(:disabled) { background: #A22670; }
.v3-btn-primary:disabled { background: #E9BCD5; cursor: not-allowed; }
.v3-btn-pink { background: #FBE8F2; color: #BA2F7D; }
.v3-btn-pink:hover { background: #F6D7E8; }
.v3-btn-auto { width: auto; min-width: 110px; }

.v3-linkbtn { display: inline-block; background: none; border: 0; padding: 6px 2px; font-family: inherit; font-size: 15px; font-weight: 700; line-height: 1.3; color: #406EB3; cursor: pointer; }
.v3-linkbtn:hover { text-decoration: underline; }
.v3-linkbtn-pink { color: #BA2F7D; }

/* ── choice rows: card style on desktop (D4), plain rows on the phone (M4) ── */
.v3-radio { display: flex; align-items: flex-start; gap: 12px; width: 100%; text-align: left; background: #fff; border: 1px solid #D1D1DC; border-radius: 10px; padding: 17px 18px; font-family: inherit; font-size: 15px; color: #1E1E35; cursor: pointer; transition: border-color .12s ease, background-color .12s ease; }
.v3-radio:hover { border-color: #B3B3C4; }
.v3-radio:focus-within { outline: 3px solid #3361A0; outline-offset: 2px; }
.v3-radio.is-on { border-color: #BA2F7D; background: #FDF4F9; }
@media (max-width: 767px) {
  .v3-radio, .v3-radio:hover, .v3-radio.is-on { border: 0; background: none; padding: 10px 0; border-radius: 0; }
}

/* ── chrome ── */
.v3-foot-link { color: #406EB3; cursor: pointer; }
.v3-foot-link:hover { color: #26478D; text-decoration: underline; }
.v3-close { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 0; border-radius: 50%; background: #F1F1F5; color: #4D4D6A; cursor: pointer; }
.v3-close:hover { background: #E4E4EC; }

/* ── modal (D3/M3) ── */
.v3-backdrop { position: fixed; inset: 0; z-index: 400; background: rgba(13,13,31,.55); display: flex; align-items: center; justify-content: center; padding: 24px; }
.v3-modal { position: relative; width: 100%; max-width: 575px; max-height: calc(100dvh - 48px); overflow-y: auto; background: #fff; border-radius: 14px; padding: 28px 32px 24px; box-shadow: 0 20px 60px rgba(13,13,31,.3); }
@media (max-width: 767px) {
  .v3-backdrop { align-items: flex-end; padding: 0; }
  .v3-modal { max-width: none; max-height: 86dvh; border-radius: 16px 16px 0 0; padding: 20px 20px 16px; }
}

/* ── spinner (D6/M6) ── */
.v3-spin { width: 34px; height: 34px; border-radius: 50%; border: 4px solid #EAEAEF; border-top-color: #BA2F7D; animation: v3spin .9s linear infinite; }
@keyframes v3spin { to { transform: rotate(360deg); } }
.v3-toast { animation: v3fade .2s ease both; }
@keyframes v3fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .v3-spin, .v3-toast { animation: none !important; } }

/* ── D1 / M1 sign in ── */
.v3-signin-page { background: #F5F5F8; }
.v3-signin-wrap { width: 100%; max-width: 760px; margin: 0 auto; padding: 36px 24px 96px; }
.v3-signin-card { background: #fff; border-radius: 8px; padding: 28px 32px 36px; box-shadow: 0 1px 4px rgba(13,13,31,.08); }
.v3-signin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; margin-top: 22px; }
.v3-app-panel { background: #F5F5F8; border-radius: 8px; padding: 22px 20px; display: flex; gap: 16px; align-items: flex-start; }
.v3-divider { display: flex; align-items: center; gap: 14px; margin: 18px 0; color: #6B6B88; font-size: 14px; }
.v3-divider::before, .v3-divider::after { content: ''; flex: 1; height: 1px; background: #DCDCE4; }
@media (max-width: 767px) {
  .v3-signin-page { background: #fff; }
  .v3-signin-wrap { padding: 16px 20px 36px; }
  .v3-signin-card { background: none; border-radius: 0; padding: 0; box-shadow: none; }
  .v3-signin-grid { grid-template-columns: 1fr; gap: 26px; margin-top: 18px; }
  .v3-app-panel { flex-direction: column-reverse; align-items: center; text-align: center; padding: 26px 18px; }
}

/* ── D1/M1 extras: forgot links, Google button ── */
.v3-forgot { display: flex; justify-content: center; gap: 22px; margin-top: 14px; }
.v3-forgot .v3-linkbtn { font-size: 14px; font-weight: 600; color: #26478D; }
@media (max-width: 767px) { .v3-forgot .v3-linkbtn { font-weight: 400; text-decoration: underline; color: #35354E; } }
.v3-google { display: inline-flex; align-items: center; gap: 0; margin-top: 12px; padding: 2px; border: 0; border-radius: 4px; background: #1A73E8; color: #fff; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; min-height: 40px; }
.v3-google-g { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #fff; border-radius: 3px; }
.v3-google-txt { padding: 0 14px 0 12px; }
@media (max-width: 767px) {
  .v3-google { display: flex; width: 100%; min-height: 50px; border-radius: 8px; background: #4285F4; font-size: 15px; }
  .v3-google-g { width: 44px; height: 44px; border-radius: 6px; }
  .v3-google-txt { flex: 1; text-align: center; padding-right: 44px; }
}

/* ── art alignment: centred on desktop, flush left on M2 ── */
.v3-art { display: flex; justify-content: center; }
@media (max-width: 767px) { .v3-art-mobleft { justify-content: flex-start; } }
.v3-modal-cta { width: auto; min-width: 110px; }
.v3-modal-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
@media (max-width: 767px) {
  .v3-modal-cta { width: 100%; }
  /* keep Close reachable without scrolling the sheet (M3) */
  .v3-modal-actions { position: sticky; bottom: 0; margin-top: 16px; padding: 10px 0 4px; background: #fff; }
}

/* ── /v3 homepage (copy of the V2 desktop landing) ──
   The V2 landing was only ever drawn at full desktop width. These
   guards keep it from scrolling sideways between 768px (where the
   desktop layout starts) and ~1100px. !important because the
   landing's layout lives in inline styles, the same reason
   globals.css uses it for /start. */
@media (max-width: 1100px) {
  .v3-home-nav { display: none !important; }
  .v3-home-tabs { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important; }
}
@media (max-width: 1000px) {
  .v3-home-hero { grid-template-columns: minmax(0, 1fr) !important; gap: 40px !important; }
  .v3-home-bff { grid-template-columns: minmax(0, 1fr) !important; min-height: 0 !important; }
  .v3-home-help { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)) !important; }
  .v3-home-fcols { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .v3-home-sticky { flex-wrap: wrap; height: auto !important; padding-top: 12px; padding-bottom: 12px; }
}
`
