// app/careers/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
  ChevronDown,
  X,
  CheckCircle,
  Users,
  Star,
  Heart,
} from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

/* ── TYPES ─────────────────────────────────────────────────────── */
type JobType = "Full-Time" | "Contract" | "Seasonal" | "Part-Time";
type Department =
  | "Field Operations"
  | "Veterinary"
  | "Training & Education"
  | "Advisory & Compliance"
  | "Administration";

type Job = {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  posted: string; // ISO date
  closes: string; // ISO date
  summary: string;
  responsibilities: string[];
  requirements: string[];
  preferred?: string[];
};

/* ── DATA ───────────────────────────────────────────────────────── */
const jobs: Job[] = [
//   {
//     id: "field-capture-specialist-2024",
//     title: "Wildlife Field Capture Specialist",
//     department: "Field Operations",
//     location: "Arusha, Tanzania",
//     type: "Full-Time",
//     posted: "2024-03-10",
//     closes: "2024-05-01",
//     summary:
//       "We are seeking an experienced field capture specialist to join our core operations team. You will lead and assist in the planning and execution of humane wildlife capture operations across Tanzania, working directly with our veterinary and logistics teams.",
//     responsibilities: [
//       "Plan and execute safe, humane wildlife capture operations under the direction of the Field Operations Lead.",
//       "Conduct pre-operation site assessments and risk analyses.",
//       "Operate and maintain capture equipment including nets, traps, and darting equipment (where authorised).",
//       "Assist wildlife veterinarians during chemical immobilisation procedures.",
//       "Complete accurate field documentation and incident reports after each operation.",
//       "Liaise with clients, community leaders, and TAWA officials during and after operations.",
//     ],
//     requirements: [
//       "Minimum 3 years of hands-on experience in wildlife field operations in East Africa.",
//       "Valid TAWA field operations permit or ability to obtain one.",
//       "Demonstrated experience handling large and potentially dangerous mammals.",
//       "Valid driver's licence and experience driving 4WD vehicles in off-road conditions.",
//       "Strong physical fitness and ability to work in remote environments under pressure.",
//       "Fluent in Swahili; working English required.",
//     ],
//     preferred: [
//       "Experience with chemical immobilisation support procedures.",
//       "Completion of a recognised wildlife handling or ranger training programme.",
//       "First aid certification.",
//     ],
//   },
//   {
//     id: "wildlife-vet-technician-2024",
//     title: "Wildlife Veterinary Technician",
//     department: "Veterinary",
//     location: "Dar es Salaam / Field-Based",
//     type: "Full-Time",
//     posted: "2024-03-01",
//     closes: "2024-04-25",
//     summary:
//       "Tanzania Wildlife Trappers is looking for a qualified veterinary technician with wildlife experience to support our veterinary team across field and clinic-based operations. This is a hands-on role requiring travel across Tanzania.",
//     responsibilities: [
//       "Support the Chief Wildlife Veterinarian in clinical assessments, treatments, and procedures.",
//       "Prepare and administer medications, wound care, and supportive therapies under veterinary supervision.",
//       "Monitor anaesthetised animals during field immobilisation operations.",
//       "Maintain veterinary supply inventories and ensure field kit readiness.",
//       "Assist in rehabilitation care and pre-release conditioning of recovering animals.",
//       "Maintain detailed clinical records for all cases.",
//     ],
//     requirements: [
//       "Diploma or degree in veterinary technology or related biological science.",
//       "Minimum 2 years of clinical experience, preferably with non-domestic species.",
//       "Registration with the Tanzania Veterinary Council (or eligibility to register).",
//       "Willingness and ability to travel extensively for field deployments.",
//       "Calm and methodical under pressure in field environments.",
//     ],
//     preferred: [
//       "Previous wildlife clinic or rehabilitation centre experience.",
//       "Experience with large mammal species.",
//       "Exposure to chemical immobilisation procedures.",
//     ],
//   },
//   {
//     id: "field-trainer-2024",
//     title: "Wildlife Handling Field Trainer",
//     department: "Training & Education",
//     location: "Arusha, Tanzania (with nationwide travel)",
//     type: "Full-Time",
//     posted: "2024-02-20",
//     closes: "2024-04-30",
//     summary:
//       "We are expanding our Training & Education division and seeking a skilled field professional who can design, deliver, and evaluate wildlife handling training programmes for rangers, scouts, and conservation staff across Tanzania.",
//     responsibilities: [
//       "Design and deliver practical training curricula in wildlife handling, conflict response, and field safety.",
//       "Conduct training needs assessments for client organisations.",
//       "Facilitate both classroom and live-field training sessions.",
//       "Assess and certify programme participants against defined competency standards.",
//       "Develop and update training materials in line with current field practice and regulation.",
//       "Travel to client facilities across Tanzania to deliver in-situ programmes.",
//     ],
//     requirements: [
//       "Minimum 5 years of active wildlife field experience in East Africa.",
//       "Demonstrable experience training or mentoring junior field staff.",
//       "Strong communication and facilitation skills in both Swahili and English.",
//       "Ability to adapt training delivery to mixed experience levels.",
//       "Valid driver's licence.",
//     ],
//     preferred: [
//       "Formal training or teaching qualification.",
//       "Experience working with TANAPA, TAWA, or wildlife NGO ranger programmes.",
//       "Competence in Microsoft Office and basic presentation tools.",
//     ],
//   },
//   {
//     id: "compliance-advisor-2024",
//     title: "Wildlife Compliance & Permit Advisor",
//     department: "Advisory & Compliance",
//     location: "Dar es Salaam, Tanzania",
//     type: "Contract",
//     posted: "2024-03-15",
//     closes: "2024-05-15",
//     summary:
//       "TWT's Advisory division is seeking a compliance specialist with in-depth knowledge of Tanzania's wildlife regulatory framework to support our zoo licensing, CITES permit, and facility compliance advisory services. This is initially a contract role with potential to convert to full-time.",
//     responsibilities: [
//       "Advise clients on TAWA licensing requirements for wildlife facilities and operations.",
//       "Prepare and review CITES permit applications and supporting documentation.",
//       "Conduct facility compliance audits and produce gap analysis reports.",
//       "Monitor regulatory updates and brief internal teams and clients on changes.",
//       "Support new facility development projects with regulatory strategy and timeline planning.",
//       "Build and maintain professional relationships with TAWA and other regulatory bodies.",
//     ],
//     requirements: [
//       "Degree in law, environmental management, wildlife science, or related field.",
//       "Minimum 3 years of experience working with Tanzanian wildlife regulations.",
//       "Demonstrated understanding of CITES Appendix provisions and permit processes.",
//       "Excellent written English and Swahili for report production and official correspondence.",
//       "High attention to detail and structured analytical approach.",
//     ],
//     preferred: [
//       "Previous experience working within TAWA, NEMC, or related government body.",
//       "Familiarity with WAZA or regional zoo accreditation standards.",
//     ],
//   },
//   {
//     id: "operations-coordinator-2024",
//     title: "Operations Coordinator",
//     department: "Administration",
//     location: "Arusha, Tanzania",
//     type: "Full-Time",
//     posted: "2024-03-18",
//     closes: "2024-05-10",
//     summary:
//       "We are looking for a sharp, organised operations coordinator to support the day-to-day running of TWT's field and administrative operations. This is a central role that keeps the organisation moving — coordinating schedules, logistics, client communications, and team support.",
//     responsibilities: [
//       "Coordinate field team scheduling, vehicle assignments, and equipment logistics.",
//       "Manage inbound client enquiries and triage to the appropriate team.",
//       "Maintain operational records, filing systems, and compliance documentation.",
//       "Support procurement of field supplies and veterinary consumables.",
//       "Assist with invoicing, expense tracking, and reporting in coordination with management.",
//       "Provide general administrative support to directors and department leads.",
//     ],
//     requirements: [
//       "Degree or diploma in business administration, management, or related field.",
//       "Minimum 2 years of experience in an operations or coordination role.",
//       "Excellent organisational skills and ability to manage multiple priorities.",
//       "Proficient in Microsoft Office Suite (Word, Excel, Outlook).",
//       "Strong written and spoken English and Swahili.",
//       "Comfortable working in a fast-moving, field-operations environment.",
//     ],
//     preferred: [
//       "Experience in a wildlife, conservation, or environmental organisation.",
//       "Familiarity with project management tools.",
//     ],
//   },
];

/* Set to [] to test the empty state */
const ACTIVE_JOBS = jobs;

const DEPARTMENTS: Department[] = [
  "Field Operations",
  "Veterinary",
  "Training & Education",
  "Advisory & Compliance",
  "Administration",
];

const TYPE_COLORS: Record<JobType, string> = {
  "Full-Time": "bg-green-900/40 text-green-300",
  "Contract": "bg-blue-900/40 text-blue-300",
  "Seasonal": "bg-orange-900/40 text-orange-300",
  "Part-Time": "bg-purple-900/40 text-purple-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered =
    activeFilter === "All"
      ? ACTIVE_JOBS
      : ACTIVE_JOBS.filter((j) => j.department === activeFilter);

  const hasJobs = ACTIVE_JOBS.length > 0;

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-0 px-6 lg:px-16 overflow-hidden">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Join The Team ]
          </span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-16">
            <h1 className="lg:col-span-8 text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
              Work At The{" "}
              <span className="font-bold uppercase">Edge Of The Wild.</span>
            </h1>
            <p className="lg:col-span-4 text-white/50 text-base leading-relaxed lg:text-right">
              We hire people who are serious about wildlife, serious about professionalism,
              and ready to do the work that matters.
            </p>
          </div>

          {/* Filter tabs */}
          {hasJobs && (
            <div className="flex items-end gap-0 overflow-x-auto scrollbar-none border-t border-white/10 -mx-6 lg:-mx-16 px-6 lg:px-16">
              {["All", ...DEPARTMENTS].map((dept) => {
                const count =
                  dept === "All"
                    ? ACTIVE_JOBS.length
                    : ACTIVE_JOBS.filter((j) => j.department === dept).length;
                if (dept !== "All" && count === 0) return null;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveFilter(dept)}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 border-t-2 -mt-px ${
                      activeFilter === dept
                        ? "text-white border-[#d6852b]"
                        : "text-white/30 border-transparent hover:text-white/60"
                    }`}
                  >
                    {dept}
                    <span
                      className={`text-[10px] font-bold ${
                        activeFilter === dept ? "text-[#d6852b]" : "text-white/20"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY JOIN US (values strip) ──────────────────────────── */}
      <section className="bg-[#1a1a1a] py-14 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            {
              icon: Star,
              heading: "Purposeful Work",
              body: "Every role at TWT has a direct line to meaningful conservation outcomes. You will see the impact of your work.",
            },
            {
              icon: Users,
              heading: "Expert Colleagues",
              body: "You will work alongside Tanzania's most experienced wildlife field professionals, veterinarians, and regulatory experts.",
            },
            {
              icon: Heart,
              heading: "Genuine Mission",
              body: "We are not a corporate entity with a conservation programme. Wildlife is the whole business — and everyone here knows it.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 px-8 py-8 first:pl-0 last:pr-0">
              <item.icon size={18} className="text-[#d6852b]" />
              <h3 className="text-white text-base font-bold uppercase tracking-wide">
                {item.heading}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOB LISTINGS or EMPTY STATE ─────────────────────────── */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {hasJobs ? (
            <>
              {/* Label row */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest uppercase">
                  {activeFilter === "All" ? "Open Positions" : activeFilter}
                </span>
                <div className="flex-1 h-px bg-[#1a1a1a]/10" />
                <span className="text-[#1a1a1a]/30 text-xs font-bold">
                  {filtered.length} {filtered.length === 1 ? "role" : "roles"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  {filtered.length === 0 ? (
                    <p className="py-16 text-center text-gray-400 text-sm">
                      No open roles in this department right now. Check back soon.
                    </p>
                  ) : (
                    filtered.map((job, i) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        index={i}
                        onSelect={() => setSelectedJob(job)}
                      />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* ── OPEN APPLICATION CTA ────────────────────────────────── */}
      <section className="bg-[#f0ebe1] py-20 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Don't See Your Role? ]
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#1a1a1a] leading-tight">
                Send An Open{" "}
                <span className="font-bold uppercase">Application.</span>
              </h2>
              <p className="mt-5 text-gray-500 text-base leading-relaxed max-w-xl">
                If you are an experienced wildlife professional and believe you have
                something to contribute to TWT — even if no current role matches your
                profile — we welcome open applications. Tell us who you are and what
                you bring.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/contact-us"
                className="bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors text-center"
              >
                Get In Touch
              </Link>
              <Link
                href="/about-us"
                className="border border-[#1a1a1a]/20 text-[#1a1a1a] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-[#d6852b] hover:text-[#d6852b] transition-colors text-center"
              >
                Learn About TWT
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── JOB DETAIL DRAWER ───────────────────────────────────── */}
      <AnimatePresence>
        {selectedJob && (
          <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── JOB CARD ───────────────────────────────────────────────────── */
function JobCard({
  job,
  index,
  onSelect,
}: {
  job: Job;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        onClick={onSelect}
        className="group w-full text-left bg-white hover:bg-[#1a1a1a] transition-colors duration-500 border-l-2 border-[#d6852b] overflow-hidden"
      >
        <div className="px-7 py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          {/* Main info */}
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase">
                {job.department}
              </span>
              <span className="text-[#1a1a1a]/20 group-hover:text-white/20 text-xs transition-colors">·</span>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${TYPE_COLORS[job.type]}`}
              >
                {job.type}
              </span>
            </div>
            <h3 className="text-[#1a1a1a] group-hover:text-white text-xl font-light leading-snug transition-colors duration-500">
              {job.title}
            </h3>
            <p className="mt-2 text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
              {job.summary}
            </p>
          </div>

          {/* Meta */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[#1a1a1a]/40 group-hover:text-white/40 transition-colors text-xs">
              <MapPin size={11} className="text-[#d6852b] flex-shrink-0" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-[#1a1a1a]/40 group-hover:text-white/40 transition-colors text-xs">
              <Clock size={11} className="text-[#d6852b] flex-shrink-0" />
              Closes {formatDate(job.closes)}
            </div>
            <div className="flex items-center gap-1.5 text-[#1a1a1a]/40 group-hover:text-white/40 transition-colors text-xs">
              <Briefcase size={11} className="text-[#d6852b] flex-shrink-0" />
              Posted {formatDate(job.posted)}
            </div>
          </div>

          {/* Arrow */}
          <div className="md:col-span-2 flex justify-end">
            <div className="w-10 h-10 border border-[#d6852b]/30 group-hover:border-[#d6852b] group-hover:bg-[#d6852b] flex items-center justify-center transition-all duration-300">
              <ArrowRight
                size={14}
                className="text-[#d6852b] group-hover:text-white transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* ── EMPTY STATE ────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <ScrollReveal>
      <div className="py-24 flex flex-col items-center text-center max-w-xl mx-auto">
        {/* Amber icon ring */}
        <div className="w-20 h-20 border-2 border-[#d6852b]/30 flex items-center justify-center mb-8">
          <Briefcase size={28} className="text-[#d6852b]/60" />
        </div>

        <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase mb-4">
          [ No Open Positions ]
        </span>

        <h2 className="text-[#1a1a1a] text-3xl md:text-4xl font-light leading-tight mb-5">
          Nothing Listed{" "}
          <span className="font-bold uppercase">Right Now.</span>
        </h2>

        <p className="text-gray-500 text-base leading-relaxed mb-4">
          We don't always have open roles — but when we do, they appear here first.
          We hire slowly and carefully: the work we do demands it.
        </p>

        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          If you're a qualified wildlife professional and believe you belong on this
          team, send us an open application. We read every one.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/contact-us"
            className="bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors text-center"
          >
            Send Open Application
          </Link>
          <Link
            href="/about-us"
            className="border border-[#1a1a1a]/20 text-[#1a1a1a] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-[#d6852b] hover:text-[#d6852b] transition-colors text-center"
          >
            About Our Team
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ── JOB DETAIL DRAWER ──────────────────────────────────────────── */
function JobDrawer({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        key="drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-[#f9f5ef] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Drawer header */}
        <div className="sticky top-0 bg-[#0f1a0f] px-8 pt-8 pb-6 z-10 flex-shrink-0">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex flex-wrap gap-2">
              <span className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase">
                {job.department}
              </span>
              <span className="text-white/20 text-xs">·</span>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${TYPE_COLORS[job.type]}`}
              >
                {job.type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-light leading-snug">
            {job.title}
          </h2>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap gap-5 text-white/40 text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-[#d6852b]" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} className="text-[#d6852b]" /> Closes {formatDate(job.closes)}
            </span>
          </div>
        </div>

        {/* Drawer body */}
        <div className="flex-1 px-8 py-8 flex flex-col gap-8">

          {/* Summary */}
          <div>
            <div className="w-8 h-px bg-[#d6852b] mb-5" />
            <p className="text-gray-600 text-base leading-relaxed">{job.summary}</p>
          </div>

          {/* Responsibilities */}
          <DrawerSection title="Key Responsibilities">
            <ul className="flex flex-col gap-3">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <CheckCircle
                    size={14}
                    className="text-[#d6852b] flex-shrink-0 mt-0.5"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </DrawerSection>

          {/* Requirements */}
          <DrawerSection title="What We Need From You">
            <ul className="flex flex-col gap-3">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d6852b] flex-shrink-0 mt-1.5" />
                  {r}
                </li>
              ))}
            </ul>
          </DrawerSection>

          {/* Preferred */}
          {job.preferred && job.preferred.length > 0 && (
            <DrawerSection title="Nice To Have">
              <ul className="flex flex-col gap-3">
                {job.preferred.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-500 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/20 flex-shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </DrawerSection>
          )}

          {/* Apply block */}
          <div className="border-t-2 border-[#d6852b] pt-8 mt-2">
            <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-wide mb-2">
              Ready To Apply?
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Send your CV and a short cover letter explaining why you are the right
              person for this role to{" "}
              <span className="text-[#d6852b] font-semibold">
                careers@tanzaniawildlifetrappers.com
              </span>
              , with the subject line:{" "}
              <span className="font-semibold text-[#1a1a1a]">
                Application — {job.title}
              </span>
              .
            </p>
            <a
              href={`mailto:careers@tanzaniawildlifetrappers.com?subject=Application — ${encodeURIComponent(job.title)}`}
              className="inline-flex items-center gap-3 bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
            >
              Apply Now <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── DRAWER SECTION ─────────────────────────────────────────────── */
function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-[#1a1a1a]/10 pt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h3 className="text-[#1a1a1a] text-sm font-bold uppercase tracking-widest group-hover:text-[#d6852b] transition-colors">
          {title}
        </h3>
        <ChevronDown
          size={15}
          className={`text-[#d6852b] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}