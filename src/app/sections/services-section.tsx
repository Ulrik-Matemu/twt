// app/components/services-section.tsx
"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { services } from "@/app/data/services";
import type { Service } from "@/app/data/services";
import ScrollReveal from "@/app/components/scroll-reveal";

/* ── ICONS ───────────────────────────────────────────────────────── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "safe-capture-of-wild-animals": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  "wild-animal-rescue": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M4.5 12.5l7 7L20 6" />
    </svg>
  ),
  "wildlife-treatment-and-care": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M12 21C12 21 4 13.5 4 8.5a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 5-8 12.5-8 12.5z" />
    </svg>
  ),
  "problem-animal-control": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  "wildlife-management-support": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M17.5 14v7M14 17.5h7" />
    </svg>
  ),
  "zoo-licensing-and-permit-advisory": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  "wildlife-handling-and-staff-training": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "wildlife-adaptation-and-human-interaction-training": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  "zoo-setup-and-wildlife-advisory": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

/* ── PROPS ───────────────────────────────────────────────────────── */
type Theme = "light" | "dark";

type Props = {
  /**
   * "light" → cream #f9f5ef background (default)
   * "dark"  → #0f1a0f dark green background
   */
  theme?: Theme;
  /** Curate specific services by slug, in your preferred order */
  slugs?: string[];
  /** Cap list at N services */
  limit?: number;
  /** Show the bottom "Request a Service" CTA row (default true) */
  showCta?: boolean;
  /** Show the section eyebrow + headline (default true) */
  showHeader?: boolean;
  /** Override the section headline with custom JSX */
  headline?: React.ReactNode;
};

/* ── MAIN COMPONENT ──────────────────────────────────────────────── */
export default function ServicesSection({
  theme = "light",
  slugs,
  limit,
  showCta = true,
  showHeader = true,
  headline,
}: Props) {
  const isDark = theme === "dark";

  const pool: Service[] = slugs
    ? (slugs.map((s) => services.find((svc) => svc.slug === s)).filter(Boolean) as Service[])
    : services;

  const displayList = limit ? pool.slice(0, limit) : pool;

  /* Token map — single isDark switch populates everything */
  const t = {
    bg:          isDark ? "bg-[#0f1a0f]"       : "bg-[#f9f5ef]",
    border:      isDark ? "border-white/10"     : "border-[#1a1a1a]/10",
    heading:     isDark ? "text-white"          : "text-[#1a1a1a]",
    title:       isDark ? "text-white"          : "text-[#1a1a1a]",
    desc:        isDark ? "text-white/50"       : "text-gray-500",
    num:         isDark ? "text-white/[0.06]"   : "text-[#1a1a1a]/[0.06]",
    chipBg:      isDark ? "bg-white/5"          : "bg-[#1a1a1a]/5",
    chipTxt:     isDark ? "text-white/35"       : "text-[#1a1a1a]/35",
    iconBg:      isDark ? "bg-[#d6852b]/12"     : "bg-[#d6852b]/8",
    toggleBorder:isDark ? "border-white/15"     : "border-[#1a1a1a]/15",
    panelBg:     isDark ? "bg-[#111d11]"        : "bg-white",
    rowHover:    isDark ? "hover:bg-[#1a1a1a]"  : "hover:bg-white",
    panelDesc:   isDark ? "text-white/60"       : "text-gray-600",
    panelSub:    isDark ? "text-white/45"       : "text-gray-500",
    gradLeft:    isDark
      ? "bg-gradient-to-r from-[#111d11] via-[#111d11]/50 to-transparent"
      : "bg-gradient-to-r from-white via-white/30 to-transparent",
    ctaLink:     isDark
      ? "text-white/40 hover:text-white"
      : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]",
    exploreBtn:  isDark
      ? "border-white/20 text-white hover:border-white"
      : "border-[#1a1a1a]/20 text-[#1a1a1a] hover:border-[#d6852b] hover:text-[#d6852b]",
  };

  return (
    <section
      className={`${t.bg} py-24 px-6 lg:px-16`}
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header ────────────────────────────────────────────── */}
        {showHeader && (
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
                  [ What We Do ]
                </span>
                <h2
                  id="services-heading"
                  className={`mt-4 text-4xl md:text-6xl font-light ${t.heading} tracking-tight leading-tight`}
                >
                  {headline ?? (
                    <>
                      Professional{" "}
                      <span className="font-bold uppercase">Wildlife</span>
                      <br />
                      <span className="font-bold uppercase">Services.</span>
                    </>
                  )}
                </h2>
              </div>

              {showCta && (
                <Link
                  href="/our-services"
                  aria-label="View all wildlife services"
                  className={`group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest transition-colors flex-shrink-0 ${t.ctaLink}`}
                >
                  All Services
                  <span className="w-8 h-8 border border-current/20 group-hover:border-[#d6852b] group-hover:bg-[#d6852b] flex items-center justify-center transition-all duration-300">
                    <ArrowRight size={13} className="group-hover:text-white transition-colors" aria-hidden="true" />
                  </span>
                </Link>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* ── Service list ──────────────────────────────────────── */}
        <div
          className={`border-t ${t.border}`}
          role="list"
          aria-label="Wildlife services"
        >
          {displayList.map((service, i) => (
            <ServiceRow
              key={service.slug}
              service={service}
              index={i}
              isDark={isDark}
              t={t}
            />
          ))}
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────── */}
        {showCta && (
          <ScrollReveal delay={0.08}>
            <div className={`border-t ${t.border} pt-10 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}>
              <p className={`text-sm leading-relaxed max-w-md ${t.desc}`}>
                Every engagement begins with a conversation. Tell us your situation
                and we'll recommend the right approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/schedule-consultation"
                  className="bg-[#d6852b] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors text-center"
                >
                  Request a Service
                </Link>
                <Link
                  href="/our-services"
                  className={`border px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center ${t.exploreBtn}`}
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/* ── SERVICE ROW ─────────────────────────────────────────────────── */
function ServiceRow({
  service,
  index,
  isDark,
  t,
}: {
  service: Service;
  index: number;
  isDark: boolean;
  t: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btnId   = useId();
  const icon    = SERVICE_ICONS[service.slug];

  return (
    <div role="listitem" className={`border-b ${t.border}`}>

      {/* ══════════════ DESKTOP (md+) ══════════════ */}
      <div className="hidden md:block">
        <button
          id={btnId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((p) => !p)}
          className={`w-full text-left group ${open ? t.panelBg : `${t.bg} ${t.rowHover}`} transition-colors duration-300`}
        >
          <div className="flex items-center gap-6 py-5 px-0">

            {/* Ghost index */}
            <span
              className={`text-6xl font-bold leading-none select-none w-20 flex-shrink-0 text-right ${t.num} group-hover:text-[#d6852b]/10 transition-colors duration-300`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Icon */}
            <div
              className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-[#d6852b] transition-all duration-300 ${
                open ? "bg-[#d6852b] text-white" : `${t.iconBg} group-hover:bg-[#d6852b] group-hover:text-white`
              }`}
              aria-hidden="true"
            >
              {icon}
            </div>

            {/* Title */}
            <span className={`flex-1 min-w-0 text-xl font-light transition-colors duration-300 leading-snug ${
              open ? "text-[#d6852b]" : `${t.title} group-hover:text-[#d6852b]`
            }`}>
              {service.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-bold uppercase">
                {service.title.split(" ").slice(-1)[0]}
              </span>
            </span>

            {/* Tagline chip (hidden when open) */}
            <AnimatePresence>
              {!open && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                  className={`hidden lg:block ${t.chipBg} ${t.chipTxt} text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 flex-shrink-0 max-w-[220px] truncate`}
                  aria-hidden="true"
                >
                  {service.tagline}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Toggle button */}
            <div
              className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                open ? "border-[#d6852b] bg-[#d6852b]" : `${t.toggleBorder} group-hover:border-[#d6852b]`
              }`}
              aria-hidden="true"
            >
              {open
                ? <Minus size={12} className="text-white" />
                : <Plus size={12} className={`${isDark ? "text-white/40" : "text-[#1a1a1a]/40"} group-hover:text-[#d6852b]`} />
              }
            </div>
          </div>
        </button>

        {/* ── Expand panel ──────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className={`${t.panelBg}`}>
                {/* indent left to align with text */}
                <div className="grid grid-cols-12 pl-[104px]">

                  {/* LEFT col — text */}
                  <div className="col-span-7 pr-10 py-9 flex flex-col gap-6">

                    <p className={`text-base leading-[1.85] ${t.panelDesc}`}>
                      {service.intro}
                    </p>

                    {/* Highlights */}
                    {service.highlights?.length > 0 && (
                      <ul className="flex flex-col gap-2.5" aria-label={`${service.title} highlights`}>
                        {service.highlights.slice(0, 4).map((h) => (
                          <li key={h} className={`flex items-start gap-2.5 text-sm ${t.panelSub}`}>
                            <span className="w-1 h-1 rounded-full bg-[#d6852b] mt-[7px] flex-shrink-0" aria-hidden="true" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Who it's for */}
                    {service.whoItsFor?.length > 0 && (
                      <div>
                        <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                          Who This Is For
                        </p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5" aria-label={`Who ${service.title} is for`}>
                          {service.whoItsFor.slice(0, 4).map((w) => (
                            <li key={w} className={`flex items-start gap-1.5 text-xs ${t.panelSub}`}>
                              <span className="text-[#d6852b] flex-shrink-0 mt-0.5" aria-hidden="true">→</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-1">
                      <Link
                        href={`/our-services/${service.slug}`}
                        className="inline-flex items-center gap-2.5 bg-[#d6852b] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                        aria-label={`View full details for ${service.title}`}
                      >
                        Full Service Details
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT col — hero image */}
                  <div className="col-span-5 relative overflow-hidden" style={{ minHeight: "300px" }}>
                    {service.heroImage ? (
                      <>
                        <img
                          src={service.heroImage}
                          alt={`${service.title} in the field`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/*
                          Gradient fades from the panel background on the
                          left edge so the image bleeds seamlessly into the
                          text column — no hard cut between text and image.
                        */}
                        <div
                          className={`absolute inset-y-0 left-0 w-1/2 ${t.gradLeft} pointer-events-none`}
                          aria-hidden="true"
                        />
                        {/* Tagline badge bottom-right */}
                        <div className="absolute bottom-5 right-5 pointer-events-none">
                          <span className="bg-[#d6852b] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5">
                            {service.tagline}
                          </span>
                        </div>
                        {/* Dark vignette on right edge for depth */}
                        <div
                          className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-black/20 pointer-events-none"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      /* Fallback — large ghost icon */
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${isDark ? "bg-[#1a1a1a]" : "bg-[#f0ebe1]"}`}
                        aria-hidden="true"
                      >
                        <div className="text-[#d6852b]/15 scale-[3.5]">{icon}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════ MOBILE (< md) ══════════════ */}
      <div className="md:hidden">
        <button
          id={`m-${btnId}`}
          aria-expanded={open}
          aria-controls={`m-${panelId}`}
          onClick={() => setOpen((p) => !p)}
          className="w-full text-left flex items-center gap-4 py-5"
        >
          <div
            className={`w-9 h-9 flex items-center justify-center flex-shrink-0 text-[#d6852b] transition-all duration-300 ${
              open ? "bg-[#d6852b] text-white" : t.iconBg
            }`}
            aria-hidden="true"
          >
            {icon}
          </div>
          <span className={`flex-1 text-base font-light leading-snug text-left transition-colors duration-300 ${
            open ? "text-[#d6852b]" : t.title
          }`}>
            {service.title}
          </span>
          <div
            className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              open ? "border-[#d6852b] bg-[#d6852b]" : t.toggleBorder
            }`}
            aria-hidden="true"
          >
            {open
              ? <Minus size={11} className="text-white" />
              : <Plus size={11} className={isDark ? "text-white/50" : "text-[#1a1a1a]/50"} />
            }
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`m-${panelId}`}
              role="region"
              aria-labelledby={`m-${btnId}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className={`${t.panelBg} pb-7`}>
                {/* Hero image — full bleed on mobile */}
                {service.heroImage && (
                  <div className="relative h-48 overflow-hidden mb-5">
                    <img
                      src={service.heroImage}
                      alt={`${service.title} in the field`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-[#d6852b] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1">
                        {service.tagline}
                      </span>
                    </div>
                  </div>
                )}

                {/* Short description */}
                <p className={`text-sm leading-[1.75] ${t.desc} mb-4`}>
                  {service.shortDescription}
                </p>

                {/* Top 3 highlights */}
                {service.highlights?.slice(0, 3).map((h) => (
                  <div key={h} className={`flex items-start gap-2 mb-1.5 text-xs ${t.desc}`}>
                    <span className="w-1 h-1 rounded-full bg-[#d6852b] mt-[5px] flex-shrink-0" aria-hidden="true" />
                    {h}
                  </div>
                ))}

                <div className="mt-5">
                  <Link
                    href={`/our-services/${service.slug}`}
                    className="inline-flex items-center gap-2 bg-[#d6852b] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                    aria-label={`View full details for ${service.title}`}
                  >
                    Learn More <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}