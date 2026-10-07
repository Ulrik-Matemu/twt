import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import {
  EMAIL_MANAGER_ROLES,
  IMAGE_MANAGER_ROLES,
  REVIEWER_ROLES,
  displayRoleTitle,
  type AnimalSex,
  type ReportEntryInput,
  type ReportStatus,
  type SubUnitEntryInput,
} from "@/lib/portal-types";
import ReviewPanel from "./ReviewPanel";
import ReportImagesManager from "./ReportImagesManager";
import EmailPanel from "./EmailPanel";
import { getReportEmailLog } from "@/lib/email-log-data";

const STATUS_STYLES: Record<ReportStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-amber-50 text-amber-700",
  reviewed: "bg-green-50 text-green-700",
  flagged: "bg-red-50 text-red-700",
};

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/portal/login");

  const { id } = await params;
  const reportDoc = await adminDb.collection("reports").doc(id).get();

  if (!reportDoc.exists) notFound();

  const report = reportDoc.data() as {
    reportType?: "capture" | "zoo_census" | "postmortem";
    date: string;
    project?: string;
    site?: string;
    unit?: string;
    animalCommonName?: string;
    observerId: string;
    observerName: string;
    status: ReportStatus;
    reviewNotes?: string;
  };
  const isZooCensus = report.reportType === "zoo_census";
  const isPostmortem = report.reportType === "postmortem";

  const canViewAll = hasRole(user, REVIEWER_ROLES);
  const isAuthor = report.observerId === user.uid;
  const isOwnDraft = isAuthor && report.status === "draft";

  // Once a report leaves draft status, only reviewers (admin, office_manager,
  // admin_doctor, i.e. Admin Vet) can view its full details — an author only sees it in the
  // reports list ("history") while it's their own submitted report.
  if (!canViewAll && !isOwnDraft) {
    redirect("/portal/reports");
  }

  const canEdit = canViewAll || isOwnDraft;
  const canManageImages = hasRole(user, IMAGE_MANAGER_ROLES);
  const emailLog = hasRole(user, EMAIL_MANAGER_ROLES) ? await getReportEmailLog(id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-slate-900">
              {isZooCensus
                ? report.unit
                : isPostmortem
                  ? report.animalCommonName
                  : `${report.project} · ${report.site}`}
            </h1>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_STYLES[report.status]}`}
            >
              {report.status}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {isZooCensus ? "Zoo Census" : isPostmortem ? "Postmortem" : "Capture"}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {report.date} &middot; Observer: {report.observerName}
          </p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <Link
              href={`/portal/reports/${id}/edit`}
              className="text-sm font-medium rounded-lg px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              {isOwnDraft && !canViewAll ? "Continue editing" : "Edit report"}
            </Link>
          )}
          {canViewAll && (
            <Link
              href={`/portal/reports/${id}/print`}
              target="_blank"
              className="text-sm font-medium rounded-lg px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Print
            </Link>
          )}
        </div>
      </div>

      {isZooCensus ? (
        <ZooCensusBody reportRef={reportDoc.ref} />
      ) : isPostmortem ? (
        <PostmortemBody reportDoc={reportDoc} manageImages={canManageImages} />
      ) : (
        <CaptureBody reportRef={reportDoc.ref} manageImages={canManageImages} />
      )}

      {emailLog && <EmailPanel reportId={id} log={emailLog} />}

      {canViewAll && (
        <ReviewPanel
          reportId={id}
          currentStatus={report.status}
          currentNotes={report.reviewNotes || ""}
        />
      )}
    </div>
  );
}

async function CaptureBody({
  reportRef,
  manageImages,
}: {
  reportRef: FirebaseFirestore.DocumentReference;
  manageImages: boolean;
}) {
  const entriesSnapshot = await reportRef.collection("entries").orderBy("createdAt").get();
  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ReportEntryInput),
  }));

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">
              {index + 1}. {entry.animalName}
            </h3>
            {entry.delivered && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                Delivered
              </span>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Field label="Type" value={entry.type} />
            <Field label="Gender" value={entry.gender} />
            <Field label="Quantity" value={String(entry.quantity)} />
            <Field
              label="Age group"
              value={entry.ageGroup === "juvenile" ? "Juvenile" : "Adult"}
            />
            <Field label="Site of capture" value={entry.siteOfCapture} />
            <Field label="Capture date/time" value={entry.captureDateTime} />
          </dl>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Condition</p>
            <p className="text-sm text-slate-800">{entry.condition}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Vet&apos;s summary</p>
            <p className="text-sm text-slate-800">{entry.doctorSummary}</p>
          </div>

          {(entry.imageUrls?.length > 0 || manageImages) && (
            <ImageGrid
              label="Animal photos"
              urls={entry.imageUrls ?? []}
              manage={
                manageImages
                  ? { reportId: reportRef.id, entryId: entry.id, field: "imageUrls" }
                  : undefined
              }
            />
          )}

          {entry.delivered && (
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Delivery summary</p>
                <p className="text-sm text-slate-800">{entry.deliverySummary}</p>
                {entry.deliveredAt && (
                  <p className="text-xs text-slate-500 mt-1">
                    Marked delivered at {new Date(entry.deliveredAt).toLocaleString()}
                  </p>
                )}
              </div>
              {(entry.deliveryImageUrl || manageImages) && (
                <ImageGrid
                  label="Delivery photo"
                  urls={entry.deliveryImageUrl ? [entry.deliveryImageUrl] : []}
                  manage={
                    manageImages
                      ? { reportId: reportRef.id, entryId: entry.id, field: "deliveryImageUrl" }
                      : undefined
                  }
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

async function PostmortemBody({
  reportDoc,
  manageImages,
}: {
  reportDoc: FirebaseFirestore.DocumentSnapshot;
  manageImages: boolean;
}) {
  const report = reportDoc.data() as {
    location: string;
    animalCommonName: string;
    animalScientificName?: string;
    sex: AnimalSex;
    age: string;
    caseHistory: string;
    postmortemFindings: string;
    causeOfDeath: string;
    recommendations: string;
    imageUrls?: string[];
    preparedByName: string;
    preparedByTitle?: string;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <Field label="Location" value={report.location} />
        <Field
          label="Animal species"
          value={
            report.animalScientificName
              ? `${report.animalCommonName} (${report.animalScientificName})`
              : report.animalCommonName
          }
        />
        <Field label="Sex" value={capitalize(report.sex)} />
        <Field label="Age" value={report.age} />
        <Field
          label="Prepared by"
          value={
            report.preparedByTitle
              ? `${report.preparedByName} — ${displayRoleTitle(report.preparedByTitle)}`
              : report.preparedByName
          }
        />
      </dl>

      <Field label="Case history" value={report.caseHistory} block />
      <Field label="Postmortem findings" value={report.postmortemFindings} block />
      <Field label="Cause of death" value={report.causeOfDeath} block />
      <Field label="Recommendations" value={report.recommendations} block />

      {((report.imageUrls && report.imageUrls.length > 0) || manageImages) && (
        <ImageGrid
          label="Photos"
          urls={report.imageUrls ?? []}
          manage={
            manageImages ? { reportId: reportDoc.id, field: "imageUrls" } : undefined
          }
        />
      )}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function ZooCensusBody({
  reportRef,
}: {
  reportRef: FirebaseFirestore.DocumentReference;
}) {
  const entriesSnapshot = await reportRef
    .collection("subUnitEntries")
    .orderBy("createdAt")
    .get();
  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as SubUnitEntryInput),
  }));

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-medium text-slate-900">
            {index + 1}. {entry.subUnitName}
          </h3>

          {entry.animals?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.animals.map((a) => (
                <span
                  key={a.name}
                  className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1"
                >
                  {a.name} &middot; {a.gender}
                </span>
              ))}
            </div>
          )}

          <Field label="Appearance and posture" value={entry.appearance} block />
          <Field label="Behavior and activity level" value={entry.behavior} block />
          <Field label="Respiration and breathing" value={entry.respiration} block />
          <Field label="Faeces and urine" value={entry.faecesUrine} block />
          <Field label="Wounds and lesions" value={entry.woundsLesions} block />
          <Field label="Feed and water intake" value={entry.feedWaterIntake} block />
          <Field label="Training and adaptability" value={entry.trainingAdaptability} block />

          {entry.hasIndividualParams && (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <p className="text-xs font-medium text-slate-500">
                Today&apos;s health parameters for {entry.individualAnimalName}
              </p>
              <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <Field label="Temperature" value={entry.individualTemperature || "—"} />
                <Field label="Heart rate" value={entry.individualHeartRate || "—"} />
                <Field
                  label="Respiratory rate"
                  value={entry.individualRespiratoryRate || "—"}
                />
              </dl>
              {entry.individualNotes && (
                <Field label="Other notes" value={entry.individualNotes} block />
              )}
            </div>
          )}

          {entry.hasTreatment && (
            <div className="border-t border-slate-100 pt-3">
              <Field label="Treatment undertaken" value={entry.treatmentNotes || ""} block />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  block,
}: {
  label: string;
  value: string;
  block?: boolean;
}) {
  if (block) {
    return (
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    );
  }

  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

// Admins get an editable photo manager (add/replace/delete); everyone else
// gets a large, click-to-open grid.
function ImageGrid({
  label,
  urls,
  manage,
}: {
  label: string;
  urls: string[];
  manage?: {
    reportId: string;
    entryId?: string;
    field: "imageUrls" | "deliveryImageUrl";
  };
}) {
  if (manage) {
    return (
      <div className="space-y-3">
        <ImageGridView label={label} urls={urls} />
        <ReportImagesManager
          reportId={manage.reportId}
          entryId={manage.entryId}
          field={manage.field}
          label={label}
          urls={urls}
        />
      </div>
    );
  }
  return <ImageGridView label={label} urls={urls} />;
}

function ImageGridView({ label, urls }: { label: string; urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {urls.map((url) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          >
            <Image
              src={url}
              alt={label}
              width={800}
              height={600}
              className="w-full h-64 object-contain"
              unoptimized
            />
          </a>
        ))}
      </div>
    </div>
  );
}
