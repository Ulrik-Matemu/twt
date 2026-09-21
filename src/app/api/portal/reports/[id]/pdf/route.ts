import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import {
  REVIEWER_ROLES,
  type ReportEntryInput,
  type ReportStatus,
  type SubUnitEntryInput,
} from "@/lib/portal-types";
import { generateCaptureReportPdf, generateZooCensusReportPdf } from "@/lib/pdf/report-pdf";
import { buildReportFilename } from "@/lib/report-filename";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);

  const user = await getSessionUser();
  if (!user) {
    const loginUrl = new URL("/portal/login", url.origin);
    loginUrl.searchParams.set("next", `/api/portal/reports/${id}/pdf`);
    return NextResponse.redirect(loginUrl);
  }

  const reportDoc = await adminDb.collection("reports").doc(id).get();
  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = reportDoc.data() as {
    reportType?: "capture" | "zoo_census";
    date: string;
    project?: string;
    site?: string;
    unit?: string;
    observerName: string;
    status: ReportStatus;
  };

  // Same reviewer-only rule as the existing HTML print view.
  const canView = hasRole(user, REVIEWER_ROLES);
  if (!canView) {
    return NextResponse.redirect(new URL(`/portal/reports/${id}`, url.origin));
  }

  let pdfBuffer: Buffer;

  if (report.reportType === "zoo_census") {
    const entriesSnapshot = await reportDoc.ref
      .collection("subUnitEntries")
      .orderBy("createdAt")
      .get();
    const entries = entriesSnapshot.docs.map((doc) => doc.data() as SubUnitEntryInput);

    pdfBuffer = await generateZooCensusReportPdf(
      {
        date: report.date,
        unit: report.unit || "",
        observerName: report.observerName,
        status: report.status,
      },
      entries
    );
  } else {
    const entriesSnapshot = await reportDoc.ref.collection("entries").orderBy("createdAt").get();
    const entries = entriesSnapshot.docs.map((doc) => doc.data() as ReportEntryInput);

    pdfBuffer = await generateCaptureReportPdf(
      {
        date: report.date,
        project: report.project || "",
        site: report.site || "",
        observerName: report.observerName,
        status: report.status,
      },
      entries
    );
  }

  const filename = buildReportFilename(report);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}.pdf"`,
    },
  });
}
