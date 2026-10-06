"use client";

import { useEffect } from "react";
import { checkForUpdate, useUpdateStatus } from "./update-store";

const CHECK_INTERVAL_MS = 60_000;

// Tells people with a stale tab that a new version has been deployed, so they
// can reload instead of running old code (or submitting through an old form).
export default function UpdateNotifier() {
  const status = useUpdateStatus();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BUILD_ID || process.env.NODE_ENV !== "production") return;

    const check = () => void checkForUpdate();
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };

    const interval = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    check();

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  if (status !== "available") return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg"
    >
      <span>A new version is available.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-md bg-white px-3 py-1.5 font-medium text-neutral-900 hover:bg-neutral-200"
      >
        Refresh
      </button>
    </div>
  );
}
