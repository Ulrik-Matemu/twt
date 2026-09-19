import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; animalId: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, CATALOG_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, animalId } = await params;

  try {
    const body = await req.json();
    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Missing active flag" }, { status: 400 });
    }

    const animalRef = adminDb
      .collection("zoo_subunits")
      .doc(id)
      .collection("animals")
      .doc(animalId);
    const animalDoc = await animalRef.get();
    if (!animalDoc.exists) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }
    const animalName = (animalDoc.data()?.name as string) || animalId;

    await animalRef.update({ active: body.active });

    await logActivity(
      user,
      body.active ? "zoo_subunit_animal.activate" : "zoo_subunit_animal.deactivate",
      {
        targetType: "zoo_subunit_animal",
        targetId: animalId,
        summary: `${body.active ? "Activated" : "Deactivated"} ${animalName} in the zoo roster`,
      }
    );

    revalidateTag("zoo-subunits", "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update zoo sub-unit animal error:", error);
    return NextResponse.json({ error: "Failed to update animal" }, { status: 400 });
  }
}
