// Row-to-API-shape transformers
// Convert flat DB rows (snake_case) back to nested API shapes (camelCase)
// matching the JSON fixture format exactly

export function transformProfile(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    bio: row.bio,
    avatar: row.avatar,
    roles: JSON.parse(row.roles as string),
    memberSince: row.member_since,
    location: row.location,
    verified: Boolean(row.verified),
    verificationLevel: row.verification_level,
    verificationDetails: {
      email: Boolean(row.verification_email),
      identity: Boolean(row.verification_identity),
      trackRecord: Boolean(row.verification_track_record),
    },
    followers: row.followers,
    trust: {
      score: row.trust_score,
      fulfillmentRate: row.fulfillment_rate,
      updateConsistency: row.update_consistency,
      repeatDonorConfidence: row.repeat_donor_confidence,
    },
    stats: {
      campaignsOrganized: row.campaigns_organized,
      campaignsFunded: row.campaigns_funded,
      totalRaised: row.total_raised,
      totalDonated: row.total_donated,
    },
    recommendedBy: row.recommended_by,
  };
}

export function transformCampaign(row: Record<string, unknown>) {
  const campaign: Record<string, unknown> = {
    id: row.id,
    organizerId: row.organizer_id,
    title: row.title,
    category: row.category,
    status: row.status,
    heroImage: row.hero_image,
    goal: row.goal,
    raised: row.raised,
    backerCount: row.backer_count,
    averageGift: row.average_gift,
    createdAt: row.created_at,
    weeklyMomentum: row.weekly_momentum,
  };

  // Conditional fields based on status
  if (row.status === "active") {
    campaign.endsAt = row.ends_at;
    campaign.daysLeft = row.days_left;
    campaign.images = JSON.parse(row.images as string || "[]");
    campaign.story = JSON.parse(row.story as string || "[]");
    campaign.updates = JSON.parse(row.updates as string || "[]");
    campaign.testimonials = JSON.parse(row.testimonials as string || "[]");
  } else {
    campaign.endedAt = row.ended_at;
    campaign.summary = row.summary;
  }

  // Optional nested objects
  if (row.stretch_goal) {
    campaign.stretchGoal = JSON.parse(row.stretch_goal as string);
  }
  if (row.matching_sponsor) {
    campaign.matchingSponsor = JSON.parse(row.matching_sponsor as string);
  }

  return campaign;
}

export function transformDonation(row: Record<string, unknown>) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    donorName: row.donor_name,
    amount: row.amount,
    timestamp: row.timestamp,
    message: row.message || null,
  };
}
