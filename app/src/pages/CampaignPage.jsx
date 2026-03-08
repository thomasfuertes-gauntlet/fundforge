import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCampaign, getProfile, getDonationsByCampaign, community } from "@/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import DonateModal from "@/components/DonateModal";
import ShareModal from "@/components/ShareModal";
import NotFound from "@/components/NotFound";
import { usePageView, useScrollDepth } from "@/lib/useAnalytics";
import { trackDonateClick } from "@/lib/analytics";
import {
  Heart,
  Share2,
  Clock,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  HeartHandshake,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Trophy,
  Zap,
  Target,
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

function formatCurrency(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

export default function CampaignPage() {
  const { id } = useParams();
  const [donateOpen, setDonateOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  usePageView("campaign", { id });
  useScrollDepth(id);

  const campaign = getCampaign(id);
  if (!campaign) return <NotFound type="campaign" />;

  const organizer = getProfile(campaign.organizerId);
  const donations = getDonationsByCampaign(campaign.id);
  const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  const leaderboardEntry = community.leaderboard.find(
    (e) => e.activeCampaignId === campaign.id
  );
  const visibleUpdates = showAllUpdates
    ? campaign.updates
    : (campaign.updates || []).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* ─── Left Column: Story ─── */}
          <div className="space-y-8 lg:col-span-7">
            {/* Hero Image */}
            <Card
              className="overflow-hidden border-white/70 bg-white/90 shadow-sm transition-shadow duration-300 hover:shadow-md"
              data-testid="campaign-hero-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={campaign.heroImage}
                  alt={campaign.title}
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
                  <Badge
                    className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-900 hover:bg-sky-50"
                    data-testid="campaign-days-left"
                  >
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {campaign.daysLeft} days left
                  </Badge>
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

                {/* Story */}
                <div className="space-y-5" data-testid="campaign-story">
                  {campaign.story.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem] sm:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Detail Images */}
                {campaign.images && campaign.images.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2" data-testid="campaign-images">
                    {campaign.images.map((img, i) => (
                      <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl">
                        <img
                          src={img}
                          alt={`${campaign.title} detail ${i + 1}`}
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
                    <div
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="font-medium text-foreground">
                        {Math.round(campaign.backerCount * factor).toLocaleString()}
                      </span>
                      {label}
                    </div>
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
                      className="border-white/70 bg-white/90 transition-shadow duration-300 hover:shadow-md"
                    >
                      <CardContent className="flex gap-4 p-5">
                        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary/40" />
                        <div>
                          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground italic">
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
                      className="border-white/70 bg-white/90 transition-shadow duration-300 hover:shadow-md"
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
          </div>

          {/* ─── Right Column: Sticky Donate Panel ─── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <Card
                className="border-white/70 bg-white/95 shadow-sm"
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
                        className="text-4xl font-serif text-foreground"
                        data-testid="campaign-raised"
                      >
                        {formatCurrency(campaign.raised)}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid="campaign-goal">
                        of {formatCurrency(campaign.goal)} goal
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={progressPercent}
                    className="h-3 bg-primary/15"
                    data-testid="campaign-progress"
                  />

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
                      to="/community"
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
                      className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                      data-testid="campaign-backer-count"
                    >
                      <p className="text-2xl font-serif text-foreground">
                        {campaign.backerCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">total backers</p>
                    </div>
                    <div
                      className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                      data-testid="campaign-avg-gift"
                    >
                      <p className="text-2xl font-serif text-foreground">
                        {formatCurrency(campaign.averageGift)}
                      </p>
                      <p className="text-sm text-muted-foreground">average gift</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
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
                      {donations.slice(0, 5).map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between rounded-2xl border border-secondary bg-secondary/40 px-4 py-3"
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DonateModal
        open={donateOpen}
        onOpenChange={setDonateOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
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
