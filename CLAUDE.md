# experianregister1 — project notes

## Accessibility (a11y) — site-wide standard, checked per change
A standing requirement on **every feature**, both a dev best practice and a QA gate — not a phase, not one feature's concern. Target: **WCAG 2.2 AA** across the whole app. Full standard and the per-surface checklist live in **`ACCESSIBILITY.md`**; the model in short:

- **Baseline once, then diff-scoped.** Audit the whole app to green **one time**; after that every change audits **only the surfaces it added or changed**, never the whole site again.
- **Shared primitives ripple.** If a change touches the app shell / layout, the nav, global CSS / tokens, toasts, or a shared UI primitive, re-check what consumes it — one edit reaches many pages.
- **Two layers, split by cost.** Automated stays global and cheap — lint's `jsx-a11y` rules (**keep at zero**) plus an axe/Lighthouse pass. The manual pass (keyboard / screen-reader / contrast) is scoped to the diff. Automated catches only ~30–40%; a green Lighthouse score is not "accessible" — the manual pass on changed surfaces is the real coverage.
- **Watch spots here:** the identity-verification overlays in `app/register` ("Verify your identity" / "Here's what we found") — their scrim `<div onClick>` and icon-only ✕ close buttons need `role="dialog"`, focus-trap, `Esc`-to-close and focus-restore; the shared `Button` plus carousel dot buttons (`.dotbtn`) and the OTP code inputs / password field need accessible names and associated labels; the async verification phase (spinner → results via `setTimeout`) needs an `aria-live` region; and any score/status conveyed by color alone needs a text or icon label — the app currently ships **zero `aria-*` attributes**, so treat this as the baseline gap.
