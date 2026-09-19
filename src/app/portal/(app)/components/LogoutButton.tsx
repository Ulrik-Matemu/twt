"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/portal/auth/session", { method: "DELETE" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={className}>
      Sign out
    </button>
  );
}
