"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Animal {
  id: string;
  name: string;
  active: boolean;
}

export default function AnimalsManager({ animals }: { animals: Animal[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add animal");
      }
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/portal/animals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Animal name (e.g. Mati the Zebra)"
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

      <ul className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {animals.length === 0 && (
          <li className="p-4 text-sm text-slate-500 text-center">
            No animals registered yet.
          </li>
        )}
        {animals.map((animal) => (
          <li key={animal.id} className="flex items-center justify-between p-4">
            <span
              className={`text-sm ${animal.active ? "text-slate-900" : "text-slate-400 line-through"}`}
            >
              {animal.name}
            </span>
            <button
              onClick={() => toggleActive(animal.id, !animal.active)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                animal.active
                  ? "bg-slate-100 text-slate-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {animal.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
