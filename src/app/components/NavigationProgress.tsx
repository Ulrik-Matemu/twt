// components/NavigationProgress.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.08 });

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useRef(false);

  // Detect clicks on internal links and start the bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, hash-only links, and non-http links
      const isExternal = anchor.target === "_blank" || href.startsWith("http");
      const isHashOnly = href.startsWith("#");
      const isSpecial = href.startsWith("mailto:") || href.startsWith("tel:");

      if (isExternal || isHashOnly || isSpecial) return;

      // Skip if navigating to the same path (hash changes, etc.)
      const isSamePage = href === pathname || href === `${pathname}?${searchParams}`;
      if (isSamePage) return;

      NProgress.start();
      isNavigating.current = true;
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, searchParams]);

  // Stop the bar when the route actually changes
  useEffect(() => {
    if (isNavigating.current) {
      NProgress.done();
      isNavigating.current = false;
    }
  }, [pathname, searchParams]);

  return null;
}