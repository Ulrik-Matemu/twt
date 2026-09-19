import { FieldValue } from "firebase-admin/firestore";
import type { SubUnitEntryInput } from "./portal-types";

export function validateZooGeneralDetails(
  body: unknown
): body is { date: string; unit: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.date === "string" &&
    !!b.date.trim() &&
    typeof b.unit === "string" &&
    !!b.unit.trim()
  );
}

function isAnimalsArray(value: unknown): value is { name: string; gender: string }[] {
  return (
    Array.isArray(value) &&
    value.every(
      (a) =>
        typeof a === "object" &&
        a !== null &&
        typeof (a as Record<string, unknown>).name === "string" &&
        typeof (a as Record<string, unknown>).gender === "string"
    )
  );
}

// Full validation — required before a zoo census report can move to
// "submitted". The individual-params and treatment blocks stay optional
// even here since the real reports genuinely omit them most days.
export function validateSubUnitEntries(
  entries: unknown
): entries is SubUnitEntryInput[] {
  if (!Array.isArray(entries) || entries.length === 0) return false;

  return entries.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const e = entry as Record<string, unknown>;

    const baseValid =
      typeof e.subUnitId === "string" &&
      typeof e.subUnitName === "string" &&
      isAnimalsArray(e.animals) &&
      typeof e.appearance === "string" &&
      e.appearance.trim() &&
      typeof e.behavior === "string" &&
      e.behavior.trim() &&
      typeof e.respiration === "string" &&
      e.respiration.trim() &&
      typeof e.faecesUrine === "string" &&
      e.faecesUrine.trim() &&
      typeof e.woundsLesions === "string" &&
      e.woundsLesions.trim() &&
      typeof e.feedWaterIntake === "string" &&
      e.feedWaterIntake.trim() &&
      typeof e.trainingAdaptability === "string" &&
      e.trainingAdaptability.trim() &&
      typeof e.hasIndividualParams === "boolean" &&
      typeof e.hasTreatment === "boolean";

    if (!baseValid) return false;

    if (e.hasIndividualParams && !(typeof e.individualAnimalName === "string" && e.individualAnimalName.trim())) {
      return false;
    }

    if (e.hasTreatment && !(typeof e.treatmentNotes === "string" && e.treatmentNotes.trim())) {
      return false;
    }

    return true;
  });
}

// Lenient validation — a draft only needs the sub-unit identity + roster
// snapshot per entry; everything else may be missing while filled in later.
export function validateDraftSubUnitEntries(
  entries: unknown
): entries is Record<string, unknown>[] {
  if (!Array.isArray(entries)) return false;

  return entries.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const e = entry as Record<string, unknown>;
    return (
      typeof e.subUnitId === "string" &&
      typeof e.subUnitName === "string" &&
      isAnimalsArray(e.animals)
    );
  });
}

function normalizeSubUnitEntry(entry: Record<string, unknown>) {
  return {
    subUnitId: entry.subUnitId ?? "",
    subUnitName: entry.subUnitName ?? "",
    animals: isAnimalsArray(entry.animals) ? entry.animals : [],
    appearance: entry.appearance ?? "",
    behavior: entry.behavior ?? "",
    respiration: entry.respiration ?? "",
    faecesUrine: entry.faecesUrine ?? "",
    woundsLesions: entry.woundsLesions ?? "",
    feedWaterIntake: entry.feedWaterIntake ?? "",
    trainingAdaptability: entry.trainingAdaptability ?? "",
    hasIndividualParams: entry.hasIndividualParams === true,
    individualAnimalName: entry.individualAnimalName ?? null,
    individualTemperature: entry.individualTemperature ?? null,
    individualHeartRate: entry.individualHeartRate ?? null,
    individualRespiratoryRate: entry.individualRespiratoryRate ?? null,
    individualNotes: entry.individualNotes ?? null,
    hasTreatment: entry.hasTreatment === true,
    treatmentNotes: entry.treatmentNotes ?? null,
  };
}

// Replaces a report's entire `subUnitEntries` subcollection with a new set,
// inside the given batch. Mirrors replaceReportEntries in report-helpers.ts
// for the capture report type.
export async function replaceReportSubUnitEntries(
  reportRef: FirebaseFirestore.DocumentReference,
  entries: Record<string, unknown>[],
  batch: FirebaseFirestore.WriteBatch
) {
  const existing = await reportRef.collection("subUnitEntries").get();
  existing.docs.forEach((doc) => batch.delete(doc.ref));

  for (const entry of entries) {
    const entryRef = reportRef.collection("subUnitEntries").doc();
    batch.set(entryRef, {
      ...normalizeSubUnitEntry(entry),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
}
