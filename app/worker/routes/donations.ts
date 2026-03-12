import { Hono } from "hono";
import { transformDonation } from "../lib/transforms";

type Bindings = { DB: D1Database };

export const donationRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/donations?campaignId=X - sorted desc by timestamp
donationRoutes.get("/", async (c) => {
  const campaignId = c.req.query("campaignId");
  if (!campaignId) {
    return c.json({ error: "campaignId query parameter required" }, 400);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM donations WHERE campaign_id = ? ORDER BY timestamp DESC"
  )
    .bind(campaignId)
    .all();

  return c.json(results.map(transformDonation));
});

// POST /api/donations - create donation + update campaign atomically
donationRoutes.post("/", async (c) => {
  const body = await c.req.json<{
    campaignId: string;
    donorName: string;
    amount: number;
    message?: string;
  }>();

  if (!body.campaignId || !body.donorName || !body.amount || body.amount <= 0) {
    return c.json({ error: "campaignId, donorName, and positive amount required" }, 400);
  }

  const id = `donation-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Atomic: insert donation + update campaign stats
  const results = await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO donations (id, campaign_id, donor_name, amount, timestamp, message) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, body.campaignId, body.donorName, body.amount, timestamp, body.message || null),
    c.env.DB.prepare(
      `UPDATE campaigns
       SET raised = raised + ?,
           backer_count = backer_count + 1,
           average_gift = CAST((raised + ?) AS INTEGER) / (backer_count + 1)
       WHERE id = ?`
    ).bind(body.amount, body.amount, body.campaignId),
  ]);

  return c.json(
    {
      id,
      campaignId: body.campaignId,
      donorName: body.donorName,
      amount: body.amount,
      timestamp,
      message: body.message || null,
    },
    201
  );
});
