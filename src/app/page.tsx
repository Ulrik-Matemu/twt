import type { Metadata } from "next";
import Hero from "./sections/hero-section";
import StoriesSection from "./sections/stories-section";
import AboutStatsSection from "./sections/about-stats-section";
import ServicesSection from "./sections/services-section";
import TestimonialCarousel from "./sections/testimonials";
import FAQSection from "./sections/faqs";
import ParallaxCTA from "./sections/cta";

export const metadata: Metadata = {
  title: "Wildlife Capture, Relocation & Veterinary Services",
  description:
    "Tanzania Wildlife Trappers delivers legal wildlife capture, relocation, veterinary support, and field training for conservation authorities, parks, reserves, and private partners.",
};

export default function Home() {
  return (
    <main className="">
      <Hero />
      <StoriesSection />
      <AboutStatsSection />
      <ServicesSection />
      <TestimonialCarousel />
      <FAQSection />
      <ParallaxCTA />
    </main>
  );
}
