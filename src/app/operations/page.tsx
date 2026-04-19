// app/operations/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, ArrowRight } from "lucide-react";
import { countries } from "@/app/data/countries";
import ScrollReveal from "@/app/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Where We Operate | Tanzania Wildlife Trappers",
  description:
    "Tanzania Wildlife Trappers operates across East Africa — with headquarters in Tanzania and active operations in Kenya, Uganda, and Rwanda.",
};

const PRESENCE_COLORS: Record<string, string> = {
  Headquarters: "bg-[#d6852b] text-white",
  "Active Operations": "bg-[#1a1a1a] text-white",
  "Partner Network": "bg-[#f0ebe1] text-[#1a1a1a]",
  "Regional Office": "bg-[#1a1a1a]/10 text-[#1a1a1a]",
};

export default function OperationsPage() {
  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-24 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Where We Operate ]
          </span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <h1 className="lg:col-span-8 text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
              Four Countries.{" "}
              <span className="font-bold uppercase">One Standard.</span>
            </h1>
            <p className="lg:col-span-4 text-white/50 text-base leading-relaxed lg:text-right">
              TWT's operations span the most biodiverse wildlife landscapes in East Africa.
              Same protocols, same expertise, same accountability — wherever we work.
            </p>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10 border-t border-white/10 pt-10">
            {[
              { value: "4", label: "Countries" },
              { value: "30+", label: "Years Experience" },
              { value: "1,500+", label: "Operations" },
              { value: "East Africa", label: "Region" },
            ].map((s, i) => (
              <div key={i} className="px-8 first:pl-0 last:pr-0">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none block">
                  {s.value}
                </span>
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mt-3 block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRY CARDS ───────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">

          {/* Featured — Tanzania (HQ) */}
          <ScrollReveal>
            <Link
              href={`/operations/${countries[0].slug}`}
              className="group block relative overflow-hidden bg-[#1a1a1a] mb-6"
            >
              <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
                <img
                  src={countries[0].heroImage}
                  alt={countries[0].name}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-[1.03] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/20 to-transparent" />

                {/* HQ badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-[#d6852b] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5">
                    Headquarters
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{countries[0].flagEmoji}</span>
                      <span className="text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <MapPin size={10} className="text-[#d6852b]" /> {countries[0].region}
                      </span>
                    </div>
                    <h2 className="text-white text-4xl md:text-6xl font-light leading-tight">
                      {countries[0].name}{" "}
                      <span className="font-bold uppercase">Operations.</span>
                    </h2>
                    <p className="mt-3 text-white/50 text-base max-w-xl leading-relaxed hidden md:block">
                      {countries[0].intro.slice(0, 180)}…
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-3">
                    <div className="w-12 h-12 border border-white/20 group-hover:bg-[#d6852b] group-hover:border-[#d6852b] flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                    <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                      Since {countries[0].operationalSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amber strip */}
              <div className="bg-[#d6852b] px-8 md:px-12 py-3 flex items-center justify-between">
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  {countries[0].tagline}
                </span>
                <span className="text-white/60 text-xs font-bold flex items-center gap-1">
                  {countries[0].stats[0].value} {countries[0].stats[0].label}
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Grid — remaining 3 countries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {countries.slice(1).map((country, i) => (
              <ScrollReveal key={country.slug} delay={i * 0.1}>
                <Link
                  href={`/operations/${country.slug}`}
                  className="group flex flex-col h-full bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={country.heroImage}
                      alt={country.name}
                      className="w-full h-full object-cover opacity-75 grayscale-[0.2] group-hover:opacity-60 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Flag + presence badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-2xl">{country.flagEmoji}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 ${
                          PRESENCE_COLORS[country.presenceType]
                        }`}
                      >
                        {country.presenceType}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 border-t-2 border-[#d6852b]">
                    <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {country.tagline}
                    </span>
                    <h3 className="text-[#1a1a1a] group-hover:text-white text-2xl font-light transition-colors duration-500 flex-1">
                      {country.name}{" "}
                      <span className="font-bold uppercase">Ops.</span>
                    </h3>
                    <p className="mt-3 text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
                      {country.intro.slice(0, 120)}…
                    </p>

                    {/* Mini stats */}
                    <div className="mt-5 pt-4 border-t border-[#1a1a1a]/8 group-hover:border-white/10 transition-colors grid grid-cols-2 gap-3">
                      {country.stats.slice(0, 2).map((s) => (
                        <div key={s.label}>
                          <span className="text-xl font-bold text-[#1a1a1a] group-hover:text-white tracking-tighter transition-colors duration-500 block">
                            {s.value}
                          </span>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#d6852b] mt-0.5 block">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONS MAP PLACEHOLDER ──────────────────────────── */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="bg-[#1a1a1a] relative overflow-hidden h-64 md:h-80 flex items-center justify-center">
              {/* SVG simplified East Africa outline */}
              <svg viewBox="0 0 400 320" className="w-full h-full opacity-20 absolute inset-0">
                <path d="M180,20 L230,30 L270,60 L290,100 L310,140 L300,180 L280,220 L240,270 L200,300 L160,280 L130,240 L120,200 L100,160 L110,120 L130,80 L150,50 Z" fill="none" stroke="#d6852b" strokeWidth="1.5"/>
              </svg>
              <div className="relative text-center z-10 px-6">
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">[ Operational Footprint ]</p>
                <p className="text-white/60 text-sm leading-relaxed max-w-md">
                  Tanzania · Kenya · Uganda · Rwanda — spanning the most biodiverse wildlife landscapes in East Africa.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#d6852b] py-20 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <h2 className="text-white text-4xl md:text-5xl font-light leading-tight">
                Operating in a country{" "}
                <span className="font-bold uppercase">not listed?</span>
              </h2>
              <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-lg">
                We engage in cross-border operations across East and Central Africa when the
                situation demands our expertise. Contact us to discuss your specific location.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link href="/contact-us" className="bg-white text-[#d6852b] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors text-center">
                Contact Us
              </Link>
              <Link href="/schedule-consultation" className="border border-white/40 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-white hover:bg-white/10 transition-colors text-center">
                Schedule a Call
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}