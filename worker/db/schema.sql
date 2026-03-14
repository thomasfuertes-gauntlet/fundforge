-- FundForge D1 Schema
-- Flattened for query performance, JSON columns for arrays fetched whole

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  roles TEXT NOT NULL DEFAULT '[]',           -- JSON array of strings
  member_since TEXT NOT NULL,
  location TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  verification_level TEXT NOT NULL,
  verification_email INTEGER NOT NULL DEFAULT 0,
  verification_identity INTEGER NOT NULL DEFAULT 0,
  verification_track_record INTEGER NOT NULL DEFAULT 0,
  followers INTEGER NOT NULL DEFAULT 0,
  trust_score INTEGER NOT NULL,
  fulfillment_rate INTEGER NOT NULL,
  update_consistency INTEGER NOT NULL,
  repeat_donor_confidence INTEGER NOT NULL,
  campaigns_organized INTEGER NOT NULL DEFAULT 0,
  campaigns_funded INTEGER NOT NULL DEFAULT 0,
  total_raised INTEGER NOT NULL DEFAULT 0,
  total_donated INTEGER NOT NULL DEFAULT 0,
  recommended_by INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  organizer_id TEXT NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',       -- active | funded | unfunded
  hero_image TEXT,
  images TEXT DEFAULT '[]',                    -- JSON array of image URLs
  goal INTEGER NOT NULL,
  stretch_goal TEXT,                           -- JSON object {amount, label} or null
  matching_sponsor TEXT,                       -- JSON object {name, multiplier, remaining} or null
  raised INTEGER NOT NULL DEFAULT 0,
  backer_count INTEGER NOT NULL DEFAULT 0,
  average_gift INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  ends_at TEXT,                                -- null for past campaigns
  ended_at TEXT,                               -- null for active campaigns
  days_left INTEGER,
  weekly_momentum INTEGER DEFAULT 0,
  story TEXT DEFAULT '[]',                     -- JSON array of paragraph strings
  updates TEXT DEFAULT '[]',                   -- JSON array of update objects
  testimonials TEXT DEFAULT '[]',              -- JSON array of testimonial objects
  summary TEXT                                 -- text summary for past campaigns
);

CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id),
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  message TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_campaigns_organizer ON campaigns(organizer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_timestamp ON donations(timestamp DESC);

-- A/B testing events (dual-written with Analytics Engine)
CREATE TABLE IF NOT EXISTS ab_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  experiment TEXT NOT NULL,
  variation TEXT NOT NULL,
  event_type TEXT NOT NULL,
  url TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ab_exp_event ON ab_events(experiment, event_type);
