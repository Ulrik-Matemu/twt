import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import { DOCTOR_ROLES, EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { getRecipients } from "@/lib/email-recipients";
import { getRecentEmailLog } from "@/lib/email-log-data";
import { getUsers } from "@/lib/users-data";
import RecipientsManager from "./RecipientsManager";
import DeliveryLog from "./DeliveryLog";

export default async function EmailPage() {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    redirect("/portal");
  }

  const [recipients, log, users, recentReports] = await Promise.all([
    getRecipients(),
    getRecentEmailLog(100),
    getUsers(),
    adminDb
      .collection("reports")
      .orderBy("createdAt", "desc")
      .limit(300)
      .select("unit", "project", "site")
      .get(),
  ]);

  // Units/projects/sites are free text on reports, so suggest what's already
  // been used (to avoid typos in filters) while still allowing new values.
  const distinct = (key: "unit" | "project" | "site") =>
    Array.from(
      new Set(
        recentReports.docs
          .map((d) => (d.get(key) as string | undefined)?.trim())
          .filter((v): v is string => !!v)
      )
    ).sort();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Report emails</h1>
        <p className="text-sm text-slate-500 mt-1">
          Choose who receives submitted reports, and check whether the emails were delivered.
        </p>
      </div>

      <RecipientsManager
        recipients={recipients}
        doctors={users
          .filter((u) => DOCTOR_ROLES.includes(u.role))
          .map((u) => ({ id: u.id, name: u.name }))}
        suggestions={{
          units: distinct("unit"),
          projects: distinct("project"),
          sites: distinct("site"),
        }}
      />

      <DeliveryLog rows={log} />
    </div>
  );
}
