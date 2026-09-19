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
