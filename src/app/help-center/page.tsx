// app/help/page.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle,
  BookOpen,
  Shield,
  Zap,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

/* ── TYPES ─────────────────────────────────────────────────────── */
type Category = {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string; // amber accent variant
};

type Article = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  tags: string[];
  helpful?: boolean;
};

/* ── DATA ───────────────────────────────────────────────────────── */
const categories: Category[] = [
  {
    id: "getting-started",
    icon: Zap,
    label: "Getting Started",
    description: "First time working with TWT? Start here.",
    color: "border-[#d6852b]",
  },
  {
    id: "services",
    icon: Shield,
    label: "Services & Operations",
    description: "How our field services work in practice.",
    color: "border-[#d6852b]",
  },
  {
    id: "emergency",
    icon: AlertTriangle,
    label: "Emergency Response",
    description: "What to do in an active wildlife situation.",
    color: "border-red-500",
  },
  {
    id: "legal",
    icon: FileText,
    label: "Licensing & Compliance",
    description: "Permits, TAWA, CITES, and regulatory questions.",
    color: "border-[#d6852b]",
  },
  {
    id: "training",
    icon: Users,
    label: "Training Programs",
    description: "Courses, certifications, and booking training.",
    color: "border-[#d6852b]",
  },
  {
    id: "billing",
    icon: BookOpen,
    label: "Quotes & Billing",
    description: "Pricing, invoicing, and payment questions.",
    color: "border-[#d6852b]",
  },
];

const articles: Article[] = [
  /* GETTING STARTED */
  {
    id: "gs-1",
    categoryId: "getting-started",
    question: "How do I request a service from Tanzania Wildlife Trappers?",
    answer:
      "The fastest way to engage TWT is through our Schedule & Request page, where you can submit a detailed service or consultation request directly. A member of our team reviews every submission personally and responds within one business day. For urgent or emergency situations, please call our 24/7 emergency line at +255 750 151 020 — do not wait for a form response.",
    tags: ["request", "booking", "first time"],
  },
  {
    id: "gs-2",
    categoryId: "getting-started",
    question: "What areas of Tanzania do you operate in?",
    answer:
      "Tanzania Wildlife Trappers operates across all regions of Tanzania, including the Selous/Nyerere ecosystem, Serengeti, Ruaha, Tarangire, Ngorongoro, and the coastal zones. We are headquartered in Arusha with an operational presence in Dar es Salaam. We also undertake engagements in other East African countries where the situation requires our specific expertise — contact us to discuss cross-border work.",
    tags: ["location", "coverage", "regions"],
  },
  {
    id: "gs-3",
    categoryId: "getting-started",
    question: "How quickly can you respond to a new request?",
    answer:
      "For non-emergency consultation requests, we aim to respond within one business day. For urgent situations requiring field deployment, our response time depends on proximity and team availability — typically 2–12 hours for locations within reach of Arusha or Dar es Salaam. For active emergencies where life is at risk (human or animal), call our emergency line immediately for the fastest possible response.",
    tags: ["response time", "speed", "urgency"],
  },
  {
    id: "gs-4",
    categoryId: "getting-started",
    question: "Do you work with private individuals as well as organisations?",
    answer:
      "Yes. We work with private landowners, individual farmers, community members, conservation organisations, government bodies, and private companies. If you have a wildlife situation on your property or need expert guidance, we are available to help regardless of the scale of the operation.",
    tags: ["individuals", "private", "who can use"],
  },
  {
    id: "gs-5",
    categoryId: "getting-started",
    question: "What information should I have ready before contacting TWT?",
    answer:
      "Having the following information available will help us respond more effectively: your GPS coordinates or precise location description; the species involved (if known); a description of the situation and how long it has been occurring; an indication of urgency; your name and best contact number. If there is any immediate danger to people, lead with that when you call.",
    tags: ["preparation", "information", "contact"],
  },

  /* SERVICES */
  {
    id: "sv-1",
    categoryId: "services",
    question: "What is chemical immobilisation and when is it used?",
    answer:
      "Chemical immobilisation (CI) is the use of pharmaceutical agents — administered by dart or injection — to render a wild animal temporarily sedated or anaesthetised for safe handling. It is used when an animal cannot be safely captured by physical means alone, when the animal needs veterinary treatment in the field, or when the risk of injury to people or the animal is otherwise too high. All CI at TWT is performed by our certified wildlife veterinarians under TAWA permit. It is never attempted by field staff without veterinary oversight.",
    tags: ["darting", "immobilisation", "veterinary"],
  },
  {
    id: "sv-2",
    categoryId: "services",
    question: "What happens to an animal after it is captured?",
    answer:
      "Post-capture outcomes depend on the nature of the operation. Options include: release on-site once any immediate threat is resolved; translocation to more suitable habitat; transfer to a veterinary facility for treatment and rehabilitation; or, in the case of research operations, temporary holding before monitored release. We discuss the intended outcome with the client before any operation and ensure all actions comply with TAWA requirements.",
    tags: ["after capture", "relocation", "rehabilitation"],
  },
  {
    id: "sv-3",
    categoryId: "services",
    question: "Do you offer ongoing wildlife management contracts?",
    answer:
      "Yes. We work with game reserves, conservancies, and protected area managers on retainer and contract arrangements for ongoing wildlife management support. This can include periodic population surveys, seasonal conflict management, routine health monitoring, and on-call field response. Contact us to discuss a tailored arrangement for your property.",
    tags: ["contract", "ongoing", "retainer", "management"],
  },
  {
    id: "sv-4",
    categoryId: "services",
    question: "Can you help with non-native or exotic species on private property?",
    answer:
      "Yes, within the bounds of Tanzanian law. Handling non-native species may require additional TAWA authorisation depending on the species and the nature of the situation. Contact us with the specifics and we will advise on the regulatory pathway and whether we are the right service for your needs.",
    tags: ["exotic", "non-native", "private property"],
  },
  {
    id: "sv-5",
    categoryId: "services",
    question: "How do you ensure the welfare of animals during operations?",
    answer:
      "Animal welfare is central to every TWT operation. We follow the five domains welfare framework: nutrition, environment, health, behaviour, and mental state. In practice this means: using minimum-necessary intervention, administering drugs at precise veterinary-calculated doses, monitoring vitals throughout all procedures, actively managing hyperthermia and stress during immobilisation, and ensuring proper recovery before the team leaves. All personnel receive welfare training as part of their onboarding and ongoing development.",
    tags: ["welfare", "animal care", "ethics"],
  },

  /* EMERGENCY */
  {
    id: "em-1",
    categoryId: "emergency",
    question: "There is a dangerous wild animal near people right now — what do I do?",
    answer:
      "Call our emergency line immediately: +255 750 151 020. While waiting: keep all people and domestic animals away from the wild animal — maintain at least 50 metres where possible. Do not attempt to chase, corner, or touch the animal. Do not throw objects. Keep children indoors. If the animal is inside a building, close doors to limit its movement. Our team will give you real-time guidance on the phone while deploying.",
    tags: ["emergency", "dangerous", "immediate danger"],
  },
  {
    id: "em-2",
    categoryId: "emergency",
    question: "I found an injured wild animal. What should I do?",
    answer:
      "Do not touch, move, or attempt to treat the animal yourself. Keep all people and pets well back. Call our emergency line or submit a rescue request online. If the animal is on a road, make the area safe from further vehicle strikes — use hazard lights and stand well clear. Our team will advise you by phone on what to do while they respond. The single most important thing you can do is call us quickly and keep the perimeter clear.",
    tags: ["injured", "rescue", "found animal"],
  },
  {
    id: "em-3",
    categoryId: "emergency",
    question: "A snake has entered my home. What should I do?",
    answer:
      "Remain calm. Do not attempt to handle, strike, or kill the snake — this is when most bites occur. Move everyone (people and pets) out of the room and close the door. If the snake is in an open area, keep it in sight from a safe distance and call us. Note the snake's location, colour, and any distinctive markings if you can do so safely — this helps our team prepare the right equipment. Call our emergency line for a rapid response.",
    tags: ["snake", "venomous", "home", "emergency"],
  },
  {
    id: "em-4",
    categoryId: "emergency",
    question: "Is your emergency line really available 24 hours a day?",
    answer:
      "Yes. Our emergency line — +255 750 151 020 — is staffed around the clock, every day of the year including public holidays. Wildlife situations do not follow office hours, and neither do we. If you call and the line is temporarily engaged, stay on — you will be connected or called back within minutes.",
    tags: ["24/7", "hours", "availability"],
  },

  /* LEGAL */
  {
    id: "lc-1",
    categoryId: "legal",
    question: "Do I need a permit to relocate a problem animal on my farm?",
    answer:
      "In most cases, yes. The Tanzania Wildlife Management Authority (TAWA) regulates the capture, relocation, and handling of wild animals. Carrying out these activities without a valid permit is a criminal offence under the Wildlife Conservation Act. When TWT conducts operations, we handle all required TAWA permits on behalf of the operation. If you are planning to manage wildlife yourself, contact TAWA directly for guidance on what is permitted.",
    tags: ["permit", "TAWA", "legal", "relocation"],
  },
  {
    id: "lc-2",
    categoryId: "legal",
    question: "What is CITES and why does it matter for my wildlife facility?",
    answer:
      "CITES (the Convention on International Trade in Endangered Species) is an international treaty that controls the trade — including transfer and gifting — of listed species between countries. If your facility holds, imports, exports, or acquires species listed on CITES Appendix I or II, you must obtain CITES permits in addition to domestic TAWA licences. Our Zoo Advisory & Compliance team specialises in navigating these requirements and can manage the full permit process on your behalf.",
    tags: ["CITES", "international", "trade", "zoo"],
  },
  {
    id: "lc-3",
    categoryId: "legal",
    question: "How long does it take to obtain a zoo licence in Tanzania?",
    answer:
      "Processing times for new TAWA facility licences typically range from 3 to 6 months for well-prepared applications. Incomplete or incorrectly prepared applications can take significantly longer or be rejected. TWT's compliance team prepares applications to the standard TAWA expects, minimising delays. We also advise on pre-application site improvements to ensure your facility meets standards before submission.",
    tags: ["zoo licence", "TAWA", "timeline", "application"],
  },
  {
    id: "lc-4",
    categoryId: "legal",
    question: "Can TWT act as our compliance representative with TAWA?",
    answer:
      "Yes. We regularly act as the compliance representative for clients in their dealings with TAWA, including attending site inspections, submitting documentation, and responding to regulatory queries on the client's behalf. This arrangement requires a formal engagement letter. Contact our Advisory & Compliance team to discuss your requirements.",
    tags: ["representative", "TAWA", "compliance", "advisor"],
  },

  /* TRAINING */
  {
    id: "tr-1",
    categoryId: "training",
    question: "Who are your training programs designed for?",
    answer:
      "Our training programs are designed for wildlife rangers, game scouts, veterinary technicians, conservation field staff, anti-poaching unit personnel, safari guides, and any professional who works in proximity to wild animals. Programs are customised to the participant's role, species exposure, and operational environment. We do not offer general public wildlife interaction courses — all programs are professional-grade.",
    tags: ["who", "audience", "rangers", "professional"],
  },
  {
    id: "tr-2",
    categoryId: "training",
    question: "Can training be delivered at our location?",
    answer:
      "Yes. The majority of our training is delivered on-site at the client's facility or field station. This ensures that training is contextually relevant — participants learn in the environment they actually work in. Travel, accommodation, and logistics costs are factored into the program quote. We also have training facilities in Arusha for organisations that prefer to bring staff to us.",
    tags: ["location", "on-site", "field training"],
  },
  {
    id: "tr-3",
    categoryId: "training",
    question: "Do participants receive a certificate?",
    answer:
      "Yes. Participants who meet the assessment standard at the end of a TWT training program receive a Tanzania Wildlife Trappers Certificate of Completion, specifying the modules covered and competencies demonstrated. For programs involving chemical immobilisation awareness, participants also receive a formal record of training that can support TAWA permit applications. We do not issue certificates to participants who do not meet the assessment standard — the certification is meaningful.",
    tags: ["certificate", "qualification", "assessment"],
  },
  {
    id: "tr-4",
    categoryId: "training",
    question: "How far in advance should we book a training program?",
    answer:
      "We recommend booking at least 6–8 weeks in advance to allow sufficient time for needs assessment, curriculum customisation, and logistics planning. For larger programs involving multiple modules or significant travel, 10–12 weeks is preferred. We do occasionally accommodate shorter lead times — contact us to check availability.",
    tags: ["booking", "advance", "schedule", "planning"],
  },

  /* BILLING */
  {
    id: "bi-1",
    categoryId: "billing",
    question: "How are your services priced?",
    answer:
      "TWT services are priced on a per-engagement basis, reflecting the complexity, duration, species involved, location, and equipment required. We do not publish fixed price lists because no two field situations are identical. Following an initial consultation, we provide a detailed written quote covering all costs — there are no hidden fees. For ongoing management contracts, we agree a monthly retainer covering defined scope.",
    tags: ["pricing", "cost", "quote"],
  },
  {
    id: "bi-2",
    categoryId: "billing",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer (TZS and USD accounts available), mobile money (M-Pesa), and cheque from registered organisations. For international clients, we accept SWIFT transfers. Payment terms are stated in the engagement agreement — typically 50% deposit before mobilisation and 50% on completion for field operations. Training programs are billed in full before the program commences.",
    tags: ["payment", "methods", "mobile money", "bank transfer"],
  },
  {
    id: "bi-3",
    categoryId: "billing",
    question: "Do you provide invoices for insurance or government claims?",
    answer:
      "Yes. We provide detailed, itemised invoices and formal field operation reports that can support insurance claims, government compensation scheme applications, and TAWA documentation requirements. Our reports include species identification, operation timeline, methods used, and outcome. Let us know at the time of engagement that documentation for a claim is required so we can ensure the report is structured appropriately.",
    tags: ["invoice", "insurance", "documentation", "report"],
  },
  {
    id: "bi-4",
    categoryId: "billing",
    question: "What happens if an operation takes longer than expected?",
    answer:
      "Our quotes include realistic time estimates based on the information available at the time of scoping. If an operation significantly exceeds the estimated duration due to factors outside our control (animal behaviour, terrain, weather), we will discuss any cost implications with you before proceeding. We do not issue surprise invoices — any scope changes are agreed with the client in writing before additional costs are incurred.",
    tags: ["overtime", "cost overrun", "scope", "billing"],
  },
];

/* ── POPULAR SEARCHES ───────────────────────────────────────────── */
const POPULAR = [
  "emergency response",
  "TAWA permit",
  "elephant crop raiding",
  "chemical immobilisation",
  "zoo licence",
  "training certificate",
];

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean | null>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  /* Filter articles by search query and/or category */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return articles.filter((a) => {
      const matchesCat = !activeCategory || a.categoryId === activeCategory;
      const matchesQuery =
        !q ||
        a.question.toLowerCase().includes(q) ||
        a.answer.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q));
      return matchesCat && matchesQuery;
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map: Record<string, Article[]> = {};
    filtered.forEach((a) => {
      if (!map[a.categoryId]) map[a.categoryId] = [];
      map[a.categoryId].push(a);
    });
    return map;
  }, [filtered]);

  const categoriesToShow = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories.filter((c) => grouped[c.id]?.length > 0);

  const totalResults = filtered.length;

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO + SEARCH ───────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-20 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Help Center ]
          </span>
          <h1 className="mt-5 text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
            How Can We <span className="font-bold uppercase">Help?</span>
          </h1>
          <p className="mt-5 text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            Find answers to common questions about our services, operations,
            licensing, and training — or reach our team directly.
          </p>

          {/* Search bar */}
          <div className="mt-10 relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-5 text-[#d6852b] flex-shrink-0 pointer-events-none"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder="Search for answers…"
                className="w-full bg-white text-[#1a1a1a] placeholder-gray-400 text-sm pl-12 pr-12 py-4 border-b-2 border-[#d6852b] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 text-gray-400 hover:text-[#1a1a1a] transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Popular searches */}
            {!query && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                  Popular:
                </span>
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setQuery(p); setActiveCategory(null); }}
                    className="text-white/50 text-[11px] font-medium hover:text-[#d6852b] transition-colors border border-white/10 hover:border-[#d6852b] px-3 py-1 capitalize"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Result count when searching */}
            {query && (
              <p className="mt-3 text-white/40 text-xs">
                {totalResults === 0
                  ? "No results found — try different keywords or browse categories below."
                  : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ───────────────────────────────────────── */}
      {!query && (
        <section className="px-6 lg:px-16 py-14">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest uppercase">
                  Browse by Category
                </span>
                <div className="flex-1 h-px bg-[#1a1a1a]/10" />
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-[#d6852b] text-xs font-bold uppercase tracking-widest hover:text-[#1a1a1a] transition-colors flex items-center gap-1"
                  >
                    <X size={11} /> Clear Filter
                  </button>
                )}
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => {
                const count = articles.filter((a) => a.categoryId === cat.id).length;
                const isActive = activeCategory === cat.id;
                return (
                  <ScrollReveal key={cat.id} delay={i * 0.05}>
                    <button
                      onClick={() =>
                        setActiveCategory(isActive ? null : cat.id)
                      }
                      className={`group w-full text-left p-5 border-t-2 transition-all duration-300 flex flex-col gap-3 ${
                        isActive
                          ? `${cat.color} bg-[#1a1a1a]`
                          : `border-[#1a1a1a]/10 bg-white hover:border-[#d6852b] hover:bg-[#1a1a1a]`
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <cat.icon
                          size={18}
                          className={`transition-colors ${
                            isActive
                              ? "text-[#d6852b]"
                              : "text-[#1a1a1a]/40 group-hover:text-[#d6852b]"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-bold tracking-widest transition-colors ${
                            isActive ? "text-[#d6852b]" : "text-[#1a1a1a]/20 group-hover:text-[#d6852b]"
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold uppercase tracking-wide transition-colors leading-snug ${
                            isActive ? "text-white" : "text-[#1a1a1a] group-hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </p>
                        <p
                          className={`text-[10px] leading-snug mt-1 transition-colors ${
                            isActive ? "text-white/40" : "text-gray-400 group-hover:text-white/40"
                          }`}
                        >
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLES ────────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Article list */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={query + activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {totalResults === 0 ? (
                  <NoResults query={query} onClear={() => setQuery("")} />
                ) : (
                  categoriesToShow.map((cat) => {
                    const catArticles = grouped[cat.id] ?? [];
                    if (catArticles.length === 0) return null;
                    return (
                      <div key={cat.id} className="mb-12">
                        {/* Category heading */}
                        {!activeCategory && (
                          <div className="flex items-center gap-3 mb-5">
                            <cat.icon size={15} className="text-[#d6852b]" />
                            <h2 className="text-[#1a1a1a] text-sm font-bold uppercase tracking-widest">
                              {cat.label}
                            </h2>
                            <div className="flex-1 h-px bg-[#1a1a1a]/8" />
                            <span className="text-[#1a1a1a]/20 text-xs font-bold">
                              {catArticles.length}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col gap-3">
                          {catArticles.map((article) => (
                            <ArticleAccordion
                              key={article.id}
                              article={article}
                              isOpen={openArticle === article.id}
                              onToggle={() =>
                                setOpenArticle(
                                  openArticle === article.id ? null : article.id
                                )
                              }
                              helpfulState={helpfulMap[article.id]}
                              onHelpful={(v) =>
                                setHelpfulMap((p) => ({ ...p, [article.id]: v }))
                              }
                              query={query}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">

            {/* Still need help */}
            <ScrollReveal direction="right">
              <div className="bg-[#1a1a1a] p-7">
                <div className="w-8 h-px bg-[#d6852b] mb-5" />
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                  Still Need Help?
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: Phone,
                      label: "Emergency Line",
                      value: "+255 750 151 020",
                      sub: "Available 24/7",
                      href: "tel:+255750151020",
                    },
                    {
                      icon: Mail,
                      label: "General Enquiries",
                      value: "office@twt.co.tz",
                      sub: "Response within 1 business day",
                      href: "mailto:office@twt.co.tz",
                    },
                    {
                      icon: MessageCircle,
                      label: "WhatsApp",
                      value: "Chat with our team",
                      sub: "Typically replies within 1 hour",
                      href: "https://wa.me/255750151020",
                    },
                  ].map((c, i) => (
                    <a
                      key={i}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 py-3 border-b border-white/8 last:border-0"
                    >
                      <div className="w-8 h-8 bg-[#d6852b]/10 flex items-center justify-center flex-shrink-0">
                        <c.icon size={14} className="text-[#d6852b]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                          {c.label}
                        </p>
                        <p className="text-white text-sm font-medium group-hover:text-[#d6852b] transition-colors truncate">
                          {c.value}
                        </p>
                        <p className="text-white/30 text-[10px] mt-0.5">{c.sub}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Schedule consultation CTA */}
            <ScrollReveal direction="right" delay={0.08}>
              <div className="border-2 border-[#d6852b] p-7">
                <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-wide mb-3 leading-snug">
                  Need a Full Consultation?
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-6">
                  Sometimes a question is better answered in a conversation.
                  Schedule a consultation with one of our specialists.
                </p>
                <Link
                  href="/schedule-consultation"
                  className="flex items-center justify-between bg-[#d6852b] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                >
                  Schedule Now <ArrowRight size={12} />
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick links */}
            <ScrollReveal direction="right" delay={0.12}>
              <div className="bg-[#f0ebe1] p-7">
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  Useful Pages
                </p>
                <div className="flex flex-col gap-0">
                  {[
                    { label: "Our Services", href: "/our-services" },
                    { label: "Field Projects", href: "/projects" },
                    { label: "Careers", href: "/careers" },
                    { label: "About Us", href: "/about-us" },
                    { label: "Contact", href: "/contact-us" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group flex items-center justify-between py-3 border-b border-[#1a1a1a]/8 last:border-0 text-sm text-[#1a1a1a] hover:text-[#d6852b] transition-colors"
                    >
                      {l.label}
                      <ArrowRight
                        size={12}
                        className="text-[#d6852b] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Couldn't Find What You Need? ]
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-light leading-tight">
                Ask Us <span className="font-bold uppercase">Directly.</span>
              </h2>
              <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-lg">
                Our team reads every message personally. If your question isn't
                answered here, send it through and we'll respond within one
                business day.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link
                href="/contact-us"
                className="bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d6852b] transition-colors text-center"
              >
                Contact Us
              </Link>
              <Link
                href="/schedule-consultation"
                className="border border-white/20 text-white/70 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors text-center"
              >
                Schedule a Call
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}

/* ── ARTICLE ACCORDION ──────────────────────────────────────────── */
function ArticleAccordion({
  article,
  isOpen,
  onToggle,
  helpfulState,
  onHelpful,
  query,
}: {
  article: Article;
  isOpen: boolean;
  onToggle: () => void;
  helpfulState: boolean | null | undefined;
  onHelpful: (v: boolean) => void;
  query: string;
}) {
  /* Highlight matching text in question */
  const highlightText = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#d6852b]/20 text-[#1a1a1a] rounded-none">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`border-l-2 transition-colors duration-300 ${
        isOpen ? "border-[#d6852b]" : "border-[#1a1a1a]/10"
      } bg-white`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
      >
        <span
          className={`text-sm md:text-base font-light leading-snug transition-colors duration-300 ${
            isOpen ? "text-[#d6852b]" : "text-[#1a1a1a] group-hover:text-[#d6852b]"
          }`}
        >
          {highlightText(article.question, query)}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 mt-0.5 text-[#d6852b] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="border-t border-[#1a1a1a]/8 pt-4">
                <p className="text-gray-600 text-sm leading-[1.85] font-light">
                  {article.answer}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold tracking-widest uppercase text-[#1a1a1a]/30 border border-[#1a1a1a]/10 px-2 py-0.5 capitalize"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Helpful rating */}
                <div className="mt-5 pt-4 border-t border-[#1a1a1a]/8 flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-widest">
                    Was this helpful?
                  </span>

                  {helpfulState === undefined || helpfulState === null ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onHelpful(true)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#d6852b] transition-colors border border-[#1a1a1a]/10 hover:border-[#d6852b] px-3 py-1.5"
                      >
                        <CheckCircle size={11} /> Yes
                      </button>
                      <button
                        onClick={() => onHelpful(false)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-red-500 transition-colors border border-[#1a1a1a]/10 hover:border-red-400 px-3 py-1.5"
                      >
                        <X size={11} /> No
                      </button>
                    </div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                        helpfulState ? "text-[#d6852b]" : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={11} />
                      {helpfulState ? "Thanks for the feedback." : "We'll work on improving this."}
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── NO RESULTS ─────────────────────────────────────────────────── */
function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-16 flex flex-col items-start">
      <div className="w-12 h-12 border-2 border-[#d6852b]/30 flex items-center justify-center mb-6">
        <Search size={20} className="text-[#d6852b]/50" />
      </div>
      <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
        No Results
      </p>
      <h3 className="text-[#1a1a1a] text-2xl font-light mb-3">
        Nothing found for{" "}
        <span className="font-bold">"{query}"</span>
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-6">
        Try different keywords, or browse the categories above. If you can't find
        what you need, our team is happy to help directly.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onClear}
          className="text-xs font-bold uppercase tracking-widest text-[#d6852b] border border-[#d6852b] px-5 py-2.5 hover:bg-[#d6852b] hover:text-white transition-colors"
        >
          Clear Search
        </button>
        <Link
          href="/contact-us"
          className="text-xs font-bold uppercase tracking-widest text-white bg-[#1a1a1a] px-5 py-2.5 hover:bg-[#d6852b] transition-colors flex items-center gap-2"
        >
          Ask Us Directly <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}