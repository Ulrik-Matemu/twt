// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

export const metadata: Metadata = {
  title: "About Us | Tanzania Wildlife Trappers",
  description:
    "For over 30 years, Tanzania Wildlife Trappers has set the standard for humane, professional wildlife operations across East Africa. Learn our story, values, and the team behind the work.",
};

const stats = [
  { value: "30+", label: "Years In The Field" },
  { value: "2.5K+", label: "Wildlife Relocated" },
  { value: "1,200+", label: "Successful Missions" },
  { value: "15+", label: "Veterinary Partners" },
];

const values = [
  {
    number: "01",
    title: "Animal Welfare First",
    body: "Every decision we make in the field begins with a single question: what is best for the animal? Our methods, tools, and training are built around minimising stress, pain, and risk to wildlife — without exception.",
  },
  {
    number: "02",
    title: "Professional Precision",
    body: "Wildlife operations leave no room for guesswork. We plan meticulously, execute calmly, and adapt intelligently. The credibility of conservation depends on professionals who get it right every time.",
  },
  {
    number: "03",
    title: "Community Partnership",
    body: "Conservation cannot succeed against communities — it must succeed with them. We invest in local relationships, train local professionals, and build solutions that make wildlife an asset rather than a threat to the people who live alongside it.",
  },
  {
    number: "04",
    title: "Legal & Ethical Integrity",
    body: "We operate under full licensing from the Tanzania Wildlife Management Authority and comply with all national and international wildlife law. Our reputation is built on doing things properly — always.",
  },
];

const team = [
  {
    name: "Dr. James Mwangi",
    role: "Chief Wildlife Veterinarian",
    bio: "25 years of large mammal immobilization experience across Tanzania, Kenya, and Uganda. Certified by the Southern African Wildlife College.",
    image: "/team/vet.jpg",
  },
  {
    name: "Amina Salehe",
    role: "Head of Field Operations",
    bio: "Former TAWA senior ranger with deep expertise in conflict animal management and community-led conservation strategies.",
    image: "/team/field-ops.jpg",
  },
  {
    name: "Robert Kimaro",
    role: "Training & Education Director",
    bio: "Architect of our field training curriculum, with 18 years developing ranger capacity programs for protected area authorities across East Africa.",
    image: "/team/training.jpg",
  },
  {
    name: "Grace Mollel",
    role: "Zoo Advisory & Compliance Lead",
    bio: "Former CITES national authority officer. Brings unmatched regulatory expertise to our zoo licensing and wildlife permit advisory services.",
    image: "/team/compliance.jpg",
  },
];

const milestones = [
  { year: "1994", event: "Founded in Arusha by a team of former wildlife rangers and veterinarians committed to raising the standard of wildlife operations." },
  { year: "2001", event: "Received formal TAWA accreditation and expanded operations to include the Selous Game Reserve and Ruaha National Park." },
  { year: "2007", event: "Launched our first structured wildlife handling training program for ranger associations across three Tanzanian regions." },
  { year: "2013", event: "Completed our 500th successful large mammal relocation — including one of Tanzania's largest elephant translocations." },
  { year: "2018", event: "Established our Zoo Advisory division to support the growing demand for legally compliant, welfare-focused wildlife facilities." },
  { year: "2024", event: "Surpassed 1,200 successful wildlife operations and expanded our veterinary partnership network to 15 specialist clinics." },
];

export default function AboutPage() {
  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden bg-[#0f1a0f]">
        {/* Full bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop"
            alt="Tanzania wildlife landscape"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/50 to-[#0f1a0f]/10" />
        </div>

        {/* Subtle crosshatch texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16 pb-20 pt-40">
          {/* Eyebrow */}
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Our Story ]
          </span>

          {/* Headline — large editorial treatment */}
          <h1 className="mt-6 text-white font-light leading-[0.92] tracking-tight">
            <span className="block text-5xl md:text-7xl lg:text-[96px]">Thirty Years</span>
            <span className="block text-5xl md:text-7xl lg:text-[96px]">
              In The <span className="font-bold uppercase">Field.</span>
            </span>
          </h1>

          {/* Ruled intro line */}
          <div className="mt-12 flex items-start gap-8 max-w-2xl">
            <div className="w-px h-16 bg-[#d6852b] flex-shrink-0 mt-1" />
            <p className="text-white/60 text-lg leading-relaxed font-light">
              Tanzania Wildlife Trappers has spent three decades at the intersection
              of wild Africa and human progress — protecting both, compromising neither.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 px-6 lg:px-16 pb-8">
          <div className="flex items-center gap-3 text-white/20">
            <div className="w-6 h-6 border border-white/20 flex items-center justify-center animate-bounce">
              <ArrowRight size={10} className="rotate-90" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ─────────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-24 px-6 lg:px-16" id="mission-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left label */}
            <ScrollReveal direction="left" className="lg:col-span-3">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Our Mission ]
              </span>
              <div className="w-10 h-px bg-[#d6852b]" />
            </ScrollReveal>

            {/* Right — large pull quote style */}
            <ScrollReveal direction="right" delay={0.1} className="lg:col-span-9">
              <blockquote className="text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] tracking-tight">
                "To deliver the highest standard of professional wildlife services in East Africa —
                with <span className="font-bold uppercase">uncompromising respect</span> for animal
                welfare, legal integrity, and the communities we serve."
              </blockquote>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#1a1a1a]/10 pt-12">
                <p className="text-gray-500 text-base leading-relaxed">
                  We were founded on the conviction that wildlife operations done right require
                  more than good intentions — they require deep expertise, rigorous training,
                  and a principled approach to every engagement.
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  From emergency captures to long-term management support, we bring the same
                  standard of professionalism to every call. The animals we work with deserve
                  nothing less.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="px-8 first:pl-0 last:pr-0">
                <div className="flex flex-col py-4">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-4 text-xs font-bold tracking-[0.2em] uppercase text-[#d6852b]">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIELD IMAGE BREAK ─────────────────────────────────────── */}
      <ScrollReveal direction="none">
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0f1a0f]">
          <img
            src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=2670&auto=format&fit=crop"
            alt="Field operations in Tanzania"
            className="w-full h-full object-cover opacity-70"
          />
          {/* Amber accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d6852b]" />
          {/* Floating caption */}
          <div className="absolute bottom-8 right-6 lg:right-16">
            <span className="text-white/50 text-xs font-bold tracking-widest uppercase">
              Serengeti, Tanzania — 2023
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* ── WHAT WE STAND FOR (Values) ────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
                  [ What We Stand For ]
                </span>
                <h2 className="mt-4 text-4xl md:text-6xl font-light text-[#1a1a1a] tracking-tight leading-tight">
                  Our Core <span className="font-bold uppercase">Values.</span>
                </h2>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed md:text-right">
                These aren't principles we display on a wall. They're the decisions we make every day in the field.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]/10">
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={(i % 2) * 0.1}>
                <div className="bg-[#f9f5ef] p-10 group hover:bg-[#1a1a1a] transition-colors duration-500">
                  <div className="flex items-start gap-6">
                    <span className="text-[#d6852b]/30 text-4xl font-bold leading-none group-hover:text-[#d6852b]/50 transition-colors">
                      {v.number}
                    </span>
                    <div>
                      <h3 className="text-[#1a1a1a] group-hover:text-white text-xl font-bold uppercase tracking-wide transition-colors duration-500">
                        {v.title}
                      </h3>
                      <p className="mt-4 text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-500">
                        {v.body}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORY TIMELINE ──────────────────────────────────────── */}
      <section className="bg-[#f0ebe1] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
              [ Our Journey ]
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-light text-[#1a1a1a] tracking-tight mb-16">
              Three Decades <span className="font-bold uppercase">Distilled.</span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#d6852b]/20 hidden md:block" />

            <div className="space-y-0">
              {milestones.map((m, i) => (
                <ScrollReveal key={i} delay={0.05 * i}>
                  <div className="flex gap-8 md:gap-12 items-start py-8 border-b border-[#1a1a1a]/10 last:border-0 group">
                    {/* Year bubble */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-[104px] h-10 bg-[#1a1a1a] group-hover:bg-[#d6852b] transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-bold tracking-widest">
                          {m.year}
                        </span>
                      </div>
                    </div>

                    {/* Event */}
                    <p className="text-gray-600 group-hover:text-[#1a1a1a] text-base leading-relaxed transition-colors duration-300 pt-1.5 max-w-2xl">
                      {m.event}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
                  [ Leadership ]
                </span>
                <h2 className="mt-4 text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                  The Team <span className="font-bold uppercase">Behind The Work.</span>
                </h2>
              </div>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed md:text-right">
                Professionals who have dedicated their careers to East Africa's wildlife.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group">
                  {/* Photo */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-[#2a2a2a]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    />
                    {/* Amber border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d6852b] transition-all duration-500" />
                  </div>

                  {/* Info */}
                  <div className="pt-5 border-t-2 border-[#d6852b] mt-0">
                    <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase">
                      {member.role}
                    </span>
                    <h3 className="mt-1 text-white text-lg font-bold">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-white/40 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECOND IMAGE BREAK ────────────────────────────────────── */}
      <ScrollReveal direction="none">
        <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551009175-15bdf9dcb580?q=80&w=2671&auto=format&fit=crop"
            alt="Wildlife in Tanzania"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f1a0f]/50" />

          {/* Centered text overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              <p className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase mb-4">
                [ In Their Element ]
              </p>
              <p className="text-white text-2xl md:text-4xl font-light max-w-2xl leading-snug">
                "The wild does not ask for our presence.
                <span className="font-bold"> We earn it."</span>
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── WHY CHOOSE TWT ────────────────────────────────────────── */}
      <section className="bg-[#f9f5ef] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
              [ Why Work With Us ]
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight mb-16">
              What Sets Us <span className="font-bold uppercase">Apart.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#1a1a1a]/10">
            {[
              {
                heading: "Certified Expertise",
                body: "Every member of our field team holds current certification from recognised wildlife management institutions. Our veterinary staff are licensed by the Tanzania Veterinary Council and maintain ongoing professional development.",
              },
              {
                heading: "Field-Proven Methods",
                body: "We don't apply textbook approaches in situations that require field intelligence. Our protocols are developed from 30 years of real operational experience — refined with every mission.",
              },
              {
                heading: "End-to-End Accountability",
                body: "From the first call to the final outcome report, we take responsibility for the entire process. No handoffs to unknown sub-contractors, no gaps in care, no loose ends.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="px-0 lg:px-10 first:pl-0 last:pr-0 py-8 lg:py-0">
                  <div className="w-8 h-px bg-[#d6852b] mb-6" />
                  <h3 className="text-[#1a1a1a] text-xl font-bold uppercase tracking-wide mb-5">
                    {item.heading}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS / ACCREDITATION ──────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <span className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase flex-shrink-0">
                Accredited & Licensed By
              </span>
              <div className="flex-1 h-px bg-white/10 hidden md:block" />
              <div className="flex flex-wrap items-center gap-8 justify-center md:justify-end">
                {[
                  "TAWA — Tanzania Wildlife Management Authority",
                  "CITES Compliant Operator",
                  "Tanzania Veterinary Council",
                  "WAZA Affiliated",
                ].map((partner, i) => (
                  <span
                    key={i}
                    className="text-white/40 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors cursor-default"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#d6852b] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8">
                <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                  [ Work With Us ]
                </span>
                <h2 className="mt-4 text-4xl md:text-6xl font-light text-white leading-tight tracking-tight">
                  Ready To Talk About{" "}
                  <span className="font-bold uppercase">Your Needs?</span>
                </h2>
                <p className="mt-6 text-white/70 text-base leading-relaxed max-w-xl">
                  Whether you're facing an urgent situation in the field or planning a
                  long-term wildlife management strategy, our team is ready to help.
                  Every engagement starts with a conversation.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-4">
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
                  View Our Services
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}