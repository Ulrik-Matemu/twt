import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

export type ScheduleRequestInput = {
  requestType: string;
  serviceCategory: string;
  urgency: string;
  firstName: string;
  lastName: string;
  organisation?: string;
  role?: string;
  email: string;
  phone: string;
  country?: string;
  location?: string;
  region: string;
  species?: string;
  situationDetail: string;
  previousAttempts?: string;
  preferredDate: string;
  preferredTime: string;
  alternateDate?: string;
  meetingFormat: string;
  additionalNotes?: string;
};

export async function saveScheduleRequest(data: ScheduleRequestInput) {
  const docRef = await adminDb.collection("schedule_requests").add({
    requestType: data.requestType,
    serviceCategory: data.serviceCategory,
    urgency: data.urgency,
    firstName: data.firstName,
    lastName: data.lastName,
    organisation: data.organisation || null,
    role: data.role || null,
    email: data.email,
    phone: data.phone,
    country: data.country || null,
    location: data.location || null,
    region: data.region,
    species: data.species || null,
    situationDetail: data.situationDetail,
    previousAttempts: data.previousAttempts || null,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    alternateDate: data.alternateDate || null,
    meetingFormat: data.meetingFormat,
    additionalNotes: data.additionalNotes || null,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}