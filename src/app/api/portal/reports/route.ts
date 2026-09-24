import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole, requireRole } from "@/lib/portal-auth";
import {
  PORTAL_ROLE_LABELS,
  POSTMORTEM_AUTHOR_ROLES,
  REPORT_AUTHOR_ROLES,
  REVIEWER_ROLES,
  type ReportEntryInput,
  type ReportInput,
  type SubUnitEntryInput,
  type ZooCensusReportInput,
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
import {
  validatePostmortemDraft,
  validatePostmortemGeneralDetails,
  validatePostmortemReport,
  type PostmortemReportClientInput,
} from "@/lib/postmortem-report-helpers";
import { logActivity } from "@/lib/activity-log";
import {
  generateCaptureReportPdf,
  generatePostmortemReportPdf,
  generateZooCensusReportPdf,
} from "@/lib/pdf/report-pdf";
import { sendReportSubmissionEmail } from "@/lib/resend-email";
import type { DocumentReference } from "firebase-admin/firestore";

// Persists whether the office notification email went out, so a failure
// (e.g. a missing/invalid Resend API key) is visible on the report itself
// instead of only in server logs nobody checks day-to-day.
async function recordNotificationStatus(
  reportRef: DocumentReference,
  result: { ok: true } | { ok: false; error: string }
) {
  try {
    await reportRef.update({
      notificationEmail: result.ok
        ? { status: "sent", sentAt: FieldValue.serverTimestamp() }
        : { status: "failed", error: result.error, failedAt: FieldValue.serverTimestamp() },
    });
  } catch (updateError) {
    console.error("Failed to record notification email status:", updateError);
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canViewAll = hasRole(user, REVIEWER_ROLES);

  const query = canViewAll
    ? adminDb.collection("reports").orderBy("createdAt", "desc").limit(200)
    : adminDb
        .collection("reports")
        .where("observerId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .limit(200);

  const snapshot = await query.get();
  const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const user = await getSessionUser();

  try {
    const body = await req.json();
    const isDraft = body.status === "draft";
    const isZooCensus = body.reportType === "zoo_census";
    const isPostmortem = body.reportType === "postmortem";

    const allowedRoles = isPostmortem ? POSTMORTEM_AUTHOR_ROLES : REPORT_AUTHOR_ROLES;
    if (!requireRole(user, allowedRoles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (isPostmortem) {
      const postmortem = body as PostmortemReportClientInput;

      if (!validatePostmortemGeneralDetails(postmortem)) {
        return NextResponse.json(
          { error: "Missing report details (date, location, animal species)" },
          { status: 400 }
        );
      }

      if (isDraft) {
        if (!validatePostmortemDraft(postmortem)) {
          return NextResponse.json(
            { error: "A postmortem draft must at least identify the animal and exam date" },
            { status: 400 }
          );
        }
      } else if (!validatePostmortemReport(postmortem)) {
        return NextResponse.json(
          { error: "The postmortem report must have all required fields filled in" },
          { status: 400 }
        );
      }

      // "Prepared by" always reflects who is actually logged in — the
      // submitting doctor's session name and role — never anything the
      // client could send.
      const preparedByName = user.name;
      const preparedByTitle = PORTAL_ROLE_LABELS[user.role];

      const reportRef = adminDb.collection("reports").doc();

      await reportRef.set({
        reportType: "postmortem",
        date: postmortem.date,
        location: postmortem.location ?? "",
        animalCommonName: postmortem.animalCommonName,
        animalScientificName: postmortem.animalScientificName ?? "",
        sex: postmortem.sex ?? "unknown",
        age: postmortem.age ?? "",
        caseHistory: postmortem.caseHistory ?? "",
        postmortemFindings: postmortem.postmortemFindings ?? "",
        causeOfDeath: postmortem.causeOfDeath ?? "",
        recommendations: postmortem.recommendations ?? "",
        imageUrls: Array.isArray(postmortem.imageUrls) ? postmortem.imageUrls : [],
        preparedByName,
        preparedByTitle,
        observerId: user.uid,
        observerName: user.name,
        status: isDraft ? "draft" : "submitted",
        createdAt: FieldValue.serverTimestamp(),
      });

      await logActivity(user, isDraft ? "report.save_draft" : "report.submit", {
        targetType: "report",
        targetId: reportRef.id,
        summary: `${isDraft ? "Saved draft" : "Submitted"} postmortem report for ${postmortem.animalCommonName} (${postmortem.date})`,
      });

      if (!isDraft) {
        try {
          const pdfBuffer = await generatePostmortemReportPdf({
            ...postmortem,
            preparedByName,
            preparedByTitle,
            observerName: user.name,
            status: "submitted",
          });
          const result = await sendReportSubmissionEmail({
            reportType: "Postmortem Report",
            observerName: user.name,
            date: postmortem.date,
            location: postmortem.animalCommonName,
            reportId: reportRef.id,
            pdfBuffer,
            portalOrigin: new URL(req.url).origin,
          });
          await recordNotificationStatus(reportRef, result);
        } catch (emailError) {
          console.error("Report submission email failed:", emailError);
          await recordNotificationStatus(reportRef, {
            ok: false,
            error: emailError instanceof Error ? emailError.message : String(emailError),
          });
        }
      }

      return NextResponse.json({ success: true, reportId: reportRef.id });
    }

    if (isZooCensus) {
      const { date, unit, subUnitEntries } = body as ZooCensusReportInput;

      if (!validateZooGeneralDetails({ date, unit })) {
        return NextResponse.json(
          { error: "Missing report details (date, unit)" },
          { status: 400 }
        );
      }

      if (isDraft) {
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

      const reportRef = adminDb.collection("reports").doc();
      const batch = adminDb.batch();

      batch.set(reportRef, {
        reportType: "zoo_census",
        date,
        unit,
        observerId: user.uid,
        observerName: user.name,
        status: isDraft ? "draft" : "submitted",
        createdAt: FieldValue.serverTimestamp(),
      });

      await replaceReportSubUnitEntries(
        reportRef,
        subUnitEntries as Record<string, unknown>[],
        batch
      );

      await batch.commit();

      await logActivity(user, isDraft ? "report.save_draft" : "report.submit", {
        targetType: "report",
        targetId: reportRef.id,
        summary: `${isDraft ? "Saved draft" : "Submitted"} zoo census report for ${unit} (${date})`,
      });

      if (!isDraft) {
        // The report is already saved at this point — a PDF/email hiccup
        // must never turn into an error response for an already-successful
        // submission, so this is isolated from the outer try/catch.
        try {
          const pdfBuffer = await generateZooCensusReportPdf(
            { date, unit, observerName: user.name, status: "submitted" },
            subUnitEntries as SubUnitEntryInput[]
          );
          const result = await sendReportSubmissionEmail({
            reportType: "Zoo Census Report",
            observerName: user.name,
            date,
            location: unit,
            reportId: reportRef.id,
            pdfBuffer,
            portalOrigin: new URL(req.url).origin,
          });
          await recordNotificationStatus(reportRef, result);
        } catch (emailError) {
          console.error("Report submission email failed:", emailError);
          await recordNotificationStatus(reportRef, {
            ok: false,
            error: emailError instanceof Error ? emailError.message : String(emailError),
          });
        }
      }

      return NextResponse.json({ success: true, reportId: reportRef.id });
    }

    const { date, project, site, entries } = body as ReportInput;

    if (!validateGeneralDetails({ date, project, site })) {
      return NextResponse.json(
        { error: "Missing report details (date, project, site)" },
        { status: 400 }
      );
    }

    if (isDraft) {
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

    const reportRef = adminDb.collection("reports").doc();
    const batch = adminDb.batch();

    batch.set(reportRef, {
      reportType: "capture",
      date,
      project,
      site,
      observerId: user.uid,
      observerName: user.name,
      status: isDraft ? "draft" : "submitted",
      createdAt: FieldValue.serverTimestamp(),
    });

    await replaceReportEntries(reportRef, entries as Record<string, unknown>[], batch);

    await batch.commit();

    await logActivity(user, isDraft ? "report.save_draft" : "report.submit", {
      targetType: "report",
      targetId: reportRef.id,
      summary: `${isDraft ? "Saved draft" : "Submitted"} report for ${project} · ${site} (${date})`,
    });

    if (!isDraft) {
      try {
        const pdfBuffer = await generateCaptureReportPdf(
          { date, project, site, observerName: user.name, status: "submitted" },
          entries as ReportEntryInput[]
        );
        const result = await sendReportSubmissionEmail({
          reportType: "Capture Report",
          observerName: user.name,
          date,
          location: `${project} · ${site}`,
          reportId: reportRef.id,
          pdfBuffer,
          portalOrigin: new URL(req.url).origin,
        });
        await recordNotificationStatus(reportRef, result);
      } catch (emailError) {
        console.error("Report submission email failed:", emailError);
        await recordNotificationStatus(reportRef, {
          ok: false,
          error: emailError instanceof Error ? emailError.message : String(emailError),
        });
      }
    }

    return NextResponse.json({ success: true, reportId: reportRef.id });
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
