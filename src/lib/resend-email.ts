import { Resend } from "resend";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { OFFICE_ADDRESS, resolveRecipientEmails, type ReportRoutingInfo } from "./email-recipients";
import type { ReportType } from "./portal-types";

export type EmailKind = "submission" | "forward" | "retry";

export type EmailLogStatus =
  | "sent"
  | "delivered"
  | "delayed"
  | "bounced"
  | "complained"
  | "failed";

export interface ReportEmailParams {
  reportId: string;
  reportType: ReportType;
  reportTypeLabel: "Capture Report" | "Zoo Census Report" | "Postmortem Report";
  observerName: string;
  date: string;
  location: string;
  pdfBuffer: Buffer;
  portalOrigin: string;
  to: string[];
  kind: EmailKind;
  sentBy: string;
  note?: string;
}

export interface RecipientSendResult {
  email: string;
  ok: boolean;
  error?: string;
  logId?: string;
}

const MAX_PARALLEL_SENDS = 10;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Sends the report PDF to each address as its own email — so every recipient
// gets an independent Resend message id (and thus an independent delivery
// status) and never sees who else received it — and records one `email_log`
// row per recipient. Best-effort: the report is already saved by the time
// this runs, so this never throws; failures come back in the results.
export async function sendReportEmail(params: ReportEmailParams): Promise<RecipientSendResult[]> {
  const recipients = Array.from(new Set(params.to.map((e) => e.trim().toLowerCase()))).filter(Boolean);
  const apiKey = process.env.RESEND_API_KEY;
  const reportLabel = `${params.reportTypeLabel} — ${params.location} (${params.date})`;
  const reportLink = `${params.portalOrigin}/portal/reports/${params.reportId}`;

  const subject =
    params.kind === "forward"
      ? `Forwarded: ${params.reportTypeLabel} — ${params.location} (${params.date})`
      : `New ${params.reportTypeLabel} submitted — ${params.location} (${params.date})`;

  const intro =
    params.kind === "forward"
      ? "A report from the TWT Animal Monitoring Portal has been forwarded to you."
      : "A new report was submitted on the TWT Animal Monitoring Portal.";

  const html = `
    <p>${intro}</p>
    ${params.note ? `<p style="white-space:pre-wrap">${escapeHtml(params.note)}</p>` : ""}
    <ul>
      <li><strong>Type:</strong> ${params.reportTypeLabel}</li>
      <li><strong>Observer:</strong> ${escapeHtml(params.observerName)}</li>
      <li><strong>Date:</strong> ${escapeHtml(params.date)}</li>
      <li><strong>Location:</strong> ${escapeHtml(params.location)}</li>
    </ul>
    <p>The full report is attached as a PDF.</p>
  `;

  async function sendOne(email: string): Promise<RecipientSendResult> {
    let resendId: string | null = null;
    let error: string | undefined;

    if (!apiKey) {
      error = "RESEND_API_KEY is not configured; skipping notification email.";
      console.error(error);
    } else {
      try {
        const resend = new Resend(apiKey);
        const { data, error: sendError } = await resend.emails.send({
          from: OFFICE_ADDRESS,
          to: email,
          subject,
          html:
            email === OFFICE_ADDRESS
              ? html.replace(
                  "<p>The full report",
                  `<p>View it online: <a href="${reportLink}">${reportLink}</a></p><p>The full report`
                )
              : html,
          attachments: [
            {
              filename: `report-${params.reportTypeLabel}-${params.date}-${params.observerName}.pdf`,
              content: params.pdfBuffer,
            },
          ],
        });
        if (sendError) {
          error = sendError.message ?? String(sendError);
        } else {
          resendId = data?.id ?? null;
        }
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
      if (error) console.error("Failed to send report email to", email, error);
    }

    let logId: string | undefined;
    try {
      const doc = await adminDb.collection("email_log").add({
        reportId: params.reportId,
        reportLabel,
        reportType: params.reportType,
        to: email,
        kind: params.kind,
        sentBy: params.sentBy,
        resendId,
        status: (error ? "failed" : "sent") satisfies EmailLogStatus,
        ...(error ? { error } : {}),
        createdAt: FieldValue.serverTimestamp(),
      });
      logId = doc.id;
    } catch (logError) {
      console.error("Failed to write email log:", logError);
    }

    return { email, ok: !error, error, logId };
  }

  const results: RecipientSendResult[] = [];
  for (let i = 0; i < recipients.length; i += MAX_PARALLEL_SENDS) {
    results.push(...(await Promise.all(recipients.slice(i, i + MAX_PARALLEL_SENDS).map(sendOne))));
  }
  return results;
}

// Persists whether the notification emails went out, so a failure (e.g. a
// missing/invalid Resend API key) is visible on the report itself instead of
// only in server logs nobody checks day-to-day.
export async function recordNotificationStatus(
  reportRef: DocumentReference,
  results: RecipientSendResult[]
) {
  const failed = results.filter((r) => !r.ok);
  try {
    await reportRef.update({
      notificationEmail:
        failed.length === 0
          ? { status: "sent", sentAt: FieldValue.serverTimestamp() }
          : {
              status: "failed",
              error: failed.map((r) => `${r.email}: ${r.error}`).join("; "),
              failedAt: FieldValue.serverTimestamp(),
            },
    });
  } catch (updateError) {
    console.error("Failed to record notification email status:", updateError);
  }
}

// Routes a freshly submitted report to the office plus every admin-configured
// recipient whose filters match, then records the outcome on the report.
// Never throws.
export async function notifyReportSubmitted(
  reportRef: DocumentReference,
  routing: ReportRoutingInfo,
  params: Omit<ReportEmailParams, "to" | "kind" | "reportId" | "reportType" | "sentBy"> & {
    sentBy: string;
  }
) {
  try {
    const to = await resolveRecipientEmails(routing);
    const results = await sendReportEmail({
      ...params,
      reportId: reportRef.id,
      reportType: routing.reportType,
      to,
      kind: "submission",
    });
    await recordNotificationStatus(reportRef, results);
  } catch (error) {
    console.error("Report submission email failed:", error);
    await recordNotificationStatus(reportRef, [
      {
        email: OFFICE_ADDRESS,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
    ]);
  }
}
