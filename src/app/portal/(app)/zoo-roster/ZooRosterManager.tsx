"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { ZooSubUnitRecord } from "@/lib/zoo-roster-data";

export default function ZooRosterManager({ subunits }: { subunits: ZooSubUnitRecord[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddSubunit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/zoo-subunits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add sub-unit");
      }
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleSubunitActive(id: string, active: boolean) {
    await fetch(`/api/portal/zoo-subunits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleAddSubunit}
        className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sub-unit name (e.g. Zebra)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 disabled:opacity-40"
        >
          Add
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {subunits.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No sub-units registered yet.
        </div>
      )}

      {subunits.map((subunit) => (
        <SubunitCard
          key={subunit.id}
          subunit={subunit}
          onToggleActive={() => toggleSubunitActive(subunit.id, !subunit.active)}
        />
      ))}
    </div>
  );
}

function SubunitCard({
  subunit,
  onToggleActive,
}: {
  subunit: ZooSubUnitRecord;
  onToggleActive: () => void;
}) {
  const router = useRouter();
  const [animalName, setAnimalName] = useState("");
  const [gender, setGender] = useState("Male");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddAnimal(e: React.FormEvent) {
    e.preventDefault();
    if (!animalName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/zoo-subunits/${subunit.id}/animals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: animalName, gender }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add animal");
      }
      setAnimalName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleAnimalActive(animalId: string, active: boolean) {
    await fetch(`/api/portal/zoo-subunits/${subunit.id}/animals/${animalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3
          className={`font-medium ${subunit.active ? "text-slate-900" : "text-slate-400 line-through"}`}
        >
          {subunit.name}
        </h3>
        <button
          onClick={onToggleActive}
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            subunit.active ? "bg-slate-100 text-slate-600" : "bg-green-50 text-green-700"
          }`}
        >
          {subunit.active ? "Deactivate" : "Activate"}
        </button>
      </div>

      <ul className="divide-y divide-slate-100 border-t border-slate-100">
        {subunit.animals.length === 0 && (
          <li className="py-2 text-sm text-slate-400">No animals added yet.</li>
        )}
        {subunit.animals.map((animal) => (
          <li key={animal.id} className="flex items-center justify-between py-2">
            <span
              className={`text-sm ${animal.active ? "text-slate-800" : "text-slate-400 line-through"}`}
            >
              {animal.name} &middot; {animal.gender}
            </span>
            <button
              onClick={() => toggleAnimalActive(animal.id, !animal.active)}
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                animal.active ? "bg-slate-100 text-slate-600" : "bg-green-50 text-green-700"
              }`}
            >
              {animal.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddAnimal} className="flex gap-2 pt-1">
        <input
          value={animalName}
          onChange={(e) => setAnimalName(e.target.value)}
          placeholder="Animal name (e.g. Mati)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          type="submit"
          disabled={submitting || !animalName.trim()}
          className="bg-slate-900 text-white rounded-lg px-3 disabled:opacity-40 flex items-center gap-1 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
