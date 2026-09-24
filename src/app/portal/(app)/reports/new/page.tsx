import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import {
  POSTMORTEM_AUTHOR_ROLES,
  PORTAL_ROLE_LABELS,
  REPORT_AUTHOR_ROLES,
  type ReportType,
} from "@/lib/portal-types";
import { getAnimals } from "@/lib/animals-data";
import { getZooSubunits } from "@/lib/zoo-roster-data";
import ReportForm from "../ReportForm";
import ZooReportForm from "../ZooReportForm";
import PostmortemReportForm from "../PostmortemReportForm";

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  capture: "Capture report",
  zoo_census: "Zoo census report",
  postmortem: "Postmortem report",
};

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const user = await getSessionUser();
  const canAuthorPostmortem = requireRole(user, POSTMORTEM_AUTHOR_ROLES);
  const canAuthorOther = requireRole(user, REPORT_AUTHOR_ROLES);
  if (!canAuthorPostmortem && !canAuthorOther) {
    redirect("/portal");
  }

  const eligibleTypes: ReportType[] = [];
  if (user.role === "zoo_doctor") eligibleTypes.push("zoo_census");
  if (user.role === "field_doctor") eligibleTypes.push("capture");
  if (canAuthorPostmortem) eligibleTypes.push("postmortem");

  const { type: requestedType } = await searchParams;
  const selectedType: ReportType =
    requestedType && eligibleTypes.includes(requestedType as ReportType)
      ? (requestedType as ReportType)
      : eligibleTypes[0];

  if (eligibleTypes.length > 1 && !requestedType) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">New report</h1>
        <p className="text-sm text-slate-500">Which report are you filing?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          {eligibleTypes.map((type) => (
            <Link
              key={type}
              href={`/portal/reports/new?type=${type}`}
              className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 hover:border-[#d6852b] transition-colors"
            >
              {REPORT_TYPE_LABELS[type]}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  if (selectedType === "zoo_census") {
    const subunits = await getZooSubunits();
    return (
      <ZooReportForm
        mode="create"
        initialSubunits={subunits}
        initial={{ date: today, unit: "", subUnitEntries: [] }}
      />
    );
  }

  if (selectedType === "postmortem") {
    return (
      <PostmortemReportForm
        mode="create"
        initial={{
          date: today,
          location: "",
          animalCommonName: "",
          animalScientificName: "",
          sex: "unknown",
          age: "",
          caseHistory: "",
          postmortemFindings: "",
          causeOfDeath: "",
          recommendations: "",
          imageUrls: [],
        }}
        preparedBy={{ name: user.name, title: PORTAL_ROLE_LABELS[user.role] }}
      />
    );
  }

  const animals = await getAnimals();
  return (
    <ReportForm
      mode="create"
      initialAnimals={animals}
      initial={{ date: today, project: "", site: "", entries: [] }}
    />
  );
}
