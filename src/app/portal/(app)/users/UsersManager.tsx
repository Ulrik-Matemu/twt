"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PORTAL_ROLE_LABELS, type PortalRole } from "@/lib/portal-types";

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  active: boolean;
}

const ROLE_OPTIONS: PortalRole[] = [
  "admin",
  "office_manager",
  "admin_doctor",
  "zoo_doctor",
  "field_doctor",
];

export default function UsersManager({ users }: { users: PortalUser[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<PortalRole>("field_doctor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create account");
      }
      setName("");
      setEmail("");
      setPassword("");
      setRole("field_doctor");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/portal/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
      >
        <h2 className="font-medium text-slate-900 text-sm">Create account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary password (min 8 chars)"
            required
            minLength={8}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d6852b] focus:border-transparent"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as PortalRole)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d6852b]"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {PORTAL_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#d6852b] text-white text-sm font-medium rounded-lg px-4 py-2.5 disabled:opacity-40"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <ul className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {users.length === 0 && (
          <li className="p-4 text-sm text-slate-500 text-center">
            No accounts created yet.
          </li>
        )}
        {users.map((u) => (
          <li key={u.id} className="flex items-center justify-between p-4 gap-3">
            <div className="min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  u.active ? "text-slate-900" : "text-slate-400 line-through"
                }`}
              >
                {u.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {u.email} &middot; {PORTAL_ROLE_LABELS[u.role]}
              </p>
            </div>
            <button
              onClick={() => toggleActive(u.id, !u.active)}
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                u.active
                  ? "bg-slate-100 text-slate-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {u.active ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
