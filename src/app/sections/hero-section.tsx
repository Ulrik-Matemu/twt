'use client';
import React from 'react';
import { ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingProjectCard from '../components/side-image-carousel-card';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-[#0a0f0a]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lion-hero-image.jpg"
          alt="Tanzania Wildlife"
          className="w-full h-full object-cover opacity-80 grayscale-[0.1]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-16">
        {/* Left Content */}
        <div className="lg:col-span-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-"
          >
            Safeguarding The
            Wild, <span className="font-bold">RESPONSIBLY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-gray-300 text-lg md:text-xl max-w-xl font-semilight leading-relaxed"
          >
            Humane capture, veterinary support, and specialized relocation services
            across East Africa. Professional training for the next generation of
            wildlife guardians.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href='our-services'>
              <button className="bg-white text-black px-8 py-4 flex items-center gap-3 font-bold uppercase tracking-widest text-xs hover:bg-[#d6852b] hover:text-white transition-all transition duration-400 ease-in-out hover:cursor-pointer">
                Our Services <ArrowRight size={16} />
              </button>
            </Link>
            <Link href='/projects'>
              <button className="border border-white/30 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all transition duration-400 ease-in-out hover:cursor-pointer">
                View Field Projects
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Feature Card (The "Nairobi/Arusha" card in your sample) */}
        <FloatingProjectCard />
      </div>
    </section>
  );
};

export default Hero;