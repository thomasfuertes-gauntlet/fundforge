import { Hono } from "hono";

type Bindings = { DB: D1Database };

export const communityRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/community - computed aggregates, leaderboard, trending
communityRoutes.get("/", async (c) => {
  const db = c.env.DB;

  // Run all queries in parallel
  const [aggregatesResult, leaderboardResult, trendingResult] = await Promise.all([
    // Aggregates: computed from campaigns table
    db.prepare(`
      SELECT
        SUM(raised) as total_raised,
        SUM(backer_count) as total_backers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
        COUNT(CASE WHEN status != 'active' THEN 1 END) as completed_campaigns,
        COUNT(CASE WHEN status = 'funded' THEN 1 END) as funded_campaigns
      FROM campaigns
    `).first(),

    // Leaderboard: profiles with their active campaign, ranked by totalRaised * trustScore
    db.prepare(`
      SELECT
        p.id as profile_id,
        p.name,
        p.avatar,
        p.total_raised,
        p.trust_score,
        p.campaigns_funded,
        c.id as active_campaign_id,
        c.weekly_momentum as weekly_trend
      FROM profiles p
      LEFT JOIN campaigns c ON c.organizer_id = p.id AND c.status = 'active'
      ORDER BY (p.total_raised * p.trust_score / 100) DESC
    `).all(),

    // Trending: active campaigns with weeklyMomentum > 20, sorted by momentum
    db.prepare(`
      SELECT
        c.id as campaign_id,
        c.title,
        p.id as organizer_id,
        p.name as organizer_name,
        c.weekly_momentum,
        c.raised,
        c.backer_count
      FROM campaigns c
      JOIN profiles p ON p.id = c.organizer_id
      WHERE c.status = 'active' AND c.weekly_momentum > 20
      ORDER BY c.weekly_momentum DESC
    `).all(),
  ]);

  const agg = aggregatesResult!;
  const totalBacers = (agg.total_backers as number) || 0;
  const totalRaised = (agg.total_raised as number) || 0;
  const uniqueDonors = Math.round(totalBacers * 0.85);
  const avgGift = totalBacers > 0 ? Math.round(totalRaised / totalBacers) : 0;
  const completedCampaigns = (agg.completed_campaigns as number) || 0;
  const fundedCampaigns = (agg.funded_campaigns as number) || 0;
  const avgFundingRate = completedCampaigns > 0
    ? Math.round((fundedCampaigns / completedCampaigns) * 100)
    : 0;

  // Build leaderboard with ranks - deduplicate by profile (take first active campaign)
  const seen = new Set<string>();
  const leaderboard = (leaderboardResult.results || [])
    .filter((row) => {
      const pid = row.profile_id as string;
      if (seen.has(pid)) return false;
      seen.add(pid);
      return true;
    })
    .map((row, i) => ({
      profileId: row.profile_id,
      rank: i + 1,
      name: row.name,
      avatar: row.avatar,
      totalRaised: row.total_raised,
      trustScore: row.trust_score,
      weeklyTrend: row.weekly_trend || 0,
      activeCampaignId: row.active_campaign_id,
      campaignsFunded: row.campaigns_funded,
    }));

  // Build trending with tags
  const trending = (trendingResult.results || []).map((row) => {
    const momentum = row.weekly_momentum as number;
    // Estimate weekly raised from momentum percentage
    const raised = row.raised as number;
    const weeklyRaised = Math.round(raised * (momentum / 100));
    const weeklyDonors = Math.round((row.backer_count as number) * (momentum / 100));
    return {
      campaignId: row.campaign_id,
      title: row.title,
      organizerId: row.organizer_id,
      organizerName: row.organizer_name,
      tag: momentum >= 28 ? "Fastest Growth" : "Trending",
      weeklyMomentum: momentum,
      weeklyRaised,
      weeklyDonors,
    };
  });

  return c.json({
    aggregates: {
      totalRaised,
      totalDonors: uniqueDonors,
      activeCampaigns: agg.active_campaigns,
      completedCampaigns,
      fundedCampaigns,
      averageGift: avgGift,
      averageFundingRate: avgFundingRate,
    },
    leaderboard,
    trending,
  });
});
