import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { USER_MANAGER_ROLES } from "@/lib/portal-types";
import { getUsers } from "@/lib/users-data";
import UsersManager from "./UsersManager";

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!requireRole(user, USER_MANAGER_ROLES)) {
    redirect("/portal");
  }

  const users = await getUsers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">User accounts</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create login accounts for doctors and office managers.
        </p>
      </div>
      <UsersManager users={users} />
    </div>
  );
}
