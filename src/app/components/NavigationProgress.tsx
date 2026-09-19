// components/NavigationProgress.tsx
"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { useNavigationLoading } from "./NavigationLoadingContext";

NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.08 });

export default function NavigationProgress() {
  const isPending = useNavigationLoading();

  useEffect(() => {
    if (isPending) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isPending]);

  return null;
}
