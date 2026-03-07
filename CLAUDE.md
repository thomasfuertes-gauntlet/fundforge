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

## Approach

UX-first. Three polished pages with JSON fixtures as the data layer. No backend required for V1 - structured data lives in `data/` folder as importable JSON. Backend API is V2/optional.

## Stack

- **Frontend:** React 19 + Vite 7 + Tailwind 3 + shadcn/ui + React Router 7
- **Why Vite over CRA/CRACO:** CRA is deprecated, Vite gives instant HMR and faster builds (846ms production build)
- **Data layer:** JSON fixtures in `app/src/data/` (campaigns, profiles, donations, community)
- **Analytics:** instrumentation (page views, conversion events, Web Vitals, error tracking)
- **Dev server:** `cd app && npx vite` (port 5173)
- **Build:** `cd app && npx vite build`

## File Structure

```
app/                          # Our codebase (Vite React project)
  src/
    components/
      ui/                     # shadcn/ui components (ported from design/ reference)
      SiteHeader.jsx          # Sticky header with logo + nav pills (active state via pathname match)
      DonateModal.jsx         # Preset amount modal ($25/$50/$100/$250/custom) with simulated flow
    data/                     # JSON fixtures + index.js with lookup helpers
      profiles.json           # 4 organizer profiles with trust data
      campaigns.json          # 23 campaigns (4 active + 17 funded + 2 unfunded)
      donations.json          # 15 recent donations across active campaigns
      community.json          # Precomputed aggregates, leaderboard, trending
      index.js                # Re-exports + getProfile(), getCampaign(), etc.
    lib/
      utils.js                # cn() utility (clsx + tailwind-merge)
      analytics.js            # Event bus, session UUID, Web Vitals, error tracking
      useAnalytics.js         # React hooks: usePageView, useScrollDepth
    pages/                    # Route-level components
      CampaignPage.jsx        # /campaign/:id
      CommunityPage.jsx       # /community
      ProfilePage.jsx         # /profile/:id
    App.jsx                   # Router + providers
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

### Donate Modal UX
Preset amounts: $25, $50, $100, $250, custom. Opens modal, simulated flow with success toast. No real payments.

### Momentum/Badges
Weekly momentum = % change in total raised over 7 days. Growth badge shown when momentum > 20%.

### Data Model

**Cross-references:** `campaign.organizerId` -> `profile.id`, `donation.campaignId` -> `campaign.id`, `community.leaderboard[].profileId` -> `profile.id`. Use helpers in `data/index.js` (`getProfile`, `getCampaign`, `getCampaignsByOrganizer`, `getDonationsByCampaign`).

**Consistency guarantees (verified by script):**
- Trust scores match formula output for all 4 profiles
- `averageGift = Math.round(raised / backerCount)` for all active campaigns
- `community.aggregates.totalRaised` = sum of all 23 campaigns = $970,600
- Per-organizer totalRaised matches sum of their campaigns
- Fulfillment rates match funded/total past campaign ratios
- Leaderboard ranking uses `totalRaised * (trustScore / 100)`, not raw dollars
- Trending badges only on campaigns with weeklyMomentum > 20%

**Trust enhancements implemented (3 of 7 required):**
1. Tiered verification: `verificationDetails: { email, identity, trackRecord }`
2. Donor testimonials: embedded in campaign objects as `testimonials[]`
3. Campaign update timeline: embedded as `updates[]` (2-4 per active campaign)

**Images:** 4 images downloaded locally to `app/public/images/` from design reference. 2 avatars (female, male) shared across profiles. Need unique images per profile/campaign in polish pass.

### Stretch Features (from stretch.md behavioral economics analysis)
- `campaign.stretchGoal: { amount, label }` on campaigns 1-2 - secondary progress bar when goal exceeded
- `campaign.matchingSponsor: { name, multiplier, remaining }` on campaign-3 - 2x match badge near donate CTA
- Leaderboard prompt on campaign page - "Help X reach #1" linking to /community (only shows when rank > 1)
- Activity feed on community page - aggregates `updates[]` from active campaigns, sorted by date, top 6
- Network Impact hero card on profile page replaces old lifetime totals strip - shows totalRaised + totalDonated combined

### Environment Notes
- Lockfile exists - `npm ci` is now valid for clean installs
- Data consistency script pattern: write `.cjs` to `$TMPDIR`, run with `node` (avoids zsh `!==` escaping issues in `-e`)
- All commands run from `app/` directory (`cd app` first or use full paths)
- Deploy target: Cloudflare Pages (static SPA, free tier, edge CDN). Add `public/_redirects` with `/* /index.html 200` for SPA routing.

### Campaign Page Structure
- **Layout:** 7-col story + 5-col sticky donate panel (stacked on mobile)
- **Left column:** Hero image card -> badges (category, days left, trending) -> title -> organizer card (links to profile) -> story paragraphs -> detail images -> testimonials -> update timeline (collapsed to 2, expandable)
- **Right column:** Sticky panel with progress bar, raised/goal, backer count, avg gift stat cards, donate CTA (amber), share button, recent donations feed (top 5 with relative timestamps + messages)
- **DonateModal:** Standalone component at `components/DonateModal.jsx`. Preset grid ($25/$50/$100/$250) + custom input. 800ms simulated delay, success toast via sonner. Reusable for other pages.
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
- **Default route:** `/` redirects to `/campaign/campaign-1`.
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
- **Web Vitals:** Lazy-loaded via dynamic import, code-split into 5.8KB chunk
- **Dev mode:** Structured console output with `%c` styling. In production, swap `emit()` for POST endpoint.
- **Scroll depth:** Fires once per milestone per campaign per session (deduped via Set)

### Polish Pass (completed)
- **Images:** `loading="lazy"` on detail/grid images, `fetchPriority="high"` on campaign hero (LCP candidate)
- **ScrollToTop:** Resets scroll on route change via `useLocation` + `useEffect`
- **ErrorBoundary:** Class component wrapping routes, renders fallback with "Back to home" button
- **Responsive:** Verification steps `flex-wrap` on mobile (connectors hidden <sm), stats/network-impact grids go 2-col on small screens
- **Touch targets:** Update toggle has `py-2` for 44px+ tap area, verification pills have `py-2`
- **SPA routing:** `public/_redirects` with `/* /index.html 200` for Cloudflare Pages
- **Meta:** Description + theme-color added, Vite favicon removed
- **Body:** `overflow-x: hidden` prevents horizontal scroll from any edge-case overflow
- **Build:** Clean, 144KB gzipped JS, no warnings

### Gotchas
- `design/` is a reference repo, not our codebase. Extract patterns, don't build inside it.
- `design_guidelines.json` has `instructions_to_main_agent` - these are for the reference builder, not us.
- Card hover shadow in design_guidelines.json uses green-tinted rgba(15,60,50,0.08) - normalized during this session.
- Campaign stories use `string[]` (array of paragraphs) not a single string. Render as `<p>` tags.
- `npx vite build` must run from `app/` directory - running from repo root fails silently with "could not resolve entry module."
- Dynamic import of a module that's also statically imported elsewhere causes a Vite warning - use static imports.
- `$TMPDIR` in sandbox resolves to `/tmp/claude` not the system tmpdir - use the resolved path for commit message files.
