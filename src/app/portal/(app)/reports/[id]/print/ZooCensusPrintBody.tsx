import type { SubUnitEntryInput } from "@/lib/portal-types";

export default async function ZooCensusPrintBody({
  entriesSnapshot,
}: {
  entriesSnapshot: FirebaseFirestore.QuerySnapshot;
}) {
  const entries = entriesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as SubUnitEntryInput),
  }));

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <section
          key={entry.id}
          className="subunit-section border border-slate-300 rounded-none p-4 text-sm"
        >
          <h3 className="font-bold text-slate-900 mb-1">
            Sub Unit {index + 1}: {entry.subUnitName.toUpperCase()}
          </h3>
          {entry.animals?.length > 0 && (
            <p className="text-xs text-slate-600 mb-3">
              Names:{" "}
              {entry.animals.map((a) => `${a.name} (${a.gender})`).join(", ")}
            </p>
          )}

          <p className="font-semibold text-slate-800 mt-2">
            1. General Health &amp; Physical Observation
          </p>
          <PrintRemark label="A. Appearance and posture" value={entry.appearance} />
          <PrintRemark label="B. Behavior and activity level" value={entry.behavior} />
          <PrintRemark label="C. Respiration and breathing" value={entry.respiration} />
          <PrintRemark label="D. Faeces and urine" value={entry.faecesUrine} />
          <PrintRemark label="E. Wounds and lesions" value={entry.woundsLesions} />

          <p className="font-semibold text-slate-800 mt-3">2. Feed and Water Intake</p>
          <PrintRemark label="Remark" value={entry.feedWaterIntake} />

          <p className="font-semibold text-slate-800 mt-3">3. Training and Adaptability</p>
          <PrintRemark label="Remark" value={entry.trainingAdaptability} />

          {entry.hasIndividualParams && (
            <>
              <p className="font-semibold text-slate-800 mt-3 underline">
                Today&apos;s health parameters for {entry.individualAnimalName}
              </p>
              <p className="text-slate-700 mt-1">
                Temperature: {entry.individualTemperature || "—"} &middot; Heart rate:{" "}
                {entry.individualHeartRate || "—"} &middot; Respiratory rate:{" "}
                {entry.individualRespiratoryRate || "—"}
              </p>
              {entry.individualNotes && (
                <p className="text-slate-700 mt-1">{entry.individualNotes}</p>
              )}
            </>
          )}

          {entry.hasTreatment && (
            <>
              <p className="font-semibold text-slate-800 mt-3">4. Treatment Undertaken</p>
              <p className="text-slate-700 mt-1">{entry.treatmentNotes}</p>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

function PrintRemark({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-slate-700 mt-1">
      <span className="font-medium text-slate-800">{label}: </span>
      {value}
    </p>
  );
}
