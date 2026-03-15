import { useCallback } from "react";
import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/useData";

// KEY-DECISION 2026-03-15: Prefetch API data on hover so client-side
// navigation has instant data. ~200ms hover-to-click gives enough time
// for edge-served API responses to arrive before React mounts the page.
export default function PrefetchLink({ to, children, ...props }) {
  const handlePointerEnter = useCallback(() => {
    prefetchRoute(to);
  }, [to]);

  return (
    <Link
      to={to}
      onPointerEnter={handlePointerEnter}
      {...props}
    >
      {children}
    </Link>
  );
}
