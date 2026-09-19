"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/cloudinary-client";
import type { AgeGroup } from "@/lib/portal-types";

export interface AnimalOption {
  id: string;
  name: string;
  active: boolean;
}

export interface EntryDraft {
  localId: string;
  animalId: string;
  animalName: string;
  type: string;
  gender: string;
  quantity: string;
  ageGroup: AgeGroup;
  siteOfCapture: string;
  captureDateTime: string;
  condition: string;
  doctorSummary: string;
  imageUrls: string[];
  delivered: boolean;
  deliverySummary: string;
  deliveryImageUrl: string;
  deliveredAt: string;
  uploadingImages: boolean;
  uploadingDelivery: boolean;
}

export interface ReportFormInitial {
  date: string;
  project: string;
  site: string;
  entries: EntryDraft[];
}

export type ReportFormMode = "create" | "draft-edit" | "admin-edit";

function isEntryComplete(entry: EntryDraft): boolean {
  const baseComplete =
    entry.type.trim() &&
    entry.gender.trim() &&
    Number(entry.quantity) > 0 &&
    entry.siteOfCapture.trim() &&
    entry.captureDateTime.trim() &&
    entry.condition.trim() &&
    entry.doctorSummary.trim() &&
    entry.imageUrls.length > 0;

  if (!baseComplete) return false;

  if (entry.delivered) {
    return !!(entry.deliverySummary.trim() && entry.deliveryImageUrl && entry.deliveredAt);
  }

  return true;
}

export default function ReportForm({
  mode,
  reportId,
  initial,
  initialAnimals,
}: {
  mode: ReportFormMode;
  reportId?: string;
  initial: ReportFormInitial;
  initialAnimals: AnimalOption[];
}) {
  const router = useRouter();
  const [animals] = useState<AnimalOption[]>(() =>
    initialAnimals.filter((a) => a.active)
  );
  const [date, setDate] = useState(initial.date);
  const [project, setProject] = useState(initial.project);
  const [site, setSite] = useState(initial.site);
  const [entries, setEntries] = useState<EntryDraft[]>(initial.entries);
  const [pickerValue, setPickerValue] = useState("");
  const [submitting, setSubmitting] = useState<"draft" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableAnimals = animals.filter(
    (a) => !entries.some((e) => e.animalId === a.id)
  );

  function addAnimal() {
    const animal = animals.find((a) => a.id === pickerValue);
    if (!animal) return;

    setEntries((prev) => [
      ...prev,
      {
        localId: crypto.randomUUID(),
        animalId: animal.id,
        animalName: animal.name,
        type: "",
        gender: "",
        quantity: "1",
        ageGroup: "adult",
        siteOfCapture: "",
        captureDateTime: "",
        condition: "",
        doctorSummary: "",
        imageUrls: [],
        delivered: false,
        deliverySummary: "",
        deliveryImageUrl: "",
        deliveredAt: "",
        uploadingImages: false,
        uploadingDelivery: false,
      },
    ]);
    setPickerValue("");
  }

  function updateEntry(localId: string, patch: Partial<EntryDraft>) {
    setEntries((prev) =>
      prev.map((e) => (e.localId === localId ? { ...e, ...patch } : e))
    );
  }

  function removeEntry(localId: string) {
    setEntries((prev) => prev.filter((e) => e.localId !== localId));
  }

  async function handleImageFiles(localId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    updateEntry(localId, { uploadingImages: true });
    try {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadImage(file))
      );
      setEntries((prev) =>
        prev.map((e) =>
          e.localId === localId
            ? { ...e, imageUrls: [...e.imageUrls, ...urls], uploadingImages: false }
            : e
        )
      );
    } catch {
      setError("Image upload failed. Check your connection and try again.");
      updateEntry(localId, { uploadingImages: false });
    }
  }

  async function handleDeliveryImage(localId: string, files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    updateEntry(localId, { uploadingDelivery: true });
    try {
      const url = await uploadImage(file);
      updateEntry(localId, { deliveryImageUrl: url, uploadingDelivery: false });
    } catch {
      setError("Delivery image upload failed. Check your connection and try again.");
      updateEntry(localId, { uploadingDelivery: false });
    }
  }

  const allComplete = entries.length > 0 && entries.every(isEntryComplete);
  const generalDetailsFilled = date.trim() && project.trim() && site.trim();
  const anyUploading = entries.some((e) => e.uploadingImages || e.uploadingDelivery);

  const canSaveDraft = mode !== "admin-edit";
  const canDraftSave = canSaveDraft && generalDetailsFilled && !submitting && !anyUploading;
  const canSubmit =
    allComplete && generalDetailsFilled && !submitting && !anyUploading;

  function buildEntryPayload(includeIncomplete: boolean) {
    return entries.map((e) => ({
      animalId: e.animalId,
      animalName: e.animalName,
      type: e.type,
      gender: e.gender,
      quantity: Number(e.quantity) || 0,
      ageGroup: e.ageGroup,
      siteOfCapture: e.siteOfCapture,
      captureDateTime: e.captureDateTime,
      condition: e.condition,
      doctorSummary: e.doctorSummary,
      imageUrls: e.imageUrls,
      delivered: e.delivered,
      deliverySummary: includeIncomplete || e.delivered ? e.deliverySummary : undefined,
      deliveryImageUrl: includeIncomplete || e.delivered ? e.deliveryImageUrl : undefined,
      deliveredAt: includeIncomplete || e.delivered ? e.deliveredAt : undefined,
    }));
  }

  async function handleSave(asDraft: boolean) {
    setError(null);
    setSubmitting(asDraft ? "draft" : "submit");
    try {
      const payload: Record<string, unknown> = {
        date,
        project,
        site,
        entries: buildEntryPayload(asDraft),
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
        {mode === "create" && "New daily monitoring report"}
        {mode === "draft-edit" && "Continue draft report"}
        {mode === "admin-edit" && "Edit report"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">General details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LabeledInput label="Date" type="date" value={date} onChange={setDate} />
          <LabeledInput
            label="Project"
            placeholder="e.g. Serengeti Relocation"
            value={project}
            onChange={setProject}
          />
          <LabeledInput
            label="Site"
            placeholder="e.g. Zoo, Field Site A"
            value={site}
            onChange={setSite}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">Add animal</h2>
        <div className="flex gap-2">
          <select
            value={pickerValue}
            onChange={(e) => setPickerValue(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
          >
            <option value="">Select a registered animal...</option>
            {availableAnimals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            onClick={addAnimal}
            disabled={!pickerValue}
            className="bg-slate-900 text-white rounded-lg px-4 disabled:opacity-40 flex items-center gap-1.5 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {animals.length === 0 && (
          <p className="text-xs text-slate-400">
            No animals registered yet. Ask an admin to add animal names first.
          </p>
        )}
      </div>

      {entries.map((entry, index) => (
        <EntryCard
          key={entry.localId}
          index={index}
          entry={entry}
          onChange={(patch) => updateEntry(entry.localId, patch)}
          onRemove={() => removeEntry(entry.localId)}
          onImageFiles={(files) => handleImageFiles(entry.localId, files)}
          onDeliveryImage={(files) => handleDeliveryImage(entry.localId, files)}
        />
      ))}

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
      {entries.length > 0 && !allComplete && (
        <p className="text-xs text-slate-500 text-center">
          Complete every field and photo (and delivery details, if marked delivered)
          for each animal before submitting.
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
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
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

function EntryCard({
  index,
  entry,
  onChange,
  onRemove,
  onImageFiles,
  onDeliveryImage,
}: {
  index: number;
  entry: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
  onRemove: () => void;
  onImageFiles: (files: FileList | null) => void;
  onDeliveryImage: (files: FileList | null) => void;
}) {
  const complete = isEntryComplete(entry);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">
          {index + 1}. {entry.animalName}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              complete ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {complete ? "Complete" : "Incomplete"}
          </span>
          <button onClick={onRemove} className="text-slate-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LabeledInput
          label="Type"
          placeholder="e.g. Zebra"
          value={entry.type}
          onChange={(v) => onChange({ type: v })}
        />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Gender
          </label>
          <select
            value={entry.gender}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <LabeledInput
          label="Quantity"
          type="number"
          value={entry.quantity}
          onChange={(v) => onChange({ quantity: v })}
        />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Age group
          </label>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            {(["juvenile", "adult"] as const).map((ag) => (
              <button
                key={ag}
                type="button"
                onClick={() => onChange({ ageGroup: ag })}
                className={`flex-1 py-2.5 text-sm capitalize ${
                  entry.ageGroup === ag
                    ? "bg-[#d6852b] text-white"
                    : "bg-white text-slate-600"
                }`}
              >
                {ag}
              </button>
            ))}
          </div>
        </div>
        <LabeledInput
          label="Site of capture"
          value={entry.siteOfCapture}
          onChange={(v) => onChange({ siteOfCapture: v })}
        />
        <LabeledInput
          label="Date/time of capture"
          type="datetime-local"
          value={entry.captureDateTime}
          onChange={(v) => onChange({ captureDateTime: v })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Animal condition
        </label>
        <textarea
          rows={2}
          value={entry.condition}
          onChange={(e) => onChange({ condition: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Doctor&apos;s summary / comment
        </label>
        <textarea
          rows={2}
          value={entry.doctorSummary}
          onChange={(e) => onChange({ doctorSummary: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
      </div>

      <ImageUploadField
        label="Animal photo(s)"
        required
        urls={entry.imageUrls}
        uploading={entry.uploadingImages}
        multiple
        onFiles={onImageFiles}
        onRemove={(url) =>
          onChange({ imageUrls: entry.imageUrls.filter((u) => u !== url) })
        }
      />

      <div className="border-t border-slate-100 pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.delivered}
            onChange={(e) =>
              onChange({
                delivered: e.target.checked,
                deliveredAt: e.target.checked ? new Date().toISOString() : "",
              })
            }
            className="w-4 h-4 accent-[#d6852b]"
          />
          <span className="text-sm font-medium text-slate-800">
            Mark as delivered
          </span>
        </label>

        {entry.delivered && (
          <div className="mt-3 space-y-3">
            {entry.deliveredAt && (
              <p className="text-xs text-slate-500">
                Marked delivered at {new Date(entry.deliveredAt).toLocaleString()}
              </p>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Delivery summary
              </label>
              <textarea
                rows={2}
                value={entry.deliverySummary}
                onChange={(e) => onChange({ deliverySummary: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
              />
            </div>
            <ImageUploadField
              label="Delivery photo"
              required
              urls={entry.deliveryImageUrl ? [entry.deliveryImageUrl] : []}
              uploading={entry.uploadingDelivery}
              multiple={false}
              onFiles={onDeliveryImage}
              onRemove={() => onChange({ deliveryImageUrl: "" })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploadField({
  label,
  required,
  urls,
  uploading,
  multiple,
  onFiles,
  onRemove,
}: {
  label: string;
  required?: boolean;
  urls: string[];
  uploading: boolean;
  multiple: boolean;
  onFiles: (files: FileList | null) => void;
  onRemove: (url: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2 flex-wrap">
        {urls.map((url) => (
          <div key={url} className="relative w-20 h-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={label}
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
            multiple={multiple}
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
