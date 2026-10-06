"use client";

import { useSyncExternalStore } from "react";

export type UpdateStatus = "idle" | "checking" | "upToDate" | "available";

// Shared between the background poller (UpdateNotifier) and the manual
// "Check for updates" button so both agree on whether a new build exists.
let status: UpdateStatus = "idle";
const listeners = new Set<() => void>();

function setStatus(next: UpdateStatus) {
  if (status === next) return;
  status = next;
  listeners.forEach((l) => l());
}

export function useUpdateStatus(): UpdateStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => "idle" as UpdateStatus
  );
}

export function resetUpdateStatus() {
  if (status === "upToDate") setStatus("idle");
}

// `manual` checks surface progress/"up to date"; background checks stay
// silent unless a new build is found.
export async function checkForUpdate(manual = false): Promise<UpdateStatus> {
  if (status === "available") return status;
  const currentBuild = process.env.NEXT_PUBLIC_BUILD_ID;
  if (manual) setStatus("checking");

  try {
    const res = await fetch("/api/version", { cache: "no-store" });
    if (!res.ok) throw new Error("version check failed");
    const { buildId } = (await res.json()) as { buildId: string | null };
    if (currentBuild && buildId && buildId !== currentBuild) {
      setStatus("available");
    } else if (manual) {
      setStatus("upToDate");
    }
  } catch {
    // Offline or transient failure — background polling retries on its own;
    // a manual check just returns to idle.
    if (manual) setStatus("idle");
  }
  return status;
}
