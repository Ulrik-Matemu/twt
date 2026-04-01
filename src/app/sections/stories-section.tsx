"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const StoriesSection = () => {
  const stories = [
    {
      id: 1,
      tag: "FIELD REPORT",
      title: "Territory Of The Deep",
      description: "Observing hippo pod dynamics during the dry season in the Rufiji River.",
      image: "/stories/hippo.jpg",
      span: "md:col-span-8", // Larger image
    },
    {
      id: 2,
      tag: "CONSERVATION",
      title: "The River Watch",
      description: "Vital water source monitoring in the Selous.Far from roads, we documented rare species in undisturbed treetops. Each sighting was fleeting, precious, and sharp.",
      image: "/stories/IMG-R8NQBFM.jpg",
      span: "md:col-span-4", // Narrower image
    },
    {
      id: 3,
      tag: "CONSERVATION",
      title: "Patterns in the Wild",
      description: "We followed a small zebra group through vast plains. Natural light and angles brought their beauty and order to life.",
      image: "/stories/zebras.jpg",
      span: "md:col-span-4", // Narrower image
    },
    {
      id: 4,
      tag: "CONSERVATION",
      title: "The River Watch",
      description: "Vital water source monitoring in the Selous.",
      image: "/stories/impala.jpg",
      span: "md:col-span-4", // Narrower image
    },
    {
      id: 5,
      tag: "CONSERVATION",
      title: "The River Watch",
      description: "Vital water source monitoring in the Selous.",
      image: "/stories/giraffe.jpg",
      span: "md:col-span-4", // Narrower image
    },
  ];

  return (
    <section className="bg-[#fcf4e8] py-24 px-6 lg:px-22">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#d6852b] uppercase">
            [ Featured Projects ]
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-light text-[#1a1a1a] tracking-tight">
            Stories From The <span className="font-bold uppercase">Wild World.</span>
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`${story.span} group cursor-pointer`}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white p-4 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300">
                      <ArrowUpRight className="text-black" size={24} />
                   </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="mt-6">
                <h3 className="text-2xl md:text-3xl font-light text-gray-900 group-hover:text-green-900 transition-colors">
                  {story.title}
                </h3>
                <p className="mt-2 text-gray-500 font-light max-w-md">
                  {story.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;