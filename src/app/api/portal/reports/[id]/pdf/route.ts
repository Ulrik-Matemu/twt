import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { REVIEWER_ROLES } from "@/lib/portal-types";
import { buildReportPdf } from "@/lib/pdf/build-report-pdf";

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

  // Same reviewer-only rule as the existing HTML print view.
  if (!hasRole(user, REVIEWER_ROLES)) {
    return NextResponse.redirect(new URL(`/portal/reports/${id}`, url.origin));
  }

  const { buffer, filename } = await buildReportPdf(reportDoc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}.pdf"`,
    },
  });
}
