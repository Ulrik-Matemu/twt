import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { REPORT_AUTHOR_ROLES } from "@/lib/portal-types";
import { getAnimals } from "@/lib/animals-data";
import { getZooSubunits } from "@/lib/zoo-roster-data";
import ReportForm from "../ReportForm";
import ZooReportForm from "../ZooReportForm";

export default async function NewReportPage() {
  const user = await getSessionUser();
  if (!requireRole(user, REPORT_AUTHOR_ROLES)) {
    redirect("/portal");
  }

  const today = new Date().toISOString().slice(0, 10);

  if (user.role === "zoo_doctor") {
    const subunits = await getZooSubunits();
    return (
      <ZooReportForm
        mode="create"
        initialSubunits={subunits}
        initial={{ date: today, unit: "Zoo", subUnitEntries: [] }}
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
