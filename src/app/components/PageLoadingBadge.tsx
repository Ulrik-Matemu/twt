"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNavigationLoading } from "./NavigationLoadingContext";

export default function PageLoadingBadge() {
  const isPending = useNavigationLoading();

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-[9997] pointer-events-none">
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-label="Loading"
            className="w-7 h-7 rounded-full bg-[#1a1a1a] shadow-lg flex items-center justify-center"
          >
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#d6852b] border-t-transparent animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
