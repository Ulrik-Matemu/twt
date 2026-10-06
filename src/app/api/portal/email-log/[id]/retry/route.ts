import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { buildReportPdf } from "@/lib/pdf/build-report-pdf";
import { sendReportEmail } from "@/lib/resend-email";

export const maxDuration = 60;

// Re-sends a report to the one address a previous attempt failed for.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const logDoc = await adminDb.collection("email_log").doc(id).get();
  if (!logDoc.exists) {
    return NextResponse.json({ error: "Log entry not found" }, { status: 404 });
  }
  const entry = logDoc.data()!;

  const reportDoc = await adminDb.collection("reports").doc(entry.reportId).get();
  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report no longer exists" }, { status: 404 });
  }

  const built = await buildReportPdf(reportDoc);
  const [result] = await sendReportEmail({
    reportId: reportDoc.id,
    reportType: built.routing.reportType,
    reportTypeLabel: built.reportTypeLabel,
    observerName: built.observerName,
    date: built.date,
    location: built.location,
    pdfBuffer: built.buffer,
    portalOrigin: new URL(req.url).origin,
    to: [entry.to],
    kind: "retry",
    sentBy: user.name,
  });

  await logActivity(user, "email.retry", {
    targetType: "report",
    targetId: reportDoc.id,
    summary: `Retried report email to ${entry.to}${result.ok ? "" : " (failed again)"}`,
  });

  return NextResponse.json({ success: result.ok, error: result.error });
}
