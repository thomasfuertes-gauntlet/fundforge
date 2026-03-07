import {
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  HeartHandshake,
  Leaf,
  MoveRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  configSnippet,
  donationFeed,
  keyStats,
  leaderboard,
  paletteTokens,
  profileWins,
  showcaseImages,
  trendingCampaigns,
  typeSpec,
} from "./showcase-data";

const navLinks = [
  { id: "nav-design-system", label: "Design System", href: "#design-system" },
  { id: "nav-campaign", label: "Campaign", href: "#campaign-preview" },
  { id: "nav-community", label: "Community", href: "#community-preview" },
  { id: "nav-profile", label: "Profile", href: "#profile-preview" },
];

const trustPillars = [
  { id: "pillar-conversion", icon: CircleDollarSign, label: "Conversion without pressure" },
  { id: "pillar-community", icon: Users, label: "Community with visible momentum" },
  { id: "pillar-trust", icon: ShieldCheck, label: "Trust signals on every surface" },
];

const formatAvatar = (avatar) =>
  avatar === "female" ? showcaseImages.avatarFemale : showcaseImages.avatarMale;

function SectionHeader({ eyebrow, title, description, testId }) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="section-eyebrow" data-testid={`${testId}-eyebrow`}>
        {eyebrow}
      </p>
      <h2 className="text-3xl font-serif text-slate-900 sm:text-4xl" data-testid={`${testId}-title`}>
        {title}
      </h2>
      <p className="text-sm leading-7 text-slate-600 sm:text-base" data-testid={`${testId}-description`}>
        {description}
      </p>
    </div>
  );
}

function ShowcasePage() {
  return (
    <div className="app-shell">
      <div className="app-shell__orb app-shell__orb--left" />
      <div className="app-shell__orb app-shell__orb--right" />

      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-16">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-900" data-testid="brand-kicker">
              Component Page
            </p>
            <h1 className="text-lg font-serif text-slate-900" data-testid="brand-title">
              Verdant Fund Design System
            </h1>
          </div>

          <nav className="hidden items-center gap-5 md:flex" data-testid="main-navigation">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-emerald-950"
                data-testid={link.id}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-24 px-6 py-10 md:px-10 md:py-14 lg:gap-32 lg:px-16 lg:py-16">
        <section className="section-reveal grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="section-eyebrow" data-testid="hero-section-eyebrow">
                Design system as an API
              </p>
              <h2 className="max-w-3xl text-4xl font-serif leading-[0.98] text-slate-900 sm:text-5xl lg:text-[4.6rem]" data-testid="hero-section-title">
                One premium editorial language for Campaign, Community, and Profile.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-lg" data-testid="hero-section-description">
                This single-page showcase turns a crowdfunding product into a calm, credible, green-blue system.
                Instead of generating disconnected screens, each module inherits the same spacing, radius,
                type, and trust signals.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-amber-600 px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(217,119,6,0.22)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-amber-700"
                data-testid="hero-primary-cta"
              >
                <a href="#campaign-preview">
                  Explore conversion module
                  <MoveRight className="h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-emerald-900/30 bg-white/80 px-7 text-sm font-semibold text-emerald-950 transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-emerald-900 hover:bg-emerald-50"
                data-testid="hero-secondary-cta"
              >
                <a href="#profile-preview">
                  View trust layer
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {trustPillars.map(({ id, icon: Icon, label }) => (
                <Card key={id} className="editorial-card border-white/70 bg-white/80" data-testid={id}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-full bg-emerald-50 p-2 text-emerald-900">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-700" data-testid={`${id}-label`}>
                      {label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="section-reveal stagger-2 space-y-6">
            <Card className="glass-panel overflow-hidden border-white/60 bg-white/75" data-testid="hero-config-card">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-eyebrow" data-testid="hero-config-eyebrow">
                      Token preview
                    </p>
                    <h3 className="mt-2 text-2xl font-serif text-slate-900" data-testid="hero-config-title">
                      Brand tokens first, screens second.
                    </h3>
                  </div>
                  <Badge className="rounded-full bg-emerald-900 px-3 py-1 text-white" data-testid="hero-config-badge">
                    System Ready
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {keyStats.map((stat) => (
                    <div key={stat.id} className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4" data-testid={stat.id}>
                      <p className="text-2xl font-serif text-emerald-950" data-testid={`${stat.id}-value`}>
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600" data-testid={`${stat.id}-label`}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="code-panel" data-testid="design-system-code-snippet">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-700">{configSnippet}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="design-system" className="section-reveal space-y-10">
          <SectionHeader
            eyebrow="Style guide"
            title="A trustworthy palette, an editorial type rhythm, and token-level consistency."
            description="The page behaves like a documentation surface and a sales surface at once. Color, typography, spacing, and card treatment stay stable so each generated component feels authored by the same team."
            testId="design-system-section"
          />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="editorial-card border-white/70 bg-white/90" data-testid="palette-card">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-emerald-900" />
                  <h3 className="text-xl font-serif text-slate-900" data-testid="palette-card-title">
                    Core color palette
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {paletteTokens.map((token) => (
                    <div key={token.id} className="rounded-[1.5rem] border border-slate-200/80 p-4" data-testid={`${token.id}-token-card`}>
                      <div className="token-swatch" style={{ backgroundColor: token.value }} data-testid={`${token.id}-token-swatch`} />
                      <div className="mt-4 space-y-1">
                        <p className="text-lg font-semibold text-slate-900" data-testid={`${token.id}-token-name`}>
                          {token.name}
                        </p>
                        <p className="font-mono text-sm text-slate-500" data-testid={`${token.id}-token-value`}>
                          {token.value}
                        </p>
                        <p className="text-sm leading-6 text-slate-600" data-testid={`${token.id}-token-note`}>
                          {token.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="editorial-card border-white/70 bg-white/90" data-testid="typography-card">
                <CardContent className="space-y-5 p-6 lg:p-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-sky-800" />
                    <h3 className="text-xl font-serif text-slate-900" data-testid="typography-card-title">
                      Typography hierarchy
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {typeSpec.map((spec) => (
                      <div key={spec.id} className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid={spec.id}>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500" data-testid={`${spec.id}-label`}>
                          {spec.label}
                        </p>
                        <p className={`mt-3 ${spec.style} text-slate-900`} data-testid={`${spec.id}-preview`}>
                          {spec.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="editorial-card border-white/70 bg-gradient-to-br from-emerald-950 to-sky-950 text-white" data-testid="spacing-card">
                <CardContent className="space-y-5 p-6 lg:p-8">
                  <h3 className="text-xl font-serif" data-testid="spacing-card-title">
                    Spacing + radius rules
                  </h3>
                  <div className="grid gap-3 text-sm leading-6 text-white/80 sm:grid-cols-2">
                    <p data-testid="spacing-rule-sections">Sections breathe at 6rem to 8rem vertical spacing.</p>
                    <p data-testid="spacing-rule-cards">Cards use 1.25rem to 1.75rem radius for softness without blur.</p>
                    <p data-testid="spacing-rule-grids">Responsive grids stack early to avoid horizontal overflow.</p>
                    <p data-testid="spacing-rule-cta">Call-to-action moments reserve amber for contrast and urgency.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="campaign-preview" className="section-reveal space-y-10">
          <SectionHeader
            eyebrow="Campaign · conversion"
            title="A donation surface that feels urgent, clear, and remarkably trustworthy."
            description="The campaign module uses a magazine-like story column on the left and a sticky decision panel on the right. It preserves credibility with organizer identity, donor momentum, and generous whitespace."
            testId="campaign-section"
          />

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="space-y-6 lg:col-span-7">
              <Card className="editorial-card overflow-hidden border-white/70 bg-white/90" data-testid="campaign-hero-card">
                <div className="aspect-[4/3] overflow-hidden" data-testid="campaign-hero-image-frame">
                  <img
                    src={showcaseImages.heroCampaign}
                    alt="Community members tending a rooftop garden"
                    className="h-full w-full object-cover object-center"
                    data-testid="campaign-hero-image"
                  />
                </div>
                <CardContent className="space-y-5 p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-950 hover:bg-emerald-100" data-testid="campaign-category-badge">
                      Urban Climate Projects
                    </Badge>
                    <Badge className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-900 hover:bg-sky-50" data-testid="campaign-status-badge">
                      12 days left
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif text-slate-900" data-testid="campaign-title">
                      Grow a public rooftop garden for 400 neighborhood families.
                    </h3>
                    <p className="text-sm leading-7 text-slate-600 sm:text-base" data-testid="campaign-description">
                      The story area is intentionally long-form. It uses calm copy, visible stewardship, and image-led
                      credibility to turn donation into an informed decision rather than a rushed click.
                    </p>
                  </div>

                  <div className="grid gap-4 rounded-[2rem] border border-emerald-100 bg-emerald-50/70 p-4 md:grid-cols-[auto_1fr] md:items-center" data-testid="campaign-organizer-card">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm" data-testid="campaign-organizer-avatar">
                      <AvatarImage src={showcaseImages.avatarFemale} alt="Organizer portrait" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-[0.24em] text-emerald-900" data-testid="campaign-organizer-label">
                        Organizer
                      </p>
                      <p className="text-lg font-semibold text-slate-900" data-testid="campaign-organizer-name">
                        Maya Chen · Community Architect
                      </p>
                      <p className="text-sm leading-6 text-slate-600" data-testid="campaign-organizer-note">
                        7 past campaigns funded · 98% fulfillment rate · verified stewardship history
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem]" data-testid="campaign-detail-image-frame">
                      <img
                        src={showcaseImages.campaignDetail}
                        alt="Detail view of a sustainable community garden"
                        className="h-full w-full object-cover object-center"
                        data-testid="campaign-detail-image"
                      />
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-5" data-testid="campaign-story-card">
                      <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500" data-testid="campaign-story-label">
                        Rich text story
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600" data-testid="campaign-story-text">
                        The editorial story block keeps paragraphs roomy, uses textured backgrounds instead of hard dividers,
                        and frames each impact metric as evidence. This helps the donate panel feel earned.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Card className="editorial-card border-white/70 bg-white/95" data-testid="campaign-donate-card">
                  <CardContent className="space-y-6 p-6 lg:p-8">
                    <div className="space-y-2">
                      <p className="section-eyebrow" data-testid="campaign-progress-label">
                        Donation progress
                      </p>
                      <div className="flex items-end justify-between gap-4">
                        <p className="text-4xl font-serif text-slate-900" data-testid="campaign-progress-raised">
                          $86,400
                        </p>
                        <p className="text-sm text-slate-500" data-testid="campaign-progress-goal">
                          of $120,000 goal
                        </p>
                      </div>
                    </div>

                    <Progress value={72} className="h-3 bg-emerald-100" data-testid="campaign-progress-bar" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid="campaign-backer-count-card">
                        <p className="text-2xl font-serif text-slate-900" data-testid="campaign-backer-count-value">
                          1,248
                        </p>
                        <p className="text-sm text-slate-600" data-testid="campaign-backer-count-label">
                          total backers
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid="campaign-average-gift-card">
                        <p className="text-2xl font-serif text-slate-900" data-testid="campaign-average-gift-value">
                          $69
                        </p>
                        <p className="text-sm text-slate-600" data-testid="campaign-average-gift-label">
                          average gift
                        </p>
                      </div>
                    </div>

                    <Button
                      className="h-12 w-full rounded-full bg-amber-600 text-sm font-semibold text-white shadow-[0_20px_44px_rgba(217,119,6,0.25)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-amber-700"
                      data-testid="campaign-donate-button"
                    >
                      Donate to this campaign
                    </Button>

                    <div className="space-y-4" data-testid="campaign-recent-donations-list">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-lg font-serif text-slate-900" data-testid="campaign-recent-donations-title">
                          Recent donations
                        </h4>
                        <HeartHandshake className="h-4 w-4 text-emerald-900" />
                      </div>

                      {donationFeed.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 px-4 py-3"
                          data-testid={donation.id}
                        >
                          <div>
                            <p className="font-medium text-slate-900" data-testid={`${donation.id}-name`}>
                              {donation.name}
                            </p>
                            <p className="text-sm text-slate-500" data-testid={`${donation.id}-time`}>
                              {donation.time}
                            </p>
                          </div>
                          <p className="text-base font-semibold text-emerald-950" data-testid={`${donation.id}-amount`}>
                            {donation.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="community-preview" className="section-reveal space-y-10">
          <SectionHeader
            eyebrow="Community · gamification"
            title="A leaderboard that rewards momentum without losing warmth."
            description="The community surface treats social proof as a calm data story. A bento layout highlights aggregate impact first, then ranks fundraisers with subtle trend signals and trending campaign badges."
            testId="community-section"
          />

          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="editorial-card border-white/70 bg-white/90 lg:col-span-4" data-testid="community-metrics-card">
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-emerald-900" />
                  <h3 className="text-xl font-serif text-slate-900" data-testid="community-metrics-title">
                    Aggregate metrics
                  </h3>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] bg-emerald-950 p-5 text-white" data-testid="community-total-raised-card">
                    <p className="text-3xl font-serif" data-testid="community-total-raised-value">$12.8M</p>
                    <p className="mt-2 text-sm text-white/75" data-testid="community-total-raised-label">total raised across the community</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-5" data-testid="community-total-donors-card">
                    <p className="text-3xl font-serif text-slate-900" data-testid="community-total-donors-value">43,912</p>
                    <p className="mt-2 text-sm text-slate-600" data-testid="community-total-donors-label">total donors contributing this quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="editorial-card border-white/70 bg-white/90 lg:col-span-3" data-testid="community-trending-card">
              <CardContent className="space-y-5 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-sky-800" />
                  <h3 className="text-xl font-serif text-slate-900" data-testid="community-trending-title">
                    Trending campaigns
                  </h3>
                </div>
                <div className="space-y-4">
                  {trendingCampaigns.map((campaign) => (
                    <div key={campaign.id} className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid={campaign.id}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900" data-testid={`${campaign.id}-name`}>{campaign.name}</p>
                        <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 hover:bg-amber-100" data-testid={`${campaign.id}-badge`}>
                          {campaign.tag}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600" data-testid={`${campaign.id}-value`}>{campaign.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="editorial-card border-white/70 bg-white/90 lg:col-span-5" data-testid="community-leaderboard-card">
              <CardContent className="space-y-5 p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-serif text-slate-900" data-testid="community-leaderboard-title">
                    Top fundraisers
                  </h3>
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-950 hover:bg-emerald-100" data-testid="community-leaderboard-badge">
                    Live momentum view
                  </Badge>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3"
                      data-testid={entry.id}
                    >
                      <p className="w-8 text-sm font-semibold text-slate-500" data-testid={`${entry.id}-rank`}>
                        {entry.rank}
                      </p>
                      <Avatar className="h-11 w-11" data-testid={`${entry.id}-avatar`}>
                        <AvatarImage src={formatAvatar(entry.avatar)} alt={`${entry.name} portrait`} />
                        <AvatarFallback>{entry.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-[140px] flex-1">
                        <p className="font-semibold text-slate-900" data-testid={`${entry.id}-name`}>
                          {entry.name}
                        </p>
                        <p className="text-sm text-slate-500" data-testid={`${entry.id}-trend`}>
                          {entry.trend} this week
                        </p>
                      </div>
                      <p className="text-lg font-serif text-emerald-950" data-testid={`${entry.id}-amount`}>
                        {entry.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="profile-preview" className="section-reveal space-y-10 pb-10">
          <SectionHeader
            eyebrow="Profile · trust"
            title="A profile dashboard where reputation is visible, measurable, and human."
            description="The trust layer combines identity, social proof, and campaign history. It avoids gamified noise by giving the trust score room to breathe and by summarizing prior wins in a clean grid."
            testId="profile-section"
          />

          <Card className="editorial-card overflow-hidden border-white/70 bg-white/92" data-testid="profile-header-card">
            <CardContent className="grid gap-8 p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-emerald-100 shadow-sm" data-testid="profile-avatar">
                    <AvatarImage src={showcaseImages.avatarMale} alt="Profile owner portrait" />
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="section-eyebrow" data-testid="profile-label">
                      Verified profile
                    </p>
                    <h3 className="text-3xl font-serif text-slate-900" data-testid="profile-name">
                      Jonas Reid
                    </h3>
                    <p className="text-sm text-slate-600" data-testid="profile-role">
                      Organizer, donor, and mentor across climate-focused community campaigns
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid="profile-followers-card">
                    <p className="text-2xl font-serif text-slate-900" data-testid="profile-followers-value">12.4k</p>
                    <p className="text-sm text-slate-600" data-testid="profile-followers-label">followers</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4" data-testid="profile-campaigns-card">
                    <p className="text-2xl font-serif text-slate-900" data-testid="profile-campaigns-value">18</p>
                    <p className="text-sm text-slate-600" data-testid="profile-campaigns-label">successful campaigns</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-4" data-testid="profile-trust-score-card">
                    <p className="text-2xl font-serif text-emerald-950" data-testid="profile-trust-score-value">94 / 100</p>
                    <p className="text-sm text-slate-600" data-testid="profile-trust-score-label">trust score</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-sky-900 p-6 text-white" data-testid="profile-trust-panel">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-eyebrow text-white/70" data-testid="profile-trust-panel-label">
                      Trust composition
                    </p>
                    <h4 className="mt-2 text-2xl font-serif" data-testid="profile-trust-panel-title">
                      Reputation built through fulfillment, transparency, and repeat support.
                    </h4>
                  </div>
                  <BadgeCheck className="h-9 w-9 text-emerald-100" />
                </div>
                <div className="mt-6 space-y-4">
                  <div data-testid="profile-trust-metric-fulfillment">
                    <div className="mb-2 flex items-center justify-between text-sm text-white/75">
                      <span data-testid="profile-trust-metric-fulfillment-label">Fulfillment history</span>
                      <span data-testid="profile-trust-metric-fulfillment-value">98%</span>
                    </div>
                    <Progress value={98} className="h-2 bg-white/15 [&>div]:bg-white" data-testid="profile-trust-metric-fulfillment-bar" />
                  </div>
                  <div data-testid="profile-trust-metric-updates">
                    <div className="mb-2 flex items-center justify-between text-sm text-white/75">
                      <span data-testid="profile-trust-metric-updates-label">Update consistency</span>
                      <span data-testid="profile-trust-metric-updates-value">91%</span>
                    </div>
                    <Progress value={91} className="h-2 bg-white/15 [&>div]:bg-white" data-testid="profile-trust-metric-updates-bar" />
                  </div>
                  <div data-testid="profile-trust-metric-repeat">
                    <div className="mb-2 flex items-center justify-between text-sm text-white/75">
                      <span data-testid="profile-trust-metric-repeat-label">Repeat donor confidence</span>
                      <span data-testid="profile-trust-metric-repeat-value">88%</span>
                    </div>
                    <Progress value={88} className="h-2 bg-white/15 [&>div]:bg-white" data-testid="profile-trust-metric-repeat-bar" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {profileWins.map((win) => (
              <Card key={win.id} className="editorial-card border-white/70 bg-white/92" data-testid={win.id}>
                <CardContent className="space-y-4 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500" data-testid={`${win.id}-meta`}>
                    {win.meta}
                  </p>
                  <h4 className="text-2xl font-serif text-slate-900" data-testid={`${win.id}-title`}>
                    {win.title}
                  </h4>
                  <p className="text-3xl font-serif text-emerald-950" data-testid={`${win.id}-amount`}>
                    {win.amount}
                  </p>
                  <p className="text-sm leading-7 text-slate-600" data-testid={`${win.id}-note`}>
                    {win.note}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ShowcasePage;