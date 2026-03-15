import { useState, useEffect, useCallback } from "react";

// KEY-DECISION 2026-03-15: Shared fetch cache eliminates redundant requests.
// prefetch() warms the cache on hover; useFetch consumes it on mount.
const fetchCache = new Map();

function consumePreload(url) {
  const preloaded = window.__PRELOAD__?.[url];
  if (preloaded !== undefined) {
    delete window.__PRELOAD__[url];
    return preloaded;
  }
  // Check hover-prefetch cache
  if (fetchCache.has(url)) {
    const cached = fetchCache.get(url);
    fetchCache.delete(url);
    return cached;
  }
  return null;
}

// Prefetch an API endpoint into cache (called on link hover)
export function prefetch(apiUrl) {
  if (fetchCache.has(apiUrl) || window.__PRELOAD__?.[apiUrl]) return;
  fetch(apiUrl)
    .then((r) => r.ok ? r.json() : null)
    .then((data) => { if (data) fetchCache.set(apiUrl, data); })
    .catch(() => {});
}

// Route → API mapping for hover prefetch
const ROUTE_APIS = {
  campaign: (id) => [`/api/campaigns/${id}`, `/api/donations?campaignId=${id}`],
  profile: (id) => [`/api/profiles/${id}`, `/api/campaigns?organizerId=${id}`],
  community: () => ["/api/community", "/api/campaigns?status=active", "/api/profiles"],
};

// Prefetch all APIs for a given route path
export function prefetchRoute(path) {
  const campaignMatch = path.match(/^\/campaign\/([^/]+)$/);
  if (campaignMatch) return ROUTE_APIS.campaign(campaignMatch[1]).forEach(prefetch);

  const profileMatch = path.match(/^\/profile\/([^/]+)$/);
  if (profileMatch) return ROUTE_APIS.profile(profileMatch[1]).forEach(prefetch);

  if (path.startsWith("/communities/")) return ROUTE_APIS.community().forEach(prefetch);
}

function useFetch(url, { enabled = true } = {}) {
  // KEY-DECISION 2026-03-15: Read preloaded data in useState initializer,
  // not useEffect. This gives first render real data instead of a skeleton.
  const [data, setData] = useState(() => enabled ? consumePreload(url) : null);
  const [loading, setLoading] = useState(() => enabled && !data);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache again (prefetch may have completed between mount and effect)
    const cached = consumePreload(url);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(`[useData] fetch failed for ${url}`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    // Skip fetch if we already have preloaded data
    if (data) return;
    fetchData();
  }, [fetchData, data]);

  return { data, loading, error, refetch: fetchData };
}

export function useProfiles() {
  return useFetch("/api/profiles");
}

export function useProfile(id) {
  return useFetch(`/api/profiles/${id}`, { enabled: Boolean(id) });
}

export function useCampaign(id) {
  return useFetch(`/api/campaigns/${id}`, { enabled: Boolean(id) });
}

export function useCampaignsByOrganizer(profileId) {
  return useFetch(`/api/campaigns?organizerId=${profileId}`, {
    enabled: Boolean(profileId),
  });
}

export function useActiveCampaigns() {
  return useFetch("/api/campaigns?status=active");
}

export function useDonations(campaignId) {
  return useFetch(`/api/donations?campaignId=${campaignId}`, {
    enabled: Boolean(campaignId),
  });
}

export function useCommunity() {
  return useFetch("/api/community");
}

// POST helper for mutations
export async function postDonation({ campaignId, donorName, amount, message }) {
  const res = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, donorName, amount, message }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function postFollow(profileId) {
  const res = await fetch(`/api/profiles/${profileId}/follow`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
