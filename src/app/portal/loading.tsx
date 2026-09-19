export default function PortalLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50"
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#d6852b] border-t-transparent animate-spin" />
    </div>
  );
}
