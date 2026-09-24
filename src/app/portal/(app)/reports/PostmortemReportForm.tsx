"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/cloudinary-client";
import type { AnimalSex } from "@/lib/portal-types";

export interface PostmortemReportFormInitial {
  date: string;
  location: string;
  animalCommonName: string;
  animalScientificName: string;
  sex: AnimalSex;
  age: string;
  caseHistory: string;
  postmortemFindings: string;
  causeOfDeath: string;
  recommendations: string;
  imageUrls: string[];
}

export type PostmortemReportFormMode = "create" | "draft-edit" | "admin-edit";

export default function PostmortemReportForm({
  mode,
  reportId,
  initial,
  preparedBy,
}: {
  mode: PostmortemReportFormMode;
  reportId?: string;
  initial: PostmortemReportFormInitial;
  // Who "prepared" the report is never a text field the form lets you
  // type — it's the submitting doctor's session identity (name + role),
  // detected server-side and only ever displayed here.
  preparedBy: { name: string; title: string };
}) {
  const router = useRouter();
  const [date, setDate] = useState(initial.date);
  const [location, setLocation] = useState(initial.location);
  const [animalCommonName, setAnimalCommonName] = useState(initial.animalCommonName);
  const [animalScientificName, setAnimalScientificName] = useState(initial.animalScientificName);
  const [sex, setSex] = useState<AnimalSex>(initial.sex);
  const [age, setAge] = useState(initial.age);
  const [caseHistory, setCaseHistory] = useState(initial.caseHistory);
  const [postmortemFindings, setPostmortemFindings] = useState(initial.postmortemFindings);
  const [causeOfDeath, setCauseOfDeath] = useState(initial.causeOfDeath);
  const [recommendations, setRecommendations] = useState(initial.recommendations);
  const [imageUrls, setImageUrls] = useState<string[]>(initial.imageUrls);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState<"draft" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const identityFilled = date.trim() && animalCommonName.trim();
  const allFilled =
    identityFilled &&
    location.trim() &&
    age.trim() &&
    caseHistory.trim() &&
    postmortemFindings.trim() &&
    causeOfDeath.trim() &&
    recommendations.trim();

  const canSaveDraft = mode !== "admin-edit";
  const canDraftSave = canSaveDraft && !!identityFilled && !submitting && !uploadingImages;
  const canSubmit = !!allFilled && !submitting && !uploadingImages;

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadImage(file)));
      setImageUrls((prev) => [...prev, ...urls]);
    } catch {
      setError("Image upload failed. Check your connection and try again.");
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleSave(asDraft: boolean) {
    setError(null);
    setSubmitting(asDraft ? "draft" : "submit");
    try {
      const payload: Record<string, unknown> = {
        reportType: "postmortem",
        date,
        location,
        animalCommonName,
        animalScientificName,
        sex,
        age,
        caseHistory,
        postmortemFindings,
        causeOfDeath,
        recommendations,
        imageUrls,
      };

      // Admin editing an already-submitted/reviewed/flagged report should
      // never implicitly change its status.
      if (mode !== "admin-edit") {
        payload.status = asDraft ? "draft" : "submitted";
      }

      const url = reportId ? `/api/portal/reports/${reportId}` : "/api/portal/reports";
      const method = reportId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save report");
      }

      const data = await res.json();

      router.push(`/portal/reports/${reportId || data.reportId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-xl font-semibold text-slate-900">
        {mode === "create" && "New postmortem report"}
        {mode === "draft-edit" && "Continue draft postmortem report"}
        {mode === "admin-edit" && "Edit postmortem report"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">Animal biodata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LabeledInput label="Date of examination" type="date" value={date} onChange={setDate} />
          <LabeledInput
            label="Location"
            placeholder="e.g. Kimbiji Zoo"
            value={location}
            onChange={setLocation}
          />
          <LabeledInput
            label="Animal species"
            placeholder="e.g. Impala"
            value={animalCommonName}
            onChange={setAnimalCommonName}
          />
          <LabeledInput
            label="Scientific name (optional)"
            placeholder="e.g. Aepyceros melampus"
            value={animalScientificName}
            onChange={setAnimalScientificName}
          />
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sex</label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden">
              {(["male", "female", "unknown"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={`flex-1 py-2.5 text-sm capitalize ${
                    sex === s ? "bg-[#d6852b] text-white" : "bg-white text-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <LabeledInput label="Age" placeholder="e.g. 3 months" value={age} onChange={setAge} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <LabeledTextarea
          label="Case history"
          value={caseHistory}
          onChange={setCaseHistory}
          rows={4}
        />
        <LabeledTextarea
          label="Postmortem findings"
          value={postmortemFindings}
          onChange={setPostmortemFindings}
          rows={6}
        />
        <LabeledTextarea
          label="Cause of death"
          value={causeOfDeath}
          onChange={setCauseOfDeath}
          rows={3}
        />
        <LabeledTextarea
          label="Recommendations"
          value={recommendations}
          onChange={setRecommendations}
          rows={4}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">Photos (optional)</h2>
        <ImageUploadField
          urls={imageUrls}
          uploading={uploadingImages}
          onFiles={handleImageFiles}
          onRemove={(url) => setImageUrls((prev) => prev.filter((u) => u !== url))}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
        <h2 className="font-medium text-slate-900 text-sm">Prepared by</h2>
        <p className="text-sm text-slate-800">{preparedBy.name}</p>
        <p className="text-xs text-slate-500">{preparedBy.title}</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {canSaveDraft && (
          <button
            onClick={() => handleSave(true)}
            disabled={!canDraftSave}
            className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl py-3 hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            {submitting === "draft" ? "Saving..." : "Save as draft"}
          </button>
        )}
        <button
          onClick={() => handleSave(false)}
          disabled={!canSubmit}
          className="flex-1 bg-[#d6852b] text-white font-medium rounded-xl py-3 hover:bg-[#c07724] transition-colors disabled:opacity-40"
        >
          {submitting === "submit"
            ? "Saving..."
            : mode === "admin-edit"
              ? "Save changes"
              : "Submit report"}
        </button>
      </div>
      {!allFilled && (
        <p className="text-xs text-slate-500 text-center">
          Complete every field before submitting.
        </p>
      )}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />
    </div>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />
    </div>
  );
}

function ImageUploadField({
  urls,
  uploading,
  onFiles,
  onRemove,
}: {
  urls: string[];
  uploading: boolean;
  onFiles: (files: FileList | null) => void;
  onRemove: (url: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {urls.map((url) => (
        <div key={url} className="relative w-20 h-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Postmortem photo"
            className="w-20 h-20 rounded-lg object-cover border border-slate-200"
          />
          <button
            type="button"
            onClick={() => onRemove(url)}
            className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            &times;
          </button>
        </div>
      ))}

      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#d6852b] transition-colors">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-slate-400" />
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
}
