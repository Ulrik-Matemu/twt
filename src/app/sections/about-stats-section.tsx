"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutStatsSection = () => {
  const stats = [
    { label: "Wildlife Relocated", value: "2.5K+" },
    { label: "Years In The Field", value: "30+" },
    { label: "Successful Missions", value: "1200+" },
    { label: "Veterinary Partners", value: "15+" },
  ];

  return (
    <section className="bg-white py-24 px-6 lg:px-22">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid: Image and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left: Professional Field Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden bg-gray-100 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2574&auto=format&fit=crop" 
                alt="Tanzania Wildlife Trappers in action" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <span className="text-sm font-bold tracking-[0.2em] text-[#d6852b] uppercase">
              [ About Tanzania Wildlife Trappers ]
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-light text-[#1a1a1a] leading-[1.1] tracking-tight">
              Rooted In A Legacy Of <br />
              <span className="font-bold uppercase text-[#1a1a1a]">Ethical Conservation.</span>
            </h2>
            
            <div className="mt-8 space-y-6 max-w-2xl">
              <p className="text-gray-600 text-lg font-md leading-relaxed">
                Tanzania Wildlife Trappers is a premier field operation service specializing 
                in the humane capture, medical support, and strategic relocation of East 
                Africa’s most vital species.
              </p>
              <p className="text-gray-500 text-base font-md leading-relaxed">
                We operate with precision and respect, bridging the gap between human 
                expansion and wildlife preservation—ensuring that every animal we handle 
                is given a safer, more sustainable future.
              </p>
            </div>

            <button className="mt-10 bg-[#d6852b] text-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#645958] transition-colors shadow-lg">
              Read Our Mission
            </button>
          </motion.div>
        </div>

        {/* Bottom: Stats Counter Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 ">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold tracking-widest border-t border-[#d6852b] pt-8 text-[#645958] uppercase mb-3">
                {stat.label}
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1a1a1a] tracking-tighter">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStatsSection;