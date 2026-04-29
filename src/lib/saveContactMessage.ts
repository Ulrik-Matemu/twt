import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

export type ContactMessageInput = {
  name: string;
  organisation?: string;
  email: string;
  phone?: string;
  enquiryType: string;
  urgency?: string;
  message: string;
};

export async function saveContactMessage(data: ContactMessageInput) {
  const docRef = await adminDb.collection("contact_messages").add({
    name: data.name,
    organisation: data.organisation || null,
    email: data.email,
    phone: data.phone || null,
    enquiryType: data.enquiryType,
    urgency: data.urgency || null,
    message: data.message,
    status: "new",
    source: "contact_page",
    createdAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}