"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/cloudinary-client";
import ImageUploadField from "../ImageUploadField";

// Admin-only photo editor for one image field of a report. Each change is
// saved immediately through the images endpoint (which also deletes removed
// photos from Cloudinary), so there's no separate "save" step.
export default function ReportImagesManager({
  reportId,
  entryId,
  field,
  label,
  urls: initialUrls,
}: {
  reportId: string;
  entryId?: string;
  field: "imageUrls" | "deliveryImageUrl";
  label: string;
  urls: string[];
}) {
  const router = useRouter();
  const [urls, setUrls] = useState(initialUrls);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const single = field === "deliveryImageUrl";

  async function save(next: string[]) {
    const res = await fetch(`/api/portal/reports/${reportId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, field, urls: next }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? "Failed to save photos");
    }
    setUrls(next);
    router.refresh();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        Array.from(single ? [files[0]] : files).map((file) => uploadImage(file))
      );
      await save(single ? uploaded : [...urls, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(url: string) {
    if (!window.confirm("Permanently delete this photo? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    try {
      await save(urls.filter((u) => u !== url));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <ImageUploadField
        label={`${label} (admin)`}
        urls={urls}
        uploading={busy}
        multiple={!single}
        onFiles={handleFiles}
        onRemove={handleRemove}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
