import { Link } from "react-router-dom";
import { usePageView } from "@/lib/useAnalytics";
import { community, getActiveCampaigns, getProfile } from "@/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

const { aggregates, leaderboard, trending } = community;

function formatCurrency(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatNumber(value) {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

export default function CommunityPage() {
  usePageView("community");
  const activeCampaigns = getActiveCampaigns();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-16">
        {/* Header */}
        <div className="mb-12 max-w-2xl lg:mb-16">
          <Badge variant="secondary" data-testid="community-badge">
            <Flame className="mr-1 h-3.5 w-3.5" />
            Live
          </Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight leading-snug sm:text-5xl md:text-6xl">
            Community Hub
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Where social proof meets impact. See who's raising, what's trending,
            and how the community is growing.
          </p>
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
              <div
                className="rounded-2xl bg-primary p-5 text-primary-foreground"
                data-testid="community-total-raised"
              >
                <p className="text-3xl font-serif">
                  {formatCurrency(aggregates.totalRaised)}
                </p>
                <p className="mt-1.5 text-sm text-primary-foreground/75">
                  total raised across the community
                </p>
              </div>

              {/* Total Donors */}
              <div
                className="rounded-2xl border border-sky-100 bg-sky-50/80 p-5"
                data-testid="community-total-donors"
              >
                <p className="text-3xl font-serif text-foreground">
                  {formatNumber(aggregates.totalDonors)}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  unique donors contributing
                </p>
              </div>

              {/* Secondary stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  data-testid="community-avg-gift"
                >
                  <p className="text-2xl font-serif text-foreground">
                    ${aggregates.averageGift}
                  </p>
                  <p className="text-xs text-muted-foreground">avg gift</p>
                </div>
                <div
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  data-testid="community-funding-rate"
                >
                  <p className="text-2xl font-serif text-foreground">
                    {aggregates.averageFundingRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">funded</p>
                </div>
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
                        <p className="text-sm font-semibold leading-snug text-foreground">
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
          <Card
            className="border-white/70 bg-white/90 lg:col-span-5"
            data-testid="community-leaderboard-card"
          >
            <CardContent className="space-y-5 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-serif text-foreground">
                    Top fundraisers
                  </h2>
                </div>
                <Badge
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary"
                >
                  Live rankings
                </Badge>
              </div>

              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <Link
                    key={entry.profileId}
                    to={`/profile/${entry.profileId}`}
                    className="block"
                    data-testid={`leaderboard-${entry.profileId}`}
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 transition-all duration-200 hover:bg-muted/60 hover:shadow-sm sm:gap-4">
                      {/* Rank */}
                      <p className="w-7 text-center text-sm font-bold text-muted-foreground">
                        {entry.rank}
                      </p>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10 border border-white shadow-sm sm:h-11 sm:w-11">
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                      </Avatar>

                      {/* Name + trend */}
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

                      {/* Amount + weekly trend */}
                      <div className="text-right">
                        <p className="text-base font-serif font-semibold text-primary sm:text-lg">
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
        </div>

        {/* ─── Activity Feed ─── */}
        <div className="mt-12 lg:mt-16" data-testid="community-activity-feed">
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
                  <Card className="h-full border-white/70 bg-white/90 transition-all duration-200 hover:shadow-md">
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
        <div className="mt-12 lg:mt-16">
          <h2 className="mb-6 text-2xl font-serif font-semibold text-foreground">
            Active campaigns
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activeCampaigns.map((c) => (
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
                    <Progress
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
      </div>
    </div>
  );
}
