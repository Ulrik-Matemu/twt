import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { getAnimals } from "@/lib/animals-data";
import AnimalsManager from "./AnimalsManager";

export default async function AnimalsPage() {
  const user = await getSessionUser();
  if (!requireRole(user, CATALOG_MANAGER_ROLES)) {
    redirect("/portal");
  }

  const animals = await getAnimals();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Animal catalog</h1>
        <p className="text-sm text-slate-500 mt-1">
          Register animal names here. Doctors will select from this list and
          fill in the rest of the details for each daily report.
        </p>
      </div>
      <AnimalsManager animals={animals} />
    </div>
  );
}
