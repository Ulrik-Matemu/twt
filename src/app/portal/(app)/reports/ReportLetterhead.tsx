import Image from "next/image";

export default function ReportLetterhead({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <header className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
      <div className="flex items-center gap-3">
        <Image
          src="/twt-logo-removebg-preview.png"
          alt="Tanzania Wildlife Trappers"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
          priority
        />
        <div>
          <p className="text-lg font-bold text-slate-900">Tanzania Wildlife Trappers</p>
          <p className="text-xs text-slate-500">Arusha, Tanzania, East Africa</p>
          <p className="text-xs text-slate-500">+255 750 151 020 &middot; office@twt.co.tz</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 capitalize">Status: {status}</p>
      </div>
    </header>
  );
}
