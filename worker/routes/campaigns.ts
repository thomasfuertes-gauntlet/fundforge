import { Hono } from "hono";
import { transformCampaign } from "../lib/transforms";

type Bindings = { DB: D1Database };

export const campaignRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/campaigns - list with optional filters
campaignRoutes.get("/", async (c) => {
  const status = c.req.query("status");
  const organizerId = c.req.query("organizerId");

  let sql = "SELECT * FROM campaigns";
  const conditions: string[] = [];
  const bindings: string[] = [];

  if (status) {
    conditions.push("status = ?");
    bindings.push(status);
  }
  if (organizerId) {
    conditions.push("organizer_id = ?");
    bindings.push(organizerId);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY created_at DESC";

  const stmt = c.env.DB.prepare(sql);
  const { results } = bindings.length > 0
    ? await stmt.bind(...bindings).all()
    : await stmt.all();

  return c.json(results.map(transformCampaign));
});

// GET /api/campaigns/:id
campaignRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare("SELECT * FROM campaigns WHERE id = ?")
    .bind(id)
    .first();
  if (!row) return c.json({ error: "Campaign not found" }, 404);
  return c.json(transformCampaign(row));
});
