"use client";

import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  ArrowUp
} from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: ['About', 'Career', 'Reviews', 'Gallery'],
    Operations: ['Tanzania', 'Kenya', 'Uganda', 'Rwanda'],
    QuickAccess: ['Services', 'Projects', 'Our Team', 'Training'],
    Support: ['FAQs', 'Contact Us', 'Help Center', 'Blog & News']
  };

  // Map link labels to real hrefs (internal or external)
  const linkPaths: Record<string, string> = {
    // Company
    About: '/about-us',
    Career: '/careers',
    Reviews: '/reviews',
    Gallery: '/gallery',

    // Operations
    Tanzania: '/operations/tanzania',
    Kenya: '/operations/kenya',
    Uganda: '/operations/uganda',
    Rwanda: '/operations/rwanda',

    // QuickAccess
    Services: '/our-services',
    Projects: '/projects',
    'Our Team': '/about-us',
    Training: '/our-services/wildlife-handling-and-staff-training',

    // Support
    FAQs: '/help-center',
    'Contact Us': '/contact-us',
    'Help Center': '/help-center',
    'Blog & News': '/blog'
  };

  // Helper to get href for a link label (falls back to "#")
  const getHref = (label: string) => linkPaths[label] ?? '#';

  // NOTE: Update the anchor in the rendering section from:
  //   <a href="#" ...>
  // to:
  //   <a href={getHref(link)} ...>

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Subscription failed. Please try again.");
        return;
      }

      setMessage(
        data.alreadyExists
          ? "You're already subscribed."
          : "Thank you for subscribing."
      );

      setEmail("");
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#121212] text-white pt-20 pb-10 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">

        {/* Top Bar: Socials and Contact */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 pb-12 border-b border-white/10">
          {/* <div className="flex items-center gap-6">
            <span className="text-sm font-light text-gray-400">Find And Follow Us</span>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 border border-white/20 hover:bg-white hover:text-black transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div> */}

          <div className="flex flex-wrap gap-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-full">
                <PhoneCall size={20} className="text-gray-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Contact us at</p>
                <p className="text-lg font-light">+255 750 151 020</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-full">
                <Mail size={20} className="text-gray-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Mail us at</p>
                <p className="text-lg font-light">info@twt.co.tz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Bar: Links and Newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 py-20">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-200">{title}</h4>
              <ul className="flex flex-col gap-4">
                {links.map(link => (
                  <li key={link}>
                    <a href={getHref(link)} className="text-gray-500 hover:text-white transition-colors font-light text-sm flex items-center gap-2">
                      {link}
                      {link === 'Career' && (
                        <span className="bg-[#556b2f] text-[8px] px-1.5 py-0.5 rounded text-white font-bold">HIRING!</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="col-span-2 flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-200">Subscribe To Our Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hello@twt.co.tz"
                className="bg-white/5 border border-white/10 px-4 py-4 w-full text-sm outline-none focus:border-white/30 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#d6852b] hover:bg-gray-500 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-60"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p className="text-xs text-gray-400">
                {message}
              </p>
            )}
            <p className="text-xs text-gray-500 leading-relaxed italic">
              Join our network for field updates, wildlife relocation reports, and seasonal training opportunities.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Logo and Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/10 gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/twt-logo-removebg-preview.png"
              alt="TWT Logo"
              width={40}
              height={20}
              loading='eager'
            />
            <span className="font-bold tracking-tighter text-xl">
              TANZANIA WILDLIFE<span className="font-light"> TRAPPERS</span>
            </span>
          </div>

          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            Copyright © {currentYear} Tanzania Wildlife Trappers
          </p>
        </div>


      </div>
    </footer>
  );
};

export default Footer;