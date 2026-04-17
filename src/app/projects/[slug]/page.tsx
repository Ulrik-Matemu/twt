// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { projects } from "@/app/data/projects";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Clock, Tag, CheckCircle } from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Field Projects | Tanzania Wildlife Trappers`,
    description: project.summary.slice(0, 160),
  };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  Relocation: "text-blue-400",
  Rescue: "text-red-400",
  "Conflict Control": "text-orange-400",
  Conservation: "text-green-400",
  Training: "text-purple-400",
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  const currentIdx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIdx + 1) % projects.length];
  const prev = projects[(currentIdx - 1 + projects.length) % projects.length];

  // Related projects — same category, not self
  const related = projects
    .filter((p) => p.category === project.category && p.slug !== slug)
    .slice(0, 2);

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[580px] flex flex-col justify-end overflow-hidden bg-[#0f1a0f]">
        <div className="absolute inset-0 z-0">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/40 to-transparent" />
        </div>

        {/* Breadcrumb */}
        <div className="relative z-10 px-6 lg:px-16 pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors"
          >
            <ArrowLeft size={12} /> Field Projects
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 pb-0 pt-8">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-xs font-bold tracking-widest uppercase ${CATEGORY_COLORS[project.category]}`}>
              [ {project.category} ]
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <MapPin size={10} className="text-[#d6852b]" /> {project.region}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Clock size={10} className="text-[#d6852b]" /> {project.year} · {project.duration}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight max-w-4xl">
            {project.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="font-bold uppercase">
              {project.title.split(" ").slice(-1)[0]}.
            </span>
          </h1>

          {/* Outcome badge */}
          <div className="mt-6 flex items-center gap-3 pb-16">
            <CheckCircle size={14} className="text-[#d6852b]" />
            <span className="text-white/60 text-xs font-bold tracking-widest uppercase">
              Outcome: {project.outcome}
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {project.stats.map((s, i) => (
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

      {/* ── SUMMARY + SIDEBAR ─────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Main body */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <ScrollReveal>
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Field Report ]
              </span>
              <div className="w-10 h-px bg-[#d6852b] mb-10" />

              <p className="text-[#1a1a1a] text-xl md:text-2xl font-light leading-[1.6] tracking-tight">
                {project.summary}
              </p>
            </ScrollReveal>

            {/* Extended narrative sections — placeholder for CMS content */}
            <ScrollReveal delay={0.1}>
              <div className="mt-14 space-y-8">
                <div>
                  <h2 className="text-[#1a1a1a] text-2xl font-bold uppercase tracking-wide mb-4">
                    The Challenge
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Every field operation begins with a situation that carries real stakes — for the animals involved, for the communities affected, and for the ecosystem in which they interact. In this operation, our team was called to address a situation requiring immediate professional intervention. The combination of species behaviour, terrain complexity, and human-wildlife interface made this one of the more demanding assessments of the year.
                  </p>
                </div>

                <div className="border-l-2 border-[#d6852b] pl-6">
                  <p className="text-[#1a1a1a] text-lg font-light italic leading-relaxed">
                    "The field never presents clean situations. It presents real ones. Our job is to bring order to complexity — without compromising the animal or the people around it."
                  </p>
                  <p className="mt-4 text-[#d6852b] text-xs font-bold tracking-widest uppercase">
                    — TWT Field Lead
                  </p>
                </div>

                <div>
                  <h2 className="text-[#1a1a1a] text-2xl font-bold uppercase tracking-wide mb-4">
                    Our Approach
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Following our standard assessment protocol, the team conducted a thorough situational review before any intervention was attempted. Species-specific behavioural patterns were documented, risk levels were mapped, and a staged response plan was agreed upon with all stakeholders present. Equipment was prepared and safety perimeters established before the operation commenced.
                  </p>
                </div>

                <div>
                  <h2 className="text-[#1a1a1a] text-2xl font-bold uppercase tracking-wide mb-4">
                    The Outcome
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed">
                    The operation concluded with a {project.outcome.toLowerCase()} outcome for all parties. Post-operation documentation was completed and submitted to the Tanzania Wildlife Management Authority. A follow-up assessment was scheduled 30 days after conclusion to monitor the situation.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <ScrollReveal direction="right" className="lg:sticky lg:top-32 space-y-8">

              {/* Operation details card */}
              <div className="bg-[#1a1a1a] p-8">
                <div className="w-8 h-px bg-[#d6852b] mb-6" />
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase block mb-6">
                  Operation Details
                </span>
                <div className="space-y-5">
                  {[
                    { label: "Category", value: project.category },
                    { label: "Location", value: project.location },
                    { label: "Region", value: project.region },
                    { label: "Year", value: project.year },
                    { label: "Duration", value: project.duration },
                    { label: "Outcome", value: project.outcome },
                  ].map((d) => (
                    <div key={d.label} className="flex flex-col gap-0.5 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                        {d.label}
                      </span>
                      <span className="text-white text-sm font-medium">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Species card */}
              <div className="bg-[#f0ebe1] p-8">
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase block mb-4">
                  Species Involved
                </span>
                <div className="flex flex-col gap-3">
                  {project.species.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d6852b] flex-shrink-0" />
                      <span className="text-[#1a1a1a] text-sm font-medium italic">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enquiry CTA */}
              <div className="border-2 border-[#d6852b] p-8">
                <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-wide mb-3 leading-snug">
                  Need A Similar Operation?
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Contact our team to discuss your situation. We'll assess and propose an approach.
                </p>
                <Link
                  href="/contact-us"
                  className="flex items-center justify-between bg-[#d6852b] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                >
                  Get In Touch <ArrowRight size={13} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── RELATED PROJECTS ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-[#f0ebe1] py-20 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
                    [ Related Operations ]
                  </span>
                  <h2 className="text-3xl font-light text-[#1a1a1a]">
                    More <span className="font-bold uppercase">{project.category} Work.</span>
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#d6852b] transition-colors"
                >
                  All Projects <ArrowRight size={12} />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group flex flex-col bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={p.heroImage}
                        alt={p.title}
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 border-t-2 border-[#d6852b] flex-1">
                      <span className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 mb-3">
                        <MapPin size={10} /> {p.region}
                      </span>
                      <h3 className="text-[#1a1a1a] group-hover:text-white text-xl font-light transition-colors duration-500">
                        {p.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="font-bold">{p.title.split(" ").slice(-1)[0]}</span>
                      </h3>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PREV / NEXT ───────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex items-center gap-6 py-10 pr-0 md:pr-12 hover:bg-white/5 transition-colors px-4"
          >
            <ArrowLeft size={20} className="text-[#d6852b] group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <div>
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Previous</span>
              <span className="text-white text-base font-light group-hover:text-[#d6852b] transition-colors">{prev.title}</span>
            </div>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-end gap-6 py-10 pl-0 md:pl-12 hover:bg-white/5 transition-colors px-4"
          >
            <div className="text-right">
              <span className="text-white/30 text-xs font-bold tracking-widest uppercase block mb-1">Next</span>
              <span className="text-white text-base font-light group-hover:text-[#d6852b] transition-colors">{next.title}</span>
            </div>
            <ArrowRight size={20} className="text-[#d6852b] group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </div>
      </section>

    </main>
  );
}