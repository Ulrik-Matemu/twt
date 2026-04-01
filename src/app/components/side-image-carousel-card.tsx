"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, MoveUpRightIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselData = [
  {
    location: "Arusha, TZ",
    title: "Field Training",
    image: "/colobus-monkey.jpg"
  },
  {
    location: "Serengeti, TZ",
    title: "Rhino Tracking",
    image: "/rhino.jpg"
  },
  {
    location: "Selous, TZ",
    title: "River Operations",
    image: "/selous.jpg"
  }
];

const FloatingProjectCard = () => {
  const [index, setIndex] = useState(0);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = carouselData[index];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="hidden md:block md:absolute bottom-0 right-12 z-20 w-64 md:w-56"
    >
      <div className="relative group p-1 border-2 border-gray-200 bg-gray-200 shadow-2xl">
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-300">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Image */}
              <img 
                src={current.image} 
                alt={current.title} 
                className="w-full h-full object-cover grayscale-[0.2]"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
              
              {/* Top Badge: Location */}
              <div className="absolute top-4 left-2 flex items-center gap-2 px-3 py-1.5">
                <MapPin size={16} className="text-white" />
                <span className="text-sm text-white tracking-[0.1em] font-extrabold uppercase">
                  {current.location.split(',')[0]}
                </span>
              </div>

              {/* Bottom Text Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl font-light leading-tight">
                  {current.title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Static UI Elements (Don't fade) */}
          <div className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 cursor-pointer transition-colors z-10">
            <MoveUpRightIcon size={14} className="text-white" />
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default FloatingProjectCard;