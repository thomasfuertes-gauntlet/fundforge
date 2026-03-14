import { Hono } from "hono";

type Bindings = { DB: D1Database };

export const abRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/ab/track - persist experiment event to D1
abRoutes.post("/track", async (c) => {
  const body = await c.req.json<{
    visitorId: string;
    experiment: string;
    variation: string;
    eventType: string;
    url?: string;
  }>();

  if (!body.visitorId || !body.experiment || !body.variation || !body.eventType) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  await c.env.DB.prepare(
    "INSERT INTO ab_events (visitor_id, experiment, variation, event_type, url) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(body.visitorId, body.experiment, body.variation, body.eventType, body.url || null)
    .run();

  return c.json({ ok: true });
});

// GET /api/ab/results - per-experiment rollup + total visitor count for site-wide conv rates
abRoutes.get("/results", async (c) => {
  const [rollup, totals] = await c.env.DB.batch([
    c.env.DB.prepare(
      `SELECT experiment, variation, event_type,
              COUNT(DISTINCT visitor_id) as unique_visitors
       FROM ab_events
       GROUP BY experiment, variation, event_type`
    ),
    c.env.DB.prepare(
      `SELECT COUNT(DISTINCT visitor_id) as total_visitors FROM ab_events`
    ),
  ]);

  return c.json({
    rows: rollup.results,
    totalVisitors: (totals.results[0] as any)?.total_visitors ?? 0,
  });
});
