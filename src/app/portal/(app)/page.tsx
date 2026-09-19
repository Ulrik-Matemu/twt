import Link from "next/link";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import {
  PORTAL_ROLE_LABELS,
  REPORT_AUTHOR_ROLES,
  REVIEWER_ROLES,
} from "@/lib/portal-types";

export default async function PortalDashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const canViewAll = hasRole(user, REVIEWER_ROLES);
  const isAuthor = hasRole(user, REPORT_AUTHOR_ROLES);

  const query = canViewAll
    ? adminDb.collection("reports").orderBy("createdAt", "desc").limit(5)
    : adminDb
        .collection("reports")
        .where("observerId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .limit(5);

  const snapshot = await query.get();
  const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome, {user.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {PORTAL_ROLE_LABELS[user.role]}
        </p>
      </div>

      {isAuthor && (
        <Link
          href="/portal/reports/new"
          className="block bg-[#d6852b] text-white font-medium rounded-xl px-4 py-3 text-center hover:bg-[#c07724] transition-colors"
        >
          + New monitoring report
        </Link>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-slate-900">Recent reports</h2>
          <Link href="/portal/reports" className="text-sm text-[#c07724]">
            View all
          </Link>
        </div>

        {reports.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No reports yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reports.map((report) => {
              const r = report as {
                id: string;
                reportType?: "capture" | "zoo_census";
                date: string;
                project?: string;
                site?: string;
                unit?: string;
                observerId: string;
                observerName: string;
                status: string;
              };
              const isOwnDraft = r.status === "draft" && r.observerId === user.uid;
              const canOpen = canViewAll || isOwnDraft;
              const isZooCensus = r.reportType === "zoo_census";

              const rowContent = (
                <>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {isZooCensus ? r.unit : `${r.project} · ${r.site}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {r.date} &middot; {r.observerName}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </>
              );

              if (!canOpen) {
                return (
                  <li key={r.id} className="flex items-center justify-between py-3 opacity-75">
                    {rowContent}
                  </li>
                );
              }

              return (
                <li key={r.id}>
                  <Link
                    href={isOwnDraft ? `/portal/reports/${r.id}/edit` : `/portal/reports/${r.id}`}
                    className="flex items-center justify-between py-3"
                  >
                    {rowContent}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    submitted: "bg-amber-50 text-amber-700",
    reviewed: "bg-green-50 text-green-700",
    flagged: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
