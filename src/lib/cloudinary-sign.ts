import { createHash } from "crypto";

const FOLDER = "animal-monitoring-reports";

export function signUploadParams() {
  const timestamp = Math.floor(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const paramsToSign = `folder=${FOLDER}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(paramsToSign).digest("hex");

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: FOLDER,
  };
}

// True only for images hosted in our own Cloudinary account, so the images
// endpoint can't be pointed at (or made to delete) arbitrary URLs.
export function isOwnCloudinaryUrl(url: unknown): url is string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return (
    typeof url === "string" &&
    !!cloudName &&
    url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`)
  );
}

function extractPublicId(url: string): string | null {
  const afterUpload = url.split("/image/upload/")[1];
  if (!afterUpload) return null;
  const segments = afterUpload.split("?")[0].split("/");
  // Drop transformation segments and the version, keeping folder/name.ext.
  const versionIndex = segments.findIndex((s) => /^v\d+$/.test(s));
  const rest = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(-2);
  if (rest.length === 0) return null;
  return decodeURIComponent(rest.join("/")).replace(/\.[^./]+$/, "");
}

// Permanently removes an uploaded image from Cloudinary. Best-effort: never
// throws, returns whether Cloudinary confirmed the deletion.
export async function destroyImage(url: string): Promise<boolean> {
  try {
    const publicId = extractPublicId(url);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!publicId || !apiSecret || !cloudName || !apiKey) return false;

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1")
      .update(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const body = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
      invalidate: "true",
    });
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { result?: string };
    return data.result === "ok";
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", url, error);
    return false;
  }
}
