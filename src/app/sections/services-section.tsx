"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Footprints } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: "Wildlife Relocation",
      description: "Safe and humane capture and transport of wildlife across East Africa, ensuring minimal stress.",
      image: "/stories/elephant.jpg",
    },
    {
      title: "Veterinary Support",
      description: "On-field medical intervention and health assessments conducted by specialized wildlife veterinarians.",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop",
    },
    {
      title: "Wildlife Relocation",
      description: "Safe and humane capture and transport of wildlife across East Africa, ensuring minimal stress.",
      image: "https://images.unsplash.com/photo-1547407139-3c921a66005c?q=80&w=2574&auto=format&fit=crop",
    },
    {
      title: "Bird & Reptile Monitoring",
      description: "High-speed documentation of rare avian and reptile species in undisturbed habitats.",
      image: "/stories/flamingoes.jpg",
    },
  ];

  return (
    <section className="bg-[#d6852b] py-24 px-6 lg:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">
            [ TWT SERVICES ]
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-light tracking-tight">
            Professional Solutions For <span className="font-bold uppercase text-white">The Wild.</span>
          </h2>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/10] rounded-sm">
                {/* Image */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Paw Icon Badge (Top Left) */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center rounded-sm">
                  <Footprints className="text-[#2d402d]" size={22} />
                </div>

                {/* Circular Arrow (Bottom Right) */}
                <div className="absolute bottom-6 right-6 w-12 h-12 border border-white/40 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300 z-10">
                  <ArrowUpRight size={20} className="text-white group-hover:text-[#2d402d]" />
                </div>

                {/* Text Content (Inside Image) */}
                <div className="absolute bottom-8 left-8 right-20">
                  <h3 className="text-3xl md:text-4xl font-light mb-3 text-white">
                    {service.title}
                  </h3>
                  <p className="text-white/70 font-medium text-sm md:text-base leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;