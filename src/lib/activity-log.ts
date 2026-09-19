import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import type { PortalSessionUser } from "./portal-types";

export async function logActivity(
  user: PortalSessionUser,
  action: string,
  opts: { targetType?: string; targetId?: string; summary: string }
) {
  try {
    await adminDb.collection("activity_logs").add({
      userId: user.uid,
      userName: user.name,
      userRole: user.role,
      action,
      targetType: opts.targetType ?? null,
      targetId: opts.targetId ?? null,
      summary: opts.summary,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    // Logging must never break the action it's describing.
    console.error("Activity log write failed:", error);
  }
}
