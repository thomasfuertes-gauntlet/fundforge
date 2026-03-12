# FundForge

Premium crowdfunding experience built with AI-accelerated development. Three interconnected pages - Fundraiser Campaign, Community Hub, and User Profile - forming a cohesive trust-driven donation platform.

**Live:** [fundforge.tomfuertes.workers.dev](https://fundforge.tomfuertes.workers.dev)

## Pages

- **Fundraiser Campaign** (`/campaign/:id`) - Editorial story layout with sticky donation panel, organizer trust signals, donation feed, progress tracking, stretch goals, matching sponsors
- **Community Hub** (`/community`) - Bento grid with aggregate impact metrics, trending campaigns with momentum badges, ranked leaderboard using trust-weighted scoring
- **User Profile** (`/profile/:id`) - Identity dashboard with composite trust score breakdown, verification tiers, campaign history, network impact visualization

## Getting Started

```bash
# Clone and install
git clone https://github.com/tomfuertes/gofundme-interview.git
cd gofundme-interview
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
| Data | D1 database (SQLite) + JSON fixture fallbacks in `src/data/` |
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

## Data Architecture

JSON fixtures in `src/data/` seed the D1 database:

- **4 organizer profiles** with trust data, verification tiers, bios
- **26 campaigns** (7 active + 17 funded + 2 unfunded) with stories, testimonials, updates
- **15 recent donations** with messages and timestamps
- **Precomputed community aggregates** - leaderboard, trending, metrics

Cross-references: `campaign.organizerId` -> `profile.id`, `donation.campaignId` -> `campaign.id`. Helpers in `data/index.js` (`getProfile`, `getCampaign`, `getCampaignsByOrganizer`, `getDonationsByCampaign`).

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

React 19 with Vite 7 and React Router 7. Code-split via `React.lazy` at the route level - each page is a separate chunk. The `@/` path alias maps to `src/`.

**Data loading pattern:** `useData` hooks initialize with JSON fixture data for instant render, then fetch from `/api/*` in the background. If the API fails, fixtures remain visible. This gives zero-loading-state UX while keeping the door open for live data.

**Optimistic UI:** The donate modal shows success immediately and POSTs to `/api/donations` fire-and-forget. The donation appears in the feed before the server confirms.

### Backend

Hono on Cloudflare Workers with D1 (SQLite at the edge). Four route modules:

| Route | Endpoints | Notes |
|-------|-----------|-------|
| `/api/profiles` | `GET /`, `GET /:id`, `POST /:id/follow` | Follow is optimistic increment |
| `/api/campaigns` | `GET /`, `GET /:id` | Filterable by `?status=` and `?organizerId=` |
| `/api/donations` | `GET /`, `POST /` | POST atomically updates campaign raised amount via `db.batch` |
| `/api/community` | `GET /` | No table - aggregates computed on read via SQL joins |

D1 schema: 3 tables (`profiles`, `campaigns`, `donations`). Seeded from JSON fixtures via `npm run seed:generate`. `transforms.ts` converts snake_case DB rows to camelCase API shapes.

### Cross-Page Data Consistency

The core challenge: an organizer on the campaign page must show the same data on their profile page. Solved through referential integrity - `campaign.organizerId` foreign-keys to `profile.id`, `donation.campaignId` to `campaign.id`. Community leaderboard and trending data are computed from the same underlying tables, not duplicated.

### Key Trade-offs

- **Edge SQLite over Postgres/Supabase:** D1 is colocated with the Worker - zero network hop for queries. Good enough for a demo dataset; wouldn't scale to millions of rows without read replicas.
- **Fixture fallbacks over loading spinners:** Users see content immediately. Trade-off is stale data on first paint if the DB has diverged from fixtures.
- **Single Worker over separate API:** Simpler deployment (one `wrangler deploy`), but means API and assets share the same Worker limits.
- **Optimistic donations over confirmed:** Better UX for a demo. In production you'd want server confirmation before showing success.

## Project Structure

```
src/
  components/ui/              # shadcn/ui components (Button, Card, Dialog, etc.)
  components/                 # SiteHeader, DonateModal, ErrorBoundary, RevealOnScroll
  data/                       # JSON fixtures + lookup helpers
  lib/                        # format.js, utils.js, analytics.js, useAnalytics.js
  pages/                      # HomePage, CampaignPage, CommunityPage, ProfilePage
  App.jsx                     # Router + lazy code splitting
worker/                       # Hono API + D1 database
spec.md                       # Original problem statement
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
