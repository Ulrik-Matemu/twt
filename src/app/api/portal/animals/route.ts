import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { getAnimals } from "@/lib/animals-data";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const animals = await getAnimals();
  return NextResponse.json({ animals });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!requireRole(user, CATALOG_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Missing animal name" }, { status: 400 });
    }

    const docRef = await adminDb.collection("animals").add({
      name: name.trim(),
      active: true,
      createdBy: user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    await logActivity(user, "animal.create", {
      targetType: "animal",
      targetId: docRef.id,
      summary: `Registered animal "${name.trim()}" in the catalog`,
    });

    revalidateTag("animals", "max");

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Create animal error:", error);
    return NextResponse.json({ error: "Failed to add animal" }, { status: 500 });
  }
}
