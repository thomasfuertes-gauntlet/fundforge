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
cd gofundme-interview/app
npm ci

# Development
npx vite          # http://localhost:5173

# Production build
npx vite build    # outputs to app/dist/

# Deploy (requires wrangler auth)
npm run deploy    # builds + deploys to Cloudflare Workers
```

**Requirements:** Node 18+, npm 9+

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + React Router 7 |
| Styling | Tailwind 3 + shadcn/ui + Radix primitives |
| Data | JSON fixtures in `app/src/data/` (no backend) |
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

JSON fixtures in `app/src/data/` serve as the single source of truth:

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

## Project Structure

```
app/                          # Vite React project
  src/
    components/ui/            # shadcn/ui components (Button, Card, Dialog, etc.)
    components/               # SiteHeader, DonateModal, ErrorBoundary, RevealOnScroll
    data/                     # JSON fixtures + lookup helpers
    lib/                      # format.js, utils.js, analytics.js, useAnalytics.js
    pages/                    # HomePage, CampaignPage, CommunityPage, ProfilePage
    App.jsx                   # Router + lazy code splitting
design/                       # Reference design repo (read-only)
fundforge.md                  # Full project spec and requirements
spec.md                       # Original problem statement
stretch.md                    # Behavioral economics analysis
```

## Behavioral Economics

Each UI pattern maps to a named persuasion mechanic (see [stretch.md](./stretch.md)):

- **Goal-gradient**: Progress bars accelerate giving as campaigns near completion
- **Anchoring**: "Most donors give $74" text near donate CTA
- **Bandwagon**: Staggered donation feed animations imply activity
- **Competitive altruism**: Leaderboard ranking drives organizer engagement
- **Stretch goals**: Secondary progress bar keeps momentum after 100%
- **Matching sponsors**: 2x multiplier badge changes donor payoff calculus

## Links

- [Full Spec](./fundforge.md) - Requirements, build strategy, pre-search checklist
- [Design Tokens](./design/design_guidelines.json) - Complete token system
- [Reference Showcase](./design/frontend/src/components/showcase/ShowcasePage.jsx) - Design reference
