"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  PawPrint,
  Users,
  History,
  Trees,
} from "lucide-react";
import type { PortalRole } from "@/lib/portal-types";
import LogoutButton from "./LogoutButton";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: PortalRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/reports", label: "Reports", icon: ClipboardList },
  {
    href: "/portal/animals",
    label: "Animals",
    icon: PawPrint,
    roles: ["admin", "office_manager"],
  },
  {
    href: "/portal/zoo-roster",
    label: "Zoo Roster",
    icon: Trees,
    roles: ["admin", "office_manager"],
  },
  {
    href: "/portal/users",
    label: "Users",
    icon: Users,
    roles: ["admin"],
  },
  {
    href: "/portal/activity",
    label: "Activity",
    icon: History,
    roles: ["admin"],
  },
];

export default function PortalNav({ role, name }: { role: PortalRole; name: string }) {
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r border-slate-200 bg-white min-h-screen p-4">
        <div className="mb-8 px-2 flex items-center gap-2.5">
          <Image
            src="/twt-logo-removebg-preview.png"
            alt="Tanzania Wildlife Trappers"
            width={36}
            height={36}
            className="w-9 h-9 object-contain shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">TWT Portal</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{name}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#d6852b]/10 text-[#c07724]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <LogoutButton className="mt-4 text-sm text-slate-500 hover:text-slate-700 text-left px-3 py-2" />
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/portal" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-3 flex-1 text-xs font-medium ${
                active ? "text-[#c07724]" : "text-slate-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
