// app/schedule/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  User,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

/* ── TYPES ─────────────────────────────────────────────────────── */
type RequestType = "consultation" | "service";
type UrgencyLevel = "emergency" | "urgent" | "planned" | "advisory";

type FormData = {
  /* Step 1 – Request type */
  requestType: RequestType | "";
  serviceCategory: string;
  urgency: UrgencyLevel | "";

  /* Step 2 – Your details */
  firstName: string;
  lastName: string;
  organisation: string;
  role: string;
  email: string;
  phone: string;
  country: string;

  /* Step 3 – Situation */
  location: string;
  region: string;
  species: string;
  situationDetail: string;
  previousAttempts: string;

  /* Step 4 – Scheduling */
  preferredDate: string;
  preferredTime: string;
  alternateDate: string;
  meetingFormat: string;
  additionalNotes: string;
};

const EMPTY: FormData = {
  requestType: "",
  serviceCategory: "",
  urgency: "",
  firstName: "",
  lastName: "",
  organisation: "",
  role: "",
  email: "",
  phone: "",
  country: "",
  location: "",
  region: "",
  species: "",
  situationDetail: "",
  previousAttempts: "",
  preferredDate: "",
  preferredTime: "",
  alternateDate: "",
  meetingFormat: "",
  additionalNotes: "",
};

/* ── CONSTANTS ──────────────────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  "Safe Capture of Wild Animals",
  "Wild Animal Rescue",
  "Wildlife Treatment & Care",
  "Problem Animal Control for Farms & Communities",
  "Wildlife Management Support",
  "Zoo Licensing & Permit Advisory",
  "Wildlife Handling & Staff Training",
  "Wildlife Adaptation & Human Interaction Training",
  "Expert Zoo Setup & Wildlife Advisory",
  "General Consultation — Not Sure Yet",
];

const REGIONS = [
  "Northern Tanzania (Arusha, Kilimanjaro, Manyara)",
  "Southern Tanzania (Lindi, Mtwara, Ruvuma)",
  "Central Tanzania (Dodoma, Singida)",
  "Western Tanzania (Tabora, Kigoma, Katavi)",
  "Southern Highlands (Iringa, Njombe, Mbeya, Rukwa)",
  "Eastern Tanzania (Dar es Salaam, Morogoro, Pwani)",
  "Lake Zone (Mwanza, Geita, Shinyanga, Simiyu)",
  "Zanzibar / Pemba",
  "Outside Tanzania — East Africa",
  "Outside East Africa",
];

const TIME_SLOTS = [
  "08:00 – 09:00",
  "09:00 – 10:00",
  "10:00 – 11:00",
  "11:00 – 12:00",
  "14:00 – 15:00",
  "15:00 – 16:00",
  "16:00 – 17:00",
  "Flexible — Any Time",
];

const MEETING_FORMATS = [
  "Phone Call",
  "Video Call (Zoom / Google Meet)",
  "In-Person — Arusha Office",
  "In-Person — Dar es Salaam Office",
  "On-Site (Field Visit)",
];

const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  label: string;
  desc: string;
  color: string;
}[] = [
    {
      value: "emergency",
      label: "Emergency",
      desc: "Animal present now — immediate intervention required",
      color: "border-red-400 bg-red-900/20 text-red-300",
    },
    {
      value: "urgent",
      label: "Urgent",
      desc: "Response needed within 24–48 hours",
      color: "border-orange-400 bg-orange-900/20 text-orange-300",
    },
    {
      value: "planned",
      label: "Planned",
      desc: "Scheduled operation within the coming weeks",
      color: "border-blue-400 bg-blue-900/20 text-blue-300",
    },
    {
      value: "advisory",
      label: "Advisory",
      desc: "Consultation or planning — no immediate time pressure",
      color: "border-green-400 bg-green-900/20 text-green-300",
    },
  ];

const STEPS = [
  { number: "01", label: "Request Type" },
  { number: "02", label: "Your Details" },
  { number: "03", label: "The Situation" },
  { number: "04", label: "Scheduling" },
];

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function SchedulePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const set =
    (field: keyof FormData) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        setForm((p) => ({ ...p, [field]: e.target.value }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
      };

  const setDirect = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  /* Per-step validation */
  const validateStep = (s: number) => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 0) {
      if (!form.requestType) e.requestType = "Please select a request type.";
      if (!form.serviceCategory) e.serviceCategory = "Please select a service category.";
      if (!form.urgency) e.urgency = "Please indicate urgency.";
    }
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "First name required.";
      if (!form.lastName.trim()) e.lastName = "Last name required.";
      if (!form.email.trim()) e.email = "Email address required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email address.";
      if (!form.phone.trim()) e.phone = "Phone number required.";
    }
    if (s === 2) {
      if (!form.region) e.region = "Please select your region.";
      if (!form.situationDetail.trim())
        e.situationDetail = "Please describe your situation.";
    }
    if (s === 3) {
      if (!form.preferredDate) e.preferredDate = "Please select a preferred date.";
      if (!form.preferredTime) e.preferredTime = "Please select a preferred time.";
      if (!form.meetingFormat) e.meetingFormat = "Please select a meeting format.";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setDirection(1);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    const e = validateStep(3);

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/schedule-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit request. Please try again.");
        return;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEmergency = form.urgency === "emergency";

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-16 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Schedule & Requests ]
          </span>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
                Request A{" "}
                <span className="font-bold uppercase">Consultation</span>
                <br />
                Or{" "}
                <span className="font-bold uppercase">Service.</span>
              </h1>
              <p className="mt-6 text-white/50 text-base leading-relaxed max-w-xl">
                Complete this form and a member of our team will review your request
                personally and respond within one business day. For emergencies, call
                our 24/7 line directly.
              </p>
            </div>

            {/* Emergency callout */}
            <div className="lg:col-span-4">
              <div className="border border-red-500/30 bg-red-950/30 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-xs font-bold tracking-widest uppercase mb-2">
                      Wildlife Emergency?
                    </p>
                    <p className="text-white/50 text-xs leading-relaxed mb-3">
                      Don't wait for a form. Call our 24/7 emergency line immediately.
                    </p>
                    <a
                      href="tel:+255750151020"
                      className="text-white text-lg font-bold hover:text-[#d6852b] transition-colors block"
                    >
                      +255 750 151 020
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRESS STEPPER ────────────────────────────────────── */}
      {!submitted && (
        <section className="bg-[#1a1a1a] px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-stretch overflow-x-auto scrollbar-none">
              {STEPS.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-6 py-5 flex-shrink-0 border-b-2 transition-all duration-300 ${isActive
                        ? "border-[#d6852b]"
                        : isDone
                          ? "border-[#d6852b]/40"
                          : "border-transparent"
                      }`}
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isDone
                          ? "bg-[#d6852b]"
                          : isActive
                            ? "border-2 border-[#d6852b]"
                            : "border border-white/20"
                        }`}
                    >
                      {isDone ? (
                        <CheckCircle size={13} className="text-white" />
                      ) : (
                        <span
                          className={`text-[10px] font-bold ${isActive ? "text-[#d6852b]" : "text-white/30"
                            }`}
                        >
                          {s.number}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive
                          ? "text-white"
                          : isDone
                            ? "text-white/50"
                            : "text-white/20"
                        }`}
                    >
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <ArrowRight size={12} className="text-white/10 ml-3 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FORM AREA ───────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── FORM PANEL ────────────────────────────────────── */}
          <div className="lg:col-span-8">

            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessState form={form} />
              ) : (
                <motion.div
                  key={step}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="bg-white border-t-2 border-[#d6852b]">
                    <div className="px-8 md:px-12 py-10">

                      {step === 0 && (
                        <Step1
                          form={form}
                          errors={errors}
                          setDirect={setDirect}
                          set={set}
                        />
                      )}
                      {step === 1 && (
                        <Step2 form={form} errors={errors} set={set} />
                      )}
                      {step === 2 && (
                        <Step3 form={form} errors={errors} set={set} />
                      )}
                      {step === 3 && (
                        <Step4 form={form} errors={errors} set={set} setDirect={setDirect} />
                      )}

                      {/* Navigation */}
                      <div className="mt-10 pt-8 border-t border-[#1a1a1a]/8 flex items-center justify-between gap-4">
                        {step > 0 ? (
                          <button
                            onClick={back}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
                          >
                            <ArrowLeft size={13} /> Back
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 3 ? (
                          <button
                            onClick={next}
                            className="flex items-center gap-3 bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                          >
                            Continue <ArrowRight size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={submit}
                            disabled={loading}
                            className="flex items-center gap-3 bg-[#d6852b] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <>
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting…
                              </>
                            ) : (
                              <>
                                Submit Request <ArrowRight size={13} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── SIDEBAR ───────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* What to expect */}
            <ScrollReveal direction="right">
              <div className="bg-[#1a1a1a] p-7">
                <div className="w-8 h-px bg-[#d6852b] mb-5" />
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                  What Happens Next
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    { n: "01", t: "We Review Your Request", b: "A senior team member reads every submission personally — not a bot." },
                    { n: "02", t: "We Respond Within 24 Hours", b: "You'll receive a confirmation and initial response within one business day." },
                    { n: "03", t: "We Agree On An Approach", b: "We'll confirm the scope, timeline, and next steps together." },
                  ].map((s) => (
                    <div key={s.n} className="flex gap-4 items-start">
                      <span className="text-[#d6852b] text-xs font-bold flex-shrink-0 mt-0.5">
                        {s.n}
                      </span>
                      <div>
                        <p className="text-white text-sm font-bold">{s.t}</p>
                        <p className="text-white/40 text-xs leading-relaxed mt-1">{s.b}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact details */}
            <ScrollReveal direction="right" delay={0.08}>
              <div className="bg-[#f0ebe1] p-7">
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                  Prefer Direct Contact?
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Phone, label: "Emergency Line", value: "+255 750 151 020", href: "tel:+255750151020" },
                    { icon: Mail, label: "General Enquiries", value: "office@twt.co.tz", href: "mailto:office@twt.co.tz" },
                    { icon: MapPin, label: "Field Base", value: "Arusha, Tanzania", href: null },
                    { icon: Clock, label: "Office Hours", value: "Mon–Fri 08:00–17:00", href: null },
                  ].map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <c.icon size={13} className="text-[#d6852b] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#1a1a1a]/40 text-[10px] font-bold tracking-widest uppercase">
                          {c.label}
                        </p>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="text-[#1a1a1a] text-sm font-medium hover:text-[#d6852b] transition-colors"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <p className="text-[#1a1a1a] text-sm font-medium">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Summary card — shows once step > 0 */}
            {step > 0 && !submitted && (
              <ScrollReveal direction="right" delay={0.12}>
                <div className="border-2 border-[#d6852b] p-7">
                  <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    Your Request So Far
                  </p>
                  <div className="flex flex-col gap-2">
                    {form.requestType && (
                      <SummaryRow
                        label="Type"
                        value={
                          form.requestType === "consultation"
                            ? "Consultation"
                            : "Service Request"
                        }
                      />
                    )}
                    {form.serviceCategory && (
                      <SummaryRow label="Service" value={form.serviceCategory} />
                    )}
                    {form.urgency && (
                      <SummaryRow
                        label="Urgency"
                        value={
                          URGENCY_OPTIONS.find((u) => u.value === form.urgency)
                            ?.label ?? form.urgency
                        }
                      />
                    )}
                    {form.firstName && (
                      <SummaryRow
                        label="Name"
                        value={`${form.firstName} ${form.lastName}`}
                      />
                    )}
                    {form.region && (
                      <SummaryRow label="Region" value={form.region} />
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}

/* ── STEP 1: Request Type ───────────────────────────────────────── */
function Step1({
  form,
  errors,
  setDirect,
  set,
}: {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  setDirect: (f: keyof FormData, v: string) => void;
  set: (f: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div>
      <StepHeader
        step="01"
        title="What Are You Looking For?"
        desc="Tell us whether you need a consultation to discuss your situation, or if you're ready to request a specific service."
      />

      {/* Request type toggle */}
      <div className="mb-8">
        <FieldLabel label="Request Type" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            {
              value: "consultation",
              icon: MessageSquare,
              title: "Schedule a Consultation",
              desc: "Speak with one of our specialists to assess your situation and explore the right approach.",
            },
            {
              value: "service",
              icon: Building2,
              title: "Request a Service",
              desc: "You know what you need — submit a formal service request for our team to action.",
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDirect("requestType", opt.value)}
              className={`group text-left p-5 border-2 transition-all duration-300 ${form.requestType === opt.value
                  ? "border-[#d6852b] bg-[#d6852b]/5"
                  : "border-[#1a1a1a]/10 hover:border-[#d6852b]/40"
                }`}
            >
              <opt.icon
                size={18}
                className={`mb-3 transition-colors ${form.requestType === opt.value ? "text-[#d6852b]" : "text-[#1a1a1a]/30"
                  }`}
              />
              <p
                className={`text-sm font-bold uppercase tracking-wide mb-1.5 transition-colors ${form.requestType === opt.value ? "text-[#d6852b]" : "text-[#1a1a1a]"
                  }`}
              >
                {opt.title}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">{opt.desc}</p>
            </button>
          ))}
        </div>
        <FieldError msg={errors.requestType} />
      </div>

      {/* Service category */}
      <div className="mb-8">
        <FieldLabel label="Service Category" required />
        <SelectField
          value={form.serviceCategory}
          onChange={set("serviceCategory")}
          placeholder="Select a service…"
          options={SERVICE_CATEGORIES}
          error={errors.serviceCategory}
        />
      </div>

      {/* Urgency */}
      <div>
        <FieldLabel label="Urgency Level" required />
        <p className="text-gray-400 text-xs mb-3 leading-relaxed">
          This helps us prioritise your request appropriately. If in doubt, select Planned.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDirect("urgency", opt.value)}
              className={`text-left p-4 border-2 transition-all duration-200 ${form.urgency === opt.value
                  ? opt.color
                  : "border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30"
                }`}
            >
              <p className="text-sm font-bold uppercase tracking-wide mb-1">
                {opt.label}
              </p>
              <p className="text-xs leading-relaxed opacity-70">{opt.desc}</p>
            </button>
          ))}
        </div>
        <FieldError msg={errors.urgency} />
      </div>
    </div>
  );
}

/* ── STEP 2: Your Details ───────────────────────────────────────── */
function Step2({
  form,
  errors,
  set,
}: {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  set: (f: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div>
      <StepHeader
        step="02"
        title="Your Details"
        desc="We respond to every request personally. These details let us reach you and understand the context of your enquiry."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <InputField
          label="First Name"
          required
          value={form.firstName}
          onChange={set("firstName")}
          placeholder="James"
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          required
          value={form.lastName}
          onChange={set("lastName")}
          placeholder="Mollel"
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Organisation"
          value={form.organisation}
          onChange={set("organisation")}
          placeholder="Your organisation or farm"
          hint="Optional"
        />
        <InputField
          label="Your Role / Title"
          value={form.role}
          onChange={set("role")}
          placeholder="Farm Manager, Reserve Warden…"
          hint="Optional"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Email Address"
          required
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          error={errors.email}
        />
        <InputField
          label="Phone Number"
          required
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+255 700 000 000"
          error={errors.phone}
        />
      </div>

      <InputField
        label="Country"
        value={form.country}
        onChange={set("country")}
        placeholder="Tanzania"
        hint="Optional"
      />
    </div>
  );
}

/* ── STEP 3: The Situation ──────────────────────────────────────── */
function Step3({
  form,
  errors,
  set,
}: {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  set: (f: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div>
      <StepHeader
        step="03"
        title="Tell Us About The Situation"
        desc="The more context you provide here, the better we can prepare for your consultation and deploy the right expertise."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <FieldLabel label="Region / Area" required />
          <SelectField
            value={form.region}
            onChange={set("region")}
            placeholder="Select a region…"
            options={REGIONS}
            error={errors.region}
          />
        </div>
        <InputField
          label="Specific Location"
          value={form.location}
          onChange={set("location")}
          placeholder="Farm name, village, reserve…"
          hint="Optional but helpful"
        />
      </div>

      <div className="mb-6">
        <InputField
          label="Species Involved"
          value={form.species}
          onChange={set("species")}
          placeholder="e.g. Elephant, Lion, Crocodile — or 'Unknown'"
          hint="Optional"
        />
      </div>

      <div className="mb-6">
        <FieldLabel label="Describe Your Situation" required />
        <textarea
          rows={6}
          value={form.situationDetail}
          onChange={set("situationDetail")}
          placeholder="Describe the situation in as much detail as you can — what has happened, how long it has been occurring, the environment, the level of risk, and anything else our team should know before the consultation…"
          className={textareaClass(!!errors.situationDetail)}
        />
        <FieldError msg={errors.situationDetail} />
      </div>

      <div>
        <FieldLabel label="Previous Attempts to Resolve" />
        <textarea
          rows={3}
          value={form.previousAttempts}
          onChange={set("previousAttempts")}
          placeholder="Have you already tried anything — contacted authorities, installed deterrents, attempted capture? What was the result?"
          className={textareaClass(false)}
        />
        <p className="text-gray-400 text-xs mt-1.5">Optional — but useful context</p>
      </div>
    </div>
  );
}

/* ── STEP 4: Scheduling ─────────────────────────────────────────── */
function Step4({
  form,
  errors,
  set,
  setDirect,
}: {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  set: (f: keyof FormData) => (e: React.ChangeEvent<any>) => void;
  setDirect: (f: keyof FormData, v: string) => void;
}) {
  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div>
      <StepHeader
        step="04"
        title="When Works For You?"
        desc="Give us your preferred times and we will confirm availability. All consultations are by appointment."
      />

      {/* Meeting format */}
      <div className="mb-8">
        <FieldLabel label="Preferred Meeting Format" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {MEETING_FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setDirect("meetingFormat", fmt)}
              className={`text-left px-4 py-3 border-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${form.meetingFormat === fmt
                  ? "border-[#d6852b] bg-[#d6852b]/5 text-[#d6852b]"
                  : "border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#d6852b]/40 hover:text-[#1a1a1a]"
                }`}
            >
              {fmt}
            </button>
          ))}
        </div>
        <FieldError msg={errors.meetingFormat} />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <FieldLabel label="Preferred Date" required />
          <input
            type="date"
            min={minDate}
            value={form.preferredDate}
            onChange={set("preferredDate")}
            className={inputClass(!!errors.preferredDate)}
          />
          <FieldError msg={errors.preferredDate} />
        </div>
        <div>
          <FieldLabel label="Alternate Date" />
          <input
            type="date"
            min={minDate}
            value={form.alternateDate}
            onChange={set("alternateDate")}
            className={inputClass(false)}
          />
          <p className="text-gray-400 text-xs mt-1.5">Optional backup date</p>
        </div>
      </div>

      {/* Time slot */}
      <div className="mb-8">
        <FieldLabel label="Preferred Time Slot" required />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setDirect("preferredTime", slot)}
              className={`text-center px-3 py-3 border-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${form.preferredTime === slot
                  ? "border-[#d6852b] bg-[#d6852b]/5 text-[#d6852b]"
                  : "border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#d6852b]/40 hover:text-[#1a1a1a]"
                }`}
            >
              {slot}
            </button>
          ))}
        </div>
        <FieldError msg={errors.preferredTime} />
      </div>

      {/* Additional notes */}
      <div>
        <FieldLabel label="Additional Notes" />
        <textarea
          rows={4}
          value={form.additionalNotes}
          onChange={set("additionalNotes")}
          placeholder="Any other information that would help us prepare — accessibility requirements, languages spoken, documents to review beforehand, etc."
          className={textareaClass(false)}
        />
        <p className="text-gray-400 text-xs mt-1.5">Optional</p>
      </div>

      {/* Privacy note */}
      <p className="mt-6 text-gray-400 text-xs leading-relaxed border-l-2 border-[#d6852b]/30 pl-4">
        Your information is used solely to process your consultation request. We do not share
        your details with third parties. All communications are treated as confidential.
      </p>
    </div>
  );
}

/* ── SUCCESS STATE ──────────────────────────────────────────────── */
function SuccessState({ form }: { form: FormData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t-2 border-[#d6852b] px-8 md:px-12 py-14 flex flex-col items-start gap-6"
    >
      <div className="w-14 h-14 bg-[#d6852b]/10 flex items-center justify-center">
        <CheckCircle size={28} className="text-[#d6852b]" />
      </div>

      <div>
        <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
          Request Received
        </p>
        <h2 className="text-[#1a1a1a] text-3xl md:text-4xl font-light leading-tight">
          Thank You,{" "}
          <span className="font-bold uppercase">{form.firstName}.</span>
        </h2>
        <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-lg">
          Your {form.requestType === "consultation" ? "consultation request" : "service request"}{" "}
          has been submitted. A member of our team will review it personally
          and respond to{" "}
          <span className="text-[#d6852b] font-semibold">{form.email}</span>{" "}
          within one business day.
        </p>
      </div>

      {/* Summary box */}
      <div className="w-full bg-[#f0ebe1] p-6 flex flex-col gap-3">
        <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
          Submission Summary
        </p>
        {[
          { label: "Service", value: form.serviceCategory },
          {
            label: "Urgency",
            value: URGENCY_OPTIONS.find((u) => u.value === form.urgency)?.label ?? "",
          },
          { label: "Region", value: form.region },
          { label: "Preferred Date", value: form.preferredDate ? new Date(form.preferredDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "" },
          { label: "Format", value: form.meetingFormat },
        ]
          .filter((r) => r.value)
          .map((r) => (
            <SummaryRow key={r.label} label={r.label} value={r.value} />
          ))}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
        If your situation is urgent or has escalated, please call our emergency line
        directly —{" "}
        <a href="tel:+255750151020" className="text-[#d6852b] font-semibold">
          +255 750 151 020
        </a>{" "}
        — available 24 hours a day.
      </p>

      <div className="flex flex-wrap gap-3 mt-2">
        <Link
          href="/our-services"
          className="inline-flex items-center gap-2 bg-[#d6852b] text-white px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
        >
          View Our Services <ArrowRight size={12} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#1a1a1a]/20 text-[#1a1a1a] px-7 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#d6852b] hover:text-[#d6852b] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

/* ── SHARED PRIMITIVES ──────────────────────────────────────────── */

function StepHeader({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-8">
      <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
        Step {step}
      </span>
      <h2 className="mt-2 text-2xl md:text-3xl font-light text-[#1a1a1a] leading-tight">
        {title}
      </h2>
      <p className="mt-3 text-gray-500 text-sm leading-relaxed max-w-xl">{desc}</p>
      <div className="mt-6 w-10 h-px bg-[#d6852b]" />
    </div>
  );
}

function FieldLabel({
  label,
  required,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[#1a1a1a] text-xs font-bold uppercase tracking-widest">
        {label}
        {required && <span className="text-[#d6852b] ml-1">*</span>}
      </label>
      {hint && <span className="text-gray-400 text-[10px]">{hint}</span>}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-[11px] font-medium mt-1.5"
    >
      {msg}
    </motion.p>
  );
}

function InputField({
  label,
  required,
  hint,
  error,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} hint={hint} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass(!!error)}
      />
      <FieldError msg={error} />
    </div>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`${inputClass(!!error)} appearance-none cursor-pointer`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d6852b]"
        />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="text-[#1a1a1a]/40 font-bold uppercase tracking-widest w-20 flex-shrink-0">
        {label}
      </span>
      <span className="text-[#1a1a1a] font-medium leading-snug">{value}</span>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full bg-[#f9f5ef] border-b-2 px-4 py-3 text-sm text-[#1a1a1a] placeholder-gray-400",
    "focus:outline-none focus:bg-white transition-colors duration-200",
    "border-t-0 border-l-0 border-r-0",
    hasError
      ? "border-red-400 bg-red-50/30"
      : "border-[#1a1a1a]/15 focus:border-[#d6852b]",
  ].join(" ");
}

function textareaClass(hasError: boolean) {
  return [
    inputClass(hasError),
    "resize-none leading-relaxed",
  ].join(" ");
}