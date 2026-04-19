// app/components/blog-section.tsx
import Link from "next/link";
import { ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import { posts } from "@/app/data/posts";
import type { Post } from "@/app/data/posts";
import ScrollReveal from "@/app/components/scroll-reveal";

type Props = {
  /**
   * How many posts to show in the grid (default 3).
   * The featured slot is separate and always shows 1.
   */
  count?: number;
  /** Show the large featured post card (default true) */
  showFeatured?: boolean;
  /** Override which posts to display — useful if you want a curated list */
  postSlugs?: string[];
  /** Section background colour class (default "bg-[#f9f5ef]") */
  bgClass?: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogSection({
  count = 3,
  showFeatured = true,
  postSlugs,
  bgClass = "bg-[#f9f5ef]",
}: Props) {
  // If caller provides specific slugs, honour them; otherwise use recency order
  const pool: Post[] = postSlugs
    ? (postSlugs
        .map((s) => posts.find((p) => p.slug === s))
        .filter(Boolean) as Post[])
    : [...posts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

  const featured = pool.find((p) => p.featured) ?? pool[0];
  const rest = pool.filter((p) => p.slug !== featured.slug).slice(0, count);

  return (
    <section className={`${bgClass} py-24 px-6 lg:px-16`}>
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ───────────────────────────────────────── */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[#d6852b] text-xs font-bold tracking-[0.25em] uppercase">
                [ Field Notes & Insights ]
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight leading-tight">
                From The{" "}
                <span className="font-bold uppercase">Journal.</span>
              </h2>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#d6852b] transition-colors group flex-shrink-0"
            >
              All Articles
              <span className="w-8 h-8 border border-[#1a1a1a]/20 group-hover:border-[#d6852b] group-hover:bg-[#d6852b] flex items-center justify-center transition-all duration-300">
                <ArrowRight
                  size={13}
                  className="group-hover:text-white transition-colors"
                />
              </span>
            </Link>
          </div>
        </ScrollReveal>

        {/* ── Featured post ─────────────────────────────────────────── */}
        {showFeatured && (
          <ScrollReveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 bg-[#1a1a1a] overflow-hidden mb-6"
            >
              {/* Image */}
              <div className="relative h-64 lg:h-auto min-h-[340px] overflow-hidden">
                <img
                  src={featured.heroImage}
                  alt={featured.title}
                  className="w-full h-full object-cover opacity-65 group-hover:scale-[1.04] group-hover:opacity-75 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/50 hidden lg:block" />

                {/* Featured badge */}
                <div className="absolute top-5 left-5">
                  <span className="bg-[#d6852b] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5">
                    Latest
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between p-8 md:p-10 border-t-2 border-[#d6852b] lg:border-t-0 lg:border-l-2">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[#d6852b] text-[10px] font-bold tracking-widest uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex-1">
                  <h3 className="text-white text-2xl md:text-3xl font-light leading-snug group-hover:text-[#d6852b] transition-colors duration-300">
                    {featured.title}
                  </h3>
                  <p className="mt-4 text-white/50 text-sm leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                {/* Author + meta */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                      <img
                        src={featured.author.avatar}
                        alt={featured.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white text-[11px] font-bold leading-none">
                        {featured.author.name}
                      </p>
                      <p className="text-white/30 text-[10px] mt-0.5">
                        {formatDate(featured.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                      <Clock size={9} className="text-[#d6852b]" />
                      {featured.readingTime} min
                    </span>
                    <div className="w-7 h-7 border border-white/20 flex items-center justify-center group-hover:bg-[#d6852b] group-hover:border-[#d6852b] transition-all">
                      <ArrowUpRight size={12} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* ── Post cards grid ───────────────────────────────────────── */}
        {rest.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              rest.length === 1
                ? "md:grid-cols-1 max-w-xl"
                : rest.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
            } gap-6`}
          >
            {rest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={post.heroImage}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 grayscale-[0.15] group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700"
                    />
                    {/* Tag badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#d6852b] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
                        {post.tags[0]}
                      </span>
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
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[#1a1a1a] group-hover:text-white text-[11px] font-bold transition-colors duration-500 leading-none">
                          {post.author.name.split(" ")[0]}{" "}
                          {post.author.name.split(" ").slice(-1)[0]}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#d6852b]">
                        <Clock size={9} /> {post.readingTime} min
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────── */}
        <ScrollReveal>
          <div className="mt-12 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 border-2 border-[#1a1a1a]/20 hover:border-[#d6852b] text-[#1a1a1a] hover:text-[#d6852b] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              Read All Articles <ArrowRight size={13} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}