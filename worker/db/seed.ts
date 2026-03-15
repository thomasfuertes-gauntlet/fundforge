#!/usr/bin/env tsx
// Reads JSON fixtures from app/src/data/ and outputs seed.sql
// Usage: cd app && npx tsx worker/db/seed.ts > worker/db/seed.sql

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "data");

function readJSON(filename: string) {
  return JSON.parse(readFileSync(resolve(dataDir, filename), "utf-8"));
}

function esc(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return esc(JSON.stringify(val));
  return `'${String(val).replace(/'/g, "''")}'`;
}

const profiles = readJSON("profiles.json");
const campaigns = readJSON("campaigns.json");
const donations = readJSON("donations.json");

const lines: string[] = [];
lines.push("-- Auto-generated seed data from JSON fixtures");
lines.push("-- Generated: " + new Date().toISOString());
lines.push("");

// Profiles
for (const p of profiles) {
  lines.push(`INSERT OR REPLACE INTO profiles (id, name, title, bio, avatar, roles, member_since, location, verified, verification_level, verification_email, verification_identity, verification_track_record, followers, trust_score, fulfillment_rate, update_consistency, repeat_donor_confidence, campaigns_organized, campaigns_funded, total_raised, total_donated, recommended_by) VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.title)}, ${esc(p.bio)}, ${esc(p.avatar)}, ${esc(p.roles)}, ${esc(p.memberSince)}, ${esc(p.location)}, ${esc(p.verified)}, ${esc(p.verificationLevel)}, ${esc(p.verificationDetails.email)}, ${esc(p.verificationDetails.identity)}, ${esc(p.verificationDetails.trackRecord)}, ${p.followers}, ${p.trust.score}, ${p.trust.fulfillmentRate}, ${p.trust.updateConsistency}, ${p.trust.repeatDonorConfidence}, ${p.stats.campaignsOrganized}, ${p.stats.campaignsFunded}, ${p.stats.totalRaised}, ${p.stats.totalDonated}, ${p.recommendedBy});`);
}

lines.push("");

// Campaigns
for (const c of campaigns) {
  lines.push(`INSERT OR REPLACE INTO campaigns (id, organizer_id, title, category, status, hero_image, images, goal, stretch_goal, matching_sponsor, raised, backer_count, average_gift, created_at, ends_at, ended_at, days_left, weekly_momentum, story, updates, testimonials, summary, delivery_timeline, fulfillment_status) VALUES (${esc(c.id)}, ${esc(c.organizerId)}, ${esc(c.title)}, ${esc(c.category)}, ${esc(c.status)}, ${esc(c.heroImage)}, ${esc(c.images || [])}, ${c.goal}, ${esc(c.stretchGoal || null)}, ${esc(c.matchingSponsor || null)}, ${c.raised}, ${c.backerCount}, ${c.averageGift}, ${esc(c.createdAt)}, ${esc(c.endsAt || null)}, ${esc(c.endedAt || null)}, ${c.daysLeft ?? "NULL"}, ${c.weeklyMomentum ?? 0}, ${esc(c.story || [])}, ${esc(c.updates || [])}, ${esc(c.testimonials || [])}, ${esc(c.summary || null)}, ${esc(c.deliveryTimeline || [])}, ${esc(c.fulfillmentStatus || null)});`);
}

lines.push("");

// Donations
for (const d of donations) {
  lines.push(`INSERT OR REPLACE INTO donations (id, campaign_id, donor_name, amount, timestamp, message) VALUES (${esc(d.id)}, ${esc(d.campaignId)}, ${esc(d.donorName)}, ${d.amount}, ${esc(d.timestamp)}, ${esc(d.message)});`);
}

console.log(lines.join("\n"));
