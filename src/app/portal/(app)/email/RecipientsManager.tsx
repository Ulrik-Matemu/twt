"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
  EMPTY_FILTERS,
  type EmailRecipient,
  type RecipientFilters,
} from "@/lib/email-filters";
import { PORTAL_ROLE_LABELS, type PortalRole, type ReportType } from "@/lib/portal-types";

const OFFICE_ADDRESS = "office@twt.co.tz";

const TYPE_LABELS: Record<ReportType, string> = {
  capture: "Capture",
  zoo_census: "Zoo census",
  postmortem: "Postmortem",
};
const DOCTOR_ROLES: PortalRole[] = ["admin_doctor", "zoo_doctor", "field_doctor"];

interface Props {
  recipients: EmailRecipient[];
  doctors: { id: string; name: string }[];
  suggestions: { units: string[]; projects: string[]; sites: string[] };
}

function summarize(filters: RecipientFilters, doctors: Props["doctors"]) {
  const parts: string[] = [];
  if (filters.reportTypes.length) parts.push(filters.reportTypes.map((t) => TYPE_LABELS[t]).join(" / "));
  if (filters.units.length) parts.push(`unit: ${filters.units.join(", ")}`);
  if (filters.projects.length) parts.push(`project: ${filters.projects.join(", ")}`);
  if (filters.sites.length) parts.push(`site: ${filters.sites.join(", ")}`);
  if (filters.observerIds.length)
    parts.push(
      `doctor: ${filters.observerIds.map((id) => doctors.find((d) => d.id === id)?.name ?? "Unknown").join(", ")}`
    );
  if (filters.observerRoles.length)
    parts.push(filters.observerRoles.map((r) => PORTAL_ROLE_LABELS[r]).join(" / "));
  return parts.length ? parts.join(" · ") : "All reports";
}

export default function RecipientsManager({ recipients, doctors, suggestions }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<EmailRecipient | "new" | null>(null);
  const [error, setError] = useState("");

  async function call(url: string, method: string, body?: unknown) {
    setError("");
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Something went wrong");
      return false;
    }
    router.refresh();
    return true;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-slate-900">Recipients</h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 bg-[#d6852b] text-white text-sm font-medium rounded-lg px-3 py-1.5 hover:bg-[#c07724]"
          >
            <Plus className="w-4 h-4" /> Add recipient
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {editing !== null && (
        <RecipientForm
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          doctors={doctors}
          suggestions={suggestions}
          onCancel={() => setEditing(null)}
          onSave={async (email, label, filters) => {
            const ok =
              editing === "new"
                ? await call("/api/portal/email-recipients", "POST", { email, label, filters })
                : await call(`/api/portal/email-recipients/${editing.id}`, "PATCH", { label, filters });
            if (ok) setEditing(null);
          }}
        />
      )}

      <ul className="space-y-2">
        <li className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">{OFFICE_ADDRESS}</p>
          <p className="text-xs text-slate-500">Always receives every submitted report · cannot be removed</p>
        </li>
        {recipients.map((r) => (
          <li
            key={r.id}
            className={`bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 ${
              r.active ? "" : "opacity-60"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {r.email}
                {r.label && <span className="text-slate-500 font-normal"> — {r.label}</span>}
              </p>
              <p className="text-xs text-slate-500">{summarize(r.filters, doctors)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-1.5 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={r.active}
                  onChange={(e) => call(`/api/portal/email-recipients/${r.id}`, "PATCH", { active: e.target.checked })}
                />
                Active
              </label>
              <button type="button" onClick={() => setEditing(r)} aria-label="Edit recipient" className="text-slate-400 hover:text-slate-700">
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Remove recipient"
                onClick={() => {
                  if (window.confirm(`Stop sending reports to ${r.email}?`))
                    void call(`/api/portal/email-recipients/${r.id}`, "DELETE");
                }}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecipientForm({
  initial,
  doctors,
  suggestions,
  onCancel,
  onSave,
}: {
  initial: EmailRecipient | null;
  doctors: Props["doctors"];
  suggestions: Props["suggestions"];
  onCancel: () => void;
  onSave: (email: string, label: string, filters: RecipientFilters) => Promise<void>;
}) {
  const [email, setEmail] = useState(initial?.email ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [filters, setFilters] = useState<RecipientFilters>(initial?.filters ?? EMPTY_FILTERS);
  const [saving, setSaving] = useState(false);

  function toggle<K extends keyof RecipientFilters>(key: K, value: RecipientFilters[K][number]) {
    setFilters((f) => {
      const list = f[key] as string[];
      const next = list.includes(value as string) ? list.filter((v) => v !== value) : [...list, value as string];
      return { ...f, [key]: next };
    });
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Email address</label>
          <input
            type="email"
            value={email}
            disabled={!!initial}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={`${input} disabled:bg-slate-50`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Label (optional)</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Zoo manager" className={input} />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Leave a filter empty to match everything. When you set several filters, a report must match all of them.
      </p>

      <ChipGroup label="Report types">
        {(Object.keys(TYPE_LABELS) as ReportType[]).map((t) => (
          <Chip key={t} active={filters.reportTypes.includes(t)} onClick={() => toggle("reportTypes", t)}>
            {TYPE_LABELS[t]}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Submitted by role">
        {DOCTOR_ROLES.map((r) => (
          <Chip key={r} active={filters.observerRoles.includes(r)} onClick={() => toggle("observerRoles", r)}>
            {PORTAL_ROLE_LABELS[r]}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Submitted by doctor">
        {doctors.length === 0 && <span className="text-xs text-slate-400">No doctor accounts yet</span>}
        {doctors.map((d) => (
          <Chip key={d.id} active={filters.observerIds.includes(d.id)} onClick={() => toggle("observerIds", d.id)}>
            {d.name}
          </Chip>
        ))}
      </ChipGroup>

      <TagInput label="Zoo units" values={filters.units} suggestions={suggestions.units} onChange={(units) => setFilters((f) => ({ ...f, units }))} />
      <TagInput label="Field projects" values={filters.projects} suggestions={suggestions.projects} onChange={(projects) => setFilters((f) => ({ ...f, projects }))} />
      <TagInput label="Field sites" values={filters.sites} suggestions={suggestions.sites} onChange={(sites) => setFilters((f) => ({ ...f, sites }))} />

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="text-sm text-slate-600 px-3 py-2">
          Cancel
        </button>
        <button
          type="button"
          disabled={saving || !email.trim()}
          onClick={async () => {
            setSaving(true);
            await onSave(email, label, filters);
            setSaving(false);
          }}
          className="bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#c07724] disabled:opacity-60"
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Add recipient"}
        </button>
      </div>
    </div>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-[#d6852b] border-[#d6852b] text-white"
          : "bg-white border-slate-300 text-slate-600 hover:border-[#d6852b]"
      }`}
    >
      {children}
    </button>
  );
}

function TagInput({
  label,
  values,
  suggestions,
  onChange,
}: {
  label: string;
  values: string[];
  suggestions: string[];
  onChange: (values: string[]) => void;
}) {
  const [text, setText] = useState("");
  const id = `tags-${label.replace(/\s+/g, "-")}`;

  function add(value: string) {
    const v = value.trim();
    if (v && !values.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...values, v]);
    setText("");
  }

  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 text-xs font-medium bg-[#d6852b]/10 text-[#c07724] rounded-full px-2.5 py-1">
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        list={id}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // Picking a datalist suggestion adds it immediately.
          if (suggestions.includes(e.target.value)) add(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(text);
          }
        }}
        onBlur={() => add(text)}
        placeholder="Type or pick, press Enter"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
      />
      <datalist id={id}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}
