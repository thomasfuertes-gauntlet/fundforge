import { Hono } from "hono";
import { cors } from "hono/cors";
import { profileRoutes } from "./routes/profiles";
import { campaignRoutes } from "./routes/campaigns";
import { donationRoutes } from "./routes/donations";
import { communityRoutes } from "./routes/community";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS for local dev (Vite on 5173 -> Wrangler on 8787)
app.use("/api/*", cors());

// Mount routes
app.route("/api/profiles", profileRoutes);
app.route("/api/campaigns", campaignRoutes);
app.route("/api/donations", donationRoutes);
app.route("/api/community", communityRoutes);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
