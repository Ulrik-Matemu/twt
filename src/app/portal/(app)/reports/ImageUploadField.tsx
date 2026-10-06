"use client";

import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";

// Photo picker shared by the report forms and the admin image manager.
// Offers two explicit entry points: the camera, and the device gallery/files
// (an `accept="image/*"` input *without* `capture`, which on mobile opens the
// photo library instead of forcing the camera).
export default function ImageUploadField({
  label,
  required,
  urls,
  uploading,
  multiple = true,
  onFiles,
  onRemove,
}: {
  label?: string;
  required?: boolean;
  urls: string[];
  uploading: boolean;
  multiple?: boolean;
  onFiles: (files: FileList | null) => void;
  onRemove: (url: string) => void;
}) {
  const tileClass =
    "w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-400 hover:border-[#d6852b] hover:text-[#c07724] transition-colors text-[10px] font-medium";

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2 flex-wrap">
        {urls.map((url) => (
          <div key={url} className="relative w-20 h-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={label ?? "Photo"}
              className="w-20 h-20 rounded-lg object-cover border border-slate-200"
            />
            <button
              type="button"
              onClick={() => onRemove(url)}
              aria-label="Remove photo"
              className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              &times;
            </button>
          </div>
        ))}

        {uploading ? (
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        ) : (
          <>
            <label className={tileClass}>
              <Camera className="w-5 h-5" />
              Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple={multiple}
                onChange={(e) => {
                  onFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
            <label className={tileClass}>
              <ImageIcon className="w-5 h-5" />
              Gallery
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => {
                  onFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
