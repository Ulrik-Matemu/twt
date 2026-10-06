import { Resend } from "resend";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import type { EmailLogStatus } from "./resend-email";

const NON_FINAL: EmailLogStatus[] = ["sent", "delayed"];
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const PER_REQUEST_DELAY_MS = 600; // Resend allows ~2 requests/second

function mapEvent(event: string): EmailLogStatus {
  switch (event) {
    case "delivered":
    case "opened":
    case "clicked":
      return "delivered";
    case "bounced":
    case "suppressed":
      return "bounced";
    case "complained":
      return "complained";
    case "delivery_delayed":
      return "delayed";
    case "failed":
    case "canceled":
      return "failed";
    default:
      return "sent";
  }
}

// Looks up still-pending emails in Resend and updates their log rows.
// Sequential and capped so it stays inside Resend's rate limit.
export async function refreshEmailStatuses(limit = 20): Promise<number> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return 0;
  const resend = new Resend(apiKey);

  const snapshot = await adminDb
    .collection("email_log")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const pending = snapshot.docs
    .filter((doc) => {
      const d = doc.data();
      const created = d.createdAt?.toMillis?.() ?? 0;
      return (
        d.resendId &&
        NON_FINAL.includes(d.status) &&
        Date.now() - created < MAX_AGE_MS
      );
    })
    .slice(0, limit);

  let updated = 0;
  for (const doc of pending) {
    try {
      const { data, error } = await resend.emails.get(doc.data().resendId);
      if (error || !data) continue;
      const next = mapEvent(data.last_event);
      if (next !== doc.data().status) {
        await doc.ref.update({ status: next, lastEventAt: FieldValue.serverTimestamp() });
        updated += 1;
      }
    } catch (e) {
      console.error("Failed to refresh email status:", e);
    }
    await new Promise((r) => setTimeout(r, PER_REQUEST_DELAY_MS));
  }
  return updated;
}
