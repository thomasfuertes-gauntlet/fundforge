import profiles from "./profiles.json";
import campaigns from "./campaigns.json";
import donations from "./donations.json";
import community from "./community.json";

export { profiles, campaigns, donations, community };

/** Look up a profile by ID */
export function getProfile(id) {
  return profiles.find((p) => p.id === id);
}

/** Look up a campaign by ID */
export function getCampaign(id) {
  return campaigns.find((c) => c.id === id);
}

/** Get all campaigns for a given organizer profile ID */
export function getCampaignsByOrganizer(profileId) {
  return campaigns.filter((c) => c.organizerId === profileId);
}

/** Get donations for a specific campaign, sorted most recent first */
export function getDonationsByCampaign(campaignId) {
  return donations
    .filter((d) => d.campaignId === campaignId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/** Get active campaigns only */
export function getActiveCampaigns() {
  return campaigns.filter((c) => c.status === "active");
}

/**
 * Compute trust score from inputs (for verification).
 * trust_score = (fulfillmentRate * 0.4) + (updateConsistency * 0.3) + (repeatDonorConfidence * 0.3)
 */
export function computeTrustScore(fulfillmentRate, updateConsistency, repeatDonorConfidence) {
  return Math.round(
    fulfillmentRate * 0.4 + updateConsistency * 0.3 + repeatDonorConfidence * 0.3
  );
}
