import { adminDb } from "./firebase-admin";
import type { EmailKind, EmailLogStatus } from "./resend-email";

export interface EmailLogRow {
  id: string;
  reportId: string;
  reportLabel: string;
  to: string;
  kind: EmailKind;
  status: EmailLogStatus;
  error?: string;
  createdAt: string | null;
}

function toRow(doc: FirebaseFirestore.QueryDocumentSnapshot): EmailLogRow {
  const d = doc.data();
  return {
    id: doc.id,
    reportId: d.reportId,
    reportLabel: d.reportLabel ?? "",
    to: d.to,
    kind: d.kind,
    status: d.status,
    error: d.error,
    createdAt: d.createdAt?.toDate?.().toISOString() ?? null,
  };
}

export async function getRecentEmailLog(limit = 100): Promise<EmailLogRow[]> {
  const snapshot = await adminDb
    .collection("email_log")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snapshot.docs.map(toRow);
}

// Filtered by reportId only and sorted in memory, so no composite index is needed.
export async function getReportEmailLog(reportId: string): Promise<EmailLogRow[]> {
  const snapshot = await adminDb.collection("email_log").where("reportId", "==", reportId).get();
  return snapshot.docs
    .map(toRow)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export interface EmailLogSummary {
  sent: number;
  delivered: number;
  problems: number; // failed + bounced + complained
}

export function summarizeEmailLog(rows: EmailLogRow[], sinceMs = 7 * 24 * 60 * 60 * 1000): EmailLogSummary {
  const cutoff = Date.now() - sinceMs;
  const recent = rows.filter((r) => r.createdAt && new Date(r.createdAt).getTime() >= cutoff);
  return {
    sent: recent.length,
    delivered: recent.filter((r) => r.status === "delivered").length,
    problems: recent.filter((r) => ["failed", "bounced", "complained"].includes(r.status)).length,
  };
}
