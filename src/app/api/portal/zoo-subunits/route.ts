import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { CATALOG_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { getZooSubunits } from "@/lib/zoo-roster-data";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subunits = await getZooSubunits();
  return NextResponse.json({ subunits });
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
      return NextResponse.json({ error: "Missing sub-unit name" }, { status: 400 });
    }

    const docRef = await adminDb.collection("zoo_subunits").add({
      name: name.trim(),
      active: true,
      createdBy: user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    await logActivity(user, "zoo_subunit.create", {
      targetType: "zoo_subunit",
      targetId: docRef.id,
      summary: `Registered zoo sub-unit "${name.trim()}"`,
    });

    revalidateTag("zoo-subunits", "max");

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Create zoo sub-unit error:", error);
    return NextResponse.json({ error: "Failed to add sub-unit" }, { status: 500 });
  }
}
