import Link from "next/link";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import { POSTMORTEM_AUTHOR_ROLES, REPORT_AUTHOR_ROLES, REVIEWER_ROLES, type ReportType } from "@/lib/portal-types";

export default async function ReportsListPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const canViewAll = hasRole(user, REVIEWER_ROLES);
  const isAuthor = hasRole(user, REPORT_AUTHOR_ROLES) || hasRole(user, POSTMORTEM_AUTHOR_ROLES);

  const query = canViewAll
    ? adminDb.collection("reports").orderBy("createdAt", "desc").limit(200)
    : adminDb
        .collection("reports")
        .where("observerId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .limit(200);

  const snapshot = await query.get();
  const reports = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      reportType?: ReportType;
      date: string;
      project?: string;
      site?: string;
      unit?: string;
      animalCommonName?: string;
      observerId: string;
      observerName: string;
      status: string;
      notificationEmail?: { status: "sent" | "failed" };
    }),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
        {isAuthor && (
          <Link
            href="/portal/reports/new"
            data-tour-id="new-report-button"
            className="bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#c07724] transition-colors"
          >
            + New report
          </Link>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No reports yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => {
            const isOwnDraft = r.status === "draft" && r.observerId === user.uid;
            // Once a non-reviewer author's report leaves draft status, this
            // list row is their only view of it — a "submitted, no longer
            // editable" history entry rather than a link to full details.
            const canOpen = canViewAll || isOwnDraft;

            const reportType: ReportType = r.reportType || "capture";
            const location =
              reportType === "zoo_census"
                ? r.unit
                : reportType === "postmortem"
                  ? r.animalCommonName
                  : `${r.project} · ${r.site}`;

            const rowContent = (
              <>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{location}</p>
                  <p className="text-xs text-slate-500">
                    {r.date} &middot; {r.observerName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {canViewAll && r.notificationEmail?.status === "failed" && (
                    <span
                      title="Office wasn't notified by email for this report — check Resend or notify manually"
                      className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700"
                    >
                      Email not sent
                    </span>
                  )}
                  <TypeBadge reportType={reportType} />
                  <StatusBadge status={r.status} />
                </div>
              </>
            );

            if (!canOpen) {
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 opacity-75"
                >
                  {rowContent}
                </li>
              );
            }

            return (
              <li key={r.id}>
                <Link
                  href={isOwnDraft ? `/portal/reports/${r.id}/edit` : `/portal/reports/${r.id}`}
                  className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-slate-300 transition-colors"
                >
                  {rowContent}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
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

const TYPE_BADGE_LABELS: Record<ReportType, string> = {
  capture: "Capture",
  zoo_census: "Census",
  postmortem: "Postmortem",
};

function TypeBadge({ reportType }: { reportType: ReportType }) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
      {TYPE_BADGE_LABELS[reportType]}
    </span>
  );
}
