// KEY-DECISION 2026-03: Module-level visitorId resets on hard refresh but persists
// across SPA navigation. Deterministic FNV-1a bucketing means same visitor always
// sees same variant within a session - no storage needed.

const visitorId = crypto.randomUUID();
const impressions = new Set();
const buckets = new Map();

// FNV-1a 32-bit hash - fast, good distribution for short strings
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function ab(expName) {
  if (!buckets.has(expName)) {
    const treatment = (fnv1a(visitorId + expName) % 100) >= 50;
    buckets.set(expName, treatment);
  }
  if (!impressions.has(expName)) {
    impressions.add(expName);
    track(visitorId, expName, buckets.get(expName) ? 'treatment' : 'control', 'impression');
  }
  return buckets.get(expName);
}

// Track arbitrary funnel events (e.g., 'cta_click', 'donate_open', 'donate_complete')
ab.track = (expName, eventType) => {
  if (!buckets.has(expName)) return; // no impression = no tracking
  track(visitorId, expName, buckets.get(expName) ? 'treatment' : 'control', eventType);
};

// Shorthand for final conversion event
ab.convert = (expName) => ab.track(expName, 'donate_complete');

// Forward an event to ALL active experiments (called from analytics.emit)
ab.trackAll = (eventType) => {
  for (const [expName] of buckets) {
    ab.track(expName, eventType);
  }
};

// Expose bucket map for dashboard introspection
ab.getBuckets = () => Object.fromEntries(buckets);

function track(vid, experiment, variation, eventType) {
  const payload = JSON.stringify({ visitorId: vid, experiment, variation, eventType, url: location.pathname });
  navigator.sendBeacon('/api/ab/track', new Blob([payload], { type: 'application/json' }));
}

window.ab = ab;
export { ab, visitorId };
