// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import ScrollReveal from "@/app/components/scroll-reveal";

const contactDetails = [
  {
    icon: MapPin,
    label: "Field Base",
    lines: ["Arusha, Tanzania", "East Africa"],
  },
  {
    icon: Phone,
    label: "Emergency Line",
    lines: ["+255 700 000 000", "Available 24 / 7"],
  },
  {
    icon: Mail,
    label: "General Enquiries",
    lines: ["info@tanzaniawildlifetrappers.com"],
  },
  {
    icon: Clock,
    label: "Office Hours",
    lines: ["Mon – Fri: 08:00 – 17:00", "Sat: 08:00 – 13:00"],
  },
];

const enquiryTypes = [
  "Safe Capture of Wild Animals",
  "Wild Animal Rescue",
  "Wildlife Treatment & Care",
  "Problem Animal Control",
  "Wildlife Management Support",
  "Zoo Licensing & Permit Advisory",
  "Wildlife Handling & Staff Training",
  "Wildlife Adaptation Training",
  "Zoo Setup & Wildlife Advisory",
  "Other / General Enquiry",
];

type FormState = {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  enquiryType: string;
  urgency: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  enquiryType: "",
  urgency: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Your name is required.";
    if (!form.email.trim()) next.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (!form.enquiryType) next.enquiryType = "Please select an enquiry type.";
    if (!form.message.trim()) next.message = "Please tell us a little about your situation.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-[#0f1a0f] pt-36 pb-24 px-6 lg:px-16 overflow-hidden">
        {/* texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
            [ Get In Touch ]
          </span>
          <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <h1 className="text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
              Let's Talk About
              <br />
              <span className="font-bold uppercase">Your Situation.</span>
            </h1>
            <p className="text-white/50 text-base max-w-sm leading-relaxed lg:text-right">
              Whether it's an emergency in the field or a long-term partnership —
              we respond to every message personally.
            </p>
          </div>
          {/* Divider */}
          <div className="mt-14 h-px bg-white/10" />
        </div>
      </section>

      {/* ── CONTACT DETAILS ROW ─────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {contactDetails.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.07}>
              <div className="flex flex-col gap-3 py-10 px-6 first:pl-0 last:pr-0 group">
                <item.icon size={16} className="text-[#d6852b] md:ml-4" />
                <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase md:pl-4">
                  {item.label}
                </span>
                {item.lines.map((line, j) => (
                  <span key={j} className="text-white/80 text-sm leading-snug md:pl-4">
                    {line}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT: FORM + SIDEBAR ────────────────────────── */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col gap-10">

            <ScrollReveal direction="left">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Before You Write ]
              </span>
              <div className="w-10 h-px bg-[#d6852b] mb-8" />
              <h2 className="text-3xl font-light text-[#1a1a1a] leading-tight">
                What To <span className="font-bold uppercase">Expect.</span>
              </h2>
              <p className="mt-6 text-gray-500 text-sm leading-relaxed">
                Every message is read by a member of our team — not a bot. For
                non-emergency enquiries we aim to respond within one business day.
              </p>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                If you are dealing with an active wildlife situation requiring
                immediate intervention, please call our{" "}
                <span className="text-[#d6852b] font-semibold">emergency line</span>{" "}
                directly — do not wait for a form response.
              </p>
            </ScrollReveal>

            {/* Emergency CTA */}
            <ScrollReveal direction="left" delay={0.1}>
              <div className="border-l-2 border-[#d6852b] pl-5 py-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d6852b] mb-2">
                  Emergency Line
                </p>
                <a
                  href="tel:+255700000000"
                  className="text-[#1a1a1a] text-2xl font-bold hover:text-[#d6852b] transition-colors"
                >
                  +255 700 000 000
                </a>
                <p className="text-gray-400 text-xs mt-1">Available 24 hours a day</p>
              </div>
            </ScrollReveal>

            {/* What happens next */}
            <ScrollReveal direction="left" delay={0.15}>
              <div className="space-y-5">
                {[
                  { step: "01", text: "We read your message and assess your situation." },
                  { step: "02", text: "A specialist responds personally within 24 hours." },
                  { step: "03", text: "We agree on the right approach together." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <span className="text-[#d6852b] text-xs font-bold tracking-widest flex-shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ── FORM PANEL ────────────────────────────────────────── */}
          <ScrollReveal direction="right" delay={0.05} className="lg:col-span-8">
            <div className="bg-white border border-[#1a1a1a]/8 relative overflow-hidden">
              {/* Amber top bar */}
              <div className="h-1 bg-[#d6852b] w-full" />

              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* ── SUCCESS STATE ───────────────────────────── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-start gap-6 py-12"
                    >
                      <div className="w-14 h-14 bg-[#d6852b]/10 flex items-center justify-center">
                        <CheckCircle size={28} className="text-[#d6852b]" />
                      </div>
                      <div>
                        <h3 className="text-[#1a1a1a] text-2xl font-bold uppercase tracking-wide">
                          Message Received.
                        </h3>
                        <p className="mt-3 text-gray-500 text-sm leading-relaxed max-w-md">
                          Thank you for reaching out, {form.name.split(" ")[0]}. A member of our
                          team will be in touch within one business day. If your
                          situation is urgent, please call our emergency line now.
                        </p>
                      </div>
                      <button
                        onClick={() => { setForm(EMPTY); setSubmitted(false); }}
                        className="mt-4 text-xs font-bold uppercase tracking-widest text-[#d6852b] hover:text-[#1a1a1a] transition-colors flex items-center gap-2"
                      >
                        Send Another Message <ArrowRight size={12} />
                      </button>
                    </motion.div>
                  ) : (
                    /* ── FORM ────────────────────────────────────── */
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-8"
                    >
                      <div>
                        <p className="text-[#1a1a1a] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                          [ Your Details ]
                        </p>

                        {/* Name + Organisation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <Field
                            label="Full Name"
                            required
                            error={errors.name}
                          >
                            <input
                              type="text"
                              placeholder="John Mollel"
                              value={form.name}
                              onChange={set("name")}
                              className={inputClass(!!errors.name)}
                            />
                          </Field>

                          <Field label="Organisation" hint="Optional">
                            <input
                              type="text"
                              placeholder="Your organisation or farm"
                              value={form.organisation}
                              onChange={set("organisation")}
                              className={inputClass(false)}
                            />
                          </Field>
                        </div>

                        {/* Email + Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Field label="Email Address" required error={errors.email}>
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={set("email")}
                              className={inputClass(!!errors.email)}
                            />
                          </Field>

                          <Field label="Phone Number" hint="Optional but helpful">
                            <input
                              type="tel"
                              placeholder="+255 700 000 000"
                              value={form.phone}
                              onChange={set("phone")}
                              className={inputClass(false)}
                            />
                          </Field>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#1a1a1a]/8" />

                      <div>
                        <p className="text-[#1a1a1a] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                          [ Your Enquiry ]
                        </p>

                        {/* Enquiry type + Urgency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <Field label="Service Required" required error={errors.enquiryType}>
                            <div className="relative">
                              <select
                                value={form.enquiryType}
                                onChange={set("enquiryType")}
                                className={selectClass(!!errors.enquiryType)}
                              >
                                <option value="">Select a service…</option>
                                {enquiryTypes.map((t) => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <ArrowRight
                                size={12}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d6852b] rotate-90"
                              />
                            </div>
                          </Field>

                          <Field label="Urgency Level">
                            <div className="relative">
                              <select
                                value={form.urgency}
                                onChange={set("urgency")}
                                className={selectClass(false)}
                              >
                                <option value="">Select urgency…</option>
                                <option value="emergency">Emergency — Animal present now</option>
                                <option value="urgent">Urgent — Within 48 hours</option>
                                <option value="planned">Planned — Within weeks</option>
                                <option value="advisory">Advisory — No time pressure</option>
                              </select>
                              <ArrowRight
                                size={12}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d6852b] rotate-90"
                              />
                            </div>
                          </Field>
                        </div>

                        {/* Message */}
                        <Field
                          label="Tell Us About Your Situation"
                          required
                          error={errors.message}
                        >
                          <textarea
                            rows={6}
                            placeholder="Describe the situation, location, species involved (if known), and any other relevant details…"
                            value={form.message}
                            onChange={set("message")}
                            className={`${inputClass(!!errors.message)} resize-none`}
                          />
                        </Field>
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                          Your information is used solely to respond to your enquiry. We do not share data with third parties.
                        </p>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-shrink-0 flex items-center gap-3 bg-[#d6852b] text-white px-9 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send Message <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MAP / LOCATION STRIP ────────────────────────────────── */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative overflow-hidden bg-[#1a1a1a] h-[320px] md:h-[400px]">
              {/* Placeholder map — replace with actual map embed */}
              <iframe
                title="Tanzania Wildlife Trappers Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.26985271534!2d36.59619295!3d-3.38193415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18371078a68ec6bf%3A0x19d7ef5a9a9a7d27!2sArusha%2C%20Tanzania!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1) brightness(0.75)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Overlay card */}
              <div className="absolute top-0 left-0 bottom-0 w-full md:w-72 bg-[#0f1a0f]/90 backdrop-blur-sm flex flex-col justify-end p-8">
                <div className="w-8 h-px bg-[#d6852b] mb-6" />
                <span className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                  Field Base
                </span>
                <h3 className="text-white text-2xl font-light leading-tight">
                  Arusha,
                  <br />
                  <span className="font-bold uppercase">Tanzania.</span>
                </h3>
                <p className="mt-4 text-white/40 text-xs leading-relaxed">
                  Operating across Tanzania and East Africa. Rapid response deployment available nationwide.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}

/* ── HELPER COMPONENTS ─────────────────────────────────────────── */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[#1a1a1a] text-xs font-bold uppercase tracking-widest">
          {label}
          {required && <span className="text-[#d6852b] ml-1">*</span>}
        </label>
        {hint && (
          <span className="text-gray-400 text-[10px] tracking-wide">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c0392b] text-[11px] font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full bg-[#f9f5ef] border-b-2 px-4 py-3 text-sm text-[#1a1a1a] placeholder-gray-400",
    "focus:outline-none focus:bg-white transition-colors duration-200",
    "border-t-0 border-l-0 border-r-0",
    hasError
      ? "border-[#c0392b] bg-red-50/30"
      : "border-[#1a1a1a]/15 focus:border-[#d6852b]",
  ].join(" ");
}

function selectClass(hasError: boolean) {
  return [
    "w-full appearance-none bg-[#f9f5ef] border-b-2 px-4 py-3 text-sm text-[#1a1a1a]",
    "focus:outline-none focus:bg-white transition-colors duration-200 cursor-pointer",
    "border-t-0 border-l-0 border-r-0",
    hasError
      ? "border-[#c0392b] bg-red-50/30"
      : "border-[#1a1a1a]/15 focus:border-[#d6852b]",
  ].join(" ");
}