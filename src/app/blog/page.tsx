// app/blog/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { posts } from "@/app/data/posts";
import type { PostTag } from "@/app/data/posts";
import ScrollReveal from "@/app/components/scroll-reveal";

const ALL_TAGS: PostTag[] = [
  "Conservation",
  "Field Notes",
  "Wildlife Science",
  "Training",
  "Human-Wildlife Conflict",
  "Legislation",
  "Species Focus",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const featured = posts.find((p) => p.featured)!;

  const filtered = useMemo(() => {
    const base = posts.filter((p) => !p.featured);
    if (activeTag === "All") return base;
    return base.filter((p) => p.tags.includes(activeTag as PostTag));
  }, [activeTag]);

  const showFeaturedInGrid =
    activeTag !== "All" && featured.tags.includes(activeTag as PostTag);

  const grid = showFeaturedInGrid ? [featured, ...filtered] : filtered;

  return (
    <main className="bg-[#f9f5ef] min-h-screen">

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <section className="bg-[#0f1a0f] relative pt-36 pb-0 px-6 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
                [ Field Notes & Insights ]
              </span>
              <h1 className="mt-5 text-white text-5xl md:text-7xl font-light leading-[0.95] tracking-tight">
                The TWT <span className="font-bold uppercase">Journal.</span>
              </h1>
            </div>
            <p className="hidden lg:block text-white/40 text-sm max-w-xs leading-relaxed text-right mt-auto pb-1">
              Expert writing on wildlife management, conservation science, and field practice across East Africa.
            </p>
          </div>

          {/* Tag filters */}
          <div className="mt-14 flex items-end gap-0 overflow-x-auto scrollbar-none border-t border-white/10 -mx-6 lg:-mx-16 px-6 lg:px-16">
            {["All", ...ALL_TAGS].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex-shrink-0 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-200 border-t-2 -mt-px ${
                  activeTag === tag
                    ? "text-white border-[#d6852b]"
                    : "text-white/30 border-transparent hover:text-white/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeTag === "All" && (
          <motion.section
            key="featured"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="px-6 lg:px-16 pt-12 pb-4"
          >
            <div className="max-w-7xl mx-auto">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 bg-[#1a1a1a] overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-72 lg:h-auto overflow-hidden min-h-[380px]">
                  <img
                    src={featured.heroImage}
                    alt={featured.title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-[1.04] group-hover:opacity-80 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/60 hidden lg:block" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#d6852b] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-8 md:p-10 border-t-2 border-[#d6852b] lg:border-t-0 lg:border-l-2">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-white text-2xl md:text-3xl font-light leading-snug group-hover:text-[#d6852b] transition-colors duration-400">
                      {featured.title.split(" ").slice(0, -2).join(" ")}{" "}
                      <span className="font-bold">
                        {featured.title.split(" ").slice(-2).join(" ")}
                      </span>
                    </h2>
                    <p className="mt-4 text-white/50 text-sm leading-relaxed">
                      {featured.excerpt}
                    </p>
                  </div>

                  {/* Author + meta */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                        <img
                          src={featured.author.avatar}
                          alt={featured.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">{featured.author.name}</p>
                        <p className="text-white/30 text-[10px] tracking-wide">{featured.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold tracking-widest uppercase">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {featured.readingTime} min
                      </span>
                      <div className="w-6 h-6 border border-white/20 flex items-center justify-center group-hover:bg-[#d6852b] group-hover:border-[#d6852b] transition-all">
                        <ArrowUpRight size={11} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── POSTS GRID ────────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-10 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[#1a1a1a]/30 text-xs font-bold tracking-widest uppercase">
              {activeTag === "All" ? "All Articles" : activeTag}
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]/10" />
            <span className="text-[#1a1a1a]/30 text-xs font-bold">{grid.length} articles</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {grid.length === 0 ? (
                <p className="text-center py-24 text-gray-400 text-sm">
                  No articles in this category yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grid.map((post, i) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col h-full bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                          <img
                            src={post.heroImage}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-80 grayscale-[0.2] group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700"
                          />
                          {/* Tags overlay */}
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            {post.tags.slice(0, 1).map((t) => (
                              <span
                                key={t}
                                className="bg-[#d6852b] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-1 p-6 border-t-2 border-[#d6852b]">
                          <h3 className="text-[#1a1a1a] group-hover:text-white text-lg font-light leading-snug transition-colors duration-500 flex-1">
                            {post.title}
                          </h3>
                          <p className="mt-3 text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="mt-5 pt-4 border-t border-[#1a1a1a]/8 group-hover:border-white/10 transition-colors flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[#1a1a1a] group-hover:text-white text-[11px] font-bold transition-colors duration-500 leading-none">
                                  {post.author.name.split(" ")[0]} {post.author.name.split(" ").slice(-1)[0]}
                                </p>
                                <p className="text-[#1a1a1a]/30 group-hover:text-white/30 text-[10px] transition-colors duration-500 mt-0.5">
                                  {formatDate(post.publishedAt)}
                                </p>
                              </div>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#d6852b]">
                              <Clock size={9} /> {post.readingTime} min
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── NEWSLETTER STRIP ──────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] py-20 px-6 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                [ Stay Informed ]
              </span>
              <h2 className="text-white text-3xl md:text-4xl font-light leading-tight">
                New articles, field reports, and species insights —
                directly to your inbox.{" "}
                <span className="font-bold uppercase">No noise.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-0"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 border-r-0 px-5 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d6852b] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#d6852b] text-white px-7 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d6852b] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-white/20 text-xs mt-3 leading-relaxed">
                No spam. Unsubscribe any time. We publish 2–4 articles per month.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}