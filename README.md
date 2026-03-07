# FundForge

Premium crowdfunding experience built with AI-accelerated development. Three interconnected pages - Fundraiser Campaign, Community Hub, and User Profile - forming a cohesive trust-driven donation platform.

## Pages

- **Fundraiser Campaign** - Editorial story layout with sticky donation panel, organizer trust signals, donation feed, progress tracking
- **Community Hub** - Bento grid with aggregate impact metrics, trending campaigns, ranked leaderboard with momentum indicators
- **User Profile** - Identity dashboard with composite trust score, campaign history, verification badges, reputation breakdown

## Design System

Built on a premium editorial design language:

| Token | Value | Usage |
|---|---|---|
| Primary | `#0F3C32` Deep Forest Green | Anchors credibility, headings, navigation |
| Secondary | `#E8F3F1` Mint Foam | Card backgrounds, soft surfaces |
| Accent | `#D97706` Amber | Conversion actions: donate, share, follow CTAs |
| Headings | Libre Baskerville (serif) | All h1-h6 elements |
| Body | Manrope (sans-serif) | Paragraphs, labels, UI text |
| Mono | JetBrains Mono | Code snippets, token labels |

## Project Structure

```
.
├── CLAUDE.md              # AI assistant context and conventions
├── README.md              # This file
├── fundforge.md           # Full project spec and requirements
├── spec.md                # Original problem statement
└── design/                # Reference design repo (read-only)
    ├── design_guidelines.json   # Design tokens and component specs
    ├── frontend/
    │   └── src/
    │       ├── components/
    │       │   ├── ui/          # 40+ shadcn/ui components
    │       │   └── showcase/    # Reference page implementations
    │       ├── hooks/
    │       └── index.css        # Tailwind + CSS variable config
    └── backend/
        └── server.py            # FastAPI + MongoDB starter
```

## Getting Started

```bash
# TODO: Project scaffolding not yet created
# Stack and setup instructions will be added after Pre-Search
```

## Instrumentation

Metrics captured:
- **Page views** - page name, timestamp, referrer, viewport
- **Conversion events** - donate clicks, shares, follows with campaign context
- **Web Vitals** - LCP, FID, CLS per page
- **Error tracking** - JS errors with stack trace, page context, session ID
- **Engagement** - scroll depth, time on donation panel, leaderboard interactions

## Links

- [Project Spec](./fundforge.md)
- [Design Tokens](./design/design_guidelines.json)
- [Reference Showcase](./design/frontend/src/components/showcase/ShowcasePage.jsx)
