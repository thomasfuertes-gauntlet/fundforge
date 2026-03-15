import { Hono } from "hono";
import { cors } from "hono/cors";
import { profileRoutes } from "./routes/profiles";
import { campaignRoutes } from "./routes/campaigns";
import { donationRoutes } from "./routes/donations";
import { communityRoutes } from "./routes/community";
import { abRoutes } from "./routes/ab";

type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS for local dev (Vite on 5173 -> Wrangler on 8787)
app.use("/api/*", cors());

// Mount routes
app.route("/api/profiles", profileRoutes);
app.route("/api/campaigns", campaignRoutes);
app.route("/api/donations", donationRoutes);
app.route("/api/community", communityRoutes);
app.route("/api/ab", abRoutes);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// ── Route-aware data preloading ──────────────────────────────────────
// KEY-DECISION 2026-03-14: Worker queries D1 at HTML-serve time and
// injects results as window.__PRELOAD__. "SSR for data" - HTML arrives
// with data pre-embedded, eliminating the client-side fetch waterfall.
// Cost: ~10-25ms server-side (parallel D1 queries on the edge).
// Savings: ~100-500ms client-side (eliminates network round-trips).

const STATIC_PRELOADS: Record<string, string[]> = {
  "/": ["/api/community", "/api/profiles"],
  "/community": ["/api/community", "/api/campaigns?status=active", "/api/profiles"],
};

function getPreloadsForPath(path: string): string[] {
  if (STATIC_PRELOADS[path]) return STATIC_PRELOADS[path];

  const campaignMatch = path.match(/^\/campaign\/([^/]+)$/);
  if (campaignMatch) {
    const id = campaignMatch[1];
    return [`/api/campaigns/${id}`, `/api/donations?campaignId=${id}`, "/api/community", "/api/campaigns?status=active"];
  }

  const profileMatch = path.match(/^\/profile\/([^/]+)$/);
  if (profileMatch) {
    const id = profileMatch[1];
    return [`/api/profiles/${id}`, `/api/campaigns?organizerId=${id}`, "/api/profiles"];
  }

  return [];
}

// SPA fallback: serve assets with inline preloaded data
app.all("*", async (c) => {
  const url = new URL(c.req.url);

  // Unknown API paths get a proper 404, not index.html
  if (url.pathname.startsWith("/api/")) return c.notFound();

  const response = await c.env.ASSETS.fetch(c.req.raw);

  // Only process HTML page navigations
  const contentType = response.headers.get("Content-Type") || "";
  if (c.req.method !== "GET" || !contentType.includes("text/html")) {
    return response;
  }

  const preloads = getPreloadsForPath(url.pathname);
  if (preloads.length === 0) return response;

  // Fetch all preload data in parallel via in-process Hono requests
  const preloadEntries = await Promise.all(
    preloads.map(async (apiPath) => {
      try {
        const apiRequest = new Request(new URL(apiPath, url.origin));
        const apiResponse = await app.fetch(apiRequest, c.env, c.executionCtx);
        if (apiResponse.ok) {
          return [apiPath, await apiResponse.json()] as const;
        }
      } catch {
        // Silently skip failed preloads - client will fetch normally
      }
      return null;
    })
  );

  const preloadData: Record<string, unknown> = {};
  for (const entry of preloadEntries) {
    if (entry) preloadData[entry[0]] = entry[1];
  }

  // Link headers as fallback for any endpoints that failed inline
  const linkHeader = preloads
    .map((href) => `<${href}>; rel=preload; as=fetch; crossorigin`)
    .join(", ");

  const headers = new Headers(response.headers);
  headers.append("Link", linkHeader);

  // Inject preload data into HTML - escape < to prevent XSS via </script>
  const json = JSON.stringify(preloadData).replace(/</g, "\\u003c");
  const rewriter = new HTMLRewriter().on("head", {
    element(el) {
      el.append(`<script>window.__PRELOAD__=${json}</script>`, { html: true });
    },
  });

  return rewriter.transform(
    new Response(response.body, { status: response.status, headers })
  );
});

export default app;
