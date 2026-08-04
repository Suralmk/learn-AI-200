"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-HMEY1FGFJ1";

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  useEffect(() => {
    if (pathname) {
      const page = pathname + window.location.search;
      ReactGA.send({ hitType: "pageview", page });
    }
  }, [pathname]);

  return null;
}
