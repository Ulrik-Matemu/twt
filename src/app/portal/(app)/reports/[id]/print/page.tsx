import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import {
  REVIEWER_ROLES,
  type AnimalSex,
  type ReportEntryInput,
  type ReportStatus,
} from "@/lib/portal-types";
import { buildReportFilename } from "@/lib/report-filename";
import ReportLetterhead from "../../ReportLetterhead";
import PrintButton from "./PrintButton";
import ZooCensusPrintBody from "./ZooCensusPrintBody";

type PrintReportData = {
  reportType?: "capture" | "zoo_census" | "postmortem";
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
  preparedByName?: string;
  preparedByTitle?: string;
  observerId: string;
  observerName: string;
  status: ReportStatus;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const reportDoc = await adminDb.collection("reports").doc(id).get();
  if (!reportDoc.exists) return {};

  const report = reportDoc.data() as PrintReportData;
  return { title: buildReportFilename(report) };
}

export default async function PrintReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/portal/login");

  const { id } = await params;
  const reportDoc = await adminDb.collection("reports").doc(id).get();
  if (!reportDoc.exists) notFound();

  const report = reportDoc.data() as PrintReportData;

  // Printing is a reviewer-only action (admin, office_manager, admin_doctor) —
  // report authors never print, whether the report is a draft or submitted.
  const canPrint = hasRole(user, REVIEWER_ROLES);
  if (!canPrint) {
    redirect(`/portal/reports/${id}`);
  }

  if (report.reportType === "postmortem") {
    return (
      <div className="max-w-[900px] mx-auto p-6 print:p-0">
        <PrintStyles orientation="portrait" />
        <PreviewBar />
        <ReportLetterhead title="Postmortem Report" status={report.status} />

        <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <dt className="text-xs font-medium text-slate-500">Date of examination</dt>
            <dd className="text-slate-900">{report.date}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Location</dt>
            <dd className="text-slate-900">{report.location}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Animal species</dt>
            <dd className="text-slate-900">
              {report.animalScientificName
                ? `${report.animalCommonName} (${report.animalScientificName})`
                : report.animalCommonName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Sex</dt>
            <dd className="text-slate-900 capitalize">{report.sex}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Age</dt>
            <dd className="text-slate-900">{report.age}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Prepared by</dt>
            <dd className="text-slate-900">
              {report.preparedByTitle
                ? `${report.preparedByName} — ${report.preparedByTitle}`
                : report.preparedByName}
            </dd>
          </div>
        </dl>

        <div className="space-y-4 text-sm">
          <PrintSection label="Case history" value={report.caseHistory} />
          <PrintSection label="Postmortem findings" value={report.postmortemFindings} />
          <PrintSection label="Cause of death" value={report.causeOfDeath} />
          <PrintSection label="Recommendations" value={report.recommendations} />
        </div>

        <Footer />
      </div>
    );
  }

  if (report.reportType === "zoo_census") {
    const entriesSnapshot = await reportDoc.ref
      .collection("subUnitEntries")
      .orderBy("createdAt")
      .get();

    return (
      <div className="max-w-[900px] mx-auto p-6 print:p-0">
        <PrintStyles orientation="portrait" />
        <PreviewBar />
        <ReportLetterhead title="Daily Animal Monitoring Report" status={report.status} />

        <dl className="grid grid-cols-3 gap-4 text-sm mb-6">
          <div>
            <dt className="text-xs font-medium text-slate-500">Date</dt>
            <dd className="text-slate-900">{report.date}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Unit</dt>
            <dd className="text-slate-900">{report.unit}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Observer</dt>
            <dd className="text-slate-900">{report.observerName}</dd>
          </div>
        </dl>

        <ZooCensusPrintBody entriesSnapshot={entriesSnapshot} />

        <Footer />
      </div>
    );
  }

  const entriesSnapshot = await reportDoc.ref.collection("entries").orderBy("createdAt").get();
  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ReportEntryInput),
  }));

  return (
    <div className="max-w-[1100px] mx-auto p-6 print:p-0">
      <PrintStyles orientation="landscape" />
      <PreviewBar />
      <ReportLetterhead title="Animal Monitoring Report" status={report.status} />

      <dl className="grid grid-cols-4 gap-4 text-sm mb-6">
        <div>
          <dt className="text-xs font-medium text-slate-500">Date</dt>
          <dd className="text-slate-900">{report.date}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Project</dt>
          <dd className="text-slate-900">{report.project}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Site</dt>
          <dd className="text-slate-900">{report.site}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Observer</dt>
          <dd className="text-slate-900">{report.observerName}</dd>
        </div>
      </dl>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left">
            {[
              "#",
              "Animal",
              "Type",
              "Gender",
              "Qty",
              "Age",
              "Site of capture",
              "Capture date/time",
              "Condition",
              "Doctor's summary",
              "Delivered",
              "Delivery summary",
            ].map((h) => (
              <th key={h} className="border border-slate-300 px-2 py-1.5 align-bottom">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id} className="entry-row align-top">
              <td className="border border-slate-300 px-2 py-1.5">{index + 1}</td>
              <td className="border border-slate-300 px-2 py-1.5 font-medium">
                {entry.animalName}
              </td>
              <td className="border border-slate-300 px-2 py-1.5">{entry.type}</td>
              <td className="border border-slate-300 px-2 py-1.5">{entry.gender}</td>
              <td className="border border-slate-300 px-2 py-1.5">{entry.quantity}</td>
              <td className="border border-slate-300 px-2 py-1.5 capitalize">
                {entry.ageGroup}
              </td>
              <td className="border border-slate-300 px-2 py-1.5">{entry.siteOfCapture}</td>
              <td className="border border-slate-300 px-2 py-1.5 whitespace-nowrap">
                {entry.captureDateTime}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 min-w-[140px]">
                {entry.condition}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 min-w-[160px]">
                {entry.doctorSummary}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 whitespace-nowrap">
                {entry.delivered
                  ? `Yes${
                      entry.deliveredAt
                        ? ` — ${new Date(entry.deliveredAt).toLocaleString()}`
                        : ""
                    }`
                  : "No"}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 min-w-[140px]">
                {entry.delivered ? entry.deliverySummary : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </div>
  );
}

function PrintSection({ label, value }: { label: string; value?: string }) {
  return (
    <div className="break-inside-avoid">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-slate-900 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function PrintStyles({ orientation }: { orientation: "portrait" | "landscape" }) {
  return (
    <style>{`
      @media print {
        @page { size: A4 ${orientation}; margin: 12mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
      .entry-row, .subunit-section { break-inside: avoid; }
    `}</style>
  );
}

function PreviewBar() {
  return (
    <div className="flex items-center justify-between mb-4 print:hidden">
      <p className="text-sm text-slate-500">Preview — this is how the printed copy will look.</p>
      <PrintButton />
    </div>
  );
}

function Footer() {
  return (
    <p className="text-[10px] text-slate-400 mt-6">
      Generated from the TWT Animal Monitoring Portal on {new Date().toLocaleString()}.
    </p>
  );
}
