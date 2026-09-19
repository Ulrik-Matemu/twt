import { redirect } from "next/navigation";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { adminDb } from "@/lib/firebase-admin";
import { REVIEWER_ROLES, type AgeGroup, type ReportStatus } from "@/lib/portal-types";
import { getAnimals } from "@/lib/animals-data";
import { getZooSubunits } from "@/lib/zoo-roster-data";
import ReportForm, { type EntryDraft } from "../../ReportForm";
import ZooReportForm, { type SubUnitEntryDraft } from "../../ZooReportForm";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/portal/login");

  const { id } = await params;
  const reportRef = adminDb.collection("reports").doc(id);
  const reportDoc = await reportRef.get();
  if (!reportDoc.exists) redirect("/portal/reports");

  const reportData = reportDoc.data()!;
  const isReviewer = hasRole(user, REVIEWER_ROLES);
  const isAuthor = reportData.observerId === user.uid;
  const canEdit = isReviewer || (isAuthor && reportData.status === "draft");

  if (!canEdit) redirect(`/portal/reports/${id}`);

  if (reportData.reportType === "zoo_census") {
    const report = reportData as { date: string; unit: string; status: ReportStatus };

    const [subunits, entriesSnapshot] = await Promise.all([
      getZooSubunits(),
      reportRef.collection("subUnitEntries").orderBy("createdAt").get(),
    ]);

    const subUnitEntries: SubUnitEntryDraft[] = entriesSnapshot.docs.map((doc) => {
      const data = doc.data() as {
        subUnitId: string;
        subUnitName: string;
        animals: { name: string; gender: string }[];
        appearance: string;
        behavior: string;
        respiration: string;
        faecesUrine: string;
        woundsLesions: string;
        feedWaterIntake: string;
        trainingAdaptability: string;
        hasIndividualParams: boolean;
        individualAnimalName: string | null;
        individualTemperature: string | null;
        individualHeartRate: string | null;
        individualRespiratoryRate: string | null;
        individualNotes: string | null;
        hasTreatment: boolean;
        treatmentNotes: string | null;
      };

      return {
        localId: doc.id,
        subUnitId: data.subUnitId,
        subUnitName: data.subUnitName,
        animals: data.animals || [],
        appearance: data.appearance,
        behavior: data.behavior,
        respiration: data.respiration,
        faecesUrine: data.faecesUrine,
        woundsLesions: data.woundsLesions,
        feedWaterIntake: data.feedWaterIntake,
        trainingAdaptability: data.trainingAdaptability,
        hasIndividualParams: data.hasIndividualParams,
        individualAnimalName: data.individualAnimalName || "",
        individualTemperature: data.individualTemperature || "",
        individualHeartRate: data.individualHeartRate || "",
        individualRespiratoryRate: data.individualRespiratoryRate || "",
        individualNotes: data.individualNotes || "",
        hasTreatment: data.hasTreatment,
        treatmentNotes: data.treatmentNotes || "",
      };
    });

    return (
      <ZooReportForm
        mode={isReviewer ? "admin-edit" : "draft-edit"}
        reportId={id}
        initialSubunits={subunits}
        initial={{ date: report.date, unit: report.unit, subUnitEntries }}
      />
    );
  }

  const report = reportData as {
    date: string;
    project: string;
    site: string;
    status: ReportStatus;
  };

  const [animals, entriesSnapshot] = await Promise.all([
    getAnimals(),
    reportRef.collection("entries").orderBy("createdAt").get(),
  ]);

  const entries: EntryDraft[] = entriesSnapshot.docs.map((doc) => {
    const data = doc.data() as {
      animalId: string;
      animalName: string;
      type: string;
      gender: string;
      quantity: number;
      ageGroup: AgeGroup;
      siteOfCapture: string;
      captureDateTime: string;
      condition: string;
      doctorSummary: string;
      imageUrls: string[];
      delivered: boolean;
      deliverySummary: string | null;
      deliveryImageUrl: string | null;
      deliveredAt: string | null;
    };

    return {
      localId: doc.id,
      animalId: data.animalId,
      animalName: data.animalName,
      type: data.type,
      gender: data.gender,
      quantity: String(data.quantity ?? ""),
      ageGroup: data.ageGroup || "adult",
      siteOfCapture: data.siteOfCapture,
      captureDateTime: data.captureDateTime,
      condition: data.condition,
      doctorSummary: data.doctorSummary,
      imageUrls: data.imageUrls || [],
      delivered: data.delivered,
      deliverySummary: data.deliverySummary || "",
      deliveryImageUrl: data.deliveryImageUrl || "",
      deliveredAt: data.deliveredAt || "",
      uploadingImages: false,
      uploadingDelivery: false,
    };
  });

  return (
    <ReportForm
      mode={isReviewer ? "admin-edit" : "draft-edit"}
      reportId={id}
      initialAnimals={animals}
      initial={{ date: report.date, project: report.project, site: report.site, entries }}
    />
  );
}
