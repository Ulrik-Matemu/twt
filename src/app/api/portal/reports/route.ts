import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole, requireRole } from "@/lib/portal-auth";
import {
  REPORT_AUTHOR_ROLES,
  REVIEWER_ROLES,
  type ReportInput,
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
import { logActivity } from "@/lib/activity-log";

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
  if (!requireRole(user, REPORT_AUTHOR_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const isDraft = body.status === "draft";
    const isZooCensus = body.reportType === "zoo_census";

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

    return NextResponse.json({ success: true, reportId: reportRef.id });
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
