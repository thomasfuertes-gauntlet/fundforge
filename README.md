# FundForge

Premium crowdfunding experience built with AI-accelerated development. Three interconnected pages - Fundraiser Campaign, Community Hub, and User Profile - forming a cohesive trust-driven donation platform.

**Live:** [fundforge.tomfuertes.workers.dev](https://fundforge.tomfuertes.workers.dev)

## Pages

- **Fundraiser Campaign** (`/campaign/:id`) - Editorial story layout with sticky donation panel, organizer trust signals, donation feed, progress tracking, stretch goals, matching sponsors
- **Community Hub** (`/communities/fundforge`) - Bento grid with aggregate impact metrics, trending campaigns with momentum badges, ranked leaderboard using trust-weighted scoring
- **User Profile** (`/profile/:id`) - Identity dashboard with composite trust score breakdown, verification tiers, campaign history, network impact visualization

## Getting Started

```bash
# Clone and install
git clone https://github.com/thomasfuertes-gauntlet/fundforge.git
cd fundforge
npm ci

# Development
npx vite          # http://localhost:5173

# Production build
npx vite build    # outputs to dist/

# Deploy (requires wrangler auth)
npm run deploy    # builds + deploys to Cloudflare Workers
```

**Requirements:** Node 18+, npm 9+

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + React Router 7 |
| Styling | Tailwind 3 + shadcn/ui + Radix primitives |
| Data | D1 database (SQLite) seeded from JSON fixtures in `worker/db/` |
| Analytics | Custom event bus + Web Vitals (dev: console, prod: POST endpoint) |
| Deploy | Cloudflare Workers (static assets with SPA fallback) |

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary | `#0F3C32` Deep Forest Green | Anchors credibility, headings, navigation |
| Secondary | `#E8F3F1` Mint Foam | Card backgrounds, soft surfaces |
| Accent | `#D97706` Amber | Conversion actions: donate, share, follow CTAs |
| Headings | Libre Baskerville (serif) | All h1-h6 elements |
| Body | Manrope (sans-serif) | Paragraphs, labels, UI text |
| Mono | JetBrains Mono | Code snippets, token labels |

## Trust Model

Composite score (0-100) visible on Profile and referenced across all pages:

```
trust_score = (fulfillment_rate * 0.4) + (update_consistency * 0.3) + (repeat_donor_confidence * 0.3)
```

Community leaderboard ranks by `totalRaised * (trustScore / 100)`, not raw dollars.


## Instrumentation

| Event | Why |
|---|---|
| `page_view` | Funnel analysis: community -> campaign -> donate |
| `donate_click` / `donate_complete` | Conversion intent and completion |
| `share_click` | Viral coefficient measurement |
| `scroll_depth` | Content engagement - do donors read the story? |
| `web_vital` | LCP/FID/CLS/INP/TTFB performance budget |
| `error` | Unhandled errors + promise rejections |

## Architecture

### System Overview

```
Browser ──► Cloudflare Workers
              ├── Static assets (Vite build output)
              └── Hono API ──► D1 (SQLite at edge)
```

A single Cloudflare Worker serves both the SPA and the API. No separate backend deployment, no origin server. The Worker's `assets` binding serves static files; unmatched routes fall back to `index.html` for client-side routing. API routes (`/api/*`) are handled by Hono before asset resolution.

### Frontend

React 19 with Vite 7 and React Router 7. Route-level code splitting via `React.lazy` for secondary pages; homepage is eagerly bundled to avoid the landing page waterfall. `PrefetchLink` warms the fetch cache on hover for instant client-side navigation. The `@/` path alias maps to `src/`.

**Optimistic UI:** The donate modal shows success immediately and POSTs to `/api/donations` fire-and-forget. The donation appears in the feed before the server confirms.

### Backend

Hono on Cloudflare Workers with D1 (SQLite at the edge). Four route modules:

| Route | Endpoints | Notes |
|-------|-----------|-------|
| `/api/profiles` | `GET /`, `GET /:id`, `POST /:id/follow` | Follow is optimistic increment |
| `/api/campaigns` | `GET /`, `GET /:id` | Filterable by `?status=` and `?organizerId=` |
| `/api/donations` | `GET /`, `POST /` | POST atomically updates campaign raised amount via `db.batch` |
| `/api/community` | `GET /` | No table - aggregates computed on read via SQL joins |

D1 schema: 4 tables (`profiles`, `campaigns`, `donations`, `ab_events`). Seeded via `wrangler d1 execute fundforge_db --file=worker/db/seed.sql`. `transforms.ts` converts snake_case DB rows to camelCase API shapes.

### Cross-Page Data Consistency

The core challenge: an organizer on the campaign page must show the same data on their profile page. Solved through referential integrity - `campaign.organizerId` foreign-keys to `profile.id`, `donation.campaignId` to `campaign.id`. Community leaderboard and trending data are computed from the same underlying tables, not duplicated.

### Performance Architecture

Three techniques that stack to deliver SSR-quality paint without SSR complexity:

1. **Inline data preloading** - The Worker queries D1 at the edge and injects results as `window.__PRELOAD__` via `HTMLRewriter`. React reads it in `useState`'s lazy initializer (not `useEffect`), so the very first render has real data. No skeleton flash, no layout shift.

2. **No code-split waterfall on landing** - The homepage is eagerly bundled with the main chunk. Other routes remain lazy-loaded. This eliminates the sequential waterfall: `main JS → parse → discover route → fetch chunk → render`.

3. **Hover prefetch** - `PrefetchLink` fires API fetches on `pointerenter`. The ~200ms between hover and click is enough for edge-served responses to arrive. Client-side navigation feels instant because data is already cached when the page mounts.

### Why Vite + Hono, Not Next.js

The spec says "React / Next.js preferred" and "AWS preferred." We chose differently:

- **Vite over Next.js:** Faster DX iteration in a 1-week sprint. No SSR complexity since trust/campaign data is pre-seeded fixtures, not user-generated. The inline preload architecture achieves SSR-quality paint without hydration, server components, or framework lock-in.
- **Cloudflare Workers + D1 over AWS:** Zero-config SQLite at the edge with no cold starts. D1 is colocated with the Worker - zero network hop for queries. `HTMLRewriter` enables the inline preload pattern natively.
- **Hono over Express/Fastify:** Lightweight edge-first API framework. Same fetch API as Workers. Single Worker serves both SPA and API - one `wrangler deploy`.

### Key Trade-offs

- **Edge SQLite over Postgres:** Good enough for a demo dataset; wouldn't scale to millions of rows without read replicas.
- **Single Worker over separate API:** Simpler deployment, but API and assets share the same Worker limits.
- **Optimistic donations over confirmed:** Better UX for a demo. In production you'd want server confirmation before showing success.

## Project Structure

```
src/
  components/ui/              # shadcn/ui components (Button, Card, Dialog, etc.)
  components/                 # SiteHeader, DonateModal, ErrorBoundary, RevealOnScroll
  lib/useData.js              # Data hooks (fetch from /api/*)
  lib/                        # format.js, utils.js, analytics.js, useAnalytics.js
  pages/                      # HomePage, CampaignPage, CommunityPage, ProfilePage
  App.jsx                     # Router + lazy code splitting
worker/                       # Hono API + D1 database
```

## Behavioral Economics

Each UI pattern maps to a named persuasion mechanic:

- **Goal-gradient**: Progress bars accelerate giving as campaigns near completion
- **Anchoring**: "Most donors give $74" text near donate CTA
- **Bandwagon**: Staggered donation feed animations imply activity
- **Competitive altruism**: Leaderboard ranking drives organizer engagement
- **Stretch goals**: Secondary progress bar keeps momentum after 100%
- **Matching sponsors**: 2x multiplier badge changes donor payoff calculus

## Links

- [Live Demo](https://fundforge.tomfuertes.workers.dev)
