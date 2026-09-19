import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, CATALOG_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Missing active flag" }, { status: 400 });
    }

    const subunitRef = adminDb.collection("zoo_subunits").doc(id);
    const subunitDoc = await subunitRef.get();
    if (!subunitDoc.exists) {
      return NextResponse.json({ error: "Sub-unit not found" }, { status: 404 });
    }
    const subunitName = (subunitDoc.data()?.name as string) || id;

    await subunitRef.update({ active: body.active });

    await logActivity(user, body.active ? "zoo_subunit.activate" : "zoo_subunit.deactivate", {
      targetType: "zoo_subunit",
      targetId: id,
      summary: `${body.active ? "Activated" : "Deactivated"} zoo sub-unit "${subunitName}"`,
    });

    revalidateTag("zoo-subunits", "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update zoo sub-unit error:", error);
    return NextResponse.json({ error: "Failed to update sub-unit" }, { status: 400 });
  }
}
