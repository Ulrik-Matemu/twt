import { FieldValue } from "firebase-admin/firestore";
import type { ReportEntryInput } from "./portal-types";

export function validateGeneralDetails(
  body: unknown
): body is { date: string; project: string; site: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.date === "string" &&
    !!b.date.trim() &&
    typeof b.project === "string" &&
    !!b.project.trim() &&
    typeof b.site === "string" &&
    !!b.site.trim()
  );
}

// Full validation — required before a report can move to "submitted".
export function validateEntries(entries: unknown): entries is ReportEntryInput[] {
  if (!Array.isArray(entries) || entries.length === 0) return false;

  return entries.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const e = entry as Record<string, unknown>;

    const baseValid =
      typeof e.animalId === "string" &&
      typeof e.animalName === "string" &&
      typeof e.type === "string" &&
      e.type.trim() &&
      typeof e.gender === "string" &&
      e.gender.trim() &&
      typeof e.quantity === "number" &&
      e.quantity > 0 &&
      (e.ageGroup === "juvenile" || e.ageGroup === "adult") &&
      typeof e.siteOfCapture === "string" &&
      e.siteOfCapture.trim() &&
      typeof e.captureDateTime === "string" &&
      e.captureDateTime.trim() &&
      typeof e.condition === "string" &&
      e.condition.trim() &&
      typeof e.doctorSummary === "string" &&
      e.doctorSummary.trim() &&
      Array.isArray(e.imageUrls) &&
      e.imageUrls.length > 0 &&
      typeof e.delivered === "boolean";

    if (!baseValid) return false;

    if (e.delivered) {
      return (
        typeof e.deliverySummary === "string" &&
        e.deliverySummary.trim() &&
        typeof e.deliveryImageUrl === "string" &&
        e.deliveryImageUrl.trim() &&
        typeof e.deliveredAt === "string" &&
        e.deliveredAt.trim()
      );
    }

    return true;
  });
}

// Lenient validation — a draft only needs an animal identity per entry;
// everything else may be missing while the doctor fills it in later.
export function validateDraftEntries(entries: unknown): entries is Record<string, unknown>[] {
  if (!Array.isArray(entries)) return false;

  return entries.every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;
    const e = entry as Record<string, unknown>;
    return typeof e.animalId === "string" && typeof e.animalName === "string";
  });
}

function normalizeEntry(entry: Record<string, unknown>) {
  return {
    animalId: entry.animalId ?? "",
    animalName: entry.animalName ?? "",
    type: entry.type ?? "",
    gender: entry.gender ?? "",
    quantity: typeof entry.quantity === "number" ? entry.quantity : 0,
    ageGroup: entry.ageGroup === "juvenile" ? "juvenile" : "adult",
    siteOfCapture: entry.siteOfCapture ?? "",
    captureDateTime: entry.captureDateTime ?? "",
    condition: entry.condition ?? "",
    doctorSummary: entry.doctorSummary ?? "",
    imageUrls: Array.isArray(entry.imageUrls) ? entry.imageUrls : [],
    delivered: entry.delivered === true,
    deliverySummary: entry.deliverySummary ?? null,
    deliveryImageUrl: entry.deliveryImageUrl ?? null,
    deliveredAt: entry.deliveredAt ?? null,
  };
}

// Replaces a report's entire `entries` subcollection with a new set,
// inside the given batch. Used by both create and full-edit paths.
export async function replaceReportEntries(
  reportRef: FirebaseFirestore.DocumentReference,
  entries: Record<string, unknown>[],
  batch: FirebaseFirestore.WriteBatch
) {
  const existing = await reportRef.collection("entries").get();
  existing.docs.forEach((doc) => batch.delete(doc.ref));

  for (const entry of entries) {
    const entryRef = reportRef.collection("entries").doc();
    batch.set(entryRef, {
      ...normalizeEntry(entry),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
}
