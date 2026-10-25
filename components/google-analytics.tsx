"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TRACKING_ID = "G-HMEY1FGFJ1";

/**
 * Google Analytics, loaded on the first interaction (scroll, tap, key) so the
 * ~75 KB gtag script never competes with first paint or input. Trade-off:
 * visits with no interaction at all are not counted.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const ga = useRef<typeof import("react-ga4").default | null>(null);

  useEffect(() => {
    let done = false;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const start = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, start));
      import("react-ga4").then(({ default: ReactGA }) => {
        ReactGA.initialize(TRACKING_ID);
        ga.current = ReactGA;
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
      });
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);

  // Later client-side navigations, once GA is loaded.
  useEffect(() => {
    ga.current?.send({ hitType: "pageview", page: pathname + window.location.search });
  }, [pathname]);

  return null;
}
