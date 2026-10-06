"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import type { EmailLogRow } from "@/lib/email-log-data";
import EmailStatusBadge from "./EmailStatusBadge";

export default function DeliveryLog({ rows }: { rows: EmailLogRow[] }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [problemsOnly, setProblemsOnly] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/portal/email-log/refresh", { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  // Pull the latest statuses from Resend whenever the page is opened.
  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function retry(id: string) {
    setRetrying(id);
    setMessage("");
    try {
      const res = await fetch(`/api/portal/email-log/${id}/retry`, { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      setMessage(data.success ? "Email re-sent." : `Retry failed: ${data.error ?? "unknown error"}`);
      router.refresh();
    } finally {
      setRetrying(null);
    }
  }

  const visible = problemsOnly
    ? rows.filter((r) => ["failed", "bounced", "complained"].includes(r.status))
    : rows;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-medium text-slate-900">Delivery log</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={problemsOnly}
              onChange={(e) => setProblemsOnly(e.target.checked)}
            />
            Problems only
          </label>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm font-medium text-[#c07724] disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh status
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
          No emails to show.
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((row) => (
            <li
              key={row.id}
              className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{row.to}</p>
                <p className="text-xs text-slate-500 truncate">
                  <Link href={`/portal/reports/${row.reportId}`} className="hover:underline">
                    {row.reportLabel}
                  </Link>
                  {" · "}
                  {row.kind === "submission" ? "Submission" : row.kind === "forward" ? "Forwarded" : "Retry"}
                  {row.createdAt && ` · ${new Date(row.createdAt).toLocaleString()}`}
                </p>
                {row.error && <p className="text-xs text-red-600 mt-0.5 truncate">{row.error}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {["failed", "bounced"].includes(row.status) && (
                  <button
                    type="button"
                    onClick={() => retry(row.id)}
                    disabled={retrying === row.id}
                    className="text-xs font-medium text-[#c07724] disabled:opacity-60"
                  >
                    {retrying === row.id ? "Retrying…" : "Retry"}
                  </button>
                )}
                <EmailStatusBadge status={row.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
