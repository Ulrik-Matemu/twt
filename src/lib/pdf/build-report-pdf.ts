import type {
  AnimalSex,
  PortalRole,
  ReportEntryInput,
  ReportStatus,
  ReportType,
  SubUnitEntryInput,
} from "@/lib/portal-types";
import type { ReportRoutingInfo } from "@/lib/email-recipients";
import { buildReportFilename } from "@/lib/report-filename";
import {
  generateCaptureReportPdf,
  generatePostmortemReportPdf,
  generateZooCensusReportPdf,
} from "./report-pdf";

export interface BuiltReportPdf {
  buffer: Buffer;
  filename: string;
  reportTypeLabel: "Capture Report" | "Zoo Census Report" | "Postmortem Report";
  location: string;
  date: string;
  observerName: string;
  routing: ReportRoutingInfo;
}

// Builds the PDF for an already-saved report document, whatever its type.
// Shared by the PDF download route, forwarding and email retries.
export async function buildReportPdf(
  reportDoc: FirebaseFirestore.DocumentSnapshot
): Promise<BuiltReportPdf> {
  const report = reportDoc.data() as {
    reportType?: ReportType;
    date: string;
    project?: string;
    site?: string;
    unit?: string;
    location?: string;
    animalCommonName?: string;
    animalScientificName?: string;
    sex?: AnimalSex;
    age?: string;
    caseHistory?: string;
    postmortemFindings?: string;
    causeOfDeath?: string;
    recommendations?: string;
    imageUrls?: string[];
    preparedByName?: string;
    preparedByTitle?: string;
    observerId?: string;
    observerRole?: PortalRole;
    observerName: string;
    status: ReportStatus;
  };

  const reportType: ReportType = report.reportType ?? "capture";
  const common = {
    filename: buildReportFilename(report),
    date: report.date,
    observerName: report.observerName,
  };
  const routing: ReportRoutingInfo = {
    reportType,
    unit: report.unit,
    project: report.project,
    site: report.site,
    observerId: report.observerId,
    observerRole: report.observerRole,
  };

  if (reportType === "postmortem") {
    const buffer = await generatePostmortemReportPdf({
      date: report.date,
      location: report.location || "",
      animalCommonName: report.animalCommonName || "",
      animalScientificName: report.animalScientificName,
      sex: report.sex || "unknown",
      age: report.age || "",
      caseHistory: report.caseHistory || "",
      postmortemFindings: report.postmortemFindings || "",
      causeOfDeath: report.causeOfDeath || "",
      recommendations: report.recommendations || "",
      imageUrls: report.imageUrls || [],
      preparedByName: report.preparedByName || report.observerName,
      preparedByTitle: report.preparedByTitle,
      observerName: report.observerName,
      status: report.status,
    });
    return {
      ...common,
      buffer,
      reportTypeLabel: "Postmortem Report",
      location: report.animalCommonName || "",
      routing,
    };
  }

  if (reportType === "zoo_census") {
    const entriesSnapshot = await reportDoc.ref
      .collection("subUnitEntries")
      .orderBy("createdAt")
      .get();
    const entries = entriesSnapshot.docs.map((doc) => doc.data() as SubUnitEntryInput);
    const buffer = await generateZooCensusReportPdf(
      {
        date: report.date,
        unit: report.unit || "",
        observerName: report.observerName,
        status: report.status,
      },
      entries
    );
    return {
      ...common,
      buffer,
      reportTypeLabel: "Zoo Census Report",
      location: report.unit || "",
      routing,
    };
  }

  const entriesSnapshot = await reportDoc.ref.collection("entries").orderBy("createdAt").get();
  const entries = entriesSnapshot.docs.map((doc) => doc.data() as ReportEntryInput);
  const buffer = await generateCaptureReportPdf(
    {
      date: report.date,
      project: report.project || "",
      site: report.site || "",
      observerName: report.observerName,
      status: report.status,
    },
    entries
  );
  return {
    ...common,
    buffer,
    reportTypeLabel: "Capture Report",
    location: `${report.project || ""} · ${report.site || ""}`,
    routing,
  };
}
