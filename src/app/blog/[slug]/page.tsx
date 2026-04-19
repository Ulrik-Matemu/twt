// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { posts } from "@/app/data/posts";
import type { Metadata } from "next";
import type { Section } from "@/app/data/posts";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import ReadingProgress from "@/app/components/reading-progress";
import ScrollReveal from "@/app/components/scroll-reveal";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [{ url: post.heroImage }],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [post.heroImage],
    },
  };
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return notFound();

  const idx = posts.findIndex((p) => p.slug === slug);
  const next = posts[(idx + 1) % posts.length];
  const prev = posts[(idx - 1 + posts.length) % posts.length];

  const related = posts
    .filter(
      (p) =>
        p.slug !== slug &&
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 2);

  return (
    <>
      {/* Reading progress bar — fixed to top */}
      <ReadingProgress />

      <main className="bg-[#f9f5ef] min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative bg-[#0f1a0f]">
          {/* Full image */}
          <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a0f] via-[#0f1a0f]/30 to-[#0f1a0f]/10" />

            {/* Breadcrumb */}
            <div className="absolute top-36 left-6 lg:left-16 z-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase hover:text-[#d6852b] transition-colors"
              >
                <ArrowLeft size={12} /> The Journal
              </Link>
            </div>

            {/* Caption */}
            {post.heroCaption && (
              <div className="absolute bottom-6 right-6 lg:right-16 max-w-xs text-right">
                <p className="text-white/30 text-[10px] leading-relaxed">
                  {post.heroCaption}
                </p>
              </div>
            )}
          </div>

          {/* Title block — overlapping the image bottom */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 -mt-32 pb-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="bg-[#d6852b] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-white/55 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              {post.subtitle}
            </p>
          </div>
        </section>

        {/* ── AUTHOR BAR ────────────────────────────────────────────── */}
        <section className="bg-[#0f1a0f] px-6 lg:px-8">
          <div className="max-w-4xl mx-auto py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-t border-white/10">
            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white text-sm font-bold">{post.author.name}</p>
                <p className="text-white/40 text-xs">{post.author.role}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-5 text-white/30 text-[10px] font-bold tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <Calendar size={10} className="text-[#d6852b]" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={10} className="text-[#d6852b]" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </section>

        {/* ── ARTICLE BODY ──────────────────────────────────────────── */}
        <article className="py-16 px-6 lg:px-8">
          {/*
            Constrained reading column — max-w-2xl for ~65ch line length,
            centered. Sidebar is handled via a wider wrapper on lg.
          */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* ── BODY COLUMN ─────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <div className="prose-twt">
                {post.body.map((section, i) => (
                  <BodySection key={i} section={section} />
                ))}
              </div>
            </div>

            {/* ── STICKY SIDEBAR ──────────────────────────────────── */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">

              {/* Table of contents */}
              <div className="bg-white border-t-2 border-[#d6852b] p-6">
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  In This Article
                </p>
                <nav className="flex flex-col gap-2">
                  {post.body
                    .filter((s) => s.type === "heading" && s.level === 2)
                    .map((s, i) => (
                      <span
                        key={i}
                        className="text-sm text-gray-500 hover:text-[#d6852b] transition-colors leading-snug cursor-pointer border-l-2 border-transparent hover:border-[#d6852b] pl-3 transition-all"
                      >
                        {(s as any).content}
                      </span>
                    ))}
                </nav>
              </div>

              {/* Author card */}
              <div className="bg-[#1a1a1a] p-6">
                <div className="w-8 h-px bg-[#d6852b] mb-5" />
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  About The Author
                </p>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#d6852b]/20 flex-shrink-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{post.author.name}</p>
                    <p className="text-[#d6852b] text-[10px] font-bold tracking-wide uppercase mt-0.5">
                      {post.author.role}
                    </p>
                    <p className="text-white/40 text-xs mt-3 leading-relaxed">
                      A member of the Tanzania Wildlife Trappers expert team, contributing professional insight from the field.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-[#f0ebe1] p-6">
                <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className="text-[10px] font-bold tracking-widest uppercase text-[#1a1a1a] border border-[#1a1a1a]/20 px-3 py-1.5 hover:bg-[#d6852b] hover:text-white hover:border-[#d6852b] transition-all"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border-2 border-[#d6852b] p-6">
                <p className="text-[#1a1a1a] text-sm font-bold uppercase tracking-wide mb-3 leading-snug">
                  Need Expert Wildlife Support?
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">
                  Our team is available to discuss your specific situation and recommend the right approach.
                </p>
                <Link
                  href="/contact-us"
                  className="flex items-center justify-between bg-[#d6852b] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
                >
                  Contact Us <ArrowRight size={12} />
                </Link>
              </div>
            </aside>
          </div>
        </article>

        {/* ── RELATED POSTS ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-[#f0ebe1] py-20 px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
                      [ Keep Reading ]
                    </span>
                    <h2 className="text-3xl font-light text-[#1a1a1a]">
                      Related <span className="font-bold uppercase">Articles.</span>
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#d6852b] transition-colors"
                  >
                    All Articles <ArrowRight size={12} />
                  </Link>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((p, i) => (
                  <ScrollReveal key={p.slug} delay={i * 0.1}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex flex-col bg-white hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={p.heroImage}
                          alt={p.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#d6852b] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
                            {p.tags[0]}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 border-t-2 border-[#d6852b]">
                        <h3 className="text-[#1a1a1a] group-hover:text-white text-lg font-light leading-snug transition-colors duration-500 mb-3">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                          <span className="text-[#d6852b] flex items-center gap-1">
                            <Clock size={9} /> {p.readingTime} min
                          </span>
                          <span className="text-gray-400 group-hover:text-gray-500 transition-colors">
                            {formatDate(p.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PREV / NEXT ───────────────────────────────────────────── */}
        <section className="bg-[#1a1a1a] px-6 lg:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex items-center gap-6 py-10 pr-0 md:pr-12 hover:bg-white/5 transition-colors px-4"
            >
              <ArrowLeft size={18} className="text-[#d6852b] group-hover:-translate-x-1 transition-transform flex-shrink-0" />
              <div>
                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase block mb-1">Previous</span>
                <span className="text-white text-sm font-light group-hover:text-[#d6852b] transition-colors line-clamp-2">{prev.title}</span>
              </div>
            </Link>
            <Link
              href={`/blog/${next.slug}`}
              className="group flex items-center justify-end gap-6 py-10 pl-0 md:pl-12 hover:bg-white/5 transition-colors px-4"
            >
              <div className="text-right">
                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase block mb-1">Next</span>
                <span className="text-white text-sm font-light group-hover:text-[#d6852b] transition-colors line-clamp-2">{next.title}</span>
              </div>
              <ArrowRight size={18} className="text-[#d6852b] group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}

/* ── BODY SECTION RENDERER ────────────────────────────────────── */
function BodySection({ section }: { section: Section }) {
  switch (section.type) {
    case "paragraph":
      return (
        <p className="text-gray-600 text-[17px] leading-[1.85] mb-7 font-light">
          {section.content}
        </p>
      );

    case "heading":
      if (section.level === 2) {
        return (
          <h2 className="text-[#1a1a1a] text-2xl md:text-3xl font-bold uppercase tracking-wide mt-14 mb-5 pt-8 border-t border-[#1a1a1a]/10">
            {section.content}
          </h2>
        );
      }
      return (
        <h3 className="text-[#1a1a1a] text-xl font-bold uppercase tracking-wide mt-10 mb-4">
          {section.content}
        </h3>
      );

    case "pullquote":
      return (
        <blockquote className="my-10 pl-7 border-l-4 border-[#d6852b]">
          <p className="text-[#1a1a1a] text-xl md:text-2xl font-light italic leading-[1.5]">
            "{section.content}"
          </p>
          {section.attribution && (
            <footer className="mt-4 text-[#d6852b] text-xs font-bold tracking-[0.2em] uppercase">
              — {section.attribution}
            </footer>
          )}
        </blockquote>
      );

    case "image":
      return (
        <figure className="my-10">
          <div className="overflow-hidden">
            <img
              src={section.src}
              alt={section.alt}
              className="w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[11px] text-gray-400 leading-relaxed border-l-2 border-[#d6852b] pl-3">
            {section.caption}
          </figcaption>
        </figure>
      );

    case "list":
      if (section.style === "numbered") {
        return (
          <ol className="my-7 space-y-4 pl-0">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-5 text-gray-600 text-[16px] leading-[1.75] font-light">
                <span className="flex-shrink-0 w-7 h-7 bg-[#d6852b] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="my-7 space-y-4">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-gray-600 text-[16px] leading-[1.75] font-light">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#d6852b] flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "divider":
      return (
        <div className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1a1a1a]/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d6852b]" />
          <div className="flex-1 h-px bg-[#1a1a1a]/10" />
        </div>
      );

    case "callout":
      return (
        <div className="my-8 bg-[#f0ebe1] border-l-4 border-[#d6852b] px-6 py-5">
          <p className="text-[#d6852b] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            {section.label}
          </p>
          <p className="text-[#1a1a1a] text-sm leading-relaxed font-medium">
            {section.content}
          </p>
        </div>
      );

    default:
      return null;
  }
}