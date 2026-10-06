import { adminDb } from "./firebase-admin";
import {
  EMPTY_FILTERS,
  matchRecipients,
  normalizeFilters,
  type EmailRecipient,
  type ReportRoutingInfo,
} from "./email-filters";

export * from "./email-filters";

// Always receives every submitted report and can't be removed or filtered.
export const OFFICE_ADDRESS = "office@twt.co.tz";

// Seeded on first use so the pre-existing hard-coded recipient keeps
// receiving everything until an admin changes it.
const LEGACY_DEFAULT_RECIPIENT = "d.modest@gsmgroup.africa";

function toRecipient(id: string, data: FirebaseFirestore.DocumentData): EmailRecipient {
  return {
    id,
    email: data.email,
    label: data.label ?? "",
    active: data.active !== false,
    filters: normalizeFilters(data.filters),
  };
}

export async function getRecipients(): Promise<EmailRecipient[]> {
  const col = adminDb.collection("email_recipients");
  let snapshot = await col.get();

  if (snapshot.empty) {
    await col.add({
      email: LEGACY_DEFAULT_RECIPIENT,
      label: "Default recipient",
      active: true,
      filters: EMPTY_FILTERS,
      createdAt: new Date(),
      createdBy: "system",
    });
    snapshot = await col.get();
  }

  return snapshot.docs
    .map((doc) => toRecipient(doc.id, doc.data()))
    .sort((a, b) => a.email.localeCompare(b.email));
}

// Office address first, then every active recipient whose filters match.
export async function resolveRecipientEmails(report: ReportRoutingInfo): Promise<string[]> {
  const matched = matchRecipients(report, await getRecipients()).map((r) => r.email);
  return Array.from(new Set([OFFICE_ADDRESS, ...matched].map((e) => e.toLowerCase())));
}
