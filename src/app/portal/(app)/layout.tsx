import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/portal-auth";
import { PORTAL_ROLE_LABELS } from "@/lib/portal-types";
import PortalNav from "./components/PortalNav";
import LogoutButton from "./components/LogoutButton";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/portal/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex print:block print:bg-white">
      <div className="print:hidden md:contents">
        <PortalNav role={user.role} name={user.name} />
      </div>

      <div className="flex-1 min-w-0 pb-20 md:pb-0 print:pb-0">
        <header className="md:hidden print:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/twt-logo-removebg-preview.png"
              alt="Tanzania Wildlife Trappers"
              width={32}
              height={32}
              className="w-8 h-8 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">TWT Portal</p>
              <p className="text-xs text-slate-500 truncate">
                {user.name} &middot; {PORTAL_ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
          <LogoutButton className="text-xs text-slate-500 shrink-0" />
        </header>

        <main className="p-4 md:p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
