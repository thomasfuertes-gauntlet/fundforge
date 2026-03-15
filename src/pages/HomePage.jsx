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
  MoveRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Heart,
  BarChart3,
} from "lucide-react";

const PAGES = [
  {
    to: "/campaign/campaign-1",
    label: "Campaign",
    icon: Flame,
    description: "See where every dollar goes. Line-item budgets, organizer track records, and a live donation feed that builds social proof.",
  },
  {
    to: "/community",
    label: "Community",
    icon: Users,
    description: "Who's raising, what's trending, and how the ecosystem is growing. Impact measured through trust, not just dollars.",
  },
  {
    to: "/profile/profile-1",
    label: "Profile",
    icon: User,
    description: "Every organizer carries a trust score with visible math. Fulfillment history, update consistency, and repeat donor confidence.",
  },
];

const TRUST_INPUTS = [
  { label: "Fulfillment history", weight: "40%", icon: Target },
  { label: "Update consistency", weight: "30%", icon: BarChart3 },
  { label: "Repeat donor confidence", weight: "30%", icon: Heart },
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
                Donors see where money goes, whether organizers deliver,
                and why others keep coming back. Every data point is real,
                every page is connected, every score shows its math.
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
                <Link to="/community">
                  Explore the community
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Config card with live stats */}
          <div className="section-reveal stagger-2 space-y-6">
            <Card className="glass-panel overflow-hidden border-white/60 bg-white/75">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-eyebrow">Community impact</p>
                    <h3 className="mt-2 text-2xl font-serif text-foreground">
                      Real numbers, real campaigns.
                    </h3>
                  </div>
                  <Badge className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
                    Live
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <CountStat end={raisedInK} prefix="$" suffix="K" label="Total raised across all campaigns." />
                  <CountStat end={aggregates.activeCampaigns} label="Active campaigns with live progress." />
                  <CountStat end={avgTrust} suffix=" / 100" label="Average organizer trust score." />
                </div>
              </CardContent>
            </Card>
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

    </div>
  );
}
