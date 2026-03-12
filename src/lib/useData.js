import { useState, useEffect, useCallback } from "react";

// Fallback imports for SSR/build or when API is unavailable
import {
  profiles as fixtureProfiles,
  community as fixtureCommunity,
  getProfile as fixtureGetProfile,
  getCampaign as fixtureGetCampaign,
  getCampaignsByOrganizer as fixtureGetCampaignsByOrganizer,
  getDonationsByCampaign as fixtureGetDonationsByCampaign,
  getActiveCampaigns as fixtureGetActiveCampaigns,
} from "@/data";

function useFetch(url, { fallback, enabled = true } = {}) {
  const [data, setData] = useState(fallback ?? null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.warn(`[useData] fetch failed for ${url}, using fallback`, err);
      setError(err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useProfiles() {
  return useFetch("/api/profiles", { fallback: fixtureProfiles });
}

export function useProfile(id) {
  return useFetch(`/api/profiles/${id}`, {
    fallback: fixtureGetProfile(id),
    enabled: Boolean(id),
  });
}

export function useCampaign(id) {
  return useFetch(`/api/campaigns/${id}`, {
    fallback: fixtureGetCampaign(id),
    enabled: Boolean(id),
  });
}

export function useCampaignsByOrganizer(profileId) {
  return useFetch(`/api/campaigns?organizerId=${profileId}`, {
    fallback: fixtureGetCampaignsByOrganizer(profileId),
    enabled: Boolean(profileId),
  });
}

export function useActiveCampaigns() {
  return useFetch("/api/campaigns?status=active", {
    fallback: fixtureGetActiveCampaigns(),
  });
}

export function useDonations(campaignId) {
  return useFetch(`/api/donations?campaignId=${campaignId}`, {
    fallback: fixtureGetDonationsByCampaign(campaignId),
    enabled: Boolean(campaignId),
  });
}

export function useCommunity() {
  return useFetch("/api/community", { fallback: fixtureCommunity });
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
