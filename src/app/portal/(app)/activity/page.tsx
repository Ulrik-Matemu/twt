import { redirect } from "next/navigation";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import { PORTAL_ROLE_LABELS, type PortalRole } from "@/lib/portal-types";

export default async function ActivityPage() {
  const user = await getSessionUser();
  if (!requireRole(user, ["admin"])) {
    redirect("/portal");
  }

  const snapshot = await adminDb
    .collection("activity_logs")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const entries = snapshot.docs.map((doc) => {
    const data = doc.data() as {
      userName: string;
      userRole: PortalRole;
      action: string;
      summary: string;
      createdAt?: FirebaseFirestore.Timestamp;
    };
    return {
      id: doc.id,
      userName: data.userName,
      userRole: data.userRole,
      action: data.action,
      summary: data.summary,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Activity log</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recent actions across the portal. Visible to admins only.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No activity recorded yet.
        </div>
      ) : (
        <ul className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {entries.map((entry) => (
            <li key={entry.id} className="p-4">
              <p className="text-sm text-slate-900">{entry.summary}</p>
              <p className="text-xs text-slate-500 mt-1">
                {entry.userName} &middot; {PORTAL_ROLE_LABELS[entry.userRole]}
                {entry.createdAt && (
                  <> &middot; {new Date(entry.createdAt).toLocaleString()}</>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
