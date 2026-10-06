"use client";

import { useEffect } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import {
  checkForUpdate,
  resetUpdateStatus,
  useUpdateStatus,
} from "@/app/components/update-store";

// Manual "check for updates" control. Quiet (outlined) until a new build is
// found, then it turns solid orange with a pulsing dot and reloads on click.
export default function UpdateButton({ variant }: { variant: "sidebar" | "header" }) {
  const status = useUpdateStatus();

  useEffect(() => {
    if (status !== "upToDate") return;
    const t = setTimeout(resetUpdateStatus, 3000);
    return () => clearTimeout(t);
  }, [status]);

  function onClick() {
    if (status === "available") {
      window.location.reload();
    } else if (status !== "checking") {
      void checkForUpdate(true);
    }
  }

  const available = status === "available";
  const label = available
    ? "Update available — Refresh"
    : status === "checking"
      ? "Checking…"
      : status === "upToDate"
        ? "You're up to date"
        : "Check for updates";
  const Icon = status === "upToDate" ? CheckCircle2 : RefreshCw;
  const iconClass = `w-4 h-4 ${status === "checking" ? "animate-spin" : ""}`;

  const dot = available && (
    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`relative p-1.5 rounded-full ${
          available ? "bg-[#d6852b] text-white" : "text-[#c07724] bg-[#d6852b]/10"
        }`}
      >
        <Icon className={iconClass} />
        {dot}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative mb-1 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        available
          ? "bg-[#d6852b] text-white hover:bg-[#c07724]"
          : "border border-[#d6852b]/40 text-[#c07724] hover:bg-[#d6852b]/10"
      }`}
    >
      <Icon className={iconClass} />
      {label}
      {dot}
    </button>
  );
}
