# Figma Make prompt — Experian registration prototype (backup build)

Paste everything below the line into Figma Make.

---

Build a high-fidelity, **responsive** prototype of an Experian-style consumer credit **registration flow**, for internal usability testing. This is a **design mockup only** — no backend, no real data collection, no analytics; every input is local and every button just advances the on-screen flow. Add a slim top bar, right-aligned, one line: "Demo prototype — user testing only".

## Responsive behavior
One experience, two layouts by viewport width:
- **≤ 767px (phones):** a mobile-crafted flow — full-bleed screens with a promo panel on top and a **rising bottom-sheet** holding the form/CTA.
- **> 767px (desktop):** a **two-column** layout — a marketing/benefits panel on the left, the form on the right; the dashboard is multi-column.

## Visual style
- **Brand colors:** primary magenta/pink `#BA2F7D` (CTAs, accents), blue `#406EB3`, deep navy `#1E1E35` / `#26478D`, success green `#00A651`, error red. Light lavender-gray surfaces `#F4F4FB`, `#EDEDF6`, white cards.
- **Type:** Roboto (or system sans). Bold, tight-tracked headings; generous line-height on body.
- **Shape:** rounded corners (8–16px), soft shadows, pill badges. Experian wordmark top-left. Clean, modern, trustworthy fintech feel.

## The flow (a step machine: home → phone → birthday → passkey → identity → celebrate → dashboard)

**1. Homepage / landing (marketing)**
Headline "Reach your credit and money goals". A horizontal scroller of feature chips: *Credit report & FICO® Score, No Ding Decline™ cards, Save on bills, Car insurance, Digital checking*. A dark-navy **score card** showing FICO® Score 8 = **702**, a colored gauge (300–850) with a marker, "18% credit usage" bar, and a floating "Your FICO® Score went up!" chip. Sub-headline "Get your free credit report and FICO® Score" with a paragraph about raising scores using bills (cell phone, utilities, streaming, rent). Primary CTA "Let's get started". Sticky footer: "Sign in" + "Sign up for free". All CTAs advance to the phone step.

**2. Phone step**
Promo panel: pink "ALWAYS ON" badge, "We watch your credit so you don't have to.", benefit rows — *Nothing to worry about right now* (highlighted shield), *Dark web scan — We check the leaks for your info.*, *Fraud alert — Puts lenders on notice for a year.*, *Credit freeze — Lock new credit with one tap.*, *Dispute center — Challenge errors on your report.* Form: "See your free credit score.", "Join 100 million people who trust Experian…", a US phone input with a 🇺🇸 +1 country selector. **Above the "Get started" CTA**, in 12px fine print: *"By selecting \"Get started\", you authorize your wireless carrier to use or disclose information about your account and your wireless device, if available, to Experian or its service provider, solely to help them identify you or your wireless device and to prevent fraud."* Link: "Already have an account? Sign in". CTA "Get started" → birthday.

**3. Birthday step**
Promo: pink "EXPERIAN BOOST" badge, "Get credit for the bills you already pay.", an animated **line chart** (Experian Boost lifting the score over ~11 days, "Boost added" marker), feature rows *Results in minutes* and *Smart Money checking*. Form: "Your number checks out.", birthday input (MM/DD/YYYY, validated), CTA "See my credit report" → passkey.

**4. Passkey step**
Promo: pink "FREE FOREVER" badge, "The FICO Score lenders actually pull.", a **semicircular score gauge** = **724** with "GOOD" and a Fair/Good/Very Good/Exceptional scale, feature rows *Daily score updates* and *Free Experian credit report*. Form: "Set up your passkey.", three benefits — *Faster sign-in*, *Phishing-resistant*, *Works across your devices* — CTA "Set up passkey" and a "Skip for now" link. Both → identity.

**5. Identity — "Here's what we found"**
A **pull-up drawer/modal** rising over a blurred dashboard. Title "Here's what we found", subtitle "Make sure everything looks correct…". Editable fields prefilled: First name *Robert*, Last name *Ross*, Date of birth, Phone number, Street address *732 Capouse Ave*, Apt, ZIP *18503*, City *Scranton*, State *UT*, Social Security Number *XXX-XX-4237* (masked), and an Email field under "Create your account". CTA "Continue" → celebrate.

**6. Celebration**
Confetti over the dashboard, a green check, "You're all set!", "Congratulations — your Experian account is ready and your FICO® Score is unlocked.", CTA "See my dashboard" → dashboard.

**7. Dashboard**
Header with Experian logo + nav (Dashboard, My Score, Credit Report, Protect, Offers) and a notification bell. "Hi, David!" / "Take a look at the big picture of your credit." Cards:
- **Setup progress:** Account created, Phone verified, Confirm identity, Score & report revealed (all complete).
- **Benefits:** Credit monitoring, Credit report, Experian Boost®, Exact FICO® Score, Score history, Dark web scan.
- **Credit:** tabs Experian / Equifax 🔒 / TransUnion 🔒; FICO® Score 8 = **755**, "VERY GOOD", "+7 POINTS", a score track (300–850), Total debt $496,245, Credit usage 14%, "See your report".
- **Auto:** "Unlock your auto insurance savings".
- **Protection:** Coverage / CreditLock / Security freeze (locked tiles).
- **Money:** July cash flow $1,587, income/expense bars, "See details".

Desktop = 3-column grid (left rail: setup + benefits; middle + right: the cards). Mobile = single column, cards stacked, everything full-bleed and scrollable.

## Notes
- Keep it feeling like a real, polished Experian app, but it is a **prototype** — no data leaves the device.
- Prioritize the mobile experience; make sure nothing overflows horizontally on a 375px phone and the desktop two-column collapses cleanly.
