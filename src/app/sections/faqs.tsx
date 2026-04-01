"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What types of wildlife relocation do you offer?",
    answer: "We specialize in the humane capture and relocation of mammals, reptiles, and birds. Our team is equipped for large-scale operations involving elephants and giraffes, as well as sensitive predator relocations."
  },
  {
    question: "Is your trapping process legal and humane?",
    answer: "Absolutely. We operate under strict permits from the Tanzania Wildlife Management Authority (TAWA). Every capture uses the latest veterinary-approved tranquilization and transport protocols to ensure zero harm."
  },
  {
    question: "Do you provide emergency veterinary support?",
    answer: "Yes, our rapid response teams include certified wildlife veterinarians who can provide on-field stabilization, wound care, and medical assessments in remote locations."
  },
  {
    question: "Can I book field training for my conservation team?",
    answer: "We offer customized field training programs for rangers and students, focusing on tracking, humane handling, and safety protocols in the East African bush."
  },
  {
    question: "How do we request a relocation assessment?",
    answer: "You can reach out via our contact form or emergency line. We conduct a thorough site survey and biological assessment before proposing a relocation strategy."
  },
  {
    question: "What gear is used for field operations?",
    answer: "We utilize specialized 4x4 vehicles, drone surveillance for tracking, and professional-grade veterinary darting equipment to maintain safety and efficiency."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: any) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        className="w-full flex justify-between items-center text-left group"
        onClick={onClick}
      >
        <span className="text-lg md:text-xl font-md text-gray-900 group-hover:text-black transition-colors pr-8">
          {question}
        </span>
        <div className="flex-shrink-0">
          {isOpen ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-700 font-md leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Split FAQs into two columns for the desktop layout
  const leftCol = faqs.slice(0, Math.ceil(faqs.length / 2));
  const rightCol = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="bg-[#fcfcfc] py-24 px-6 lg:px-22    ">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="">
            <span className="text-sm font-bold tracking-[0.2em] text-[#d6852b] uppercase">
              [ ASK AWAY ]
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-light text-[#1a1a1a] tracking-tight">
              Everything You <span className="font-bold uppercase">NEED TO KNOW.</span>
            </h2>
          </div>
          <button className="hidden md:block bg-[#d6852b] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-500 transition-colors">
            Explore FAQs
          </button>
        </div>

        {/* Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <div className="flex flex-col">
            {leftCol.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          <div className="flex flex-col">
            {rightCol.map((faq, i) => {
                const actualIndex = i + leftCol.length;
                return (
                  <AccordionItem
                    key={actualIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === actualIndex}
                    onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                  />
                );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;