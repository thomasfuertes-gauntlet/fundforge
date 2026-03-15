import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `end` over `duration` ms when the
 * element scrolls into view. Returns [ref, displayValue].
 */
export default function useCountUp(end, { duration = 1500, prefix = "", suffix = "", skip = false } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(skip ? end : 0);
  const hasAnimated = useRef(skip);
  const lastEnd = useRef(end);

  // Reset animation when target value changes (e.g., 0 → real data after async load)
  if (end !== lastEnd.current) {
    lastEnd.current = end;
    if (skip) {
      // No animation - jump to final value immediately
      setValue(end);
      hasAnimated.current = true;
    } else if (end > 0) {
      hasAnimated.current = false;
    }
  }

  useEffect(() => {
    if (skip) { setValue(end); return; }
    const el = ref.current;
    if (!el || hasAnimated.current || end === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, skip]);

  const formatted = `${prefix}${value.toLocaleString()}${suffix}`;
  return [ref, formatted];
}
