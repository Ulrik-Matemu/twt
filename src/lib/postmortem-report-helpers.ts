import type { PostmortemReportInput } from "./portal-types";

// The shape a client actually submits — everything except `preparedByName`/
// `preparedByTitle`, which the server always derives from the submitting
// doctor's session (see route handlers) rather than trusting the client.
export type PostmortemReportClientInput = Omit<
  PostmortemReportInput,
  "preparedByName" | "preparedByTitle"
>;

export function validatePostmortemGeneralDetails(
  body: unknown
): body is { date: string; location: string; animalCommonName: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.date === "string" &&
    !!b.date.trim() &&
    typeof b.location === "string" &&
    !!b.location.trim() &&
    typeof b.animalCommonName === "string" &&
    !!b.animalCommonName.trim()
  );
}

// Full validation — required before a report can move to "submitted".
export function validatePostmortemReport(body: unknown): body is PostmortemReportClientInput {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  return (
    typeof b.date === "string" &&
    !!b.date.trim() &&
    typeof b.location === "string" &&
    !!b.location.trim() &&
    typeof b.animalCommonName === "string" &&
    !!b.animalCommonName.trim() &&
    (b.sex === "male" || b.sex === "female" || b.sex === "unknown") &&
    typeof b.age === "string" &&
    !!b.age.trim() &&
    typeof b.caseHistory === "string" &&
    !!b.caseHistory.trim() &&
    typeof b.postmortemFindings === "string" &&
    !!b.postmortemFindings.trim() &&
    typeof b.causeOfDeath === "string" &&
    !!b.causeOfDeath.trim() &&
    typeof b.recommendations === "string" &&
    !!b.recommendations.trim() &&
    (b.imageUrls === undefined || Array.isArray(b.imageUrls))
  );
}

// Lenient validation — a draft only needs the animal identity and exam
// date; everything else may be missing while the doctor fills it in later.
export function validatePostmortemDraft(
  body: unknown
): body is { date: string; animalCommonName: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.date === "string" &&
    !!b.date.trim() &&
    typeof b.animalCommonName === "string" &&
    !!b.animalCommonName.trim()
  );
}
