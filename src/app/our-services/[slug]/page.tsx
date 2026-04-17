// app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import { services } from "@/app/data/services";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import ServiceFAQ from "@/app/components/service-faq";
import ScrollReveal from "@/app/components/scroll-reveal";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.seo.metaTitle,
    description: service.seo.metaDescription,
  };
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return notFound();

  const currentIndex = services.findIndex((s) => s.slug === slug);
  const nextService = services[(currentIndex + 1) % services.length];
  const prevService = services[(currentIndex - 1 + services.length) % services.length];

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[560px] flex flex-col justify-end overflow-hidden bg-[#0f1a0f]">
        <div className="absolute inset-0 z-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover opacity-50 grayscale-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/40 to-transparent" />
        </div>

        <div className="relative z-10 px-6 lg:px-16 pt-8">
          <Link
            href="/our-services"
            className="inline-flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors duration-300"
          >
            <ArrowLeft size={12} /> All Services
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 pb-16 pt-8">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Tanzania Wildlife Trappers ]
          </span>
          <h1 className="mt-4 text-white text-4xl md:text-6xl lg:text-7xl font-light leading-[1.0] tracking-tight max-w-4xl">
            {service.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="font-bold uppercase">
              {service.title.split(" ").slice(-1)[0]}.
            </span>
          </h1>
          <p className="mt-5 text-white/60 text-sm font-bold tracking-[0.2em] uppercase">
            {service.tagline}
          </p>
        </div>

        <div className="relative z-10 px-6 lg:px-16 pb-8 flex justify-end">
          <ChevronDown className="text-white/30 animate-bounce" size={20} />
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <ScrollReveal direction="left" className="lg:col-span-4 lg:sticky lg:top-32">
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
              [ Overview ]
            </span>
            <div className="w-12 h-px bg-[#d6852b] mb-8" />
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] leading-tight">
              What We <span className="font-bold uppercase">Do.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1} className="lg:col-span-8">
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light">
              {service.intro}
            </p>
            <div className="mt-10 border-l-2 border-[#d6852b] pl-6">
              <p className="text-[#1a1a1a] text-base font-medium leading-relaxed">
                {service.shortDescription}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHO IT'S FOR + HIGHLIGHTS ─────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ScrollReveal direction="left">
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-6">
              [ Who This Is For ]
            </span>
            <h2 className="text-3xl font-light text-white mb-10">
              Built For <span className="font-bold uppercase">These Needs.</span>
            </h2>
            <ul className="space-y-4">
              {service.whoItsFor.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-400 text-base">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#d6852b] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-6">
              [ What We Deliver ]
            </span>
            <h2 className="text-3xl font-light text-white mb-10">
              Service <span className="font-bold uppercase">Highlights.</span>
            </h2>
            <ul className="space-y-0">
              {service.highlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-4 border-b border-white/10 text-gray-300 text-sm font-medium tracking-wide group"
                >
                  <span className="group-hover:text-white transition-colors">{item}</span>
                  <span className="text-[#d6852b] text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity">✓</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="mb-14">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
                [ Our Approach ]
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight">
                How It <span className="font-bold uppercase">Works.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {service.process.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="relative border-t-2 border-[#d6852b] pt-8 pr-8 pb-8">
                  <span className="text-[80px] font-bold text-[#1a1a1a]/5 leading-none absolute top-4 right-4 select-none pointer-events-none">
                    {item.step}
                  </span>
                  <span className="text-[#d6852b] text-xs font-bold tracking-widest uppercase block mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-[#1a1a1a] text-xl font-bold uppercase tracking-wide mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {i < service.process.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="absolute top-12 -right-3 text-[#d6852b] hidden lg:block"
                    />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────── */}
      <section className="bg-[#f0ebe1] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <ScrollReveal direction="left" className="lg:col-span-4">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Questions ]
              </span>
              <h2 className="text-4xl font-light text-[#1a1a1a] leading-tight">
                Common <span className="font-bold uppercase">Queries.</span>
              </h2>
              <p className="mt-6 text-gray-500 text-sm leading-relaxed">
                Can't find the answer? Reach out to our team directly — we're happy to discuss your specific situation.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-3 mt-8 bg-[#d6852b] text-white px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#645958] transition-colors"
              >
                Contact Us <ArrowRight size={14} />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1} className="lg:col-span-8">
              <ServiceFAQ faqs={service.faqs} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="bg-[#d6852b] py-16 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-light leading-tight">
                Ready to work with <span className="font-bold uppercase">our team?</span>
              </h2>
              <p className="text-white/70 mt-2 text-sm">
                Get in touch for a field assessment, a quote, or just a conversation.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact-us"
                className="bg-white text-[#d6852b] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Get In Touch
              </Link>
              <Link
                href="/our-services"
                className="border border-white text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d6852b] transition-colors"
              >
                All Services
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── NEXT / PREV NAVIGATION ────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <Link
            href={`/our-services/${prevService.slug}`}
            className="group flex items-center gap-6 py-10 pr-0 md:pr-12 hover:bg-white/5 transition-colors px-4"
          >
            <ArrowLeft size={20} className="text-[#d6852b] group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <div>
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Previous</span>
              <span className="text-white text-lg font-light group-hover:text-[#d6852b] transition-colors">{prevService.title}</span>
            </div>
          </Link>

          <Link
            href={`/our-services/${nextService.slug}`}
            className="group flex items-center justify-end gap-6 py-10 pl-0 md:pl-12 hover:bg-white/5 transition-colors px-4"
          >
            <div className="text-right">
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Next</span>
              <span className="text-white text-lg font-light group-hover:text-[#d6852b] transition-colors">{nextService.title}</span>
            </div>
            <ArrowRight size={20} className="text-[#d6852b] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </main>
  );
}