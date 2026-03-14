import { Link } from "react-router-dom";
import { ab } from "@/lib/ab";
import { usePageView } from "@/lib/useAnalytics";
import useCountUp from "@/lib/useCountUp";
import { useCommunity, useProfiles } from "@/lib/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Users,
  User,
  ArrowRight,
  ArrowUpRight,
  MoveRight,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  Target,
  Heart,
  BarChart3,
  Leaf,
  Sparkles,
} from "lucide-react";

const PAGES = [
  {
    to: "/campaign/campaign-1",
    label: "Campaign",
    icon: Flame,
    description: "Editorial story layout with anchoring, goal-gradient urgency, stretch goals, and matching sponsors.",
  },
  {
    to: "/community",
    label: "Community",
    icon: Users,
    description: "Bento leaderboard ranked by trust-weighted score, trending momentum badges, and aggregate impact.",
  },
  {
    to: "/profile/profile-1",
    label: "Profile",
    icon: User,
    description: "Transparent trust breakdown with verification tiers, campaign history, and network impact.",
  },
];

const TRUST_PILLARS = [
  { icon: ShieldCheck, label: "Composite trust scoring" },
  { icon: BarChart3, label: "Full-funnel A/B analytics" },
  { icon: CircleDollarSign, label: "Behavioral economics patterns" },
];

const TRUST_INPUTS = [
  { label: "Fulfillment history", weight: "40%", icon: Target },
  { label: "Update consistency", weight: "30%", icon: BarChart3 },
  { label: "Repeat donor confidence", weight: "30%", icon: Heart },
];

const PALETTE_TOKENS = [
  { name: "Deep Forest Green", value: "#0F3C32", note: "Primary. Evokes stability, wealth, and nature." },
  { name: "Mint Foam", value: "#E8F3F1", note: "Secondary. Soft background for contrast." },
  { name: "Amber", value: "#D97706", note: "Accent. Warm, urgent action color for CTAs." },
  { name: "Gray 900", value: "#111827", note: "Text primary. Never pure #000." },
];

const TYPE_SPEC = [
  { label: "Display heading", style: "text-4xl font-bold font-serif tracking-tight", preview: "Crowdfunding, framed as trust." },
  { label: "Section heading", style: "text-2xl font-semibold font-serif", preview: "Three interconnected pages." },
  { label: "Body text", style: "text-base leading-relaxed font-sans", preview: "Campaign, Community, and Profile share data, tokens, and a composite trust model." },
];

function CountStat({ end, prefix = "", suffix = "", label }) {
  const [ref, display] = useCountUp(end, { prefix, suffix });
  return (
    <div ref={ref} className="rounded-[1.5rem] border border-secondary bg-secondary/70 p-4">
      <p className="text-2xl font-serif text-primary">{display}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
    </div>
  );
}

export default function HomePage() {
  usePageView("home");
  const altHeadline = ab('headline-copy');
  const { data: community } = useCommunity();
  const { data: profiles } = useProfiles();

  if (!community || !profiles)
    return (
      <div className="app-shell min-h-screen bg-background">
        <div className="app-shell__orb app-shell__orb--left" />
        <div className="app-shell__orb app-shell__orb--right" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
                <div className="space-y-3">
                  <div className="h-12 w-4/5 animate-pulse rounded-lg bg-muted" />
                  <div className="h-12 w-3/5 animate-pulse rounded-lg bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-44 animate-pulse rounded-full bg-muted" />
                <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
            <div className="h-80 animate-pulse rounded-xl bg-muted/60" />
          </div>
        </div>
      </div>
    );

  const { aggregates } = community;
  const raisedInK = Math.round(aggregates.totalRaised / 1_000);
  const avgTrust = Math.round(
    profiles.reduce((sum, p) => sum + p.trust.score, 0) / profiles.length
  );

  return (
    <div className="app-shell min-h-screen bg-background">
      <div className="app-shell__orb app-shell__orb--left" />
      <div className="app-shell__orb app-shell__orb--right" />

      {/* ─── Hero: 2-column layout matching ShowcasePage ─── */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left: Headline + CTAs + Trust Pillars */}
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="section-eyebrow">
                GoFundMe reimagined
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl lg:text-[4.6rem]">
                {altHeadline ? (
                  <>What if <span className="text-primary">reputation</span> drove donations, not just stories?</>
                ) : (
                  <>Crowdfunding where <span className="text-primary">trust</span> is the product.</>
                )}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-lg">
                Three connected pages with a composite trust score, full-funnel A/B testing,
                and behavioral economics baked into every conversion surface.
                Built in one week with AI-accelerated development.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                variant="accent"
                size="lg"
                className="shadow-[0_18px_45px_rgba(217,119,6,0.22)]"
              >
                <Link to="/campaign/campaign-1">
                  See a live campaign
                  <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link to="/dashboard">
                  View A/B dashboard
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {TRUST_PILLARS.map(({ icon: Icon, label }) => (
                <Card key={label} className="editorial-card border-white/70 bg-white/80">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-full bg-secondary p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Config card with live stats */}
          <div className="section-reveal stagger-2 space-y-6">
            <Card className="glass-panel overflow-hidden border-white/60 bg-white/75">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-eyebrow">Live from D1</p>
                    <h3 className="mt-2 text-2xl font-serif text-foreground">
                      Real data, edge-first.
                    </h3>
                  </div>
                  <Badge className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
                    Cloudflare Workers
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <CountStat end={raisedInK} prefix="$" suffix="K" label="Total raised across all campaigns in the ecosystem." />
                  <CountStat end={aggregates.activeCampaigns} label="Active campaigns with live progress, donations, and updates." />
                  <CountStat end={avgTrust} suffix=" / 100" label="Average trust score across verified organizers." />
                </div>

                <div className="code-panel">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-muted-foreground">{`// Trust score (visible on every surface)
trust = fulfillment(40%) + updates(30%)
      + repeat_donors(30%)

// A/B funnel: impression → scroll
//   → donate_click → donate_complete
// Dual-write: D1 (query) + sendBeacon`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ─── Design Tokens Section ─── */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-16">
        <div className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="section-eyebrow">Design system</p>
            <h2 className="text-3xl font-serif text-foreground sm:text-4xl">
              Editorial craft, not generic SaaS.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Serif headings signal credibility. Amber converts. Deep green anchors trust.
              Every token is shared across all three pages for visual coherence.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            {/* Color Palette */}
            <Card className="editorial-card border-white/70 bg-white/90">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-serif text-foreground">Core color palette</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {PALETTE_TOKENS.map((token) => (
                    <div key={token.value} className="rounded-[1.5rem] border border-border/80 p-4">
                      <div
                        className="h-16 w-full rounded-xl"
                        style={{ backgroundColor: token.value }}
                      />
                      <div className="mt-4 space-y-1">
                        <p className="text-lg font-semibold text-foreground">{token.name}</p>
                        <p className="font-mono text-sm text-muted-foreground">{token.value}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{token.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {/* Typography */}
              <Card className="editorial-card border-white/70 bg-white/90">
                <CardContent className="space-y-5 p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-sky-800" />
                    <h3 className="text-xl font-serif text-foreground">Typography hierarchy</h3>
                  </div>
                  <div className="space-y-4">
                    {TYPE_SPEC.map((spec) => (
                      <div key={spec.label} className="rounded-[1.5rem] border border-border/80 bg-muted/40 p-4">
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          {spec.label}
                        </p>
                        <p className={`mt-3 ${spec.style} text-foreground`}>
                          {spec.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Spacing Rules */}
              <Card className="editorial-card border-white/70 bg-gradient-to-br from-primary via-primary to-gradient-end text-primary-foreground">
                <CardContent className="space-y-5 p-6 lg:p-8">
                  <h3 className="text-xl font-serif">Spacing + radius rules</h3>
                  <div className="grid gap-3 text-sm leading-6 text-primary-foreground/80 sm:grid-cols-2">
                    <p>Sections breathe at 6rem to 8rem vertical spacing.</p>
                    <p>Cards use 1.25rem to 1.75rem radius for softness without blur.</p>
                    <p>Responsive grids stack early to avoid horizontal overflow.</p>
                    <p>Call-to-action moments reserve amber for contrast and urgency.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Ecosystem Cards ─── */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-16">
        <p className="section-eyebrow mb-2">The ecosystem</p>
        <p className="mb-8 max-w-xl text-2xl font-serif leading-snug text-foreground">
          Three pages, one feedback loop.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {PAGES.map(({ to, label, icon: Icon, description }) => (
            <Link key={to} to={to} className="block">
              <Card className="editorial-card h-full border-white/70 bg-white/90">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Trust Model ─── */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow mb-2">Trust model</p>
            <p className="mb-4 text-2xl font-serif leading-snug text-foreground">
              Reputation is visible, measurable, and human.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every organizer carries a composite trust score derived from three
              weighted inputs. The score flows across all pages: it ranks
              leaderboard position on Community, anchors credibility on Campaign,
              and breaks down transparently on Profile.
            </p>
            <div className="mt-6 space-y-3">
              {TRUST_INPUTS.map(({ label, weight, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="ml-auto text-sm font-medium text-muted-foreground">
                    {weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card
            className="overflow-hidden border-white/70 bg-gradient-to-br from-primary via-primary to-gradient-end text-primary-foreground"
          >
            <CardContent className="flex flex-col justify-between gap-6 p-6 lg:p-8">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
                    Live trust scores
                  </p>
                </div>
                <p className="mt-3 text-lg font-serif leading-snug">
                  {profiles.length} organizers verified across{" "}
                  {aggregates.activeCampaigns} active campaigns.
                </p>
              </div>
              <div className="space-y-4">
                {profiles.map((p) => (
                  <Link
                    key={p.id}
                    to={`/profile/${p.id}`}
                    className="block rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-sm font-serif">
                        {p.trust.score}
                      </span>
                    </div>
                    <Progress
                      value={p.trust.score}
                      className="mt-2 h-1.5 bg-white/20"
                    />
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
                <TrendingUp className="h-3.5 w-3.5" />
                Scores update with each campaign outcome
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Built With ─── */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-16">
        <p className="section-eyebrow mb-2">Built with</p>
        <div className="flex flex-wrap gap-2">
          {[
            "React 19",
            "Vite 7",
            "Tailwind CSS",
            "shadcn/ui",
            "React Router",
            "Cloudflare Workers",
            "Hono",
            "D1 (SQLite)",
          ].map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
