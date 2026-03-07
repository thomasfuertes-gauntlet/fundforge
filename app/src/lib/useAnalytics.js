import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackScrollDepth, resetScrollDepth } from "./analytics";

/**
 * Track page views on route change.
 * Call at the top of each page component with the page name.
 */
export function usePageView(pageName, params = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pageName, params);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Track scroll depth milestones on the campaign page.
 * Fires at 25%, 50%, 75%, 100% of document height.
 */
export function useScrollDepth(campaignId) {
  useEffect(() => {
    if (!campaignId) return;
    resetScrollDepth();

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);
      trackScrollDepth(campaignId, percent);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [campaignId]);
}
