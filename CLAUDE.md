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

## Stack (reference uses, we may adapt)

See fundforge.md "Technical Stack" for full options. Reference repo uses:
- Frontend: React 19 + CRA + CRACO + Tailwind 3 + shadcn/ui + React Router
- Data layer: JSON fixtures in `data/` (campaigns, profiles, donors, trust scores)
- Analytics: instrumentation (page views, conversion events, Web Vitals, error tracking)

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

### Gotchas
- `design/` is a reference repo, not our codebase. Extract patterns, don't build inside it.
- `design_guidelines.json` has `instructions_to_main_agent` - these are for the reference builder, not us.
- Card hover shadow in design_guidelines.json uses green-tinted rgba(15,60,50,0.08) - normalized during this session.
