"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ParallaxCTA = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Layer: 
        bg-fixed creates the effect where the image stays still while the page scrolls.
      */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668')`,
        }}
      >
        {/* Dark Overlay for text pop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">
            [ Start Protecting ]
          </span>
          
          <h2 className="mt-2 text-4xl md:text-6xl lg:text-6xl font-light text-white leading-tight tracking-tighter">
            Begin Your Wildlife <br />
            Mission Today <span className="font-bold uppercase">WITH TWT.</span>
          </h2>

          <p className="mt-2 text-white/70 text-lg md:text-xl font-md max-w-2xl mx-auto leading-relaxed">
            From the deep jungles of the Selous to the desert dunes of the north, 
            we provide the field expertise nature demands. Join us in safeguarding 
            Tanzania's wild legacy.
          </p>

          <div className="mt-6">
            <Link href='/schedule-consultation'>
            <button className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-2xl">
              Schedule Consultation
            </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxCTA;