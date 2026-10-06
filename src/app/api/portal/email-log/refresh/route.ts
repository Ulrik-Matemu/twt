import { NextResponse } from "next/server";
import { getSessionUser, requireRole } from "@/lib/portal-auth";
import { EMAIL_MANAGER_ROLES } from "@/lib/portal-types";
import { refreshEmailStatuses } from "@/lib/email-status";

export async function POST() {
  const user = await getSessionUser();
  if (!requireRole(user, EMAIL_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await refreshEmailStatuses();
  return NextResponse.json({ success: true, updated });
}
