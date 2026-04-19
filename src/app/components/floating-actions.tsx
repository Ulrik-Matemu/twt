// app/components/floating-actions.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const WHATSAPP_NUMBER = "255700000000"; // Replace with real number
const WHATSAPP_MESSAGE = "Hello, I'd like to enquire about Tanzania Wildlife Trappers services.";

export default function FloatingActions() {
  const [showBackTop, setShowBackTop] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pulse, setPulse] = useState(false);

  /* Show back-to-top once user scrolls 400px */
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Pulse the WA button once after 3s to draw attention on first load */
  useEffect(() => {
    const t = setTimeout(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openWhatsApp = useCallback(() => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setExpanded(false);
  }, []);

  return (
    /*
      Outer wrapper — fixed position, bottom-right corner.
      z-[9998] keeps it below the reading progress bar (z-[9999])
      but above all other page content.
    */
    <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[9998] flex flex-col items-end gap-3">

      {/* ── WHATSAPP TOOLTIP LABEL ─────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-white border border-[#1a1a1a]/10 px-4 py-2.5 shadow-lg cursor-pointer group"
            onClick={openWhatsApp}
          >
            {/* Online dot */}
            <span className="w-2 h-2 rounded-full bg-[#25d366] flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-[#1a1a1a] text-xs font-bold uppercase tracking-widest leading-none">
                Chat on WhatsApp
              </p>
              <p className="text-gray-400 text-[10px] mt-0.5">Instant Reply</p>
            </div>
            <ArrowUp
              size={11}
              className="text-[#25d366] rotate-90 ml-1 group-hover:translate-x-0.5 transition-transform"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BUTTON ROW ────────────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* Back to Top */}
        <AnimatePresence>
          {showBackTop && (
            <motion.button
              key="back-top"
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="group relative w-11 h-11 md:w-12 md:h-12 bg-[#1a1a1a] hover:bg-[#d6852b] flex items-center justify-center transition-colors duration-300"
            >
              <ArrowUp
                size={16}
                className="text-white group-hover:-translate-y-0.5 transition-transform duration-300"
              />
              {/* Amber bottom accent */}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d6852b] group-hover:bg-white transition-colors duration-300" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        <motion.button
          onClick={() => setExpanded((p) => !p)}
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          animate={
            pulse
              ? {
                  scale: [1, 1.18, 1, 1.12, 1],
                  transition: { duration: 0.7, ease: "easeInOut" },
                }
              : {}
          }
          className="relative group w-13 h-13 md:w-14 md:h-14"
          style={{ width: "52px", height: "52px" }}
        >
          {/* Ripple ring — always rendered, fades in on hover / pulse */}
          <span
            className={`absolute inset-0 rounded-none border-2 border-[#25d366]/40 scale-100 transition-all duration-500 ${
              expanded ? "scale-125 opacity-0" : "opacity-0 group-hover:scale-110 group-hover:opacity-100"
            }`}
          />

          {/* Main button */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
              expanded ? "bg-[#25d366]" : "bg-[#25d366] group-hover:bg-[#1fba58]"
            }`}
          >
            {/* WhatsApp SVG icon */}
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>

          {/* Amber bottom accent strip */}
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d6852b]" />

          {/* Unread badge dot — subtle presence indicator */}
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#d6852b] border-2 border-[#f9f5ef] rounded-full" />
        </motion.button>
      </div>
    </div>
  );
}