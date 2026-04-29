import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

export async function saveNewsletterSubscriber(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await adminDb
    .collection("newsletter_subscribers")
    .where("email", "==", normalizedEmail)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { alreadyExists: true };
  }

  const docRef = await adminDb.collection("newsletter_subscribers").add({
    email: normalizedEmail,
    status: "active",
    source: "footer_newsletter",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { alreadyExists: false, id: docRef.id };
}