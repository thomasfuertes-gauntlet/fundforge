import { Hono } from "hono";

type Bindings = { DB: D1Database; AB?: AnalyticsEngineDataset };

export const abRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/ab/track - dual-write to Analytics Engine + D1
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

  // Analytics Engine (durable, Cloudflare-managed retention)
  c.env.AB?.writeDataPoint({
    blobs: [body.experiment, body.variation, body.eventType, body.url || ""],
    doubles: [body.variation === "treatment" ? 1 : 0],
    indexes: [body.visitorId],
  });

  // D1 (queryable for dashboard rollups)
  await c.env.DB.prepare(
    "INSERT INTO ab_events (visitor_id, experiment, variation, event_type, url) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(body.visitorId, body.experiment, body.variation, body.eventType, body.url || null)
    .run();

  return c.json({ ok: true });
});

// GET /api/ab/results - rollup for dashboard
abRoutes.get("/results", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT experiment, variation, event_type,
            COUNT(DISTINCT visitor_id) as unique_visitors
     FROM ab_events
     GROUP BY experiment, variation, event_type`
  ).all();

  return c.json(results);
});
