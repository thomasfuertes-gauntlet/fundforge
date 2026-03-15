import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCampaign, useProfile, useDonations, useCommunity, useActiveCampaigns } from "@/lib/useData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, AnimatedProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import CampaignCard from "@/components/CampaignCard";
import DonateModal from "@/components/DonateModal";
import ShareModal from "@/components/ShareModal";
import NotFound from "@/components/NotFound";
import { usePageView, useScrollDepth } from "@/lib/useAnalytics";
import { trackDonateClick } from "@/lib/analytics";
import useCountUp from "@/lib/useCountUp";
import { ab } from "@/lib/ab";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import {
  Heart,
  Link2,
  Linkedin,
  MessageCircle,
  Send,
  Share2,
  Clock,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Package,
} from "lucide-react";

function formatRelativeTime(timestamp) {
  const now = new Date("2026-03-07T17:00:00Z"); // Fixed "now" matching fixture date
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}


export default function CampaignPage() {
  const { id } = useParams();
  const [donateOpen, setDonateOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  usePageView("campaign", { id });
  useScrollDepth(id);

  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(null);
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setScrollProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
      rafRef.current = null;
    });
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // A/B: treatment removes scroll-triggered animations for speed perception test
  const skipAnimations = ab('animations');

  const { data: campaign, loading: campaignLoading } = useCampaign(id);
  const { data: organizer } = useProfile(campaign?.organizerId);
  const { data: donations } = useDonations(campaign?.id);
  const { data: community } = useCommunity();
  const { data: allActiveCampaigns } = useActiveCampaigns();

  // All hooks must be called before any early return (Rules of Hooks)
  // Always skip count-up on donate panel - it's above the fold, so the $0→$86K
  // flash looks like a bug. A/B test still controls progress bars and donation feed.
  const [raisedRef, raisedDisplay] = useCountUp(campaign?.raised ?? 0, { prefix: "$", skip: true });
  const [backersRef, backersDisplay] = useCountUp(campaign?.backerCount ?? 0, { skip: true });
  const [avgGiftRef, avgGiftDisplay] = useCountUp(campaign?.averageGift ?? 0, { prefix: "$", skip: true });

  // Related campaigns: same category or organizer, excluding current
  const relatedCampaigns = useMemo(() => {
    if (!allActiveCampaigns || !campaign) return [];
    return allActiveCampaigns
      .filter(
        (c) =>
          c.id !== campaign.id &&
          (c.category === campaign.category || c.organizerId === campaign.organizerId)
      )
      .slice(0, 3);
  }, [allActiveCampaigns, campaign]);

  if (!campaign && !campaignLoading) return <NotFound type="campaign" />;
  if (!community || !donations)
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="space-y-8 lg:col-span-7">
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted/60" />
              <div className="space-y-3">
                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-80 animate-pulse rounded-xl bg-muted/60 lg:col-span-5" />
          </div>
        </div>
      </div>
    );

  const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  const leaderboardEntry = community.leaderboard.find(
    (e) => e.activeCampaignId === campaign.id
  );
  const visibleUpdates = showAllUpdates
    ? campaign.updates
    : (campaign.updates || []).slice(0, 2);

  const isActive = campaign.status === "active";
  const readingTime = campaign.story
    ? Math.ceil(campaign.story.join(" ").split(/\s+/).length / 200)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* ─── Left Column: Story ─── */}
          <div className="space-y-8 lg:col-span-7">
            {/* Hero Image */}
            <Card
              className="overflow-hidden border-white/70 bg-white/90"
              data-testid="campaign-hero-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={campaign.heroImage}
                  alt={campaign.title}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                  data-testid="campaign-hero-image"
                />
              </div>

              <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground hover:bg-secondary"
                    data-testid="campaign-category"
                  >
                    {campaign.category}
                  </Badge>
                  {isActive && campaign.daysLeft != null && (
                    <Badge
                      className={cn(
                        "rounded-full border px-3 py-1",
                        campaign.daysLeft <= 3
                          ? "border-red-200 bg-red-50 text-red-900 hover:bg-red-50"
                          : campaign.daysLeft <= 7
                            ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-50"
                            : "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-50"
                      )}
                      data-testid="campaign-days-left"
                    >
                      {campaign.daysLeft <= 3 ? (
                        <Flame className="mr-1 h-3.5 w-3.5" />
                      ) : (
                        <Clock className="mr-1 h-3.5 w-3.5" />
                      )}
                      {campaign.daysLeft <= 3
                        ? `Final ${campaign.daysLeft} days!`
                        : `${campaign.daysLeft} days left`}
                    </Badge>
                  )}
                  {!isActive && (
                    <Badge
                      className={cn(
                        "rounded-full border px-3 py-1",
                        campaign.status === "funded"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-50"
                          : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      {campaign.status === "funded" ? (
                        <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Funded</>
                      ) : (
                        <><Clock className="mr-1 h-3.5 w-3.5" /> Ended</>
                      )}
                    </Badge>
                  )}
                  {readingTime > 0 && (
                    <Badge
                      className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-muted-foreground hover:bg-muted/30"
                      data-testid="campaign-reading-time"
                    >
                      <BookOpen className="mr-1 h-3.5 w-3.5" />
                      {readingTime} min read
                    </Badge>
                  )}
                  {campaign.weeklyMomentum > 20 && (
                    <Badge
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-900 hover:bg-amber-50"
                      data-testid="campaign-trending"
                    >
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1
                  className="text-3xl font-bold leading-snug tracking-tight sm:text-4xl"
                  data-testid="campaign-title"
                >
                  {campaign.title}
                </h1>

                {/* Organizer Card */}
                {organizer && (
                  <Link
                    to={`/profile/${organizer.id}`}
                    className="block"
                    data-testid="campaign-organizer-link"
                  >
                    <div
                      className="grid gap-4 rounded-2xl border border-secondary bg-secondary/50 p-4 transition-all duration-200 hover:bg-secondary/80 md:grid-cols-[auto_1fr] md:items-center"
                      data-testid="campaign-organizer-card"
                    >
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        <AvatarImage src={organizer.avatar} alt={organizer.name} />
                        <AvatarFallback>{initials(organizer.name)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-widest text-primary/70">
                          Organizer
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {organizer.name}
                          <span className="font-normal text-muted-foreground">
                            {" "}&middot; {organizer.title}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          {organizer.verified && (
                            <span className="inline-flex items-center gap-1 text-primary">
                              <ShieldCheck className="h-3.5 w-3.5" /> Verified
                            </span>
                          )}
                          <span>
                            {organizer.stats.campaignsFunded} campaigns funded
                          </span>
                          <span>
                            {organizer.trust.fulfillmentRate}% fulfillment
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Story (active) or Summary (funded/unfunded) */}
                {campaign.story ? (
                  <div className="space-y-5" data-testid="campaign-story">
                    {campaign.story.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : campaign.summary ? (
                  <div data-testid="campaign-summary">
                    <Badge className={cn(
                      "mb-4 rounded-full px-3 py-1 text-xs",
                      campaign.status === "funded"
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    )}>
                      {campaign.status === "funded" ? "Campaign Funded" : "Campaign Ended"}
                    </Badge>
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
                      {campaign.summary}
                    </p>
                  </div>
                ) : null}

                {/* Detail Images */}
                {campaign.images && campaign.images.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2" data-testid="campaign-images">
                    {campaign.images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
                        <img
                          src={img}
                          alt={`${campaign.title} detail ${i + 1}`}
                          width={1200}
                          height={800}
                          loading="lazy"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {/* Story Reactions */}
                <div
                  className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-5"
                  data-testid="campaign-reactions"
                >
                  {[
                    { icon: Heart, label: "hearts", factor: 0.38 },
                    { icon: HeartHandshake, label: "prayers", factor: 0.22 },
                    { icon: MessageCircle, label: "comments", factor: 0.06 },
                  ].map(({ icon: Icon, label, factor }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span className="font-medium text-foreground">
                        {Math.round(campaign.backerCount * factor).toLocaleString()}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            {campaign.testimonials && campaign.testimonials.length > 0 && (
              <div className="space-y-4" data-testid="campaign-testimonials">
                <h2 className="text-xl font-semibold">What donors are saying</h2>
                <div className="space-y-3">
                  {campaign.testimonials.map((t, i) => (
                    <Card
                      key={i}
                      className="border-white/70 bg-white/90"
                    >
                      <CardContent className="flex gap-4 p-5">
                        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary/40" />
                        <div>
                          <p className="text-sm leading-relaxed text-muted-foreground italic">
                            "{t.text}"
                          </p>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {t.donorName}
                            <span className="ml-2 font-normal text-muted-foreground">
                              {formatDate(t.date)}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Updates Timeline */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="space-y-4" data-testid="campaign-updates">
                <h2 className="text-xl font-semibold">Campaign updates</h2>
                <div className="space-y-3">
                  {visibleUpdates.map((update) => (
                    <Card
                      key={update.id}
                      className="border-white/70 bg-white/90"
                      data-testid={`update-${update.id}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary/40" />
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">
                              {formatDate(update.date)}
                            </p>
                            <p className="font-semibold text-foreground">
                              {update.title}
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {update.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {campaign.updates.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllUpdates((v) => !v)}
                    className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary hover:underline"
                    data-testid="toggle-updates"
                  >
                    {showAllUpdates ? (
                      <>Show less <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Show all {campaign.updates.length} updates <ChevronDown className="h-4 w-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Delivery Timeline (funded/unfunded campaigns with fulfillment data) */}
            {!isActive && campaign.deliveryTimeline?.length > 0 && (
              <div className="space-y-4" data-testid="delivery-timeline">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Delivery timeline</h2>
                  {campaign.fulfillmentStatus && (
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        campaign.fulfillmentStatus === "fulfilled"
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-50"
                          : campaign.fulfillmentStatus === "delayed"
                            ? "bg-amber-50 text-amber-800 hover:bg-amber-50"
                            : "bg-sky-50 text-sky-800 hover:bg-sky-50"
                      )}
                      data-testid="fulfillment-status-badge"
                    >
                      {campaign.fulfillmentStatus === "fulfilled" && <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
                      {campaign.fulfillmentStatus === "delayed" && <AlertTriangle className="mr-1 h-3.5 w-3.5" />}
                      {campaign.fulfillmentStatus === "in_progress" && <Clock className="mr-1 h-3.5 w-3.5" />}
                      {campaign.fulfillmentStatus === "fulfilled" ? "Fulfilled" : campaign.fulfillmentStatus === "delayed" ? "Delayed" : "In Progress"}
                    </Badge>
                  )}
                </div>
                <div className="relative space-y-0">
                  {/* Vertical connector line */}
                  <div className="absolute left-[15px] top-6 bottom-6 w-px bg-border/60" />
                  {campaign.deliveryTimeline.map((milestone, i) => {
                    const stageConfig = {
                      delivered: { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
                      verified: { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
                      in_progress: { icon: Clock, color: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
                      planning: { icon: Package, color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
                    };
                    const config = stageConfig[milestone.stage] || stageConfig.planning;
                    const StageIcon = config.icon;
                    return (
                      <div
                        key={i}
                        className="relative flex gap-4 py-3"
                        data-testid={`milestone-${i}`}
                      >
                        <div className={cn("z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.color)}>
                          <StageIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {formatDate(milestone.date)}
                          </p>
                          <p className="font-semibold text-foreground">
                            {milestone.title}
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column: Sticky Donate Panel ─── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <Card
                className="border-white/70 bg-white/95"
                data-testid="donate-panel"
              >
                <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
                  {/* Progress Header */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Donation progress
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <p
                        ref={raisedRef}
                        className="text-4xl font-serif text-foreground"
                        data-testid="campaign-raised"
                      >
                        {raisedDisplay}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid="campaign-goal">
                        of {formatCurrency(campaign.goal)} goal
                      </p>
                    </div>
                  </div>

                  {skipAnimations ? (
                    <Progress
                      value={progressPercent}
                      className="h-3 bg-primary/15"
                      data-testid="campaign-progress"
                    />
                  ) : (
                    <AnimatedProgress
                      value={progressPercent}
                      className={cn(
                        "h-3 bg-primary/15",
                        progressPercent >= 75 && "animate-progress-glow"
                      )}
                      data-testid="campaign-progress"
                    />
                  )}
                  {progressPercent >= 90 ? (
                    <Badge
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10"
                      data-testid="campaign-urgency"
                    >
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      Final push!
                    </Badge>
                  ) : progressPercent >= 75 ? (
                    <Badge
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10"
                      data-testid="campaign-urgency"
                    >
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      Almost there!
                    </Badge>
                  ) : null}

                  {/* Stretch Goal */}
                  {campaign.stretchGoal && (
                    <div
                      className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4"
                      data-testid="campaign-stretch-goal"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                        <Target className="h-4 w-4" />
                        Stretch goal: {formatCurrency(campaign.stretchGoal.amount)}
                      </div>
                      <p className="mt-1 text-xs text-amber-800/70">
                        {campaign.stretchGoal.label}
                      </p>
                      {campaign.raised >= campaign.goal && (
                        <div className="mt-2">
                          {skipAnimations ? (
                            <Progress
                              value={Math.min(
                                Math.round(
                                  ((campaign.raised - campaign.goal) /
                                    (campaign.stretchGoal.amount - campaign.goal)) *
                                    100
                                ),
                                100
                              )}
                              className="h-2 bg-amber-200/50 [&>div]:bg-amber-500"
                            />
                          ) : (
                            <AnimatedProgress
                              value={Math.min(
                                Math.round(
                                  ((campaign.raised - campaign.goal) /
                                    (campaign.stretchGoal.amount - campaign.goal)) *
                                    100
                                ),
                                100
                              )}
                              delay={300}
                              className="h-2 bg-amber-200/50 [&>div]:bg-amber-500"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Matching Sponsor */}
                  {campaign.matchingSponsor && (
                    <div
                      className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-secondary/60 p-4"
                      data-testid="campaign-matching-sponsor"
                    >
                      <Zap className="h-5 w-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {campaign.matchingSponsor.multiplier}x Match from{" "}
                          {campaign.matchingSponsor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(campaign.matchingSponsor.remaining)}{" "}
                          in matching funds remaining
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard Prompt */}
                  {leaderboardEntry && leaderboardEntry.rank > 1 && (
                    <Link
                      to="/communities/fundforge"
                      className="block"
                      data-testid="campaign-leaderboard-prompt"
                    >
                      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60">
                        <Trophy className="h-5 w-5 shrink-0 text-primary/60" />
                        <p className="text-sm text-muted-foreground">
                          Help{" "}
                          <span className="font-semibold text-foreground">
                            {organizer?.name}
                          </span>{" "}
                          reach #1 - currently{" "}
                          <span className="font-semibold text-primary">
                            #{leaderboardEntry.rank}
                          </span>{" "}
                          on the leaderboard
                        </p>
                      </div>
                    </Link>
                  )}

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      ref={backersRef}
                      className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                      data-testid="campaign-backer-count"
                    >
                      <p className="text-2xl font-serif text-foreground">
                        {backersDisplay}
                      </p>
                      <p className="text-sm text-muted-foreground">total backers</p>
                    </div>
                    <div
                      ref={avgGiftRef}
                      className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                      data-testid="campaign-avg-gift"
                    >
                      <p className="text-2xl font-serif text-foreground">
                        {avgGiftDisplay}
                      </p>
                      <p className="text-sm text-muted-foreground">average gift</p>
                    </div>
                  </div>

                  {/* CTA Buttons (active campaigns only) */}
                  {isActive && (
                    <>
                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full shadow-[0_20px_44px_rgba(217,119,6,0.25)]"
                        onClick={() => { trackDonateClick(campaign.id); setDonateOpen(true); }}
                        data-testid="donate-button"
                      >
                        <Heart className="h-5 w-5" />
                        Donate to this campaign
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => setShareOpen(true)}
                        data-testid="share-button"
                      >
                        <Share2 className="h-5 w-5" />
                        Share
                      </Button>

                      {/* Inline share platform hints */}
                      <div className="flex items-center justify-center gap-3">
                        {[
                          { icon: Link2, label: "Copy link" },
                          { icon: Send, label: "Twitter" },
                          { icon: Share2, label: "Facebook" },
                          { icon: Linkedin, label: "LinkedIn" },
                          { icon: MessageCircle, label: "WhatsApp" },
                        ].map(({ icon: Icon, label }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setShareOpen(true)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                            aria-label={`Share on ${label}`}
                            data-testid={`share-hint-${label.toLowerCase()}`}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        ))}
                      </div>

                      <p className="text-center text-xs text-muted-foreground">
                        On average, each share inspires{" "}
                        <span className="font-medium text-foreground">2 new donors</span>
                      </p>

                      <Separator />

                      {/* Recent Donations */}
                      {donations.length > 0 && (
                        <div className="space-y-3" data-testid="recent-donations">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-serif text-foreground">
                              Recent donations
                            </h3>
                            <HeartHandshake className="h-4 w-4 text-primary/50" />
                          </div>
                          {donations.slice(0, 5).map((d, i) => (
                            <div
                              key={d.id}
                              className={cn(
                                "flex items-center justify-between rounded-2xl border border-secondary bg-secondary/40 px-4 py-3",
                                !skipAnimations && "opacity-0 animate-fade-slide-in"
                              )}
                              style={skipAnimations ? undefined : { animationDelay: `${i * 100}ms` }}
                              data-testid={`donation-${d.id}`}
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {d.donorName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatRelativeTime(d.timestamp)}
                                  {d.message && (
                                    <span className="ml-1.5 italic">
                                      &middot; "{d.message}"
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="ml-4 shrink-0 text-base font-semibold text-primary">
                                {formatCurrency(d.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Funded campaign: organizer link CTA */}
                  {!isActive && organizer && (
                    <Link to={`/profile/${organizer.id}`} className="block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        data-testid="view-organizer-button"
                      >
                        View {organizer.name}'s profile
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Related Campaigns */}
      {relatedCampaigns.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-12 lg:px-16" data-testid="related-campaigns">
          <h2 className="mb-6 text-2xl font-serif font-semibold text-foreground">
            Related campaigns
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} testIdPrefix="related" />
            ))}
          </div>
        </div>
      )}

      {/* Scroll progress bar (decorative) */}
      <div className="fixed top-14 left-0 right-0 z-30 h-0.5 bg-accent/20" aria-hidden="true">
        <div
          className="h-full bg-accent transition-[width] duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Task #4: Sticky mobile donate CTA (active campaigns only) */}
      {isActive && !donateOpen && (
        <div
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-sm border-t border-border/40 px-4 py-3 pb-[env(safe-area-inset-bottom)]"
          data-testid="mobile-donate-cta"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <Progress value={progressPercent} className="h-1.5 bg-primary/15" />
              <p className="mt-1 text-sm font-medium text-foreground truncate">
                {formatCurrency(campaign.raised)}{" "}
                <span className="text-muted-foreground font-normal">raised</span>
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              className="shrink-0"
              onClick={() => { trackDonateClick(campaign.id); setDonateOpen(true); }}
              data-testid="mobile-donate-button"
            >
              <Heart className="h-4 w-4" />
              Donate
            </Button>
          </div>
        </div>
      )}

      <DonateModal
        open={donateOpen}
        onOpenChange={setDonateOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        averageGift={campaign.averageGift}
        backerCount={campaign.backerCount}
        onShare={() => setShareOpen(true)}
      />
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
      />
    </div>
  );
}
