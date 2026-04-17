// app/our-services/page.tsx
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { services } from "@/app/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Tanzania Wildlife Trappers",
  description:
    "Explore Tanzania Wildlife Trappers' full suite of professional wildlife services — from humane capture and rescue to zoo advisory and staff training across East Africa.",
};

export default function ServicesPage() {
  const featured = services[0];
  const rest = services.slice(1);

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── PAGE HEADER ───────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-24 px-6 lg:px-16 overflow-hidden">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ What We Do ]
          </span>
          <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h1 className="text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight max-w-3xl">
              Professional{" "}
              <span className="font-bold uppercase">Wildlife</span>
              <br />
              Services <span className="font-bold uppercase">& Expertise.</span>
            </h1>
            <p className="text-white/50 text-base max-w-sm leading-relaxed lg:text-right">
              Nine specialist services covering every dimension of wildlife
              operations, conservation support, and education across East Africa.
            </p>
          </div>

          {/* Divider with count */}
          <div className="mt-16 flex items-center gap-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase">
              {services.length} Services
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICE (large card) ─────────────────────────── */}
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto">
        <Link
          href={`/our-services/${featured.slug}`}
          className="group block relative overflow-hidden bg-[#1a1a1a]"
        >
          {/* Image */}
          <div className="relative h-[65vh] min-h-[420px] overflow-hidden">
            <img
              src={featured.heroImage}
              alt={featured.title}
              className="w-full h-full object-cover opacity-60 grayscale-[0.1] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/30 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="flex items-end justify-between gap-8">
              <div>
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
                  [ Featured Service ]
                </span>
                <h2 className="mt-3 text-white text-3xl md:text-5xl font-light leading-tight max-w-2xl">
                  {featured.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-bold uppercase">
                    {featured.title.split(" ").slice(-1)[0]}.
                  </span>
                </h2>
                <p className="mt-3 text-white/60 text-sm max-w-lg leading-relaxed hidden md:block">
                  {featured.shortDescription}
                </p>
              </div>
              <div className="flex-shrink-0 w-12 h-12 border border-white/20 flex items-center justify-center group-hover:bg-[#d6852b] group-hover:border-[#d6852b] transition-all duration-300">
                <ArrowUpRight size={18} className="text-white" />
              </div>
            </div>
          </div>

          {/* Tagline strip */}
          <div className="bg-[#d6852b] hidden md:block px-8 md:px-12 py-3 flex items-center justify-between">
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              {featured.tagline}
            </span>
            <span className="text-white/60 text-xs font-bold tracking-widest uppercase">
              Explore →
            </span>
          </div>
        </Link>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((service, i) => (
            <Link
              key={service.id}
              href={`/our-services/${service.slug}`}
              className="group flex flex-col bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                {/* Index number */}
                <span className="absolute top-4 left-4 text-white/40 text-xs font-bold tracking-widest">
                  {String(i + 2).padStart(2, "0")}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col flex-1 p-6 border-t-2 border-[#d6852b]">
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                  {service.tagline}
                </span>
                <h3 className="text-[#1a1a1a] group-hover:text-white text-xl font-light leading-snug transition-colors duration-500 flex-1">
                  {service.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-bold uppercase">
                    {service.title.split(" ").slice(-1)[0]}
                  </span>
                </h3>
                <p className="mt-3 text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
                  {service.shortDescription}
                </p>

                {/* Arrow */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#d6852b] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                  </span>
                  <div className="w-8 h-8 border border-[#d6852b]/30 group-hover:border-[#d6852b] flex items-center justify-center group-hover:bg-[#d6852b] transition-all duration-300">
                    <ArrowUpRight
                      size={14}
                      className="text-[#d6852b] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ALL SERVICES LIST (compact, alt layout) ───────────────── */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
            [ Quick Reference ]
          </span>
          <h2 className="mt-3 text-3xl font-light text-[#1a1a1a]">
            All <span className="font-bold uppercase">Services.</span>
          </h2>
        </div>

        <div className="divide-y divide-[#1a1a1a]/10">
          {services.map((service, i) => (
            <Link
              key={service.id}
              href={`/our-services/${service.slug}`}
              className="group flex items-center justify-between py-5 hover:px-4 transition-all duration-300 hover:bg-[#d6852b]/5 -mx-4 px-4"
            >
              <div className="flex items-center gap-6">
                <span className="text-[#1a1a1a]/20 text-sm font-bold w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[#1a1a1a] text-base md:text-lg font-light group-hover:text-[#d6852b] transition-colors">
                  {service.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest uppercase hidden md:block group-hover:text-[#d6852b] transition-colors">
                  {service.tagline}
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#d6852b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
              [ Work With Us ]
            </span>
            <h2 className="mt-4 text-white text-4xl md:text-5xl font-light leading-tight">
              Not Sure Which{" "}
              <span className="font-bold uppercase">Service You Need?</span>
            </h2>
            <p className="mt-5 text-white/50 text-base leading-relaxed">
              Our team is happy to discuss your specific situation and recommend
              the most appropriate approach. Every engagement starts with a
              conversation.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Link
              href="/contact-us"
              className="bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d6852b] transition-colors text-center"
            >
              Get In Touch
            </Link>
            <Link
              href="/about-us"
              className="border border-white/20 text-white/70 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors text-center"
            >
              About Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}