"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // initialize on mount so the initial state matches the current scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Services', href: '#', hasDropdown: true },
    { name: 'Field Training', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
      {/* Logo Placeholder */}
      <Image
        src="/twt-logo-removebg-preview.png"
        alt="TWT Logo"
        width={80}
        height={40}
        loading='eager'
      />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 ml-16">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1 ${
                scrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.name}
              {link.hasDropdown && <ChevronDown size={14} />}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block justify-end ml-auto">
          <button className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#d6852b] hover:text-white transition-all transition duration-400 ease-in-out shadow-lg">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden justify-end ml-auto">
          <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? 'text-black' : 'text-white'}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 flex flex-col p-6 gap-4 shadow-xl md:hidden">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-semibold uppercase tracking-widest text-gray-800">
              {link.name}
            </a>
          ))}
          <button className="bg-black text-white py-4 text-xs font-bold uppercase tracking-widest">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;