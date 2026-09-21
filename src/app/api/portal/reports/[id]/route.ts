import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import {
  REVIEWER_ROLES,
  type ReportEntryInput,
  type ReportStatus,
  type SubUnitEntryInput,
} from "@/lib/portal-types";
import {
  replaceReportEntries,
  validateDraftEntries,
  validateEntries,
  validateGeneralDetails,
} from "@/lib/report-helpers";
import {
  replaceReportSubUnitEntries,
  validateDraftSubUnitEntries,
  validateSubUnitEntries,
  validateZooGeneralDetails,
} from "@/lib/zoo-report-helpers";
import { logActivity } from "@/lib/activity-log";
import { generateCaptureReportPdf, generateZooCensusReportPdf } from "@/lib/pdf/report-pdf";
import { sendReportSubmissionEmail } from "@/lib/resend-email";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reportDoc = await adminDb.collection("reports").doc(id).get();

  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = reportDoc.data()!;
  const canViewAll = hasRole(user, REVIEWER_ROLES);
  const isOwnDraft = report.observerId === user.uid && report.status === "draft";

  if (!canViewAll && !isOwnDraft) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const entriesSnapshot = await reportDoc.ref
    .collection("entries")
    .orderBy("createdAt")
    .get();

  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ report: { id: reportDoc.id, ...report, entries } });
}

const REVIEW_STATUSES: ReportStatus[] = ["submitted", "reviewed", "flagged"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reportRef = adminDb.collection("reports").doc(id);
  const reportDoc = await reportRef.get();
  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  const report = reportDoc.data()!;

  try {
    const body = await req.json();
    const isReviewer = hasRole(user, REVIEWER_ROLES);
    const isAuthor = report.observerId === user.uid;
    const isZooCensus = report.reportType === "zoo_census";

    // Branch 1: review action (approve/flag), reviewer-only.
    if (body.entries === undefined && body.subUnitEntries === undefined) {
      if (!isReviewer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (!REVIEW_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      await reportRef.update({
        status: body.status,
        reviewNotes: body.reviewNotes ?? null,
        reviewedBy: user.name,
        reviewedAt: FieldValue.serverTimestamp(),
      });

      const reportLabel = isZooCensus
        ? `zoo census report for ${report.unit}`
        : `report for ${report.project} · ${report.site}`;

      await logActivity(user, "report.review", {
        targetType: "report",
        targetId: id,
        summary: `Marked ${reportLabel} as ${body.status}`,
      });

      return NextResponse.json({ success: true });
    }

    // Branch 2: full content edit — reviewers can edit any report; an
    // author can only edit their own report while it's still a draft.
    const canFullEdit = isReviewer || (isAuthor && report.status === "draft");
    if (!canFullEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const nextStatus: ReportStatus =
      body.status === "submitted" || body.status === "draft"
        ? body.status
        : (report.status as ReportStatus);

    if (isZooCensus) {
      const { date, unit, subUnitEntries } = body;
      if (!validateZooGeneralDetails({ date, unit })) {
        return NextResponse.json(
          { error: "Missing report details (date, unit)" },
          { status: 400 }
        );
      }

      if (nextStatus === "draft") {
        if (!validateDraftSubUnitEntries(subUnitEntries)) {
          return NextResponse.json(
            { error: "Each sub-unit entry must at least identify the sub-unit" },
            { status: 400 }
          );
        }
      } else if (!validateSubUnitEntries(subUnitEntries)) {
        return NextResponse.json(
          {
            error:
              "Each sub-unit must have all required observations filled in, and details for any optional sections you turned on",
          },
          { status: 400 }
        );
      }

      const batch = adminDb.batch();
      batch.update(reportRef, {
        date,
        unit,
        status: nextStatus,
        updatedAt: FieldValue.serverTimestamp(),
      });
      await replaceReportSubUnitEntries(
        reportRef,
        subUnitEntries as Record<string, unknown>[],
        batch
      );
      await batch.commit();

      const action = isReviewer
        ? "report.edit"
        : nextStatus === "submitted"
          ? "report.submit"
          : "report.save_draft";

      await logActivity(user, action, {
        targetType: "report",
        targetId: id,
        summary: `${isReviewer ? "Edited" : nextStatus === "submitted" ? "Submitted" : "Saved draft for"} zoo census report for ${unit} (${date})`,
      });

      if (nextStatus === "submitted" && !isReviewer) {
        try {
          const pdfBuffer = await generateZooCensusReportPdf(
            { date, unit, observerName: user.name, status: "submitted" },
            subUnitEntries as SubUnitEntryInput[]
          );
          await sendReportSubmissionEmail({
            reportType: "Zoo Census Report",
            observerName: user.name,
            date,
            location: unit,
            reportId: id,
            pdfBuffer,
            portalOrigin: new URL(req.url).origin,
          });
        } catch (emailError) {
          console.error("Report submission email failed:", emailError);
        }
      }

      return NextResponse.json({ success: true });
    }

    const { date, project, site, entries } = body;
    if (!validateGeneralDetails({ date, project, site })) {
      return NextResponse.json(
        { error: "Missing report details (date, project, site)" },
        { status: 400 }
      );
    }

    if (nextStatus === "draft") {
      if (!validateDraftEntries(entries)) {
        return NextResponse.json(
          { error: "Each animal entry must at least identify the animal" },
          { status: 400 }
        );
      }
    } else if (!validateEntries(entries)) {
      return NextResponse.json(
        {
          error:
            "Each animal entry must be complete with an image, and delivery details if marked delivered",
        },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();
    batch.update(reportRef, {
      date,
      project,
      site,
      status: nextStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });
    await replaceReportEntries(reportRef, entries as Record<string, unknown>[], batch);
    await batch.commit();

    const action = isReviewer
      ? "report.edit"
      : nextStatus === "submitted"
        ? "report.submit"
        : "report.save_draft";

    await logActivity(user, action, {
      targetType: "report",
      targetId: id,
      summary: `${isReviewer ? "Edited" : nextStatus === "submitted" ? "Submitted" : "Saved draft for"} report for ${project} · ${site} (${date})`,
    });

    if (nextStatus === "submitted" && !isReviewer) {
      try {
        const pdfBuffer = await generateCaptureReportPdf(
          { date, project, site, observerName: user.name, status: "submitted" },
          entries as ReportEntryInput[]
        );
        await sendReportSubmissionEmail({
          reportType: "Capture Report",
          observerName: user.name,
          date,
          location: `${project} · ${site}`,
          reportId: id,
          pdfBuffer,
          portalOrigin: new URL(req.url).origin,
        });
      } catch (emailError) {
        console.error("Report submission email failed:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update report error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 400 });
  }
}
