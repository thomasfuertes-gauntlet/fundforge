import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePageView } from "@/lib/useAnalytics";
import useCountUp from "@/lib/useCountUp";
import { community, getActiveCampaigns, getProfile } from "@/data";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedProgress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Trophy,
  Flame,
  ArrowUpRight,
  Heart,
  Target,
  MessageSquare,
  CalendarDays,
  Crown,
} from "lucide-react";

const { aggregates, leaderboard, trending } = community;

function formatCurrency(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

function CommunityCounter({ end, prefix = "", suffix = "", label, className, valueClassName, labelClassName, testId }) {
  const [ref, display] = useCountUp(end, { prefix, suffix });
  return (
    <div ref={ref} className={className} data-testid={testId}>
      <p className={valueClassName}>{display}</p>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}

function CommunityCounterDonors({ donors }) {
  // Animate the decimal value (e.g. 109 for 10.9K)
  const tenths = Math.round(donors / 100);
  const [ref, display] = useCountUp(tenths);
  const raw = parseInt(display.replace(/,/g, ""), 10) || 0;
  const formatted = `${(raw / 10).toFixed(1)}K`;
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-sky-100 bg-sky-50/80 p-5"
      data-testid="community-total-donors"
    >
      <p className="text-3xl font-serif text-foreground">{formatted}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        unique donors contributing
      </p>
    </div>
  );
}

function CampaignGrid({ campaigns }) {
  const categories = useMemo(
    () => ["All", ...new Set(campaigns.map((c) => c.category))],
    [campaigns]
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Most funded");

  const filtered = useMemo(() => {
    let result = activeFilter === "All"
      ? campaigns
      : campaigns.filter((c) => c.category === activeFilter);

    if (activeSort === "Ending soon") {
      result = [...result].sort((a, b) => a.daysLeft - b.daysLeft);
    } else {
      result = [...result].sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
    }
    return result;
  }, [campaigns, activeFilter, activeSort]);

  return (
    <div className="mt-16 lg:mt-24">
      <h2 className="mb-6 text-2xl font-serif font-semibold text-foreground">
        Active campaigns
      </h2>

      {/* Filter + sort pills */}
      <div className="mb-5 flex flex-wrap items-center gap-2" data-testid="campaign-grid-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            aria-pressed={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeFilter === cat
                ? "bg-secondary text-primary"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            )}
            data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {cat}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border/60" />
        {["Most funded", "Ending soon"].map((sort) => (
          <button
            key={sort}
            aria-pressed={activeSort === sort}
            onClick={() => setActiveSort(sort)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeSort === sort
                ? "bg-secondary text-primary"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            )}
            data-testid={`sort-${sort.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {sort}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((c) => (
          <Link
            key={c.id}
            to={`/campaign/${c.id}`}
            className="block"
            data-testid={`active-campaign-${c.id}`}
          >
            <Card className="h-full overflow-hidden border-white/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={c.heroImage}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="space-y-3 p-4">
                <Badge className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary">
                  {c.category}
                </Badge>
                <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                  {c.title}
                </p>
                <AnimatedProgress
                  value={Math.min(Math.round((c.raised / c.goal) * 100), 100)}
                  className="h-2 bg-primary/15"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {formatCurrency(c.raised)}
                  </span>
                  <span>{c.daysLeft} days left</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

const LEADERBOARD_TABS = ["Top Fundraisers", "Trending"];

function LeaderboardCard() {
  const [activeTab, setActiveTab] = useState("Top Fundraisers");

  const sortedLeaderboard = useMemo(() => {
    if (activeTab === "Trending") {
      return [...leaderboard].sort((a, b) => b.weeklyTrend - a.weeklyTrend);
    }
    return leaderboard;
  }, [activeTab]);

  const showPodium = activeTab === "Top Fundraisers";

  return (
    <Card
      className="border-white/70 bg-white/90 lg:col-span-5"
      data-testid="community-leaderboard-card"
    >
      <CardContent className="space-y-5 p-5 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif text-foreground">
              Leaderboard
            </h2>
          </div>
          <Badge className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary">
            Live rankings
          </Badge>
        </div>

        {/* Tab row */}
        <div className="flex gap-4 border-b border-border/40" role="tablist">
          {LEADERBOARD_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              data-testid={`leaderboard-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Podium - top 3 (only for Top Fundraisers) */}
        {showPodium && (
          <div
            className="flex items-end justify-center gap-3"
            data-testid="leaderboard-podium"
          >
            {[sortedLeaderboard[1], sortedLeaderboard[0], sortedLeaderboard[2]].map(
              (entry, i) => {
                const isFirst = i === 1;
                const colors = [
                  "border-slate-300 bg-slate-50",
                  "border-amber-300 bg-amber-50",
                  "border-orange-300 bg-orange-50",
                ];
                return (
                  <Link
                    key={entry.profileId}
                    to={`/profile/${entry.profileId}`}
                    className="block flex-1"
                    data-testid={`podium-${entry.rank}`}
                  >
                    <div
                      className={`flex flex-col items-center rounded-2xl border-2 p-3 transition-all duration-200 hover:shadow-md ${colors[i]} ${isFirst ? "pb-5" : ""}`}
                    >
                      {isFirst && (
                        <Crown className="mb-1 h-5 w-5 text-amber-500" strokeWidth={1.5} />
                      )}
                      <Avatar
                        className={`border-2 border-white shadow-sm ${isFirst ? "h-14 w-14" : "h-11 w-11"}`}
                      >
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                      </Avatar>
                      <p className="mt-2 text-center text-xs font-semibold leading-tight text-foreground">
                        {entry.name.split(" ")[0]}
                      </p>
                      <p className="mt-1 text-sm font-serif font-semibold text-primary">
                        {formatCurrency(entry.totalRaised)}
                      </p>
                      <p className="text-[0.625rem] text-muted-foreground">
                        #{entry.rank}
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}

        {/* Flat list - all entries for Trending, remaining for Top Fundraisers */}
        <div className="space-y-3">
          {(showPodium ? sortedLeaderboard.slice(3) : sortedLeaderboard).map((entry, i) => (
            <Link
              key={entry.profileId}
              to={`/profile/${entry.profileId}`}
              className="block"
              data-testid={`leaderboard-${entry.profileId}`}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 transition-all duration-200 hover:bg-muted/60 hover:shadow-sm">
                <p className="w-7 text-center text-sm font-bold text-muted-foreground">
                  {showPodium ? entry.rank : i + 1}
                </p>
                <Avatar className="h-10 w-10 border border-white shadow-sm">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {entry.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5">
                      <Heart className="h-3 w-3" />
                      {entry.campaignsFunded} funded
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Target className="h-3 w-3" />
                      {entry.trustScore} trust
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-serif font-semibold text-primary">
                    {formatCurrency(entry.totalRaised)}
                  </p>
                  {entry.weeklyTrend > 0 && (
                    <p className="flex items-center justify-end gap-0.5 text-xs text-primary/70">
                      <ArrowUpRight className="h-3 w-3" />
                      +{entry.weeklyTrend}%
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunityPage() {
  usePageView("community");
  const activeCampaigns = getActiveCampaigns();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        {/* Hero Banner */}
        <div
          className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[hsl(195,69%,27%)] p-6 text-primary-foreground sm:p-8 lg:mb-16"
          data-testid="community-hero-banner"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Badge className="rounded-full border border-white/20 bg-white/15 text-primary-foreground hover:bg-white/20">
                <Flame className="mr-1 h-3.5 w-3.5" />
                Live
              </Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight leading-snug sm:text-5xl">
                Community Hub
              </h1>
              <p className="mt-3 text-lg font-serif leading-snug text-primary-foreground/85">
                A leaderboard that rewards momentum without losing warmth.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/60">
                See who's raising, what's trending, and how the community is
                growing. Impact measured through trust, not just dollars.
              </p>
            </div>

            {/* Avatar stack + stat */}
            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {leaderboard.slice(0, 4).map((entry) => (
                  <Avatar
                    key={entry.profileId}
                    className="h-11 w-11 border-2 border-primary shadow-md ring-2 ring-white/20"
                  >
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <p className="text-2xl font-serif">
                  {aggregates.activeCampaigns}
                </p>
                <p className="text-xs text-primary-foreground/60">
                  active campaigns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* ─── Metrics Card (4 cols) ─── */}
          <Card
            className="border-white/70 bg-white/90 lg:col-span-4"
            data-testid="community-metrics-card"
          >
            <CardContent className="space-y-5 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-serif text-foreground">
                  Aggregate impact
                </h2>
              </div>

              {/* Total Raised - hero stat */}
              <CommunityCounter
                end={Math.round(aggregates.totalRaised / 1_000)}
                prefix="$"
                suffix="K"
                label="total raised across the community"
                className="rounded-2xl bg-primary p-5 text-primary-foreground"
                valueClassName="text-3xl font-serif"
                labelClassName="mt-1.5 text-sm text-primary-foreground/75"
                testId="community-total-raised"
              />

              {/* Total Donors */}
              <CommunityCounterDonors
                donors={aggregates.totalDonors}
              />

              {/* Secondary stats row */}
              <div className="grid grid-cols-2 gap-3">
                <CommunityCounter
                  end={aggregates.averageGift}
                  prefix="$"
                  label="avg gift"
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  valueClassName="text-2xl font-serif text-foreground"
                  labelClassName="text-xs text-muted-foreground"
                  testId="community-avg-gift"
                />
                <CommunityCounter
                  end={aggregates.averageFundingRate}
                  suffix="%"
                  label="funded"
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  valueClassName="text-2xl font-serif text-foreground"
                  labelClassName="text-xs text-muted-foreground"
                  testId="community-funding-rate"
                />
              </div>
            </CardContent>
          </Card>

          {/* ─── Trending Campaigns Card (3 cols) ─── */}
          <Card
            className="border-white/70 bg-white/90 lg:col-span-3"
            data-testid="community-trending-card"
          >
            <CardContent className="space-y-5 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-serif text-foreground">
                  Trending
                </h2>
              </div>

              <div className="space-y-4">
                {trending.map((item) => (
                  <Link
                    key={item.campaignId}
                    to={`/campaign/${item.campaignId}`}
                    className="block"
                    data-testid={`trending-${item.campaignId}`}
                  >
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/60 hover:shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                          {item.title}
                        </p>
                        <Badge
                          className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs text-amber-900 hover:bg-amber-100"
                        >
                          {item.tag}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        by {item.organizerName}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <ArrowUpRight className="h-3 w-3" />
                          +{item.weeklyMomentum}%
                        </span>
                        <span>
                          {formatCurrency(item.weeklyRaised)} this week
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Active campaigns count */}
              <div className="rounded-2xl border border-secondary bg-secondary/40 p-4 text-center">
                <p className="text-2xl font-serif text-foreground">
                  {aggregates.activeCampaigns}
                </p>
                <p className="text-xs text-muted-foreground">
                  active campaigns right now
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ─── Leaderboard Card (5 cols) ─── */}
          <LeaderboardCard />
        </div>

        {/* ─── Activity Feed ─── */}
        <div className="mt-16 lg:mt-24" data-testid="community-activity-feed">
          <div className="mb-5 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Recent activity
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns
              .flatMap((c) =>
                (c.updates || []).map((u) => ({
                  ...u,
                  campaignId: c.id,
                  campaignTitle: c.title,
                  organizerId: c.organizerId,
                  organizerName: getProfile(c.organizerId)?.name,
                  organizerAvatar: getProfile(c.organizerId)?.avatar,
                }))
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 6)
              .map((update) => (
                <Link
                  key={update.id}
                  to={`/campaign/${update.campaignId}`}
                  className="block"
                >
                  <Card className="h-full overflow-hidden border-white/70 bg-white/90 transition-all duration-200 hover:shadow-md">
                    {update.image && (
                      <img
                        src={update.image}
                        alt={update.title}
                        loading="lazy"
                        className="rounded-lg aspect-[16/10] object-cover w-full"
                      />
                    )}
                    <CardContent className="flex gap-3 p-4">
                      <Avatar className="h-8 w-8 shrink-0 border border-white shadow-sm">
                        <AvatarImage
                          src={update.organizerAvatar}
                          alt={update.organizerName}
                        />
                        <AvatarFallback className="text-xs">
                          {update.organizerName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {update.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {update.organizerName} &middot; {update.campaignTitle}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {update.content}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-[0.6875rem] text-muted-foreground/60">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(update.date + "T00:00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* ─── Active Campaigns Grid ─── */}
        <CampaignGrid campaigns={activeCampaigns} />
      </div>
    </div>
  );
}
