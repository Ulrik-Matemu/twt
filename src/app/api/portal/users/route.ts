import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { USER_MANAGER_ROLES, PORTAL_ROLE_LABELS, type PortalRole } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { getUsers } from "@/lib/users-data";

const VALID_ROLES: PortalRole[] = [
  "admin",
  "office_manager",
  "admin_doctor",
  "zoo_doctor",
  "field_doctor",
];

export async function GET() {
  const user = await getSessionUser();
  if (!requireRole(user, USER_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!requireRole(user, USER_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }

    if (!VALID_ROLES.includes(role as PortalRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const created = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(created.uid, { role });

    await adminDb.collection("users").doc(created.uid).set({
      name,
      email,
      role,
      active: true,
      createdBy: user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    await logActivity(user, "user.create", {
      targetType: "user",
      targetId: created.uid,
      summary: `Created ${PORTAL_ROLE_LABELS[role as PortalRole]} account for ${name} (${email})`,
    });

    revalidateTag("users", "max");

    return NextResponse.json({ success: true, uid: created.uid });
  } catch (error: unknown) {
    console.error("Create user error:", error);
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
