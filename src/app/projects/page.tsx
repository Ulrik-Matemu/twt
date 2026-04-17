// app/projects/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MapPin, Clock, Tag } from "lucide-react";

// Local Project type and sample projects data to replace the missing '@/app/data/projects' module.
type Project = {
  id: string;
  slug: string;
  featured?: boolean;
  category: string;
  heroImage: string;
  title: string;
  location: string;
  duration: string;
  outcome: string;
  tag: string;
  region: string;
  year: string;
  summary: string;
  stats: { label: string; value: string }[];
  species: string[];
};

const projects: Project[] = [
 {
    id: "rufiji-elephant-corridor",
    slug: "rufiji-elephant-corridor",
    category: "Relocation",
    tag: "Large Mammal Relocation",
    title: "The Rufiji Corridor Relocation",
    location: "Rufiji River Basin, Selous Game Reserve",
    region: "Southern Tanzania",
    year: "2023",
    duration: "14 days",
    species: ["African Elephant"],
    outcome: "Successful",
    heroImage: "/projects/rufiji-elephants.jpg",
    summary:
      "A herd of 22 elephants had established a destructive feeding pattern along a critical agricultural corridor bordering the Selous Game Reserve, causing severe crop losses to four farming communities. Over 14 days, our team planned and executed the largest translocation operation in TWT's recent history — safely relocating the entire herd 80km north into undisturbed reserve territory.",
    featured: true,
    stats: [
      { label: "Animals Relocated", value: "22" },
      { label: "Operation Duration", value: "14 Days" },
      { label: "Distance Covered", value: "80 km" },
      { label: "Communities Protected", value: "4" },
    ],
  },
  {
    id: "ngorongoro-lion-conflict",
    slug: "ngorongoro-lion-conflict",
    category: "Conflict Control",
    tag: "Predator Management",
    title: "Ngorongoro Lion Conflict",
    location: "Ngorongoro Conservation Area",
    region: "Northern Tanzania",
    year: "2023",
    duration: "6 days",
    species: ["African Lion"],
    outcome: "Successful",
    heroImage: "/projects/ngorongoro-lion.jpg",
    summary:
      "A coalition of three male lions repeatedly broke through boma fencing to take livestock from a Maasai community on the NCA boundary. We deployed non-lethal deterrence systems, installed reinforced boma barriers, and facilitated a community compensation and early-warning program that has held for over eight months.",
    stats: [
      { label: "Lions Managed", value: "3" },
      { label: "Bomas Reinforced", value: "11" },
      { label: "Livestock Lost Since", value: "0" },
      { label: "Months Conflict-Free", value: "8+" },
    ],
  },
  {
    id: "selous-wild-dog-rescue",
    slug: "selous-wild-dog-rescue",
    category: "Rescue",
    tag: "Emergency Rescue",
    title: "Selous Wild Dog Pack Rescue",
    location: "Selous Game Reserve",
    region: "Southern Tanzania",
    year: "2022",
    duration: "3 days",
    species: ["African Wild Dog"],
    outcome: "Successful",
    heroImage: "/projects/wild-dogs.jpg",
    summary:
      "Anti-poaching rangers discovered a pack of seven African wild dogs — one of Africa's most endangered canids — with three individuals caught in wire snares. We deployed an emergency rescue team within 6 hours of the callout. All three snared animals were freed, medically assessed, and returned to the pack without permanent injury.",
    stats: [
      { label: "Dogs Rescued", value: "3" },
      { label: "Response Time", value: "6 hrs" },
      { label: "Pack Size", value: "7" },
      { label: "Permanent Injury", value: "None" },
    ],
  },
  {
    id: "ruaha-hippo-waterpoint",
    slug: "ruaha-hippo-waterpoint",
    category: "Conservation",
    tag: "Habitat Management",
    title: "Ruaha Hippo Waterpoint Survey",
    location: "Ruaha National Park",
    region: "Central Tanzania",
    year: "2022",
    duration: "21 days",
    species: ["Hippopotamus", "Nile Crocodile", "African Fish Eagle"],
    outcome: "Completed",
    heroImage: "/projects/hippo-waterpoint.jpg",
    summary:
      "The prolonged dry season had concentrated an unusually high density of hippos around three remaining waterpoints in the park's eastern section, creating dangerous competition and increasing human-wildlife encounters near park boundaries. We conducted a 21-day waterpoint survey, documented population stress indicators, and delivered a management plan to the park authority.",
    stats: [
      { label: "Waterpoints Surveyed", value: "3" },
      { label: "Hippos Documented", value: "340+" },
      { label: "Survey Days", value: "21" },
      { label: "Report Delivered", value: "Yes" },
    ],
  },
  {
    id: "arusha-leopard-capture",
    slug: "arusha-leopard-capture",
    category: "Rescue",
    tag: "Urban Wildlife Response",
    title: "Arusha Urban Leopard Capture",
    location: "Arusha Municipality",
    region: "Northern Tanzania",
    year: "2023",
    duration: "2 days",
    species: ["Leopard"],
    outcome: "Successful",
    heroImage: "/projects/arusha-leopard.jpg",
    summary:
      "A young male leopard entered the Arusha urban fringe at night and became cornered in an industrial compound, injuring two workers attempting to chase it out. Our team responded within two hours, safely immobilised the animal at dawn, conducted a full health assessment, and released it in suitable leopard territory 60km from the city.",
    stats: [
      { label: "Response Time", value: "2 hrs" },
      { label: "Animal Condition", value: "Healthy" },
      { label: "Release Distance", value: "60 km" },
      { label: "Public Injuries", value: "0 by TWT" },
    ],
  },
  {
    id: "tarangire-giraffe-training",
    slug: "tarangire-giraffe-training",
    category: "Training",
    tag: "Ranger Training",
    title: "Tarangire Ranger Handling Program",
    location: "Tarangire National Park",
    region: "Northern Tanzania",
    year: "2023",
    duration: "5 days",
    species: ["Giraffe", "Zebra", "Wildebeest"],
    outcome: "Completed",
    heroImage: "/projects/tarangire-training.jpg",
    summary:
      "TANAPA commissioned TWT to deliver a structured wildlife handling and emergency response training program for 24 rangers assigned to Tarangire National Park. The five-day program covered species-specific handling, chemical immobilisation awareness, on-field triage, and conflict situation management with live-field practical components.",
    stats: [
      { label: "Rangers Trained", value: "24" },
      { label: "Program Days", value: "5" },
      { label: "Modules Completed", value: "8" },
      { label: "Pass Rate", value: "100%" },
    ],
  },
  {
    id: "kilombero-crocodile-conflict",
    slug: "kilombero-crocodile-conflict",
    category: "Conflict Control",
    tag: "Conflict Management",
    title: "Kilombero Valley Crocodile Conflict",
    location: "Kilombero Valley",
    region: "South-Central Tanzania",
    year: "2022",
    duration: "8 days",
    species: ["Nile Crocodile"],
    outcome: "Successful",
    heroImage: "/projects/kilombero-croc.jpg",
    summary:
      "Seasonal flooding pushed a population of Nile crocodiles into active rice-farming channels in the Kilombero Valley, resulting in four livestock attacks and a near-miss with a child. We deployed capture and relocation teams, removed eight problem individuals from the farming channels, and delivered community education sessions on waterway safety.",
    stats: [
      { label: "Crocodiles Relocated", value: "8" },
      { label: "Attacks Since", value: "0" },
      { label: "Villages Covered", value: "3" },
      { label: "Education Sessions", value: "6" },
    ],
  },
  {
    id: "mikumi-orphan-cheetah",
    slug: "mikumi-orphan-cheetah",
    category: "Rescue",
    tag: "Orphan Rehabilitation",
    title: "Mikumi Orphan Cheetah Rehabilitation",
    location: "Mikumi National Park",
    region: "Eastern Tanzania",
    year: "2022",
    duration: "90 days",
    species: ["Cheetah"],
    outcome: "Successful",
    heroImage: "/projects/mikumi-cheetah.jpg",
    summary:
      "A female cheetah cub, approximately 6 weeks old, was found alone near a poacher's snare line in Mikumi. Our team managed an intensive 90-day rehabilitation program with strict minimal human-contact protocols to preserve wild hunting instincts. The cub was successfully released in a monitored soft-release area and has been confirmed territory-holding for three months.",
    stats: [
      { label: "Rehab Duration", value: "90 Days" },
      { label: "Release Weight", value: "28 kg" },
      { label: "Months Post-Release", value: "3+" },
      { label: "Wild Status", value: "Confirmed" },
    ],
  },
  {
    id: "serengeti-zebra-census",
    slug: "serengeti-zebra-census",
    category: "Conservation",
    tag: "Population Survey",
    title: "Serengeti Zebra Population Survey",
    location: "Serengeti National Park",
    region: "Northern Tanzania",
    year: "2023",
    duration: "30 days",
    species: ["Plains Zebra", "Blue Wildebeest", "Thomson's Gazelle"],
    outcome: "Completed",
    heroImage: "/projects/serengeti-zebra.jpg",
    summary:
      "Commissioned by TANAPA and a conservation research partner, TWT led a 30-day ground and aerial survey of zebra populations across the Serengeti's southern corridor — providing baseline data for a five-year management plan. The survey documented 67,400 individuals and identified three previously unrecorded movement corridors.",
    stats: [
      { label: "Zebra Documented", value: "67,400" },
      { label: "Survey Area", value: "4,200 km²" },
      { label: "New Corridors Found", value: "3" },
      { label: "Survey Days", value: "30" },
    ],
  },
];

import ScrollReveal from "@/app/components/scroll-reveal";

const CATEGORIES = [
  "All",
  "Relocation",
  "Rescue",
  "Conflict Control",
  "Conservation",
  "Training",
] as const;

const CATEGORY_COUNTS = CATEGORIES.slice(1).reduce<Record<string, number>>(
  (acc, cat) => {
    acc[cat] = projects.filter((p) => p.category === cat).length;
    return acc;
  },
  {}
);

export default function ProjectsPage() {
  const [active, setActive] = useState<string>("All");

  const featured = projects.find((p) => p.featured)!;
  const filtered = useMemo(
    () =>
      active === "All"
        ? projects.filter((p) => !p.featured)
        : projects.filter((p) => p.category === active && !p.featured),
    [active]
  );

  // When a category is active that contains the featured project, show it in the grid too
  const showFeaturedInGrid =
    active !== "All" && featured.category === active;

  const gridProjects = showFeaturedInGrid ? [featured, ...filtered] : filtered;

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO HEADER ───────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-0 px-6 lg:px-16 overflow-hidden">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Eyebrow + counter */}
          <div className="flex items-center justify-between">
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
              [ Field Projects ]
            </span>
            <span className="text-white/20 text-xs font-bold tracking-widest uppercase">
              {projects.length} documented operations
            </span>
          </div>

          {/* Headline */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16">
            <h1 className="lg:col-span-8 text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
              Work From{" "}
              <span className="font-bold uppercase">The Field.</span>
            </h1>
            <p className="lg:col-span-4 text-white/50 text-base leading-relaxed lg:text-right">
              Every project is a documented operation — real situations, real animals, real outcomes.
            </p>
          </div>

          {/* Filter tabs — pinned to bottom of header */}
          <div className="flex items-end gap-0 overflow-x-auto scrollbar-none border-t border-white/10 -mx-6 lg:-mx-16 px-6 lg:px-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative flex-shrink-0 flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-200 border-t-2 -mt-px ${
                  active === cat
                    ? "text-white border-[#d6852b]"
                    : "text-white/30 border-transparent hover:text-white/60"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span
                    className={`text-[10px] font-bold ${
                      active === cat ? "text-[#d6852b]" : "text-white/20"
                    }`}
                  >
                    {CATEGORY_COUNTS[cat]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECT ─────────────────────────────────────── */}
      <AnimatePresence>
        {active === "All" && (
          <motion.section
            key="featured"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 lg:px-16 pt-12 pb-6"
          >
            <div className="max-w-7xl mx-auto">
              <Link
                href={`/projects/${featured.slug}`}
                className="group block relative overflow-hidden bg-[#1a1a1a]"
              >
                {/* Image */}
                <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
                  <img
                    src={featured.heroImage}
                    alt={featured.title}
                    className="w-full h-full object-cover opacity-55 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/20 to-transparent" />

                  {/* Featured pill */}
                  <div className="absolute top-6 left-6 bg-[#d6852b] px-4 py-1.5">
                    <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                      Featured Project
                    </span>
                  </div>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <MetaPill icon={Tag} text={featured.tag} />
                        <MetaPill icon={MapPin} text={featured.region} />
                        <MetaPill icon={Clock} text={featured.year} />
                      </div>

                      <h2 className="text-white text-3xl md:text-5xl font-light leading-tight">
                        {featured.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="font-bold uppercase">
                          {featured.title.split(" ").slice(-1)[0]}.
                        </span>
                      </h2>
                      <p className="mt-4 text-white/55 text-sm leading-relaxed max-w-xl hidden md:block">
                        {featured.summary.slice(0, 160)}…
                      </p>
                    </div>

                    {/* Stats strip */}
                    <div className="flex gap-6 md:gap-8 flex-wrap">
                      {featured.stats.map((s) => (
                        <div key={s.label} className="flex flex-col">
                          <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter leading-none">
                            {s.value}
                          </span>
                          <span className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase mt-1.5">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="bg-[#d6852b] px-8 md:px-12 py-3 flex items-center justify-between">
                  <span className="text-white text-xs font-bold tracking-widest uppercase">
                    {featured.species.join(" · ")}
                  </span>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    Read Full Report <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── PROJECTS GRID ─────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 pt-6 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest uppercase">
              {active === "All" ? "All Projects" : active}
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]/10" />
            <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest">
              {gridProjects.length} operations
            </span>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {gridProjects.length === 0 ? (
                <div className="col-span-full py-24 text-center text-gray-400 text-sm">
                  No projects in this category yet.
                </div>
              ) : (
                gridProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
              {[
                { value: "9", label: "Project Categories" },
                { value: "1,200+", label: "Operations Completed" },
                { value: "30+", label: "Species Handled" },
                { value: "100%", label: "Legal Compliance" },
              ].map((s, i) => (
                <div key={i} className="px-8 first:pl-0 last:pr-0 py-4">
                  <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none block">
                    {s.value}
                  </span>
                  <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase mt-4 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#d6852b] py-20 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                [ Commission A Project ]
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light text-white leading-tight">
                Have A Situation In The{" "}
                <span className="font-bold uppercase">Field?</span>
              </h2>
              <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-lg">
                Every project on this page started with a single call or message.
                Our team is ready to assess your situation and propose a plan.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link
                href="/contact-us"
                className="bg-white text-[#d6852b] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors text-center"
              >
                Get In Touch
              </Link>
              <Link
                href="/our-services"
                className="border border-white/40 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-white hover:bg-white/10 transition-colors text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}

/* ── PROJECT CARD ─────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const categoryColors: Record<string, string> = {
    Relocation: "bg-blue-900/60",
    Rescue: "bg-red-900/60",
    "Conflict Control": "bg-orange-900/60",
    Conservation: "bg-green-900/60",
    Training: "bg-purple-900/60",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col h-full bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-75 grayscale-[0.25] group-hover:opacity-60 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className={`${categoryColors[project.category]} backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5`}>
              {project.category}
            </span>
          </div>

          {/* Year */}
          <div className="absolute top-4 right-4">
            <span className="text-white/50 text-xs font-bold tracking-widest">
              {project.year}
            </span>
          </div>

          {/* Species tag bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
              {project.species[0]}
            </span>
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[#d6852b] group-hover:bg-[#d6852b] transition-all duration-300">
              <ArrowUpRight size={13} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 border-t-2 border-[#d6852b]">
          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={11} className="text-[#d6852b] flex-shrink-0" />
            <span className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase">
              {project.region}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[#1a1a1a] group-hover:text-white text-lg font-light leading-snug transition-colors duration-500 flex-1">
            {project.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="font-bold">
              {project.title.split(" ").slice(-1)[0]}
            </span>
          </h3>

          {/* Summary */}
          <p className="mt-3 text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
            {project.summary}
          </p>

          {/* Mini stats */}
          <div className="mt-5 pt-5 border-t border-[#1a1a1a]/8 group-hover:border-white/10 transition-colors grid grid-cols-2 gap-3">
            {project.stats.slice(0, 2).map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-xl font-bold text-[#1a1a1a] group-hover:text-white tracking-tighter transition-colors duration-500">
                  {s.value}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#d6852b] mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── META PILL ────────────────────────────────────────────────── */
function MetaPill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5">
      <Icon size={11} className="text-[#d6852b]" />
      <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">
        {text}
      </span>
    </div>
  );
}