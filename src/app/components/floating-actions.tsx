// app/components/floating-actions.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const WHATSAPP_NUMBER = "255750151020"; // Replace with real number
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
       
      </div>
    </div>
  );
}