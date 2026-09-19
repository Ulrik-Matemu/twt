"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationLoadingCtx = createContext(false);

export function useNavigationLoading() {
  return useContext(NavigationLoadingCtx);
}

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const [isPending, setIsPending] = useState(false);
  const [routeKey, setRouteKey] = useState(`${pathname}?${searchParamsKey}`);

  // The route actually changed — clear any pending flag. Updating state
  // during render (rather than in an effect) avoids an extra render pass;
  // this is React's documented pattern for resetting state on prop change.
  const currentRouteKey = `${pathname}?${searchParamsKey}`;
  if (currentRouteKey !== routeKey) {
    setRouteKey(currentRouteKey);
    setIsPending(false);
  }

  // Detect clicks on internal links and flag navigation as pending immediately
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
      const isSamePage = href === pathname || href === `${pathname}?${searchParamsKey}`;
      if (isSamePage) return;

      setIsPending(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, searchParamsKey]);

  return (
    <NavigationLoadingCtx.Provider value={isPending}>
      {children}
    </NavigationLoadingCtx.Provider>
  );
}
