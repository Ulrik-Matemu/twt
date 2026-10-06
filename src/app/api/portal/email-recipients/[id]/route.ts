import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import { normalizeFilters } from "@/lib/email-recipients";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const ref = adminDb.collection("email_recipients").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  if (typeof body.active === "boolean") update.active = body.active;
  if (typeof body.label === "string") update.label = body.label.trim().slice(0, 80);
  if (body.filters !== undefined) update.filters = normalizeFilters(body.filters);

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await ref.update(update);
  await logActivity(user, "email.recipient_update", {
    targetType: "email_recipient",
    targetId: id,
    summary: `Updated report email recipient ${doc.data()!.email}`,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const ref = adminDb.collection("email_recipients").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  await ref.delete();
  await logActivity(user, "email.recipient_delete", {
    targetType: "email_recipient",
    targetId: id,
    summary: `Removed report email recipient ${doc.data()!.email}`,
  });

  return NextResponse.json({ success: true });
}
