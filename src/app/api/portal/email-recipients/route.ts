import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { logActivity } from "@/lib/activity-log";
import {
  EMAIL_PATTERN,
  OFFICE_ADDRESS,
  getRecipients,
  normalizeFilters,
} from "@/lib/email-recipients";

export async function GET() {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ recipients: await getRecipients() });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const label = typeof body?.label === "string" ? body.label.trim().slice(0, 80) : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (email === OFFICE_ADDRESS) {
    return NextResponse.json(
      { error: `${OFFICE_ADDRESS} already receives every report` },
      { status: 400 }
    );
  }

  const existing = await getRecipients();
  if (existing.some((r) => r.email.toLowerCase() === email)) {
    return NextResponse.json({ error: "That address is already a recipient" }, { status: 409 });
  }

  const doc = await adminDb.collection("email_recipients").add({
    email,
    label,
    active: true,
    filters: normalizeFilters(body?.filters),
    createdAt: new Date(),
    createdBy: user.name,
  });

  await logActivity(user, "email.recipient_add", {
    targetType: "email_recipient",
    targetId: doc.id,
    summary: `Added report email recipient ${email}`,
  });

  return NextResponse.json({ success: true, id: doc.id });
}
