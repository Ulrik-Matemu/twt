import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";

export async function POST(
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
    const { name, gender } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Missing animal name" }, { status: 400 });
    }
    if (!gender || typeof gender !== "string" || !gender.trim()) {
      return NextResponse.json({ error: "Missing gender" }, { status: 400 });
    }

    const subunitRef = adminDb.collection("zoo_subunits").doc(id);
    const subunitDoc = await subunitRef.get();
    if (!subunitDoc.exists) {
      return NextResponse.json({ error: "Sub-unit not found" }, { status: 404 });
    }

    const animalRef = await subunitRef.collection("animals").add({
      name: name.trim(),
      gender: gender.trim(),
      active: true,
      createdAt: FieldValue.serverTimestamp(),
    });

    await logActivity(user, "zoo_subunit_animal.create", {
      targetType: "zoo_subunit_animal",
      targetId: animalRef.id,
      summary: `Added ${name.trim()} (${gender.trim()}) to zoo sub-unit "${subunitDoc.data()?.name}"`,
    });

    revalidateTag("zoo-subunits", "max");

    return NextResponse.json({ success: true, id: animalRef.id });
  } catch (error) {
    console.error("Add zoo sub-unit animal error:", error);
    return NextResponse.json({ error: "Failed to add animal" }, { status: 500 });
  }
}
