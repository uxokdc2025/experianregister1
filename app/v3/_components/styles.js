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
.v3-desk { display: block; }
.v3-mob  { display: none; }
.v3-desk-i { display: inline; }
.v3-mob-i  { display: none; }
@media (max-width: 767px) {
  .v3-desk, .v3-desk-i { display: none; }
  .v3-mob { display: block; }
  .v3-mob-i { display: inline; }
}

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

/* ── fields ── */
.v3-field { position: relative; display: block; width: 100%; border: 1px solid #C9C9D6; border-radius: 8px; background: #fff; transition: border-color .12s ease, box-shadow .12s ease; }
.v3-field:focus-within { border-color: #406EB3; box-shadow: 0 0 0 1px #406EB3; }
.v3-field-label { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #6B6B88; pointer-events: none; transition: top .12s ease, font-size .12s ease, color .12s ease; }
.v3-field.is-active .v3-field-label { top: 10px; transform: none; font-size: 11.5px; font-weight: 700; color: #26478D; letter-spacing: .01em; }
.v3-field-input { display: block; width: 100%; border: 0; outline: 0; background: transparent; font-family: inherit; font-size: 16px; color: #1E1E35; padding: 25px 14px 11px; border-radius: 8px; }
.v3-field-input::placeholder { color: transparent; }

/* ── buttons ── */
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
.v3-demobar { display: flex; align-items: center; justify-content: flex-end; gap: 14px; background: #2B2B45; color: #fff; padding: 4px 14px; }
.v3-demobar button { background: none; border: 0; color: #fff; font: 600 11px/1.3 system-ui, sans-serif; cursor: pointer; opacity: .85; padding: 2px 4px; }
.v3-demobar button:hover { opacity: 1; text-decoration: underline; }

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
