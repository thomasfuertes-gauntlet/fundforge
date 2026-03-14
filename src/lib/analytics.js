/**
 * Instrumentation layer for FundForge.
 *
 * Event taxonomy:
 *   page_view       - route change (funnel: community -> campaign -> donate)
 *   donate_click    - donate button opened modal (conversion intent)
 *   donate_complete - donation confirmed in modal (conversion)
 *   share_click     - share button clicked (viral coefficient)
 *   scroll_depth    - campaign story scroll milestones (content engagement)
 *   web_vital       - LCP, FID, CLS, INP, TTFB (performance budget)
 *   error           - unhandled JS errors + promise rejections (reliability)
 *
 * In production, replace `emit()` with a POST to /api/events or a
 * third-party like Segment, Amplitude, or a Cloudflare Worker endpoint.
 *
 * A/B integration: emit() auto-forwards funnel events (donate_click,
 * donate_complete, share_click, scroll_depth) to all active experiments
 * via ab.trackAll(). No per-page AB calls needed.
 */
import { ab } from "./ab";

// ─── Session ────────────────────────────────────
const SESSION_KEY = "ff_session_id";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ─── Event Bus ──────────────────────────────────
const eventLog = [];

function emit(type, payload = {}) {
  const event = {
    type,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...payload,
  };
  eventLog.push(event);

  // Forward funnel events to all active AB experiments
  // KEY-DECISION 2026-03: AB hooks into analytics.emit() so pages don't need
  // explicit ab.track() calls - single event bus, no duplication.
  if (type !== "web_vital" && type !== "error" && type !== "page_view") {
    ab.trackAll(type);
  }

  // Structured console output grouped by type
  if (import.meta.env.DEV) {
    console.log(
      `%c[analytics] ${type}`,
      "color: #0F3C32; font-weight: bold",
      payload
    );
  }
}

/** Read-only access to captured events (for debug UI or export) */
export function getEvents() {
  return [...eventLog];
}

// ─── Page Views ─────────────────────────────────
export function trackPageView(pageName, params = {}) {
  emit("page_view", {
    page: pageName,
    params,
    referrer: document.referrer,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });
}

// ─── Conversion Events ─────────────────────────
export function trackDonateClick(campaignId) {
  emit("donate_click", { campaignId });
}

export function trackDonateComplete(campaignId, amount) {
  emit("donate_complete", { campaignId, amount });
}

export function trackShareClick(campaignId) {
  emit("share_click", { campaignId });
}

// ─── Engagement ─────────────────────────────────
const firedDepths = new Set();

export function trackScrollDepth(campaignId, percent) {
  const milestone = [25, 50, 75, 100].find((m) => percent >= m && !firedDepths.has(`${campaignId}-${m}`));
  if (milestone) {
    firedDepths.add(`${campaignId}-${milestone}`);
    emit("scroll_depth", { campaignId, milestone });
  }
}

export function resetScrollDepth() {
  firedDepths.clear();
}

// ─── Web Vitals ─────────────────────────────────
export async function initWebVitals() {
  try {
    const { onLCP, onFID, onCLS, onINP, onTTFB } = await import("web-vitals");
    const report = (metric) =>
      emit("web_vital", {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating, // "good" | "needs-improvement" | "poor"
      });
    onLCP(report);
    onFID(report);
    onCLS(report);
    onINP(report);
    onTTFB(report);
  } catch {
    // web-vitals not available - skip silently
  }
}

// ─── Error Tracking ─────────────────────────────
export function initErrorTracking() {
  window.addEventListener("error", (e) => {
    emit("error", {
      message: e.message,
      source: e.filename,
      line: e.lineno,
      col: e.colno,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    emit("error", {
      message: String(e.reason),
      source: "unhandledrejection",
    });
  });
}
