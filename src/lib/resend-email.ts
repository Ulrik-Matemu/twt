import { Resend } from "resend";

const NOTIFY_ADDRESS = "office@twt.co.tz";

export interface ReportSubmissionEmailParams {
  reportType: "Capture Report" | "Zoo Census Report";
  observerName: string;
  date: string;
  location: string;
  reportId: string;
  pdfBuffer: Buffer;
  portalOrigin: string;
}

export type ReportSubmissionEmailResult =
  | { ok: true }
  | { ok: false; error: string };

// Notifies office@twt.co.tz with the report's PDF attached directly — no
// login-gated link, so it's readable on any device, not just one with an
// active portal session. Best-effort: the report is already saved by the
// time this runs, so a failure here must never throw — callers persist the
// returned result on the report so a silent failure stays visible instead
// of only showing up in logs nobody checks.
export async function sendReportSubmissionEmail(
  params: ReportSubmissionEmailParams
): Promise<ReportSubmissionEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const error = "RESEND_API_KEY is not configured; skipping notification email.";
    console.error(error);
    return { ok: false, error };
  }

  try {
    const resend = new Resend(apiKey);
    const reportLink = `${params.portalOrigin}/portal/reports/${params.reportId}`;

    const { error } = await resend.emails.send({
      from: NOTIFY_ADDRESS,
      to: NOTIFY_ADDRESS,
      subject: `New ${params.reportType} submitted — ${params.location} (${params.date})`,
      html: `
        <p>A new report was submitted on the TWT Animal Monitoring Portal.</p>
        <ul>
          <li><strong>Type:</strong> ${params.reportType}</li>
          <li><strong>Observer:</strong> ${params.observerName}</li>
          <li><strong>Date:</strong> ${params.date}</li>
          <li><strong>Location:</strong> ${params.location}</li>
        </ul>
        <p>The full report is attached as a PDF. You can also view it online: <a href="${reportLink}">${reportLink}</a></p>
      `,
      attachments: [
        {
          filename: `report-${params.reportType}-${params.date}-${params.observerName}.pdf`,
          content: params.pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Failed to send report submission email:", error);
      return { ok: false, error: error.message ?? String(error) };
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to send report submission email:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
