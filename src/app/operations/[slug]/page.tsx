// app/operations/[slug]/page.tsx
import { notFound } from "next/navigation";
import { countries } from "@/app/data/countries";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = countries.find((c) => c.slug === slug);
  if (!country) return {};
  return {
    title: country.seo.metaTitle,
    description: country.seo.metaDescription,
    keywords: country.seo.keywords,
  };
}

export async function generateStaticParams() {
  return countries.map((c) => ({ slug: c.slug }));
}

const PRESENCE_LABEL: Record<string, { bg: string; text: string }> = {
  Headquarters: { bg: "bg-[#d6852b]", text: "text-white" },
  "Active Operations": { bg: "bg-white/15", text: "text-white" },
  "Partner Network": { bg: "bg-white/10", text: "text-white/80" },
};

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = countries.find((c) => c.slug === slug);
  if (!country) return notFound();

  const currentIdx = countries.findIndex((c) => c.slug === slug);
  const next = countries[(currentIdx + 1) % countries.length];
  const prev = countries[(currentIdx - 1 + countries.length) % countries.length];

  const presence = PRESENCE_LABEL[country.presenceType] ?? {
    bg: "bg-white/10",
    text: "text-white/80",
  };

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex flex-col justify-end overflow-hidden bg-[#0f1a0f]">
        <div className="absolute inset-0 z-0">
          <img
            src={country.heroImage}
            alt={country.name}
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/40 to-[#0f1a0f]/10" />
        </div>

        {/* Breadcrumb */}
        <div className="relative z-10 px-6 lg:px-16 pt-8">
          <Link
            href="/operations"
            className="inline-flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors"
          >
            <ArrowLeft size={12} /> Where We Operate
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 pb-0 pt-8">
          {/* Top meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-5xl leading-none">{country.flagEmoji}</span>
            <span
              className={`${presence.bg} ${presence.text} text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5`}
            >
              {country.presenceType}
            </span>
            <span className="text-white/30 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <MapPin size={10} className="text-[#d6852b]" /> {country.region}
            </span>
            <span className="text-white/30 text-xs font-bold tracking-widest uppercase">
              Since {country.operationalSince}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-light leading-[0.92] tracking-tight max-w-5xl">
            {country.name}{" "}
            <span className="font-bold uppercase">Operations.</span>
          </h1>

          <p className="mt-5 text-white/55 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            {country.tagline}
          </p>

          {/* Hero caption */}
          {country.heroCaption && (
            <p className="mt-4 text-white/30 text-xs italic pb-16">
              {country.heroCaption}
            </p>
          )}
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {country.stats.map((s, i) => (
              <div key={i} className="flex flex-col py-10 px-6 first:pl-0 last:pr-0">
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
                  {s.value}
                </span>
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mt-3">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO + SIDEBAR ─────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Intro body */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <ScrollReveal>
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Our Presence ]
              </span>
              <div className="w-10 h-px bg-[#d6852b] mb-10" />
              <p className="text-[#1a1a1a] text-xl md:text-2xl font-light leading-[1.65] tracking-tight">
                {country.intro}
              </p>
            </ScrollReveal>

            {/* Quote */}
            <ScrollReveal delay={0.1}>
              <blockquote className="mt-14 pl-7 border-l-4 border-[#d6852b]">
                <p className="text-[#1a1a1a] text-xl md:text-2xl font-light italic leading-[1.5]">
                  "{country.quote.text}"
                </p>
                <footer className="mt-4 text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
                  — {country.quote.attribution}
                </footer>
              </blockquote>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <ScrollReveal direction="right" className="lg:sticky lg:top-32 space-y-6">

              {/* Contact card */}
              <div className="bg-[#1a1a1a] p-7">
                <div className="w-8 h-px bg-[#d6852b] mb-5" />
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase block mb-5">
                  Contact — {country.name}
                </span>
                <div className="flex flex-col gap-5">
                  {country.contact.office && (
                    <div className="flex items-start gap-3">
                      <MapPin size={13} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                          Office
                        </p>
                        <p className="text-white text-sm mt-0.5">{country.contact.office}</p>
                      </div>
                    </div>
                  )}
                  <a href={`tel:${country.contact.phone}`} className="flex items-start gap-3 group">
                    <Phone size={13} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                        Phone
                      </p>
                      <p className="text-white text-sm mt-0.5 group-hover:text-[#d6852b] transition-colors">
                        {country.contact.phone}
                      </p>
                    </div>
                  </a>
                  <a href={`mailto:${country.contact.email}`} className="flex items-start gap-3 group">
                    <Mail size={13} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                        Email
                      </p>
                      <p className="text-white text-sm mt-0.5 group-hover:text-[#d6852b] transition-colors break-all">
                        {country.contact.email}
                      </p>
                    </div>
                  </a>
                  {country.contact.whatsapp && (
                    <a
                      href={`https://wa.me/${country.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group"
                    >
                      <MessageCircle size={13} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                          WhatsApp
                        </p>
                        <p className="text-white text-sm mt-0.5 group-hover:text-[#d6852b] transition-colors">
                          Chat with our team
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Key species */}
              <div className="bg-[#f0ebe1] p-7">
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase block mb-4">
                  Key Species
                </span>
                <div className="flex flex-col gap-2">
                  {country.keySpecies.map((s) => (
                    <div key={s} className="flex items-center gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-[#d6852b] flex-shrink-0" />
                      <span className="text-[#1a1a1a] text-sm italic">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule CTA */}
              <div className="border-2 border-[#d6852b] p-7">
                <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-wide mb-3">
                  Need Help In {country.name}?
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">
                  Submit a request and our team will assess your situation and respond within one business day.
                </p>
                <Link
                  href="/schedule-consultation"
                  className="flex items-center justify-between bg-[#d6852b] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                >
                  Submit a Request <ArrowRight size={12} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEMS ──────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                  [ Key Ecosystems ]
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
                  Where We <span className="font-bold uppercase">Work.</span>
                </h2>
              </div>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed md:text-right">
                The landscapes that define our operational territory in {country.name}.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {country.ecosystems.map((eco, i) => (
              <ScrollReveal key={eco.name} delay={i * 0.1}>
                <div className="group flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-[#2a2a2a]">
                    <img
                      src={eco.image}
                      alt={eco.name}
                      className="w-full h-full object-cover opacity-65 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[#d6852b] text-[9px] font-bold tracking-widest uppercase bg-[#0f1a0f]/70 px-2 py-1">
                        {eco.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 border-t-2 border-[#d6852b] pt-6 pb-4">
                    <h3 className="text-white text-lg font-bold uppercase tracking-wide mb-4 leading-snug">
                      {eco.name}
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-5">
                      {eco.description}
                    </p>
                    {/* Species chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {eco.species.map((s) => (
                        <span
                          key={s}
                          className="text-[9px] font-bold tracking-widest uppercase text-white/30 border border-white/10 px-2 py-0.5 italic"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGES ──────────────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
              [ Conservation Context ]
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight mb-14">
              Key <span className="font-bold uppercase">Challenges.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a]/8">
            {country.challenges.map((c, i) => (
              <ScrollReveal key={i} delay={(i % 3) * 0.08}>
                <div className="bg-[#f9f5ef] p-8 group hover:bg-[#1a1a1a] transition-colors duration-500">
                  <span className="text-[#d6852b]/40 text-5xl font-bold leading-none block mb-6 group-hover:text-[#d6852b]/60 transition-colors">
                    0{i + 1}
                  </span>
                  <h3 className="text-[#1a1a1a] group-hover:text-white text-lg font-bold uppercase tracking-wide mb-4 transition-colors duration-500">
                    {c.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-500">
                    {c.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES AVAILABILITY ───────────────────────────────── */}
      <section className="bg-[#f0ebe1] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                  [ Service Availability ]
                </span>
                <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] leading-tight">
                  What's Available
                  <br />
                  <span className="font-bold uppercase">In {country.name}.</span>
                </h2>
                <p className="mt-5 text-gray-500 text-sm leading-relaxed">
                  Availability may be subject to local regulatory requirements and partner capacity.
                  Contact us to confirm for your specific situation.
                </p>
                <Link
                  href="/our-services"
                  className="inline-flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-[#d6852b] hover:text-[#1a1a1a] transition-colors"
                >
                  All Services <ArrowRight size={12} />
                </Link>
              </div>

              <div className="lg:col-span-8">
                <div className="flex flex-col gap-0">
                  {country.services.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 py-4 border-b border-[#1a1a1a]/8 last:border-0 ${
                        !s.available ? "opacity-50" : ""
                      }`}
                    >
                      {s.available ? (
                        <CheckCircle size={16} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-[#1a1a1a]/20 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${s.available ? "text-[#1a1a1a]" : "text-[#1a1a1a]/40"}`}>
                          {s.title}
                        </p>
                        {s.notes && (
                          <p className="text-[#d6852b] text-[10px] font-bold tracking-wide uppercase mt-0.5">
                            {s.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── REGULATORY FRAMEWORK ────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
              [ Regulatory Framework ]
            </span>
            <h2 className="text-4xl font-light text-[#1a1a1a] mb-12">
              Who Governs Wildlife in{" "}
              <span className="font-bold uppercase">{country.name}.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {country.regulations.map((reg, i) => (
              <ScrollReveal key={i} delay={(i % 2) * 0.08}>
                <div className="bg-white border-l-2 border-[#d6852b] p-7 group hover:bg-[#1a1a1a] transition-colors duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl font-bold text-[#d6852b]/20 group-hover:text-[#d6852b]/30 transition-colors leading-none">
                      {reg.acronym}
                    </span>
                    <ChevronRight size={14} className="text-[#d6852b] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                  <h3 className="text-[#1a1a1a] group-hover:text-white text-sm font-bold uppercase tracking-wide mb-3 transition-colors duration-500">
                    {reg.authority}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-500">
                    {reg.role}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
              <span className="text-white/20 text-xs font-bold tracking-[0.2em] uppercase flex-shrink-0">
                Partners & Collaborators in {country.name}
              </span>
              <div className="flex-1 h-px bg-white/10 hidden md:block" />
              <div className="flex flex-wrap gap-6 justify-start md:justify-end">
                {country.partners.map((p, i) => (
                  <span
                    key={i}
                    className="text-white/30 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors cursor-default"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className="bg-[#d6852b] py-16 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-light leading-tight">
                Need wildlife support in{" "}
                <span className="font-bold uppercase">{country.name}?</span>
              </h2>
              <p className="text-white/70 mt-2 text-sm">
                Our team is ready to assess your situation and respond quickly.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link href="/contact-us" className="bg-white text-[#d6852b] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors">
                Get In Touch
              </Link>
              <Link href="/schedule-consultation" className="border border-white text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d6852b] transition-colors">
                Request Service
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── PREV / NEXT ─────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <Link
            href={`/operations/${prev.slug}`}
            className="group flex items-center gap-6 py-10 pr-0 md:pr-12 hover:bg-white/5 transition-colors px-4"
          >
            <ArrowLeft size={20} className="text-[#d6852b] group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <div>
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Previous</span>
              <span className="text-white text-lg font-light group-hover:text-[#d6852b] transition-colors flex items-center gap-2">
                <span>{prev.flagEmoji}</span> {prev.name}
              </span>
            </div>
          </Link>
          <Link
            href={`/operations/${next.slug}`}
            className="group flex items-center justify-end gap-6 py-10 pl-0 md:pl-12 hover:bg-white/5 transition-colors px-4"
          >
            <div className="text-right">
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Next</span>
              <span className="text-white text-lg font-light group-hover:text-[#d6852b] transition-colors flex items-center justify-end gap-2">
                <span>{next.flagEmoji}</span> {next.name}
              </span>
            </div>
            <ArrowRight size={20} className="text-[#d6852b] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </main>
  );
}