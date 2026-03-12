import { Hono } from "hono";
import { transformProfile } from "../lib/transforms";

type Bindings = { DB: D1Database };

export const profileRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/profiles - list all
profileRoutes.get("/", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM profiles").all();
  return c.json(results.map(transformProfile));
});

// GET /api/profiles/:id
profileRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare("SELECT * FROM profiles WHERE id = ?")
    .bind(id)
    .first();
  if (!row) return c.json({ error: "Profile not found" }, 404);
  return c.json(transformProfile(row));
});

// POST /api/profiles/:id/follow - increment followers
profileRoutes.post("/:id/follow", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare(
    "UPDATE profiles SET followers = followers + 1 WHERE id = ? RETURNING followers"
  )
    .bind(id)
    .first();
  if (!result) return c.json({ error: "Profile not found" }, 404);
  return c.json({ followers: result.followers });
});
