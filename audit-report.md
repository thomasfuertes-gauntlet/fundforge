# FundForge Design Audit Report

Generated: 2026-03-08

## Anti-Patterns Verdict

**PASS - Does not look AI-generated.** This is genuinely well-differentiated:

- **No AI color palette** - deliberate token system (Deep Forest Green + Amber) with personality
- **No gradient text** - gradients used only on dark panel backgrounds (trust, network impact, hero banner), which is appropriate
- **No glassmorphism** - `backdrop-blur` on header/mobile CTA is functional, not decorative
- **No generic fonts** - Libre Baskerville + Manrope is a distinctive pairing
- **No bounce easing** - all animations use `ease-out` or custom cubic-bezier
- **No redundant copy** - copy is specific and data-driven throughout
- **Card grids have variation** - bento grid, not uniform 3x3

**One minor tell:** Task comment markers left in source (`// Task #4:`, `// Task #12:`, `// Task #15:`) - reveals AI-authored code to anyone reading source. Low risk since interviewer is more likely to demo than read raw JSX.

## Executive Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 2 |
| Medium | 6 |
| Low | 5 |

**Top issues:**
1. Custom input in DonateModal has no `<label>` element (a11y)
2. `formatCurrency` / `initials` duplicated across 3+ files (maintainability)
3. Leaderboard/filter tabs missing ARIA roles (a11y)
4. Hard-coded HSL gradient color repeated in 4 files (theming)
5. Task comment markers in source code (craft perception)

## Detailed Findings

### H1. DonateModal custom input missing label
- **Location:** `DonateModal.jsx:190-206`
- **Category:** Accessibility
- **Description:** The custom amount `<input>` uses only `placeholder="Custom amount"` with no associated `<label>` or `aria-label`. Placeholder text disappears on focus and isn't announced by all screen readers.
- **Impact:** WCAG 1.3.1 (Info and Relationships), 3.3.2 (Labels or Instructions)
- **Fix:** Add `aria-label="Custom donation amount"` to the input
- **Task:** #19

### H2. Leaderboard tabs and filter pills missing ARIA semantics
- **Location:** `CommunityPage.jsx:204-219` (tabs), `CommunityPage.jsx:94-126` (filter pills)
- **Category:** Accessibility
- **Description:** Tab buttons have no `role="tab"`, `aria-selected`, or `role="tablist"` on the container. Filter pills have no `aria-pressed` to indicate active state. Screen readers can't distinguish active from inactive.
- **Impact:** WCAG 4.1.2 (Name, Role, Value)
- **Fix:** Add `role="tablist"` on container, `role="tab"` + `aria-selected` on each tab. Add `aria-pressed` on filter pills.
- **Task:** #19

### M1. `formatCurrency` defined 3 times with different implementations
- **Location:** `CampaignPage.jsx:48`, `CommunityPage.jsx:26`, `ProfilePage.jsx:31`
- **Category:** Maintainability
- **Description:** CampaignPage uses full precision (`$86,400`), Community/Profile use abbreviated (`$86K`). Both are valid but should be one function with a format option, not 3 separate definitions. `initials()` is also duplicated 3 times.
- **Fix:** Extract to `lib/format.js` with a `compact` option
- **Task:** #20

### M2. Hard-coded gradient HSL value in 4 files
- **Location:** `CommunityPage.jsx:333`, `ProfilePage.jsx:256,431`, `HomePage.jsx:173`
- **Category:** Theming
- **Description:** `to-[hsl(195,69%,27%)]` (teal accent for gradients) appears in 4 places as a raw HSL string. Not a CSS variable or Tailwind token. Changing the gradient endpoint requires editing 4 files.
- **Fix:** Add as `--gradient-end` CSS variable or Tailwind `extend.colors` entry
- **Task:** #23

### M3. Scroll progress bar missing semantics
- **Location:** `CampaignPage.jsx:580-585`
- **Category:** Accessibility
- **Description:** The scroll progress indicator is a bare `<div>` with no `role="progressbar"`, `aria-valuenow`, or `aria-label`. It's decorative enough to argue `aria-hidden="true"` is fine, but if present, it should be properly marked.
- **Fix:** Add `aria-hidden="true"` since it's purely visual chrome
- **Task:** #19

### M4. Story reactions look interactive but aren't
- **Location:** `CampaignPage.jsx:257-277`
- **Category:** UX / Accessibility
- **Description:** Heart, prayer, and comment counts are styled like pills/buttons (rounded-full, border, bg) but are plain `<div>` elements with no click handler. Users will try to click them. The cursor doesn't change, but the styling implies interactivity.
- **Impact:** Misleading affordance. Could confuse users or interviewers.
- **Fix:** Either make them `<button>` with a toast ("Reactions coming soon") or reduce visual weight to plain text so they read as stats, not actions.
- **Task:** #22

### M5. Arbitrary font sizes outside type scale
- **Location:** `CampaignPage.jsx:234` (`text-[1.0625rem]`), `ProfilePage.jsx:160` (`text-[0.9375rem]`), `CommunityPage.jsx:261` (`text-[0.625rem]`)
- **Category:** Theming
- **Description:** Three custom font sizes not in the design_guidelines.json type scale. They work visually but break the type system. `0.625rem` (10px) is especially small for readability.
- **Fix:** Replace with nearest Tailwind size (`text-base`, `text-sm`, `text-xs`)
- **Task:** #23

### M6. Community activity feed does redundant profile lookups
- **Location:** `CommunityPage.jsx:509-518`
- **Category:** Performance
- **Description:** `getProfile(c.organizerId)` called twice per campaign update (once for name, once for avatar) inside a `flatMap`. With 7 active campaigns x 2-3 updates each, that's ~40 function calls. Not a perf blocker with JSON fixtures, but wasteful pattern.
- **Fix:** Destructure once: `const org = getProfile(c.organizerId);` then use `org.name`, `org.avatar`
- **Task:** #21

### L1. Task comment markers in source
- **Location:** `CampaignPage.jsx:73,102,105` (`// Task #15:`, `// Task #13:`, `// Task #12:`)
- **Category:** Craft perception
- **Description:** AI-orchestration task IDs left in the source. An interviewer reading the code would see these.
- **Fix:** Remove or replace with descriptive comments
- **Task:** #22

### L2. No skip-to-content link
- **Location:** `SiteHeader.jsx`
- **Category:** Accessibility
- **Description:** No skip navigation link for keyboard users. Minor for a 3-page demo.
- **Task:** #19

### L3. Bundle exceeds 500KB warning
- **Location:** Build output (512KB, 156KB gzipped)
- **Category:** Performance
- **Description:** Vite warns about chunk size. Driven by fixture data growth (26 campaigns with full stories). Route-based code splitting would fix it.
- **Fix:** Add `React.lazy()` for page components if it matters for Lighthouse
- **Task:** #21

### L4. `prefers-reduced-motion` not respected
- **Location:** All animation components (RevealOnScroll, fade-slide-in, progress-glow, scale-in, useCountUp)
- **Category:** Accessibility
- **Description:** No `@media (prefers-reduced-motion: reduce)` to disable animations.
- **Fix:** One CSS rule in `index.css`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
- **Task:** #19

### L5. HomePage hard-codes `/campaign/campaign-1` and `/profile/profile-1`
- **Location:** `HomePage.jsx:25,38`, `SiteHeader.jsx:5,7`
- **Category:** Data coupling
- **Description:** Nav and home page link to specific campaign/profile IDs. If data changes, nav breaks. Fine for a demo.
- **Resolution:** Accepted for interview scope. No task needed.

## Positive Findings

- **Excellent data-testid coverage** - every interactive element and key section is marked
- **fetchPriority="high" on LCP image** - campaign hero image correctly prioritized
- **Passive scroll listener with rAF throttling** - scroll progress bar is well-implemented
- **Safe-area padding on mobile CTA** - shows device awareness (`env(safe-area-inset-bottom)`)
- **Semantic heading hierarchy** - h1 per page, h2 for sections, h3 for subsections
- **Design token consistency** - colors flow through CSS variables, not hard-coded hex values (one exception: M2)
- **Behavioral economics patterns are well-integrated** - anchoring, social proof, goal-gradient all feel natural
- **IntersectionObserver threshold at 0.1** - learned from mobile counter bug, consistently applied
