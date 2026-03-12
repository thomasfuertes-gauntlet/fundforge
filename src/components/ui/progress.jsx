import * as React from "react";
import { useRef, useState, useEffect } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value, "aria-label": ariaLabel, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    aria-label={ariaLabel || "Progress"}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-1000 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

/**
 * Progress bar that animates from 0 to `value` when scrolled into view.
 * Supports an optional `delay` (ms) for staggering multiple bars.
 */
const AnimatedProgress = React.forwardRef(
  ({ value, delay = 0, className, ...props }, forwardedRef) => {
    const localRef = useRef(null);
    const ref = forwardedRef || localRef;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = typeof ref === "function" ? null : ref.current;
      if (!el) return;
      let timer;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            obs.disconnect();
            if (delay > 0) {
              timer = setTimeout(() => setVisible(true), delay);
            } else {
              setVisible(true);
            }
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return () => { obs.disconnect(); clearTimeout(timer); };
    }, [ref, delay]);

    return (
      <Progress
        ref={ref}
        value={visible ? value : 0}
        className={className}
        {...props}
      />
    );
  }
);
AnimatedProgress.displayName = "AnimatedProgress";

export { Progress, AnimatedProgress };
