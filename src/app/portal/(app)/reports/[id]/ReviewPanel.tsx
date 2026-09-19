"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReportStatus } from "@/lib/portal-types";

export default function ReviewPanel({
  reportId,
  currentStatus,
  currentNotes,
}: {
  reportId: string;
  currentStatus: ReportStatus;
  currentNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState<ReportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: ReportStatus) {
    setSaving(status);
    setError(null);
    try {
      const res = await fetch(`/api/portal/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes: notes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update report");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <h2 className="font-medium text-slate-900">Review</h2>
      <p className="text-xs text-slate-500">
        Current status: <span className="font-medium capitalize">{currentStatus}</span>
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Review notes (optional)"
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => updateStatus("reviewed")}
          disabled={!!saving}
          className="flex-1 bg-green-600 text-white text-sm font-medium rounded-lg py-2.5 hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {saving === "reviewed" ? "Saving..." : "Mark reviewed"}
        </button>
        <button
          onClick={() => updateStatus("flagged")}
          disabled={!!saving}
          className="flex-1 bg-red-600 text-white text-sm font-medium rounded-lg py-2.5 hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {saving === "flagged" ? "Saving..." : "Flag report"}
        </button>
      </div>
    </div>
  );
}
