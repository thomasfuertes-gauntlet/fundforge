# PRD

## Original Problem Statement
Focus on the tone and color palette and style guide. The results should be a component page.

1. Establish a "Design System as an API"
AI can generate beautiful screens, but if you generate the Profile, Campaign, and Community pages separately, they will look like they belong to three different apps. AI needs constraints.

The Approach: Before generating any UI, use an AI assistant (like Claude or ChatGPT) to define a strict design system.

The Prompt: "I am building a crowdfunding platform clone. Generate a comprehensive design system configuration using Tailwind CSS. Include a trustworthy color palette (greens/blues), clear typography hierarchy, and consistent border-radius/spacing tokens."

Why it works for you: Treating design as a set of variables (tokens) makes it feel like backend configuration. You feed this Tailwind config into your AI UI generators so everything it spits out perfectly matches your brand.

2. Use the "Sandwich Method" for Generative UI
The 2026 standard for AI design is the "Sandwich Method": Human Context → AI Generation → Human Refinement.

Step 1: The Campaign Page (Focus on Conversion)
Step 2: The Community Page (Focus on Gamification)
Step 3: The Profile Page (Focus on Trust)

## User Choices
- Single component showcase
- Static UI demo
- Green, blue, calm, credible
- Premium marketing/editorial
- Fully responsive

## Architecture Decisions
- Built a frontend-only single-page showcase instead of separate pages
- Used the generated design system as the styling source of truth
- Kept Tailwind tokens aligned through global CSS variables and font families
- Structured the page into four sections: hero/design-system intro, tokens, campaign, community, and profile
- Used shadcn/ui primitives (Button, Card, Badge, Avatar, Progress) for consistency and testability
- No backend/domain logic added because the requested output is a static component page

## What's Implemented
- Replaced the starter app with a polished editorial crowdfunding component showcase
- Added premium visual language: Libre Baskerville + Manrope, green/blue palette, soft gradients, glass panel, card hover motion, responsive layouts
- Implemented a design system section with palette, typography, spacing/radius rules, and code-style token snippet
- Implemented campaign showcase with hero image, organizer trust block, progress bar, donate CTA, and recent donations
- Implemented community showcase with aggregate metrics, trending badges, and leaderboard
- Implemented profile showcase with trust score panel, reputation metrics, and historical campaign cards
- Added comprehensive data-testid coverage for core interactive and user-facing elements
- Self-tested with screenshots and fixed CTA test-id consistency gap reported by testing

## Prioritized Backlog
### P0
- Add downloadable/exportable design token JSON or Tailwind config block
- Add mobile-specific navigation treatment for section jumps

### P1
- Add light interactive states for token switching and component variants
- Add alternate crowdfunding themes using the same layout API
- Add richer image art direction and section-specific content presets

### P2
- Add copy customization controls for founders/design teams
- Add component documentation notes for handoff to developers
- Add comparison view for campaign/community/profile consistency checks

## Next Tasks
- Turn this showcase into a reusable component library page with variant controls
- Add a second brand theme to prove the system can scale without redesigning layouts
- Add downloadable design assets/snippets for handoff
