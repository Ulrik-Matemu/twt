import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { getZooSubunits } from "@/lib/zoo-roster-data";
import ZooRosterManager from "./ZooRosterManager";

export default async function ZooRosterPage() {
  const user = await getSessionUser();
  if (!requireRole(user, CATALOG_MANAGER_ROLES)) {
    redirect("/portal");
  }

  const subunits = await getZooSubunits();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Zoo roster</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up sub-units (species groups) and the named animals in each. The
          zoo doctor picks from this roster when filing the daily census
          report.
        </p>
      </div>
      <ZooRosterManager subunits={subunits} />
    </div>
  );
}
