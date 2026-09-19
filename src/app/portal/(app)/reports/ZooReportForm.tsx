"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { ReportFormMode } from "./ReportForm";

export interface SubunitAnimalOption {
  id: string;
  name: string;
  gender: string;
  active: boolean;
}

export interface SubunitOption {
  id: string;
  name: string;
  active: boolean;
  animals: SubunitAnimalOption[];
}

export interface SubUnitEntryDraft {
  localId: string;
  subUnitId: string;
  subUnitName: string;
  animals: { name: string; gender: string }[];
  appearance: string;
  behavior: string;
  respiration: string;
  faecesUrine: string;
  woundsLesions: string;
  feedWaterIntake: string;
  trainingAdaptability: string;
  hasIndividualParams: boolean;
  individualAnimalName: string;
  individualTemperature: string;
  individualHeartRate: string;
  individualRespiratoryRate: string;
  individualNotes: string;
  hasTreatment: boolean;
  treatmentNotes: string;
}

export interface ZooReportFormInitial {
  date: string;
  unit: string;
  subUnitEntries: SubUnitEntryDraft[];
}

function isSubUnitEntryComplete(entry: SubUnitEntryDraft): boolean {
  const baseComplete =
    entry.appearance.trim() &&
    entry.behavior.trim() &&
    entry.respiration.trim() &&
    entry.faecesUrine.trim() &&
    entry.woundsLesions.trim() &&
    entry.feedWaterIntake.trim() &&
    entry.trainingAdaptability.trim();

  if (!baseComplete) return false;

  if (entry.hasIndividualParams && !entry.individualAnimalName.trim()) return false;
  if (entry.hasTreatment && !entry.treatmentNotes.trim()) return false;

  return true;
}

export default function ZooReportForm({
  mode,
  reportId,
  initial,
  initialSubunits,
}: {
  mode: ReportFormMode;
  reportId?: string;
  initial: ZooReportFormInitial;
  initialSubunits: SubunitOption[];
}) {
  const router = useRouter();
  const [subunits] = useState<SubunitOption[]>(() =>
    initialSubunits.filter((s) => s.active)
  );
  const [date, setDate] = useState(initial.date);
  const [unit, setUnit] = useState(initial.unit);
  const [entries, setEntries] = useState<SubUnitEntryDraft[]>(initial.subUnitEntries);
  const [pickerValue, setPickerValue] = useState("");
  const [submitting, setSubmitting] = useState<"draft" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableSubunits = subunits.filter(
    (s) => !entries.some((e) => e.subUnitId === s.id)
  );

  function addSubunit() {
    const subunit = subunits.find((s) => s.id === pickerValue);
    if (!subunit) return;

    setEntries((prev) => [
      ...prev,
      {
        localId: crypto.randomUUID(),
        subUnitId: subunit.id,
        subUnitName: subunit.name,
        animals: subunit.animals
          .filter((a) => a.active)
          .map((a) => ({ name: a.name, gender: a.gender })),
        appearance: "",
        behavior: "",
        respiration: "",
        faecesUrine: "",
        woundsLesions: "",
        feedWaterIntake: "",
        trainingAdaptability: "",
        hasIndividualParams: false,
        individualAnimalName: "",
        individualTemperature: "",
        individualHeartRate: "",
        individualRespiratoryRate: "",
        individualNotes: "",
        hasTreatment: false,
        treatmentNotes: "",
      },
    ]);
    setPickerValue("");
  }

  function updateEntry(localId: string, patch: Partial<SubUnitEntryDraft>) {
    setEntries((prev) =>
      prev.map((e) => (e.localId === localId ? { ...e, ...patch } : e))
    );
  }

  function removeEntry(localId: string) {
    setEntries((prev) => prev.filter((e) => e.localId !== localId));
  }

  const allComplete = entries.length > 0 && entries.every(isSubUnitEntryComplete);
  const generalDetailsFilled = date.trim() && unit.trim();

  const canSaveDraft = mode !== "admin-edit";
  const canDraftSave = canSaveDraft && generalDetailsFilled && !submitting;
  const canSubmit = allComplete && generalDetailsFilled && !submitting;

  function buildEntryPayload(includeIncomplete: boolean) {
    return entries.map((e) => ({
      subUnitId: e.subUnitId,
      subUnitName: e.subUnitName,
      animals: e.animals,
      appearance: e.appearance,
      behavior: e.behavior,
      respiration: e.respiration,
      faecesUrine: e.faecesUrine,
      woundsLesions: e.woundsLesions,
      feedWaterIntake: e.feedWaterIntake,
      trainingAdaptability: e.trainingAdaptability,
      hasIndividualParams: e.hasIndividualParams,
      individualAnimalName:
        includeIncomplete || e.hasIndividualParams ? e.individualAnimalName : undefined,
      individualTemperature:
        includeIncomplete || e.hasIndividualParams ? e.individualTemperature : undefined,
      individualHeartRate:
        includeIncomplete || e.hasIndividualParams ? e.individualHeartRate : undefined,
      individualRespiratoryRate:
        includeIncomplete || e.hasIndividualParams ? e.individualRespiratoryRate : undefined,
      individualNotes: includeIncomplete || e.hasIndividualParams ? e.individualNotes : undefined,
      hasTreatment: e.hasTreatment,
      treatmentNotes: includeIncomplete || e.hasTreatment ? e.treatmentNotes : undefined,
    }));
  }

  async function handleSave(asDraft: boolean) {
    setError(null);
    setSubmitting(asDraft ? "draft" : "submit");
    try {
      const payload: Record<string, unknown> = {
        reportType: "zoo_census",
        date,
        unit,
        subUnitEntries: buildEntryPayload(asDraft),
      };

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
        {mode === "create" && "New zoo census report"}
        {mode === "draft-edit" && "Continue draft census report"}
        {mode === "admin-edit" && "Edit census report"}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">General details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <LabeledInput label="Date" type="date" value={date} onChange={setDate} />
          <LabeledInput label="Unit" value={unit} onChange={setUnit} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-medium text-slate-900 text-sm">Add sub-unit</h2>
        <div className="flex gap-2">
          <select
            value={pickerValue}
            onChange={(e) => setPickerValue(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
          >
            <option value="">Select a sub-unit...</option>
            {availableSubunits.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={addSubunit}
            disabled={!pickerValue}
            className="bg-slate-900 text-white rounded-lg px-4 disabled:opacity-40 flex items-center gap-1.5 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {subunits.length === 0 && (
          <p className="text-xs text-slate-400">
            No sub-units registered yet. Ask an admin to set up the zoo roster
            first.
          </p>
        )}
      </div>

      {entries.map((entry, index) => (
        <SubUnitCard
          key={entry.localId}
          index={index}
          entry={entry}
          onChange={(patch) => updateEntry(entry.localId, patch)}
          onRemove={() => removeEntry(entry.localId)}
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
          Complete all seven observations for each sub-unit (and details for
          any optional section you turn on) before submitting.
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />
    </div>
  );
}

function RemarkField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />
    </div>
  );
}

function SubUnitCard({
  index,
  entry,
  onChange,
  onRemove,
}: {
  index: number;
  entry: SubUnitEntryDraft;
  onChange: (patch: Partial<SubUnitEntryDraft>) => void;
  onRemove: () => void;
}) {
  const complete = isSubUnitEntryComplete(entry);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">
          {index + 1}. {entry.subUnitName}
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

      {entry.animals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.animals.map((a) => (
            <span
              key={a.name}
              className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1"
            >
              {a.name} &middot; {a.gender}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs font-medium text-slate-500 pt-1">
        1. General Health &amp; Physical Observation
      </p>
      <RemarkField
        label="Appearance and posture"
        value={entry.appearance}
        onChange={(v) => onChange({ appearance: v })}
      />
      <RemarkField
        label="Behavior and activity level"
        value={entry.behavior}
        onChange={(v) => onChange({ behavior: v })}
      />
      <RemarkField
        label="Respiration and breathing"
        value={entry.respiration}
        onChange={(v) => onChange({ respiration: v })}
      />
      <RemarkField
        label="Faeces and urine"
        value={entry.faecesUrine}
        onChange={(v) => onChange({ faecesUrine: v })}
      />
      <RemarkField
        label="Wounds and lesions"
        value={entry.woundsLesions}
        onChange={(v) => onChange({ woundsLesions: v })}
      />

      <p className="text-xs font-medium text-slate-500 pt-1">2. Feed and Water Intake</p>
      <RemarkField
        label="Feed and water intake"
        value={entry.feedWaterIntake}
        onChange={(v) => onChange({ feedWaterIntake: v })}
      />

      <p className="text-xs font-medium text-slate-500 pt-1">3. Training and Adaptability</p>
      <RemarkField
        label="Training and adaptability"
        value={entry.trainingAdaptability}
        onChange={(v) => onChange({ trainingAdaptability: v })}
      />

      <div className="border-t border-slate-100 pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.hasIndividualParams}
            onChange={(e) => onChange({ hasIndividualParams: e.target.checked })}
            className="w-4 h-4 accent-[#d6852b]"
          />
          <span className="text-sm font-medium text-slate-800">
            Add today&apos;s health parameters for a specific animal
          </span>
        </label>

        {entry.hasIndividualParams && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Animal</label>
              <select
                value={entry.individualAnimalName}
                onChange={(e) => onChange({ individualAnimalName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
              >
                <option value="">Select...</option>
                {entry.animals.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <LabeledInput
                label="Temperature"
                value={entry.individualTemperature}
                onChange={(v) => onChange({ individualTemperature: v })}
              />
              <LabeledInput
                label="Heart rate"
                value={entry.individualHeartRate}
                onChange={(v) => onChange({ individualHeartRate: v })}
              />
              <LabeledInput
                label="Respiratory rate"
                value={entry.individualRespiratoryRate}
                onChange={(v) => onChange({ individualRespiratoryRate: v })}
              />
            </div>
            <RemarkField
              label="Other notes (e.g. ruminal motility, feeding detail)"
              value={entry.individualNotes}
              onChange={(v) => onChange({ individualNotes: v })}
            />
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.hasTreatment}
            onChange={(e) => onChange({ hasTreatment: e.target.checked })}
            className="w-4 h-4 accent-[#d6852b]"
          />
          <span className="text-sm font-medium text-slate-800">Treatment undertaken</span>
        </label>

        {entry.hasTreatment && (
          <div className="mt-3">
            <RemarkField
              label="Treatment notes"
              value={entry.treatmentNotes}
              onChange={(v) => onChange({ treatmentNotes: v })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
