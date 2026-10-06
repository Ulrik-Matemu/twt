import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { EMAIL_PATTERN } from "@/lib/email-recipients";
import { buildReportPdf } from "@/lib/pdf/build-report-pdf";
import { sendReportEmail } from "@/lib/resend-email";

export const maxDuration = 60;

const MAX_FORWARD_ADDRESSES = 10;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const emails: string[] = Array.isArray(body?.emails)
    ? Array.from(
        new Set(
          body.emails
            .filter((e: unknown): e is string => typeof e === "string")
            .map((e: string) => e.trim().toLowerCase())
            .filter(Boolean)
        )
      )
    : [];
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 1000) : "";

  if (emails.length === 0 || emails.length > MAX_FORWARD_ADDRESSES) {
    return NextResponse.json(
      { error: `Enter between 1 and ${MAX_FORWARD_ADDRESSES} email addresses` },
      { status: 400 }
    );
  }
  const invalid = emails.find((e) => !EMAIL_PATTERN.test(e));
  if (invalid) {
    return NextResponse.json({ error: `"${invalid}" is not a valid email address` }, { status: 400 });
  }

  const reportDoc = await adminDb.collection("reports").doc(id).get();
  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const built = await buildReportPdf(reportDoc);
  const results = await sendReportEmail({
    reportId: id,
    reportType: built.routing.reportType,
    reportTypeLabel: built.reportTypeLabel,
    observerName: built.observerName,
    date: built.date,
    location: built.location,
    pdfBuffer: built.buffer,
    portalOrigin: new URL(req.url).origin,
    to: emails,
    kind: "forward",
    sentBy: user.name,
    note,
  });

  await logActivity(user, "report.forward", {
    targetType: "report",
    targetId: id,
    summary: `Forwarded ${built.reportTypeLabel.toLowerCase()} for ${built.location} to ${emails.join(", ")}`,
  });

  return NextResponse.json({
    success: results.every((r) => r.ok),
    results: results.map(({ email, ok, error }) => ({ email, ok, error })),
  });
}
