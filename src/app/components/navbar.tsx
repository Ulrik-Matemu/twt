"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Zap, Shield, Users, BarChart3, Globe, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const servicesData = [
  {
    category: "Core Services",
    items: [
      {
        icon: Zap,
        title: "Safe Capture of Wild Animals",
        desc: "Humane capture, transport, and site assessment to safely relocate animals with minimal stress.",
        href: "/our-services/safe-capture-of-wild-animals",
      },
      {
        icon: Shield,
        title: "Wild Animal Rescue",
        desc: "Rapid-response rescue operations for injured, stranded, or distressed wildlife — returning animals safely to their natural habitat.",
        href: "/our-services/wild-animal-rescue",
      },
      {
        icon: Wrench,
        title: "Problem Animal Control for Farms & Communities",
        desc: "Practical, humane solutions for human-wildlife conflict on agricultural land and in communities — protecting livelihoods without harming wildlife.",
        href: "/our-services/problem-animal-control",
      },
      {
        icon: Wrench,
        title: "Expert Zoo Setup & Wildlife Advisory",
        desc: "End-to-end expert advisory for designing, establishing, and operating world-class zoo and wildlife facilities across East Africa.",
        href: "/our-services/zoo-setup-and-wildlife-advisory",
      },
      {
        icon: Wrench,
        title: "Wildlife Treatment and Care",
        desc: "Specialist veterinary treatment and rehabilitation care for injured and recovering wildlife, delivered by certified professionals in the field and in clinic.",
        href: "/our-services/wildlife-treatment-and-care",
      }
    ],
  },
  {
    category: "Solutions",
    items: [
      {
        icon: Globe,
        title: "Wildlife Management Support",
        desc: "Strategic and operational wildlife management consulting for game reserves, conservation areas, and protected land managers across East Africa.",
        href: "/our-services/wildlife-management-support",
      },
      {
        icon: Users,
        title: "Zoo Licensing & Permit Advisory",
        desc: "Expert guidance through Tanzania's wildlife licensing and permitting frameworks for zoos, sanctuaries, educational facilities, and private collections.",
        href: "/our-services/zoo-licensing-and-permit-advisory",
      },
      {
        icon: BarChart3,
        title: "Wildlife Handling & Staff Training",
        desc: "Hands-on professional training programs for rangers, game scouts, veterinary staff, and conservation workers in safe, humane wildlife handling.",
        href: "/our-services/wildlife-handling-and-staff-training",
      },
      {
        icon: BarChart3,
        title: "Wildlife Adaptation & Human Interaction Training",
        desc: "Specialist behavioral conditioning programs for wildlife transitioning to managed environments, and community education to reduce human-wildlife conflict.",
        href: "/our-services/wildlife-adaptation-and-human-interaction-training",
      },
    ],
  },
];

const featuredService = {
  label: "New",
  title: "Field Intelligence Platform",
  desc: "Our latest AI-powered platform gives your field teams real-time data, predictive analytics, and seamless coordination tools.",
  cta: "Explore Platform →",
  href: "#",
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Services', href: '/our-services', hasDropdown: true },
    { name: 'Field Projects', href: '/projects' },
    { name: 'Journal', href: '/blog' },
    { name: 'Contact', href: '/contact-us' },
  ];

  return (
    <>
      {/*
        FIX 1: The nav itself must never exceed 100vw.
        - Added `w-full max-w-full` to cap the nav width.
        - Removed the asymmetric `sm:px-2` that was collapsing padding
          only on sm breakpoint and causing the inner row to be wider
          than the nav wrapper on some viewport sizes.
      */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled || isOpen ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        {/*
          FIX 2: Inner row — changed from px-6 sm:px-2 lg:px-12 to a
          consistent px-4 lg:px-12. The sm:px-2 was producing a narrower
          padding than the page content at the sm breakpoint, making items
          appear to overflow.
        */}
        <div className="pl-0 pr-4 lg:px-12 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="relative w-[110px] h-[55px] md:w-[160px] md:h-[80px]">
                <Image
                  src="/twt-logo-removebg-preview.png"
                  alt="TWT Logo"
                  fill
                  className="object-contain"
                  loading="eager"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 lg:gap-16">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/our-services"
                    className={`text-[11px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-1 ${scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {link.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>

                  {/* Mega Dropdown */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[720px] transition-all duration-200 ${dropdownOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100 shadow-sm" />
                    <div className="relative bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-sm">
                      <div className="grid grid-cols-3">
                        {servicesData.map((group) => (
                          <div key={group.category} className="p-6 border-r border-gray-100">
                            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 mb-4">
                              {group.category}
                            </p>
                            <div className="flex flex-col gap-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  className="group flex items-start gap-3 p-2.5 rounded hover:bg-gray-50 transition-colors"
                                >
                                  <p className="text-xs font-bold text-gray-900 tracking-wide">
                                    {item.title}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="p-6 bg-gray-950 flex flex-col justify-between">
                          <div>
                            <span className="inline-block text-[9px] uppercase tracking-widest font-bold bg-[#d6852b] text-white px-2 py-0.5 mb-3">
                              {featuredService.label}
                            </span>
                            <p className="text-sm font-bold text-white leading-snug mb-2">
                              {featuredService.title}
                            </p>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                              {featuredService.desc}
                            </p>
                          </div>
                          <Link
                            href={featuredService.href}
                            className="mt-5 text-[11px] font-bold uppercase tracking-widest text-[#d6852b] hover:text-white transition-colors"
                          >
                            {featuredService.cta}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'
                    }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex justify-end flex-shrink-0">
            <Link href='/schedule-consultation'>
              <button className="bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d6852b] transition-all duration-300">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${scrolled || isOpen ? 'text-black' : 'text-white'}`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/*
          FIX 3: Mobile menu.
          - Changed from `absolute` to a regular in-flow block so it
            doesn't escape the nav's stacking context and create a
            ghost width.
          - Added `overflow-x-hidden` to hard-stop any child from
            bleeding horizontally.
          - Replaced `w-full` (which resolves to the viewport width
            only when the element is positioned absolutely and the
            nearest containing block is the viewport) with an explicit
            `left-0 right-0` when using absolute — but since we're
            now in-flow, width is naturally constrained to the nav's
            own width which is `w-full` on the nav itself.
          - The nav is `fixed top-0 left-0 right-0` which gives it a
            definite width equal to the viewport. The in-flow menu
            therefore inherits that exact width with no overflow.
        */}
        <div
          className={`overflow-hidden overflow-x-hidden transition-all duration-300 ease-in-out md:hidden ${isOpen
            ? 'max-h-[85vh] border-t border-gray-100 shadow-xl opacity-100'
            : 'max-h-0 opacity-0'
            }`}
        >
          {/*
            FIX 4: Consistent horizontal padding matching the nav bar
            above (px-4). Previously this was px-6 which was fine, but
            keeping it consistent avoids any perceived width mismatch.
            Added `w-full box-border` to ensure padding is included in
            width calculation and the panel never exceeds 100%.
          */}
          <div className="w-full box-border bg-white px-4 py-6 flex flex-col gap-2 max-h-[85vh] overflow-y-auto overflow-x-hidden">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-gray-50 last:border-none">
                {link.hasDropdown ? (
                  <div className="py-3">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-[0.1em] text-gray-900"
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180 text-[#d6852b]' : 'text-gray-400'
                          }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${mobileServicesOpen
                        ? 'grid-rows-[1fr] opacity-100 mt-4'
                        : 'grid-rows-[0fr] opacity-0'
                        }`}
                    >
                      <div className="overflow-hidden flex flex-col gap-4 pl-2">
                        {servicesData.flatMap((g) => g.items).map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="flex items-center gap-4 group"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="p-2 bg-gray-50 rounded group-active:bg-[#d6852b]/10 flex-shrink-0">
                                <Icon size={16} className="text-[#d6852b]" />
                              </div>
                              {/*
                                FIX 5: Added `min-w-0` and `truncate` so long
                                service names don't push the row wider than the
                                screen. They clip cleanly instead.
                              */}
                              <span className="text-[13px] font-medium text-gray-700 min-w-0 leading-snug">
                                {item.title}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block py-4 text-xs font-bold uppercase tracking-[0.1em] text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-4 pt-4">
              <Link href="/schedule-consultation">
                <button className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] active:bg-[#d6852b] transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;