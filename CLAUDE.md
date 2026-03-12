# FundForge - GoFundMe Interview Project

## Project Overview

One-week sprint to build three interconnected crowdfunding pages (Fundraiser, Community, Profile) with AI-accelerated development. Private repo at `tomfuertes/gofundme-interview`.

## Architecture

- **Three pages:** Fundraiser Campaign, Community Hub, User Profile - must share data and design tokens
- **Core challenge:** Cross-page data consistency (organizer on campaign page = same data on profile page)
- **Trust system:** Composite score (0-100) from fulfillment rate, update consistency, repeat donor confidence
- **Identity model:** Anonymous sessions with generated UUID for error tracking. Follow counts and social proof are display-only (pre-seeded data). No real auth.

## Design Reference

`design/` contains the reference repo cloned from `thomasfuertes-gauntlet/gofundme-interview`:

- `design/design_guidelines.json` - Complete design token system (colors, typography, spacing, component styles)
- `design/frontend/src/components/ui/` - 40+ shadcn/ui components (React + Radix)
- `design/frontend/src/components/showcase/ShowcasePage.jsx` - Full showcase with Campaign, Community, Profile section patterns
- `design/frontend/src/components/showcase/showcase-data.js` - Sample data shapes (donors, leaderboard, campaigns, trust metrics)
- `design/frontend/src/index.css` - Tailwind config with HSL CSS variables for shadcn/ui theming
- `design/backend/server.py` - FastAPI + MongoDB starter backend

### Design Tokens (from design_guidelines.json)

- **Primary:** #0F3C32 (Deep Forest Green)
- **Secondary:** #E8F3F1 (Mint Foam)
- **Accent:** #D97706 (Amber - conversion actions: donate, share, follow CTAs)
- **Headings:** Libre Baskerville (serif)
- **Body:** Manrope (sans-serif)
- **Mono:** JetBrains Mono
- **Card radius:** rounded-xl, Button radius: rounded-full
- **No pure black (#000000)** - use #0F3C32 or #111827

### Layout Patterns

- Campaign: `grid grid-cols-1 lg:grid-cols-12` (7-col story + 5-col sticky donate panel)
- Community: Bento grid `grid grid-cols-1 md:grid-cols-3` (4-col metrics + 3-col trending + 5-col leaderboard on lg)
- Profile: Identity header with trust composition panel, campaign history in 3-col grid

## Key Files

- `fundforge.md` - Full project spec document (requirements, build strategy, pre-search checklist)
- `spec.md` - Original problem statement from Gauntlet
- `design/` - Reference design repo (read-only, not our codebase)

## Conventions

- `data-testid` attributes on all interactive elements
- Donate button uses accent color (#D97706) to contrast against primary green
- Left-align body text (never center-align everything)
- Section padding minimum: py-20
- Hover micro-interactions on all cards (lift + shadow increase)
- Icons: lucide-react, stroke-width 1.5, w-5 h-5

## Stack

- **Frontend:** React 19 + Vite 7 + Tailwind 3 + shadcn/ui + React Router 7
- **Backend:** Hono on Cloudflare Workers + D1 (SQLite)
- **Data layer:** D1 database (seeded from JSON fixtures in `app/src/data/`). Hooks in `src/lib/useData.js` fetch from `/api/*` with fixture fallbacks.
- **Analytics:** instrumentation (page views, conversion events, Web Vitals, error tracking)
- **Dev server:** `cd app && npx vite` (port 5173) + `npx wrangler dev` (port 8787). Vite proxies `/api` to wrangler.
- **Build:** `cd app && npx vite build`
- **Seed:** `cd app && npx tsx worker/db/seed.ts > worker/db/seed.sql`

### Backend Architecture

Single Worker serves both API and static assets via `main` + `assets` in wrangler.jsonc.

```
worker/
  index.ts              # Hono app, mounts routes, CORS
  routes/
    profiles.ts         # GET /, GET /:id, POST /:id/follow
    campaigns.ts        # GET /?status=&organizerId=, GET /:id
    donations.ts        # GET /?campaignId=, POST / (atomic campaign update via db.batch)
    community.ts        # GET / (computed aggregates/leaderboard/trending via SQL)
  db/
    schema.sql          # 3 tables: profiles, campaigns, donations
    seed.ts             # Reads JSON fixtures -> INSERT statements
    seed.sql            # Generated output (do not edit directly)
  lib/
    transforms.ts       # snake_case DB rows -> camelCase API shapes
```

- **D1 binding:** `DB` -> `fundforge_db` (database_id in wrangler.jsonc)
- **useData.js pattern:** Hooks init with fixture data (instant render), fetch from API in background, fallback silently on error
- **DonateModal:** Optimistic UI - shows success immediately, POSTs to `/api/donations` fire-and-forget
- **Community aggregates:** No community table - computed on read via SQL (SUM, COUNT, JOIN)

## File Structure

```
app/                          # Our codebase (Vite React project)
  src/
    components/
      ui/                     # shadcn/ui components (ported from design/ reference)
      SiteHeader.jsx          # Sticky header with logo + nav pills (active state via pathname match)
      DonateModal.jsx         # Preset amount modal ($25/$50/$100/$250/custom) - POSTs to /api/donations
      ErrorBoundary.jsx       # Wraps routes, renders fallback on crash
    data/                     # JSON fixtures (seed source) + index.js with lookup helpers
      index.js                # Re-exports + getProfile(), getCampaign(), etc. - still used as fallback in useData.js
    lib/
      format.js               # Shared formatCurrency({compact}), initials(), formatNumber(), formatDate()
      utils.js                # cn() utility (clsx + tailwind-merge)
      analytics.js            # Event bus, session UUID, Web Vitals, error tracking
      useAnalytics.js         # React hooks: usePageView, useScrollDepth
    pages/                    # Route-level components
      HomePage.jsx            # / - hero stats, ecosystem cards, trust model, tech stack
      CampaignPage.jsx        # /campaign/:id
      CommunityPage.jsx       # /community
      ProfilePage.jsx         # /profile/:id
    App.jsx                   # Router + providers + React.lazy code splitting
    main.jsx                  # Entry point + BrowserRouter
    index.css                 # Tailwind + HSL CSS variables
  tailwind.config.js          # Design tokens (fonts, colors, radius, shadows)
  vite.config.js              # Path alias @/ -> src/
design/                       # Reference repo (read-only)
```

### shadcn/ui Components Available

Button (with accent variant for donate), Card, Badge, Avatar, Progress, Dialog, Tabs, Separator, Tooltip, Sonner (toast)

### Deviations from Reference

- Vite instead of CRA/CRACO (faster, modern)
- Removed `next-themes` dependency from Sonner (no dark mode needed for V1)
- Added `accent` Button variant for donate/CTA actions (amber #D97706)
- Progress bar height increased to h-3 (from h-2) per design_guidelines.json

## Deliverables (see fundforge.md for full requirements)

- GitHub repo with clean commit history + README
- Demo video (3-5 min)
- Pre-Search document (AI conversation transcript)
- Architecture document (1-2 pages)
- AI cost analysis (dev spend + production projections)
- Deployed application (public URL)
- Social post tagging @GauntletAI

## Performance Targets

See fundforge.md "Performance Targets" for full details:
- LCP < 2.5s (on 4G connection), FID < 100ms, CLS < 0.1, TTI < 3.5s
- API p95 < 500ms
- Lighthouse >= 85

## Session Learnings

### Trust Score Formula
`trust_score = (fulfillment_rate * 0.4) + (update_consistency * 0.3) + (repeat_donor_confidence * 0.3)` - all inputs 0-100%, output rounded to integer.

### Doc Hierarchy
- `spec.md` is source of truth (never modify)
- `fundforge.md` is the elaborated spec (authoritative for requirements)
- `CLAUDE.md` is AI context (index + shortcuts, not a copy of fundforge.md)
- `README.md` is human-facing summary
- Avoid restating fundforge.md details here - link instead. Summaries drift.

### Momentum/Badges
Weekly momentum = % change in total raised over 7 days. Growth badge shown when momentum > 20%.

### Data Model

**Cross-references:** `campaign.organizerId` -> `profile.id`, `donation.campaignId` -> `campaign.id`, `community.leaderboard[].profileId` -> `profile.id`. Use helpers in `data/index.js` (`getProfile`, `getCampaign`, `getCampaignsByOrganizer`, `getDonationsByCampaign`).

**Images:** Per-profile avatars: `avatar-maya/jonas/elena/samir.jpg`. Per-campaign heroes: `hero-garden/solar/water/education/community/makerlab/mural.jpg`. Old shared images (`hero-campaign.jpg`, `campaign-detail.jpg`) used only by past campaigns. Old shared avatars (`avatar-female.jpg`, `avatar-male.jpg`) are unused.

### Environment Notes
- Lockfile exists - `npm ci` is now valid for clean installs
- Data consistency script pattern: write `.cjs` to `$TMPDIR`, run with `node` (avoids zsh `!==` escaping issues in `-e`)
- All commands run from `app/` directory (`cd app` first or use full paths)
- Deploy target: Cloudflare Workers static assets. SPA fallback in `wrangler.jsonc`, not `_redirects` (causes infinite loop with Workers).
- No root `package.json` - all npm commands run from `app/`. `wrangler.jsonc` lives in `app/` alongside `node_modules`.

### Campaign Page Structure
- **Layout:** 7-col story + 5-col sticky donate panel (stacked on mobile)
- **Left column:** Hero image card -> badges (category, days left, trending) -> title -> organizer card (links to profile) -> story paragraphs -> detail images -> testimonials -> update timeline (collapsed to 2, expandable)
- **Right column:** Sticky panel with progress bar, raised/goal, backer count, avg gift stat cards, donate CTA (amber), share button, recent donations feed (top 5 with relative timestamps + messages)
- **DonateModal:** Optimistic UI - success shown immediately, POSTs to `/api/donations` fire-and-forget. Sonner toast on close.
- **Relative time:** `formatRelativeTime()` uses a fixed "now" of `2026-03-07T17:00:00Z` matching fixture dates, not `Date.now()`. This keeps the UI stable for demos.
- **Organizer card links** to `/profile/:id` for cross-page navigation.

### Community Page Structure
- **Layout:** Bento grid `lg:grid-cols-12` - metrics (4-col) + trending (3-col) + leaderboard (5-col). Stacks vertically on mobile.
- **Metrics card:** Dark primary hero stat for total raised, sky-blue donors card, secondary row for avg gift + funding rate. All data from `community.aggregates` (precomputed, no runtime math).
- **Trending card:** Links to `/campaign/:id`. Shows weekly momentum %, weekly raised, organizer name, tag badge (Fastest Growth / Trending).
- **Leaderboard card:** Links to `/profile/:id`. Shows rank, avatar, name, campaigns funded, trust score, total raised, weekly trend arrow. Ranked by `totalRaised * (trustScore / 100)` (precomputed).
- **Active campaigns grid:** Below bento grid. 4-col card grid with hero image, category badge, title, progress bar, raised/days left. Cards have hover lift animation.
- **Currency formatting:** `formatCurrency()` abbreviates to $K/$M for large values in community context (vs full numbers on campaign page where precision matters).

### Profile Page Structure
- **Layout:** Two-section page. Top: identity header + trust composition panel in `lg:grid-cols-[1fr_1fr]`. Bottom: campaign history grid.
- **Identity header (left):** Avatar, name, title, role badges, verified badge, location/member-since/recommendations meta, bio, stats row (followers/funded/trust score), verification step indicator (email -> identity -> track record).
- **Trust panel (right):** Dark gradient card (`from-primary via-primary to-sky`). Shows all 3 trust inputs with progress bars + percentages. Formula explanation box at bottom: `fulfillment (40%) + update consistency (30%) + repeat donor confidence (30%)`.
- **Verification steps:** Stepped pill indicator showing which tiers are verified. Two profiles have all 3 (track_record), two have only email + identity.
- **Campaign history:** Active campaigns as image cards with progress bars (same pattern as Community page). Past campaigns as text-only cards with funded/not-funded badge, year, raised amount, backer count, summary.
- **Network Impact:** Dark gradient hero card at bottom showing totalRaised + totalDonated as combined headline, with raised/donated/funded breakdown in frosted sub-cards.

### Navigation
- **SiteHeader:** Sticky header with blur backdrop, text logo ("FundForge" + Users icon), 3 nav pills (Campaign, Community, Profile). Active state detected via `pathname.startsWith(match)`. Labels hidden on mobile (icon-only).
- **Default route:** `/` renders HomePage (minimal intro with nav buttons). Unknown routes redirect to `/`.
- **Cross-page links:** Campaign organizer card -> `/profile/:id`. Community leaderboard -> `/profile/:id`. Community trending + active grid -> `/campaign/:id`. Profile campaign history -> `/campaign/:id`.
- **Sticky offset:** Donate panel uses `lg:top-20` (80px) to clear the 56px header.

### Instrumentation
Event taxonomy (all events include sessionId, timestamp, url):

| Event | Payload | Why |
|---|---|---|
| `page_view` | page, params, referrer, viewport | Funnel analysis: community -> campaign -> donate |
| `donate_click` | campaignId | Conversion intent (modal opened) |
| `donate_complete` | campaignId, amount | Conversion (donation confirmed) |
| `share_click` | campaignId | Viral coefficient measurement |
| `scroll_depth` | campaignId, milestone (25/50/75/100) | Content engagement - do donors read the story? |
| `web_vital` | name (LCP/FID/CLS/INP/TTFB), value, rating | Performance budget monitoring |
| `error` | message, source, line, col | Reliability - unhandled errors + promise rejections |

- **Session UUID:** `crypto.randomUUID()` persisted in sessionStorage, ties all events to one visit
- **Web Vitals:** Lazy-loaded via dynamic import, code-split
- **Dev mode:** Structured console output with `%c` styling. In production, swap `emit()` for POST endpoint.
- **Scroll depth:** Fires once per milestone per campaign per session (deduped via Set)

### Deployment
- **URL:** https://fundforge.tomfuertes.workers.dev
- **Platform:** Cloudflare Workers (static assets, not Pages)
- **Config:** `app/wrangler.jsonc` - SPA fallback via `not_found_handling: "single-page-application"`
- **Deploy command:** `cd app && npm run deploy` (builds + deploys in one step)

### Data Field Gotcha
- Trust data is nested: `profile.trust.score`, `profile.trust.fulfillmentRate`, etc. NOT `profile.trustScore`.
- Community leaderboard has a flat `trustScore` field (duplicated for display). Don't confuse the two.

### GoFundMe Reference Pages (from spec.md)
- Campaign: https://www.gofundme.com/f/realtime-alerts-for-wildfire-safety-r5jkk
- Community: https://www.gofundme.com/communities/watch-duty
- Profile: https://www.gofundme.com/u/janahan
- `stretch.md` has behavioral economics analysis of all three (goal-gradient, competitive altruism, signaling theory)

### Gotchas
- `design/` is a reference repo, not our codebase. Extract patterns, don't build inside it.
- `design_guidelines.json` has `instructions_to_main_agent` - these are for the reference builder, not us.
- Campaign stories use `string[]` (array of paragraphs) not a single string. Render as `<p>` tags.
- `npx vite build` must run from `app/` directory - running from repo root fails silently with "could not resolve entry module."
- `$TMPDIR` in sandbox resolves to `/tmp/claude` not the system tmpdir - use the resolved path for commit message files.
- Workers static assets: `_redirects` file causes "infinite loop" validation error. Use `not_found_handling: "single-page-application"` in wrangler.jsonc instead.
- `design/frontend/` uses CRA/CRACO which is broken on Node 22+ (`ajv-keywords` MODULE_NOT_FOUND). Don't try to `npm start` it. Use the Emergent preview or Vite wrapper instead.
- `lucide-react` deprecated brand icons (`Github`, `Twitter`, `Facebook`). Use `LucideGithub`/generic alternatives (`Send`, `Share2`). TS still shows deprecation warnings on `Lucide*` variants.
- `useCountUp` IntersectionObserver threshold must be <= 0.1 for stats below the fold on mobile (375px). Higher thresholds cause counters to permanently show $0.
- `replace_all` in Edit tool replaces ALL occurrences including display text and string literals. Use targeted edits for renames where the name also appears as user-visible text.
- Profile "Email" pill is a **verification status indicator** (part of `VERIFICATION_STEPS` at ProfilePage.jsx:69), NOT a contact button. No email address is displayed anywhere. External reviewers consistently misread this.
- Campaign IDs 5-23 are taken by past campaigns. New active campaigns start at campaign-24+.
- Community aggregates are computed via SQL in `/api/community` - do not edit `community.json` directly, it's a seed artifact.
- `AnimatedProgress` (exported from `progress.jsx`) supports `delay` prop for stagger. `RevealOnScroll.jsx` wraps sections with fade-up on IntersectionObserver.

### Design Spec Compliance
- **Aligned:** CSS variables, fonts, Button variants (rounded-full, accent lift), Card shadows (green-tinted rgba), Progress h-3
- **Spacing standard:** `px-6 md:px-12 lg:px-16` container padding, `py-20` minimum section padding, `mt-16 lg:mt-24` inter-section gaps
- **Known deltas:** No gradient orb background, no glass-panel/editorial-card CSS utilities
- **Intentional deviations:** `tracking-widest` over spec's `tracking-wide` for eyebrows, `rounded-2xl` on detail images over spec's `rounded-sm`

## Design Context

### Users
GoFundMe engineering interviewers evaluating a one-week sprint. They'll review the live demo, source code, and commit history. The job-to-be-done: convince them this candidate ships polished, thoughtful products under time pressure. Secondary audience: anyone clicking the deployed URL from a resume or LinkedIn post.

### Brand Personality
**Trustworthy, Premium, Human.** The interface should feel like a high-end editorial magazine applied to crowdfunding - not a generic SaaS dashboard, not a startup MVP. Deep Forest Green (#0F3C32) anchors credibility. Amber (#D97706) creates warmth and urgency at conversion points. Serif headings (Libre Baskerville) signal editorial craft; sans body (Manrope) keeps it readable and modern.

### Emotional Goals
- **Delight + Innovation:** Behavioral economics patterns (anchoring, goal-gradient, bandwagon) should surprise interviewers. Animations should feel purposeful, not decorative. Each feature should double as an interview talking point.
- **Confidence + Craft:** Pixel-level attention to spacing, typography hierarchy, and interaction polish. The demo should feel like a shipped product, not a prototype.

### Anti-Patterns
- No pure black (#000000) anywhere - use #0F3C32 or #111827
- No center-aligned body text - left-align for readability
- No generic placeholder content - all fixture data tells a coherent, specific story
- No gratuitous animations - every motion serves a UX purpose (reveal, feedback, urgency)
- No AI aesthetic tells - avoid generic gradients, over-rounded everything, empty padding

### Design Principles
1. **Trust is the product.** Every design decision should reinforce credibility: verified badges, transparent formulas, consistent data, real-sounding stories. The trust score isn't a feature - it's the thesis.
2. **Editorial over dashboard.** Serif headings, story-first layouts, generous whitespace (py-20 minimum). Campaign pages read like longform journalism, not forms.
3. **Conversion through psychology.** Amber donate buttons, anchoring text ("Most donors give $74"), goal-gradient urgency, social proof at decision points. Every behavioral pattern has a cite-able rationale from stretch.md.
4. **Motion with meaning.** Progress bars animate on scroll (reveals progress), donation feed staggers in (implies activity), count-ups draw attention to impact numbers. No animation exists without a UX justification.
5. **Data coherence over volume.** Four organizers with interconnected campaigns, consistent trust scores, cross-page links that resolve. A small world that feels complete beats a large world with gaps.

### Accessibility Stance
Awareness-level for interview context. Semantic HTML, reasonable contrast ratios, keyboard-navigable modals (Radix handles this). Note a11y in interview discussion but prioritize visual polish for the demo. `prefers-reduced-motion` is a backlog candidate, not a blocker.
