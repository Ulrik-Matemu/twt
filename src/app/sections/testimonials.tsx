"use client";

import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "What stood out was how seamlessly the TWT team worked in sensitive environments without ever disrupting wildlife. Their quiet presence and unwavering dedication allowed them to capture and relocate with a level of care I’ve never seen.",
    author: "Lucas Harbour",
    role: "Nature Filmmaker, TerraTrail Media",
    image: "/testimonials/IMG-RTE5LHG.jpg"
  },
  {
    id: 2,
    quote: "Their field training program is second to none. The level of professional discipline and biological understanding they instill in their rangers ensures that East Africa's wildlife remains in safe, capable hands.",
    author: "Sarah Felix",
    role: "Conservation Lead, Rift Valley Trust",
    image: "/testimonials/IMG-2YEPPFS.jpg"
  }
];

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <section className="bg-white py-24 px-6 md:w-full lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-sm font-bold tracking-[0.2em] text-[#d6852b] uppercase">
              [ SHARED EXPERIENCE ]
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-light text-[#1a1a1a] tracking-tight">
              Trusted By <span className="font-bold uppercase">WILDLIFE EXPERTS.</span>
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-xl max-w-[480px] md:text-right md:pb-16">
            Each wildlife project we complete tells a story—not just of the subject, but of survival.
          </p>
        </div>

        {/* Carousel Root */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.map((t) => (
              <div key={t.id} className="embla__slide flex-[0_0_100%] min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left: Quote Content */}
                <div className="lg:col-span-6 mx-4 md:mx-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-700">
                      "{t.quote}"
                    </p>
                    
                    <div className="mt-10">
                      <div className="w-12 h-[2px] bg-gray-900 mb-6" />
                      <h4 className="text-xl font-medium text-gray-900">{t.author}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                        {t.role}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Right: Placeholder Image */}
                <div className="lg:col-span-6 md:mx-0 mx-4">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 shadow-xl">
                    <img 
                      src={t.image} 
                      alt={t.author} 
                      className="w-full h-full object-cover grayscale-[0.2]" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-start gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="w-2 h-2 rounded-full bg-gray-200 hover:bg-[#556b2f] transition-colors"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;