# FundForge - GoFundMe Interview Project

## Project Overview

One-week sprint to build three interconnected crowdfunding pages (Fundraiser, Community, Profile) with AI-accelerated development. Private repo at `tomfuertes/gofundme-interview`.

## Architecture

- **Three pages:** Fundraiser Campaign, Community Hub, User Profile - must share data and design tokens
- **Core challenge:** Cross-page data consistency (organizer on campaign page = same data on profile page)
- **Trust system:** Composite score (0-100) from fulfillment rate, update consistency, repeat donor confidence
- **Identity model:** Anonymous sessions with generated UUID for error tracking. Follow counts and social proof are display-only (pre-seeded data). No real auth.

### Design Tokens

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

- `spec.md` - Original problem statement from Gauntlet

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
- **Data layer:** D1 database (seeded from JSON fixtures in `src/data/`). Hooks in `src/lib/useData.js` fetch from `/api/*` with fixture fallbacks.
- **Analytics:** instrumentation (page views, conversion events, Web Vitals, error tracking)
- **Dev server:** `npx vite` (port 5173) + `npx wrangler dev` (port 8787). Vite proxies `/api` to wrangler.

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

## Deliverables

- GitHub repo with clean commit history + README
- Demo video (3-5 min)
- Pre-Search document (AI conversation transcript)
- Architecture document (1-2 pages)
- AI cost analysis (dev spend + production projections)
- Deployed application (public URL)
- Social post tagging @GauntletAI

## Performance Targets

- LCP < 2.5s (on 4G connection), FID < 100ms, CLS < 0.1, TTI < 3.5s
- API p95 < 500ms
- Lighthouse >= 85

## Session Learnings

### Trust Score Formula
`trust_score = (fulfillment_rate * 0.4) + (update_consistency * 0.3) + (repeat_donor_confidence * 0.3)` - all inputs 0-100%, output rounded to integer.

### Doc Hierarchy
- `spec.md` is source of truth (never modify)
- `CLAUDE.md` is AI context (index + shortcuts)
- `README.md` is human-facing summary

### Deployment
- **URL:** https://fundforge.tomfuertes.workers.dev
- **Platform:** Cloudflare Workers (static assets, not Pages). `npm run deploy` builds + deploys.
- **SPA fallback:** `not_found_handling: "single-page-application"` in wrangler.jsonc. Do NOT use `_redirects` (causes infinite loop validation error).
- **Data scripts:** Write `.cjs` to `$TMPDIR`, run with `node` (avoids zsh `!==` escaping issues in `-e`)

### Data Field Gotcha
- Trust data is nested: `profile.trust.score`, `profile.trust.fulfillmentRate`, etc. NOT `profile.trustScore`.
- Community leaderboard has a flat `trustScore` field (duplicated for display). Don't confuse the two.

### Gotchas
- Campaign stories use `string[]` (array of paragraphs) not a single string. Render as `<p>` tags.
- `$TMPDIR` in sandbox resolves to `/tmp/claude` not the system tmpdir - use the resolved path for commit message files.
- Community aggregates are computed via SQL in `/api/community` - do not edit `community.json` directly, it's a seed artifact.

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
3. **Conversion through psychology.** Amber donate buttons, anchoring text ("Most donors give $74"), goal-gradient urgency, social proof at decision points. Every behavioral pattern has a cite-able rationale.
4. **Motion with meaning.** Progress bars animate on scroll (reveals progress), donation feed staggers in (implies activity), count-ups draw attention to impact numbers. No animation exists without a UX justification.
5. **Data coherence over volume.** Four organizers with interconnected campaigns, consistent trust scores, cross-page links that resolve. A small world that feels complete beats a large world with gaps.

### Accessibility Stance
Awareness-level for interview context. Semantic HTML, reasonable contrast ratios, keyboard-navigable modals (Radix handles this). Note a11y in interview discussion but prioritize visual polish for the demo. `prefers-reduced-motion` is a backlog candidate, not a blocker.
