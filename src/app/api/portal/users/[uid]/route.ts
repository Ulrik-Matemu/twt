import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { USER_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, USER_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { uid } = await params;

  try {
    const body = await req.json();
    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Missing active flag" }, { status: 400 });
    }

    const targetRef = adminDb.collection("users").doc(uid);
    const targetDoc = await targetRef.get();
    if (!targetDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const targetName = (targetDoc.data()?.name as string) || uid;

    await adminAuth.updateUser(uid, { disabled: !body.active });
    await targetRef.update({ active: body.active });

    await logActivity(user, body.active ? "user.enable" : "user.disable", {
      targetType: "user",
      targetId: uid,
      summary: `${body.active ? "Enabled" : "Disabled"} account for ${targetName}`,
    });

    revalidateTag("users", "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
  }
}
