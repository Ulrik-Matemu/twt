import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getSessionUser, hasRole } from "@/lib/portal-auth";
import { IMAGE_MANAGER_ROLES } from "@/lib/portal-types";
import { destroyImage, isOwnCloudinaryUrl } from "@/lib/cloudinary-sign";
import { logActivity } from "@/lib/activity-log";

const MAX_IMAGES = 30;

// Replaces the photos on one field of a report (or one of its capture
// entries) without touching anything else — so it never re-runs the full-edit
// validators or re-sends the submission email. Photos dropped from the list
// are permanently deleted from Cloudinary.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasRole(user, IMAGE_MANAGER_ROLES)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    entryId?: string;
    field?: "imageUrls" | "deliveryImageUrl";
    urls?: unknown;
  } | null;

  if (!body || (body.field !== "imageUrls" && body.field !== "deliveryImageUrl")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { entryId, field } = body;

  if (
    !Array.isArray(body.urls) ||
    body.urls.length > MAX_IMAGES ||
    !body.urls.every(isOwnCloudinaryUrl) ||
    (field === "deliveryImageUrl" && body.urls.length > 1)
  ) {
    return NextResponse.json({ error: "Invalid image list" }, { status: 400 });
  }
  const urls = body.urls as string[];

  const reportRef = adminDb.collection("reports").doc(id);
  const reportDoc = await reportRef.get();
  if (!reportDoc.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  const report = reportDoc.data()!;

  const targetRef = entryId ? reportRef.collection("entries").doc(entryId) : reportRef;
  if (!entryId && (report.reportType !== "postmortem" || field !== "imageUrls")) {
    return NextResponse.json({ error: "This report has no photos at that level" }, { status: 400 });
  }
  const targetDoc = entryId ? await targetRef.get() : reportDoc;
  if (!targetDoc.exists) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  const target = targetDoc.data()!;

  // Submitted capture entries must keep their required photos, same as the
  // normal submit validation.
  if (entryId && report.status !== "draft" && urls.length === 0) {
    const required = field === "imageUrls" || target.delivered === true;
    if (required) {
      return NextResponse.json(
        { error: "A submitted entry must keep at least one photo. Upload a new one first." },
        { status: 400 }
      );
    }
  }

  const previous: string[] =
    field === "imageUrls"
      ? Array.isArray(target.imageUrls) ? target.imageUrls : []
      : typeof target.deliveryImageUrl === "string" && target.deliveryImageUrl
        ? [target.deliveryImageUrl]
        : [];
  const removed = previous.filter((url) => !urls.includes(url));

  await targetRef.update(
    field === "imageUrls"
      ? { imageUrls: urls }
      : { deliveryImageUrl: urls[0] ?? null }
  );
  await reportRef.update({ updatedAt: FieldValue.serverTimestamp() });

  // Only after Firestore no longer references them.
  const destroyed = await Promise.all(removed.map(destroyImage));

  await logActivity(user, "report.edit", {
    targetType: "report",
    targetId: id,
    summary: `Updated photos on report (${urls.length} now, ${removed.length} removed)`,
  });

  return NextResponse.json({
    success: true,
    urls,
    removed: removed.length,
    cloudinaryDeleted: destroyed.filter(Boolean).length,
  });
}
