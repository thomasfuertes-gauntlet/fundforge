import { Link } from "react-router-dom";
import { usePageView } from "@/lib/useAnalytics";
import { community, profiles } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Users,
  User,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Heart,
  BarChart3,
} from "lucide-react";

const { aggregates } = community;

function formatCurrency(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toLocaleString()}`;
}

const PAGES = [
  {
    to: "/campaign/campaign-1",
    label: "Campaign",
    icon: Flame,
    description: "Conversion through goal-gradient, social proof, and donor momentum.",
  },
  {
    to: "/community",
    label: "Community",
    icon: Users,
    description: "Competitive altruism via leaderboards, trending signals, and aggregate impact.",
  },
  {
    to: "/profile/profile-1",
    label: "Profile",
    icon: User,
    description: "Trust composition built from fulfillment, transparency, and repeat support.",
  },
];

const TRUST_INPUTS = [
  { label: "Fulfillment history", weight: "40%", icon: Target },
  { label: "Update consistency", weight: "30%", icon: BarChart3 },
  { label: "Repeat donor confidence", weight: "30%", icon: Heart },
];

export default function HomePage() {
  usePageView("home");
  const avgTrust = Math.round(
    profiles.reduce((sum, p) => sum + p.trust.score, 0) / profiles.length
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24 lg:px-16">
        <Badge variant="secondary" className="mb-4">
          Interview project
        </Badge>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Crowdfunding built on{" "}
          <span className="text-primary">trust</span>
        </h1>
        <p className="mt-3 max-w-2xl text-xl font-serif leading-snug text-foreground/80">
          A closed-loop ecosystem where reputation drives donations, not just
          stories.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          FundForge explores how trust signals, social proof, and behavioral
          economics can reshape crowdfunding. Three interconnected pages share
          data, design tokens, and a composite trust model.
        </p>

        {/* Quick stats */}
        <div className="mt-10 flex flex-wrap gap-6">
          <div>
            <p className="text-3xl font-serif text-primary">
              {formatCurrency(aggregates.totalRaised)}
            </p>
            <p className="text-sm text-muted-foreground">total raised</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-primary">
              {aggregates.activeCampaigns}
            </p>
            <p className="text-sm text-muted-foreground">active campaigns</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-primary">{avgTrust}</p>
            <p className="text-sm text-muted-foreground">avg trust score</p>
          </div>
          <div>
            <p className="text-3xl font-serif text-primary">
              {profiles.length}
            </p>
            <p className="text-sm text-muted-foreground">verified organizers</p>
          </div>
        </div>
      </div>

      {/* Three Pages */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-16">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          The ecosystem
        </h2>
        <p className="mb-8 max-w-xl text-2xl font-serif leading-snug text-foreground">
          Three pages, one feedback loop.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {PAGES.map(({ to, label, icon: Icon, description }) => (
            <Link key={to} to={to} className="block">
              <Card className="h-full border-white/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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

      {/* Trust Model */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Explanation */}
          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Trust model
            </h2>
            <p className="mb-4 text-2xl font-serif leading-snug text-foreground">
              Reputation is visible, measurable, and human.
            </p>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
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

          {/* Live preview card */}
          <Card
            className="overflow-hidden border-white/70 bg-gradient-to-br from-primary via-primary to-sky-900 text-primary-foreground"
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

      {/* Stack */}
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-16">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Built with
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "React 19",
            "Vite 7",
            "Tailwind CSS",
            "shadcn/ui",
            "React Router",
            "Cloudflare Workers",
            "JSON fixtures",
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
