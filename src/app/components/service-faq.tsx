"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const ServiceFAQ = ({ faqs }: { faqs: FAQ[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#1a1a1a]/10">
      {faqs.map((faq, i) => (
        <div key={i} className="py-6">
          <button
            className="w-full flex justify-between items-start text-left group gap-6"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span
              className={`text-base md:text-lg font-medium leading-snug transition-colors ${
                openIndex === i ? "text-[#d6852b]" : "text-[#1a1a1a] group-hover:text-[#d6852b]"
              }`}
            >
              {faq.question}
            </span>
            <span className="flex-shrink-0 mt-0.5">
              {openIndex === i ? (
                <Minus size={18} className="text-[#d6852b]" />
              ) : (
                <Plus size={18} className="text-[#1a1a1a]/40" />
              )}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-gray-500 text-sm leading-relaxed max-w-2xl">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default ServiceFAQ;