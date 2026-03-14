import { useParams, Link } from "react-router-dom";
import { usePageView } from "@/lib/useAnalytics";
import { useProfile, useCampaignsByOrganizer, useProfiles } from "@/lib/useData";
import NotFound from "@/components/NotFound";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedProgress } from "@/components/ui/progress";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { formatCurrency, formatNumber, formatMemberSince, initials } from "@/lib/format";
import {
  ShieldCheck,
  Mail,
  UserCheck,
  Award,
  MapPin,
  CalendarDays,
  Heart,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Flame,
  Sprout,
  Zap,
  TreePine,
  GraduationCap,
  Users,
  Palette,
  Cpu,
} from "lucide-react";



const CATEGORY_ICONS = {
  "Urban Agriculture": Sprout,
  "Renewable Energy": Zap,
  Environmental: TreePine,
  Education: GraduationCap,
  Community: Users,
  "Arts & Culture": Palette,
  Technology: Cpu,
};

const TRUST_METRICS = [
  { key: "fulfillmentRate", label: "Fulfillment history", icon: Award },
  { key: "updateConsistency", label: "Update consistency", icon: CalendarDays },
  { key: "repeatDonorConfidence", label: "Repeat donor confidence", icon: Heart },
];

// KEY-DECISION 2026-03: "Email" pill is a verification tier indicator, NOT a contact button.
// No email address is shown. Reviewers consistently misread this as a mailto link.
const VERIFICATION_STEPS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "identity", label: "Identity", icon: UserCheck },
  { key: "trackRecord", label: "Track record", icon: Award },
];

export default function ProfilePage() {
  const { id } = useParams();
  usePageView("profile", { id });
  const { data: profile } = useProfile(id);
  const { data: campaigns } = useCampaignsByOrganizer(id);
  const { data: allProfiles } = useProfiles();

  if (!profile) return <NotFound type="profile" />;
  if (!campaigns || !allProfiles) return null;

  const otherProfiles = allProfiles.filter((p) => p.id !== profile.id);
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const pastCampaigns = campaigns.filter((c) => c.status !== "active");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        {/* ─── Identity Header + Trust Panel ─── */}
        <Card
          className="overflow-hidden border-white/70 bg-white/90"
          data-testid="profile-header-card"
        >
          <CardContent className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_1fr] lg:p-8">
            {/* Left: Identity */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar
                  className="h-20 w-20 border-4 border-secondary shadow-sm"
                  data-testid="profile-avatar"
                >
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-xl">
                    {initials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {profile.verified && (
                      <Badge
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary"
                        data-testid="profile-verified-badge"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {profile.roles.map((role) => (
                      <Badge
                        key={role}
                        variant="outline"
                        className="rounded-full px-2.5 py-0.5 text-xs capitalize"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                  <h1
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                    data-testid="profile-name"
                  >
                    {profile.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {profile.title}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Member since{" "}
                  {formatMemberSince(profile.memberSince)}
                </span>
                {profile.recommendedBy > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {profile.recommendedBy}{" "}
                    recommendations
                  </span>
                )}
              </div>

              {/* Bio */}
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                data-testid="profile-bio"
              >
                {profile.bio}
              </p>

              {/* Top Causes */}
              {(() => {
                const categories = [...new Set(campaigns.map((c) => c.category))];
                if (categories.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-2" data-testid="profile-causes">
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat] || Flame;
                      return (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  data-testid="profile-followers"
                >
                  <p className="text-2xl font-serif text-foreground">
                    {formatNumber(profile.followers)}
                  </p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
                <div
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                  data-testid="profile-campaigns-funded"
                >
                  <p className="text-2xl font-serif text-foreground">
                    {profile.stats.campaignsFunded}
                  </p>
                  <p className="text-xs text-muted-foreground">funded</p>
                </div>
                <div
                  className="rounded-2xl border border-secondary bg-secondary/50 p-4"
                  data-testid="profile-trust-score"
                >
                  <p className="text-2xl font-serif text-primary">
                    {profile.trust.score}
                    <span className="text-base font-sans text-muted-foreground">
                      /100
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">trust</p>
                </div>
              </div>

              {/* Verification Steps */}
              <div
                className="flex flex-wrap items-center gap-2"
                data-testid="profile-verification-steps"
              >
                {VERIFICATION_STEPS.map((step, i) => {
                  const verified = profile.verificationDetails[step.key];
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center gap-2">
                      {i > 0 && (
                        <div
                          className={`hidden h-px w-6 sm:block ${verified ? "bg-primary/40" : "bg-border"}`}
                        />
                      )}
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ${
                          verified
                            ? "bg-secondary text-primary"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Trust Composition Panel */}
            <div
              className="rounded-3xl bg-gradient-to-br from-primary via-primary to-gradient-end p-6 text-primary-foreground"
              data-testid="profile-trust-panel"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
                    Trust composition
                  </p>
                  <h2 className="mt-2 text-xl font-serif leading-snug sm:text-2xl">
                    Reputation built through fulfillment, transparency, and
                    repeat support.
                  </h2>
                </div>
                <ShieldCheck className="h-8 w-8 shrink-0 text-primary-foreground/40" />
              </div>

              <div className="mt-6 space-y-5">
                {TRUST_METRICS.map(({ key, label, icon: Icon }, i) => (
                  <div key={key} data-testid={`trust-metric-${key}`}>
                    <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/75">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                      <span className="font-medium text-primary-foreground">
                        {profile.trust[key]}%
                      </span>
                    </div>
                    <AnimatedProgress
                      value={profile.trust[key]}
                      delay={i * 200}
                      className="h-2 bg-white/15 [&>div]:bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <p className="text-xs leading-relaxed text-primary-foreground/70">
                  Score formula: fulfillment (40%) + update consistency (30%) +
                  repeat donor confidence (30%) ={" "}
                  <span className="font-semibold text-primary-foreground">
                    {profile.trust.score}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Campaign History ─── */}
        <div className="mt-16 lg:mt-24">
          {/* Active Campaigns */}
          {activeCampaigns.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-5 text-2xl font-serif font-semibold text-foreground">
                Active campaigns
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {activeCampaigns.map((c) => (
                  <Link
                    key={c.id}
                    to={`/campaign/${c.id}`}
                    className="block"
                    data-testid={`profile-campaign-${c.id}`}
                  >
                    <Card className="h-full overflow-hidden border-white/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={c.heroImage}
                          alt={c.title}
                          width={800}
                          height={600}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-center gap-2">
                          <Badge className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground hover:bg-secondary">
                            {c.category}
                          </Badge>
                          {c.weeklyMomentum > 20 && (
                            <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-900 hover:bg-amber-50">
                              <TrendingUp className="mr-0.5 h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                          {c.title}
                        </p>
                        <AnimatedProgress
                          value={Math.min(
                            Math.round((c.raised / c.goal) * 100),
                            100
                          )}
                          className="h-2 bg-primary/15"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {formatCurrency(c.raised, { compact: true })} of{" "}
                            {formatCurrency(c.goal, { compact: true })}
                          </span>
                          <span>{c.daysLeft} days left</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Past Campaigns */}
          {pastCampaigns.length > 0 && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Campaign history
                </h2>
                <Badge className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted">
                  {pastCampaigns.length} past
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastCampaigns.map((c) => (
                  <Card
                    key={c.id}
                    className="border-white/70 bg-white/90"
                    data-testid={`profile-past-${c.id}`}
                  >
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-xs ${
                            c.status === "funded"
                              ? "bg-secondary text-secondary-foreground hover:bg-secondary"
                              : "bg-muted text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {c.status === "funded" ? "Funded" : "Not funded"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            (c.endedAt || c.createdAt) + "T00:00:00"
                          ).getFullYear()}
                        </span>
                      </div>
                      <p className="font-semibold leading-snug text-foreground">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCurrency(c.raised, { compact: true })}
                        </span>
                        <span>
                          {c.backerCount.toLocaleString()} backers
                        </span>
                      </div>
                      {c.summary && (
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {c.summary}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Network Impact */}
          <RevealOnScroll delay={150}>
          <div
            className="mt-10 rounded-3xl bg-gradient-to-r from-primary to-gradient-end p-6 text-primary-foreground sm:p-8"
            data-testid="profile-network-impact"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
              Total network impact
            </p>
            <p className="mt-2 text-4xl font-serif sm:text-5xl">
              {formatCurrency(
                profile.stats.totalRaised + profile.stats.totalDonated,
                { compact: true }
              )}
            </p>
            <p className="mt-2 text-sm text-primary-foreground/75">
              raised and donated across {profile.stats.campaignsOrganized}{" "}
              campaigns - recommended by {profile.recommendedBy} donors
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xl font-serif">
                  {formatCurrency(profile.stats.totalRaised, { compact: true })}
                </p>
                <p className="mt-1 text-xs text-primary-foreground/60">
                  raised
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xl font-serif">
                  {formatCurrency(profile.stats.totalDonated, { compact: true })}
                </p>
                <p className="mt-1 text-xs text-primary-foreground/60">
                  donated
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xl font-serif">
                  {profile.stats.campaignsFunded}
                  <span className="text-sm font-sans">
                    /{profile.stats.campaignsOrganized}
                  </span>
                </p>
                <p className="mt-1 text-xs text-primary-foreground/60">
                  funded
                </p>
              </div>
            </div>
          </div>
          </RevealOnScroll>

          {/* Recent Activity */}
          {(() => {
            const activity = campaigns
              .flatMap((c) => [
                // Campaign updates
                ...(c.updates || []).map((u) => ({
                  type: "update",
                  date: u.date,
                  title: u.title,
                  subtitle: c.title,
                  campaignId: c.id,
                })),
                // Campaign launched
                {
                  type: "launch",
                  date: c.createdAt,
                  title: `Started "${c.title}"`,
                  subtitle: `Goal: ${formatCurrency(c.goal, { compact: true })}`,
                  campaignId: c.id,
                },
              ])
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);

            if (activity.length === 0) return null;

            return (
              <div className="mt-10" data-testid="profile-activity-feed">
                <div className="mb-5 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-serif font-semibold text-foreground">
                    Recent activity
                  </h2>
                </div>
                <div className="space-y-3">
                  {activity.map((item, i) => (
                    <Link
                      key={i}
                      to={`/campaign/${item.campaignId}`}
                      className="block"
                    >
                      <Card className="border-white/70 bg-white/90">
                        <CardContent className="flex items-start gap-3 p-4">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              item.type === "launch"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-secondary text-primary"
                            }`}
                          >
                            {item.type === "launch" ? (
                              <Flame className="h-4 w-4" />
                            ) : (
                              <CalendarDays className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">
                              {item.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.subtitle}
                            </p>
                          </div>
                          <p className="shrink-0 text-xs text-muted-foreground/60">
                            {new Date(item.date + "T00:00:00").toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Discover more organizers */}
          {otherProfiles.length > 0 && (
            <div className="mt-10" data-testid="discover-organizers">
              <h2 className="mb-5 text-2xl font-serif font-semibold text-foreground">
                Discover more organizers
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {otherProfiles.map((p) => (
                  <Link
                    key={p.id}
                    to={`/profile/${p.id}`}
                    className="block"
                    data-testid={`discover-${p.id}`}
                  >
                    <Card className="overflow-hidden border-white/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <CardContent className="flex items-center gap-4 p-4">
                        <Avatar className="h-12 w-12 shrink-0 border-2 border-secondary shadow-sm">
                          <AvatarImage src={p.avatar} alt={p.name} />
                          <AvatarFallback>{initials(p.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-foreground">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-serif text-primary">
                            {p.trust.score}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            trust
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
