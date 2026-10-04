"use client";

import { useEffect, useState } from "react";

const CHECK_INTERVAL_MS = 60_000;

// Tells people with a stale tab that a new version has been deployed, so they
// can reload instead of running old code (or submitting through an old form).
export default function UpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const currentBuild = process.env.NEXT_PUBLIC_BUILD_ID;
    if (!currentBuild || process.env.NODE_ENV !== "production") return;

    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = (await res.json()) as { buildId: string | null };
        if (!cancelled && buildId && buildId !== currentBuild) {
          setUpdateAvailable(true);
        }
      } catch {
        // Offline or transient failure — try again on the next tick.
      }
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };

    const interval = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    check();

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  if (!updateAvailable) return null;

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
