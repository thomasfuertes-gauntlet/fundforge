# FundForge

*Building Premium Crowdfunding Experiences with AI-Accelerated Development*

---

## Before You Start: Pre-Search (1-2 hours)

Before you write a single line of code, complete the Pre-Search appendix at the end of this document. The Pre-Search is not optional - it is part of your final submission.

This week's methodology emphasis is **AI-accelerated development**. You will use AI tools throughout every stage of your build - from architecture decisions to component generation to content population. The Pre-Search process forces you to interrogate your assumptions about crowdfunding UX, page architecture, and integration strategy *before* you start generating code. Your Pre-Search conversation transcript should demonstrate that you used AI to stress-test your technical plan, not just to confirm what you already believed.

Save your complete AI conversation as a reference document. It will be evaluated alongside your code.

---

## Background

Crowdfunding platforms like GoFundMe, Kickstarter, and Indiegogo have evolved from simple donation pages into sophisticated trust ecosystems. GoFundMe alone has facilitated over $30 billion in donations across 250 million contributions. The difference between a campaign that raises $500 and one that raises $500,000 often comes down to three things: organizer credibility, community momentum, and conversion psychology. Modern crowdfunding surfaces are editorial products - they use typography, whitespace, social proof, and progressive disclosure to turn empathy into action. Companies like Stripe, Vercel, and Linear have demonstrated that premium UI quality is itself a trust signal. The bar is high.

You will build three interconnected pages - a **Fundraiser Campaign Page**, a **Community Hub Page**, and a **User Profile Page** - that together form a cohesive crowdfunding experience. Your core technical challenge is making these three surfaces feel like one product: shared design tokens, consistent trust signals, seamless navigation, and real data flowing between them. You must use AI tools to accelerate your development, generate realistic content, and instrument your pages for observability. The methodology emphasis is shipping a polished, integrated experience in one week using AI as a force multiplier, not a crutch.

---

## Gate

**Gate: Project completion required for Austin admission.**

---

## Project Overview

One-week sprint with three deadlines:

| Checkpoint | Deadline | Focus |
|---|---|---|
| Pre-Search | Before coding begins | Architecture decisions, stack selection, AI cost planning |
| MVP | Tuesday (24 hours from start) | Core pages rendering, navigation working, deployed |
| Early Submission | Friday (4 days) | Full integration, instrumentation, community features |
| Final Submission | Sunday (7 days) | Polish, performance, documentation, demo video |

---

## MVP Requirements (24 Hours)

Hard gate. All items required to pass:

- [ ] Fundraiser Campaign Page renders with hero image, title, description, progress bar, and donate CTA
- [ ] Community Hub Page renders with aggregate metrics, trending campaigns list, and fundraiser leaderboard
- [ ] User Profile Page renders with avatar, bio, trust score, campaign history, and follower count
- [ ] All three pages share a consistent design system (typography, colors, spacing, component patterns)
- [ ] Navigation between all three pages works seamlessly (profile links to campaigns, campaigns link to organizer profiles, community links to both)
- [ ] Pages consume data from a structured data layer (e.g., JSON fixtures in a `data/` folder) rather than inline hardcoded values
- [ ] AI-generated realistic content populates all three pages (campaign stories, donor names, community stats)
- [ ] Basic instrumentation is in place: at least page view tracking and one custom event (e.g., donate button click)
- [ ] Responsive layout: all three pages are usable on mobile (375px) and desktop (1440px)
- [ ] Deployed and publicly accessible

**Identity model:** Use anonymous sessions with a generated UUID for error tracking and analytics. Follow counts, donor names, and social proof are display-only (pre-seeded data, not interactive). No real authentication is required.

**Donate button behavior:** Clicking the Donate button opens a donation modal with preset amount options ($25, $50, $100, $250, custom). For MVP, this is a simulated flow - the modal confirms the selection with a success toast but does not process real payments.

**A simple crowdfunding page with real trust signals beats a complex platform with broken navigation.**

---

## Core Technical Requirements

### Page Architecture

| Feature | Requirements |
|---|---|
| Fundraiser Campaign Page | Magazine-style story column with sticky donation panel; hero image, category badges, organizer card with verification history, progress bar with backer count and average gift, recent donation feed, rich text story section |
| Community Hub Page | Bento grid layout with aggregate impact metrics (total raised, total donors), trending campaigns with growth badges (displayed when weekly momentum > 20%), ranked leaderboard with avatars, trend percentages, and weekly momentum (percentage change in total raised over the last 7 days) |
| User Profile Page | Identity header with verified badge, trust score composition (fulfillment rate, update consistency, repeat donor confidence), campaign history grid with amounts and backer counts, role labels (organizer, donor) |
| Shared Navigation | Sticky header with page links, breadcrumb context, consistent brand identity across all pages |
| Design System | Shared color tokens (primary: #0F3C32, accent: #D97706, secondary: #E8F3F1), editorial typography (Libre Baskerville headings, Manrope body), consistent card radius (rounded-xl), hover micro-interactions on all cards |
| Data Integration | Structured data layer (JSON fixtures or similar) serves campaign data, donor lists, community metrics, and profile information to the frontend. Backend API is optional (V2). |

### Instrumentation & Observability

| Feature | Requirements |
|---|---|
| Page View Tracking | Every page load fires an event with page name, timestamp, referrer, and viewport size |
| Conversion Events | Donate button clicks, share actions, and profile follow clicks are tracked with context (campaign ID, amount selected, source page) |
| Performance Metrics | Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS) are captured per page |
| Error Tracking | JavaScript errors are captured with stack trace, page context, and user session ID |
| Engagement Metrics | Scroll depth on campaign pages, time spent on donation panel, leaderboard interaction (sort, filter) |
| Dashboard | A simple analytics view or log output that shows captured metrics (can be console, a /metrics endpoint, or a third-party dashboard) |

### Testing Scenarios

We will test:

1. Loading the Fundraiser Campaign Page directly via URL and verifying all sections render (hero, progress, organizer, donations, story)
2. Navigating from a campaign to the organizer's Profile Page and confirming the profile reflects the same organizer data
3. Visiting the Community Hub and clicking a leaderboard entry to navigate to that fundraiser's profile
4. Resizing the browser from 1440px to 375px and confirming no horizontal overflow, no overlapping elements, and all CTAs remain tappable
5. Clicking the Donate button and verifying the instrumentation event fires with correct campaign context
6. Loading each page on a throttled 3G connection and verifying meaningful content appears within performance targets
7. Checking that the trust score on a profile page reflects data consistent with the campaign history shown
8. Verifying that community aggregate metrics (total raised, total donors) are mathematically consistent with the campaigns displayed

### Performance Targets

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | < 2.5 seconds on 4G connection |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3.5 seconds |
| API Response Time (p95) | < 500ms for all data endpoints |
| Lighthouse Performance Score | >= 85 on all three pages |

---

## Domain-Specific Deep Section: Trust Architecture & AI Content Generation

The signature challenge of this project is building a **trust system** that feels credible and an **AI content pipeline** that populates your pages with realistic, coherent data.

### Trust System Requirements

Your trust architecture must make credibility visible across all three pages:

**Required capabilities:**

- Trust score displayed on Profile Page as a composite metric (0-100) with visible breakdown:
  - **Fulfillment rate** (40% weight): percentage of past campaigns that reached their goal and distributed funds. Input range: 0-100%.
  - **Update consistency** (30% weight): percentage of campaigns where the organizer posted at least one update per week. Input range: 0-100%.
  - **Repeat donor confidence** (30% weight): percentage of donors who have donated to this organizer more than once. Input range: 0-100%.
  - Formula: `trust_score = (fulfillment_rate * 0.4) + (update_consistency * 0.3) + (repeat_donor_confidence * 0.3)`, rounded to nearest integer.
- Campaign Page shows organizer trust signals: past campaigns funded, fulfillment rate, verification badge
- Community Hub ranks fundraisers using a combination of amount raised and trust score, not just raw dollars
- Donation feed on Campaign Page shows recency and social proof (names, amounts, timestamps)
- Profile campaign history shows outcome data: amount raised, backer count, completion status

**Implement at least 3 of the following trust enhancements:**

1. Verified organizer badge system with tiered verification levels (email, identity, track record)
2. Trust score trend visualization showing score changes over time
3. Donor testimonials or endorsements on the Campaign Page pulled from AI-generated content
4. Community-driven reputation signals (e.g., "Recommended by 12 past donors")
5. Campaign update timeline showing organizer communication cadence
6. Withdrawal transparency: visual indicator of how funds were distributed in past campaigns
7. Social graph: show mutual connections between the viewer and the organizer/donors

### AI Content Generation

You must use AI to generate realistic content for your pages. This is not about dumping lorem ipsum - it is about creating a believable crowdfunding ecosystem.

**Required AI-generated content:**

- Campaign story (500+ words, emotionally compelling, specific to the cause)
- Organizer bio with credible background details
- At least 10 donor names and realistic donation amounts with timestamps
- Community metrics that are internally consistent (total raised = sum of campaigns, average gift = total / donors)
- At least 3 complete campaign cards for the community page with titles, descriptions, and progress data

**Evaluation criteria:**

| Input | Expected Output |
|---|---|
| Campaign page load | Coherent story with specific details, not generic placeholder text |
| Profile page load | Bio, trust metrics, and campaign history that reference each other consistently |
| Community page load | Leaderboard rankings, trending campaigns, and aggregate stats that are mathematically consistent |
| Cross-page navigation | Data referenced on one page (e.g., organizer name, amount raised) matches when seen on another page |

### Trust System Performance Targets

| Metric | Target |
|---|---|
| Trust score computation | < 50ms from data fetch to rendered score |
| Content consistency | Zero contradictions across pages (same organizer shows same stats everywhere) |
| AI content quality | No obvious AI artifacts (no "delve", "tapestry", "vibrant community" filler phrases) |
| Data coherence | Aggregate community metrics match sum of individual campaign data within 1% |

---

## AI Cost Analysis (Required)

### Development & Testing Costs

Track and report the following throughout your build:

- Total LLM API spend (OpenAI, Anthropic, or other providers) for code generation and content creation
- Token usage breakdown: input tokens vs. output tokens per provider
- Number of AI-assisted code generation sessions and average tokens per session
- Cost of AI-generated content (campaign stories, donor data, profile bios)
- Image generation or stock photo API costs (if applicable)
- Any third-party API costs (analytics platforms, deployment, database hosting)

### Production Cost Projections

| Cost Category | 100 Users | 1K Users | 10K Users | 100K Users |
|---|---|---|---|---|
| Hosting / CDN | | | | |
| Database | | | | |
| AI Content Generation | | | | |
| Analytics / Instrumentation | | | | |
| Image Storage / Delivery | | | | |
| Total Monthly | | | | |

Include assumptions:
- Average number of campaigns per user (creator vs. donor ratio)
- Average page views per user session (across all three page types)
- AI content generation frequency (on-demand vs. pre-generated and cached)

---

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React (CRA or Next.js), Vue, Svelte, or SolidJS |
| Styling | Tailwind CSS + shadcn/ui (reference components provided), CSS Modules, Styled Components |
| Backend | FastAPI (Python), Express (Node.js), Next.js API Routes, or Hono (Cloudflare Workers) |
| Database | MongoDB, PostgreSQL, Supabase, PlanetScale, or SQLite (for MVP) |
| AI / LLM | OpenAI API, Anthropic API, or local models for content generation |
| Analytics | PostHog, Mixpanel, Plausible, custom event pipeline, or Web Vitals API |
| Deployment | Vercel, Netlify, Railway, Render, or Cloudflare Pages |

Use whatever stack helps you ship. Complete the Pre-Search process to make informed decisions.

**Note:** A design reference repository is provided at `design/` with 40+ shadcn/ui components, a complete design token system (`design_guidelines.json`), and a showcase page demonstrating Campaign, Community, and Profile section patterns. You are encouraged to extract components, CSS variables, and layout patterns from this reference. You do not need to use it verbatim - adapt it to your architecture.

---

## Build Strategy

### Priority Order

1. **Design system setup** - Extract tokens from `design_guidelines.json` into your Tailwind config. Fonts, colors, spacing, component patterns. Every page inherits from this.
2. **Data fixtures** - Define JSON fixtures for campaigns, profiles, donors, and trust scores in a `data/` folder. This is the foundation for cross-page consistency.
3. **Fundraiser Campaign Page** - The most complex single page. Editorial layout, progress bar, donation feed, organizer card, donate modal.
4. **Cross-page navigation** - Wire routing between campaign, profile, and community. Verify data consistency across pages.
5. **User Profile Page** - Trust score composition panel, campaign history grid, identity header.
6. **Community Hub Page** - Bento grid with aggregate metrics, leaderboard, and trending campaigns.
7. **Instrumentation layer** - Add page view tracking, conversion events, and performance metrics.
8. **Performance optimization and polish** - Lighthouse audit, image optimization, loading states, responsive fine-tuning.
9. **Backend API (V2, optional)** - If time permits, stand up an API layer to serve fixtures dynamically.

### Critical Guidance

- Start with the design system and data fixtures. If your tokens and data shapes aren't locked on day one, every page you build will need rework.
- Use the provided design reference (`design/design_guidelines.json`) to set up your Tailwind config and CSS variables on day one. Do not invent your own design system from scratch.
- JSON fixtures in a `data/` folder are the right architecture. They guarantee cross-page consistency, are trivial to generate with AI, and can be swapped for an API later if needed.
- Instrumentation is not an afterthought. Add your analytics wrapper early and fire events as you build each feature. Retrofitting instrumentation on Sunday is painful and error-prone.
- Test cross-page consistency manually every time you change data. Open all three pages and verify that names, amounts, and scores match.
- AI-generated content should be generated once, reviewed, and committed as fixtures. Do not call an LLM on every page load.

---

## Required Documentation

Submit a 1-2 page architecture document covering the following:

| Section | Content |
|---|---|
| System Architecture | Diagram or description of frontend, backend, data layer, and AI content pipeline. How do the three pages share data? |
| Trust Model Design | How is the trust score computed? What inputs feed it? How is it displayed across pages? |
| Instrumentation Strategy | What metrics do you capture, why each metric matters, and how you would use them to improve the product |
| AI Usage Log | How you used AI during development: what worked, what failed, what you would do differently |
| Design Decisions | Key tradeoffs you made (e.g., SSR vs. CSR, SQL vs. NoSQL, shared state vs. per-page fetching) and why |

---

## Submission Requirements

**Deadline: Sunday 10:59 PM CT**

| Deliverable | Requirements |
|---|---|
| GitHub Repository | Clean commit history showing progression. README with setup instructions. Code must build and run from a fresh clone. |
| Demo Video | 3-5 minutes. Walk through all three pages, demonstrate navigation between them, show instrumentation events firing, explain your trust model and AI content strategy. |
| Pre-Search Document | Complete Pre-Search appendix with your AI conversation transcript. |
| Architecture Document | 1-2 pages covering system design, trust model, instrumentation, and AI usage (see section above). |
| AI Cost Analysis | Development spend tracking and production cost projections table with assumptions. |
| Deployed Application | All three pages publicly accessible. Provide the URL. Pages must load without errors. |
| Social Post | Share your project on X/Twitter or LinkedIn. Tag @GauntletAI. Include a screenshot or short clip. |

---

## Final Note

A simple fundraiser page with real trust signals and working navigation beats a complex platform with broken data consistency and hollow metrics.

**Gate: Project completion required for Austin admission.**

---

## Appendix: Pre-Search Checklist

Complete this before writing code. Save your AI conversation as a reference document.

### Phase 1: Define Your Constraints

**1. Scale & Load**
- How many concurrent users do you expect during the demo? During evaluation? What is the maximum you should design for?
- How many campaigns, donors, and community members will exist in your data layer? Is 10 enough or do you need 100 to make the community page feel real?
- What is the expected ratio of page views across the three pages? (Campaign pages likely get 10x the traffic of profiles)
- How many donation events should your feed display in real-time vs. historically?

**2. Budget**
- What is your total budget for AI API calls during development? How will you avoid runaway costs from iterative content generation?
- Are you using free tiers for hosting, database, and analytics? What are the limits?
- If you use image generation, what is the per-image cost and how many images do you need?

**3. Timeline**
- What is the minimum viable version of each page that gets you past the MVP gate in 24 hours?
- Which of the three pages is the highest risk? Which should you build first?
- How much time should you allocate to instrumentation vs. features vs. polish?

**4. Data Sensitivity**
- Are you using real GoFundMe data or entirely synthetic data? What are the legal implications of scraping?
- If you generate donor names with AI, are any of them real people? How do you avoid this?
- Does your analytics instrumentation capture any PII? How do you handle consent?

**5. Skills & Gaps**
- Have you built a multi-page application with shared state before? What patterns do you know (context, Redux, URL state, server state)?
- Are you comfortable with the design system provided (Tailwind + shadcn/ui)? Do you need to ramp up?
- Have you integrated an analytics SDK before? Which one?

### Phase 2: Architecture Discovery

**1. Frontend Architecture**
- Single-page app with client-side routing or multi-page with server-side rendering? What are the tradeoffs for a content-heavy crowdfunding site?
- How will you share state between pages? (Campaign data shown on Community page must match the Fundraiser page)
- Will you use the provided shadcn/ui components directly or adapt them? How will you handle the editorial typography (Libre Baskerville + Manrope)?
- How will you handle image loading for campaign heroes and avatars? Lazy loading? Placeholder skeletons? Blur-up?

**2. Data Model**
- What is the relationship between campaigns, profiles, and communities? One-to-many? Many-to-many?
- How do you model the trust score? Is it a computed field or a stored value? What inputs feed it?
- How do you ensure that aggregate community metrics (total raised, total donors) stay consistent with individual campaign data?
- What does the donation feed data structure look like? Do donations reference both a campaign and a donor profile?

**3. Backend & API**
- REST or GraphQL? What are the tradeoffs for three pages that need overlapping but different slices of the same data?
- How many API endpoints do you need? What is the minimum set for MVP?
- Will you seed your database with AI-generated content at build time or serve it dynamically?
- How do you handle the "sticky donation panel" - does it need real-time updates or is polling sufficient?

**4. AI Content Pipeline**
- Which LLM will you use for content generation? What model size balances quality and cost?
- How do you ensure cross-page consistency? (If AI generates a campaign story mentioning "$84,000 raised," the progress bar must show $84,000)
- Will you generate content in a single batch (one prompt that produces all campaigns, profiles, and donors) or piecemeal?
- How do you quality-check AI output for artifacts, contradictions, and unrealistic data?

**5. Instrumentation Architecture**
- Client-side analytics (PostHog, Mixpanel) vs. custom event pipeline (beacon API + backend logging)?
- How do you track Web Vitals (LCP, FID, CLS) - native Performance API, web-vitals library, or analytics SDK?
- What is your event taxonomy? How many distinct event types do you need?
- How will you visualize or report on the captured metrics for the demo?

**6. Design System Integration**
- The reference repo uses CRA + CRACO + Tailwind 3. Will you match this stack or use something else (Next.js, Vite)?
- How will you extract design tokens from `design_guidelines.json` into your Tailwind config?
- The reference uses HSL CSS variables for shadcn/ui theming. Will you preserve this pattern or convert to hex?
- How will you handle the editorial typography hierarchy (serif headings, sans body, mono tokens)?

### Phase 3: Post-Stack Refinement

**1. Security & Failure Modes**
- What happens if your backend API is down? Do the pages show error states, cached data, or nothing?
- Are there any XSS vectors in your AI-generated content? How do you sanitize campaign stories?
- If a campaign has no donations yet, does the donation feed show an empty state or hide entirely?
- How do you handle a profile with no trust score data (new user)?

**2. Testing Strategy**
- How will you test cross-page data consistency? Manual spot checks or automated tests?
- Will you write integration tests for your API endpoints?
- How do you test responsive layouts across breakpoints? Browser DevTools, Playwright, or manual?
- How do you verify that instrumentation events fire correctly without polluting production analytics?

**3. Deployment & Infrastructure**
- Where will you deploy the frontend? The backend? Are they on the same domain or do you need CORS?
- How do you handle environment variables for API keys (LLM, analytics, database)?
- What is your CI/CD pipeline? Push-to-deploy or manual?
- How do you handle database migrations or schema changes during the week?

**4. Observability & Debugging**
- If a user reports "the community page shows wrong numbers," how do you debug it? What logs or traces would you need?
- How do you monitor API response times in production?
- What alerting would you set up if this were a real product? (Error rate thresholds, performance degradation)
- How do you distinguish between real user traffic and your own testing traffic in analytics?

**5. Performance Optimization**
- What is your image optimization strategy? Will you use next/image, Cloudinary, or manual srcset?
- How large is your JavaScript bundle? What is the biggest dependency and can you tree-shake it?
- Will you use code splitting or lazy loading for the three page routes?
- How do you handle fonts (Libre Baskerville, Manrope) - Google Fonts CDN, self-hosted, or font-display swap?
