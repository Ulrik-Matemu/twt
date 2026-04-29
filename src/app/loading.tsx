// app/loading.tsx

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#f9f5ef] flex flex-col overflow-hidden"
      role="status"
      aria-label="Loading page content"
      aria-busy="true"
    >
      {/* ── Amber progress bar ──────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-[#1a1a1a]/5">
        <div className="h-full bg-[#d6852b] animate-loading-bar" />
      </div>

      {/* ── Skeleton navbar ─────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1a1a1a]/5 py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo skeleton */}
          <div className="w-28 h-10 bg-[#1a1a1a]/6 animate-pulse rounded-none" />
          {/* Nav links skeleton */}
          <div className="hidden md:flex items-center gap-10">
            {[52, 60, 52, 72, 44].map((w, i) => (
              <div
                key={i}
                className="h-2.5 bg-[#1a1a1a]/6 animate-pulse rounded-none"
                style={{ width: `${w}px`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
          {/* CTA skeleton */}
          <div className="hidden md:block w-28 h-9 bg-[#1a1a1a]/6 animate-pulse rounded-none" />
          {/* Mobile hamburger */}
          <div className="md:hidden w-7 h-5 bg-[#1a1a1a]/6 animate-pulse rounded-none" />
        </div>
      </div>

      {/* ── Hero skeleton ───────────────────────────────────────── */}
      <div className="relative bg-[#0f1a0f] min-h-[85vh] flex flex-col justify-end overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-shimmer" aria-hidden="true" />

        {/* Amber bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d6852b]/30" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 pb-16 pt-40">
          {/* Eyebrow */}
          <div className="w-40 h-3 bg-[#d6852b]/30 animate-pulse mb-6 rounded-none" />

          {/* Headline lines */}
          <div className="space-y-4 mb-8">
            <div className="h-14 md:h-20 bg-white/8 animate-pulse rounded-none w-full max-w-2xl"
              style={{ animationDelay: "80ms" }} />
            <div className="h-14 md:h-20 bg-white/6 animate-pulse rounded-none w-4/5 max-w-xl"
              style={{ animationDelay: "160ms" }} />
            <div className="h-14 md:h-20 bg-white/5 animate-pulse rounded-none w-3/5 max-w-lg"
              style={{ animationDelay: "240ms" }} />
          </div>

          {/* Sub-text */}
          <div className="space-y-2 mb-10 max-w-lg">
            <div className="h-3 bg-white/10 animate-pulse rounded-none w-full" style={{ animationDelay: "320ms" }} />
            <div className="h-3 bg-white/8 animate-pulse rounded-none w-5/6" style={{ animationDelay: "380ms" }} />
            <div className="h-3 bg-white/6 animate-pulse rounded-none w-3/4" style={{ animationDelay: "440ms" }} />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4" style={{ animationDelay: "500ms" }}>
            <div className="w-40 h-12 bg-white/10 animate-pulse rounded-none" />
            <div className="w-40 h-12 bg-white/6 animate-pulse rounded-none" />
          </div>
        </div>
      </div>

      {/* ── Stats bar skeleton ──────────────────────────────────── */}
      <div className="bg-[#1a1a1a] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3 px-8 py-10 first:pl-0 last:pr-0">
              <div
                className="h-12 md:h-16 bg-white/8 animate-pulse rounded-none w-24"
                style={{ animationDelay: `${i * 80}ms` }}
              />
              <div
                className="h-2.5 bg-[#d6852b]/25 animate-pulse rounded-none w-20"
                style={{ animationDelay: `${i * 80 + 60}ms` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Content section skeleton ────────────────────────────── */}
      <div className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="w-36 h-2.5 bg-[#d6852b]/30 animate-pulse rounded-none mb-5" />
              <div className="w-72 h-10 bg-[#1a1a1a]/8 animate-pulse rounded-none mb-3" />
              <div className="w-56 h-10 bg-[#1a1a1a]/5 animate-pulse rounded-none" />
            </div>
            <div className="w-28 h-3 bg-[#1a1a1a]/6 animate-pulse rounded-none" />
          </div>

          {/* Ruled service rows */}
          <div className="border-t border-[#1a1a1a]/10">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-6 py-6 border-b border-[#1a1a1a]/10"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Index number */}
                <div className="w-16 h-10 bg-[#1a1a1a]/4 animate-pulse rounded-none flex-shrink-0" />
                {/* Icon */}
                <div className="w-10 h-10 bg-[#d6852b]/10 animate-pulse rounded-none flex-shrink-0" />
                {/* Title */}
                <div className="flex-1">
                  <div
                    className="h-5 bg-[#1a1a1a]/8 animate-pulse rounded-none"
                    style={{ width: `${45 + (i * 7) % 30}%` }}
                  />
                </div>
                {/* Chip — hidden on mobile */}
                <div className="hidden lg:block w-32 h-7 bg-[#1a1a1a]/5 animate-pulse rounded-none" />
                {/* Toggle */}
                <div className="w-8 h-8 border border-[#1a1a1a]/10 animate-pulse rounded-none flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Card grid skeleton ──────────────────────────────────── */}
      <div className="bg-[#f0ebe1] px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Grid header */}
          <div className="mb-12">
            <div className="w-28 h-2.5 bg-[#d6852b]/25 animate-pulse rounded-none mb-5" />
            <div className="w-64 h-9 bg-[#1a1a1a]/8 animate-pulse rounded-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Card image */}
                <div className="relative h-48 bg-[#1a1a1a]/6 animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-shimmer" aria-hidden="true" />
                  {/* Amber top border */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#d6852b]/40" />
                </div>
                {/* Card content */}
                <div className="p-6 border-t-2 border-[#d6852b]/30">
                  <div className="w-20 h-2 bg-[#d6852b]/25 animate-pulse rounded-none mb-4" />
                  <div className="w-full h-5 bg-[#1a1a1a]/8 animate-pulse rounded-none mb-2" />
                  <div className="w-4/5 h-5 bg-[#1a1a1a]/5 animate-pulse rounded-none mb-4" />
                  <div className="w-full h-3 bg-[#1a1a1a]/4 animate-pulse rounded-none mb-1.5" />
                  <div className="w-5/6 h-3 bg-[#1a1a1a]/4 animate-pulse rounded-none mb-1.5" />
                  <div className="w-3/4 h-3 bg-[#1a1a1a]/3 animate-pulse rounded-none mb-5" />
                  {/* Card footer */}
                  <div className="pt-4 border-t border-[#1a1a1a]/6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a1a1a]/6 animate-pulse" />
                      <div className="w-24 h-2.5 bg-[#1a1a1a]/6 animate-pulse rounded-none" />
                    </div>
                    <div className="w-12 h-2.5 bg-[#d6852b]/20 animate-pulse rounded-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer skeleton ─────────────────────────────────────── */}
      <div className="bg-[#0f1a0f] px-6 lg:px-16 py-16 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {[0, 1, 2, 3].map((col) => (
              <div key={col} className="flex flex-col gap-3">
                <div className="w-24 h-2.5 bg-white/10 animate-pulse rounded-none mb-2" />
                {[0, 1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="h-2 bg-white/5 animate-pulse rounded-none"
                    style={{ width: `${55 + (row * 11) % 35}%`, animationDelay: `${(col * 4 + row) * 40}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-40 h-2 bg-white/6 animate-pulse rounded-none" />
            <div className="w-56 h-2 bg-white/4 animate-pulse rounded-none" />
          </div>
        </div>
      </div>

      {/* ── Accessible screen-reader text ───────────────────────── */}
      <span className="sr-only">Loading, please wait…</span>
    </div>
  );
}