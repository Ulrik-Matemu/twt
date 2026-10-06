"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailLogRow } from "@/lib/email-log-data";
import { EMAIL_PATTERN } from "@/lib/email-filters";
import EmailStatusBadge from "../../email/EmailStatusBadge";

// Admin-only: per-recipient delivery status for one report, plus a form to
// forward the report (as a PDF) to any addresses.
export default function EmailPanel({ reportId, log }: { reportId: string; log: EmailLogRow[] }) {
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function forward() {
    const list = emails
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    const invalid = list.find((e) => !EMAIL_PATTERN.test(e));
    if (list.length === 0 || invalid) {
      setMessage({ ok: false, text: invalid ? `"${invalid}" is not a valid email address` : "Enter at least one email address" });
      return;
    }

    setSending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/portal/reports/${reportId}/forward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: list, note }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        results?: { email: string; ok: boolean; error?: string }[];
      };
      if (!res.ok) {
        setMessage({ ok: false, text: data.error ?? "Failed to forward report" });
      } else if (data.success) {
        setMessage({ ok: true, text: `Report sent to ${list.length} address${list.length > 1 ? "es" : ""}.` });
        setEmails("");
        setNote("");
      } else {
        const failed = data.results?.filter((r) => !r.ok).map((r) => r.email).join(", ");
        setMessage({ ok: false, text: `Could not send to: ${failed}` });
      }
      router.refresh();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
      <h2 className="font-medium text-slate-900">Email &amp; forwarding</h2>

      {log.length === 0 ? (
        <p className="text-sm text-slate-500">No emails have been sent for this report yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {log.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="text-sm text-slate-900 truncate">{row.to}</p>
                <p className="text-xs text-slate-500">
                  {row.kind === "submission" ? "On submission" : row.kind === "forward" ? "Forwarded" : "Retry"}
                  {row.createdAt && ` · ${new Date(row.createdAt).toLocaleString()}`}
                </p>
                {row.error && <p className="text-xs text-red-600 truncate">{row.error}</p>}
              </div>
              <EmailStatusBadge status={row.status} />
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="block text-xs font-medium text-slate-500">Forward this report to</label>
        <input
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="name@example.com, other@example.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Optional note to include in the email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm ${message?.ok ? "text-green-700" : "text-red-600"}`}>{message?.text}</p>
          <button
            type="button"
            onClick={forward}
            disabled={sending}
            className="bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#c07724] disabled:opacity-60 shrink-0"
          >
            {sending ? "Sending…" : "Forward report"}
          </button>
        </div>
      </div>
    </div>
  );
}
