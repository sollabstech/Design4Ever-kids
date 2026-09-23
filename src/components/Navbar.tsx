"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Row: Logo + Search + Icons */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4 py-2.5 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Design4EverKids"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 flex items-center max-w-2xl mx-auto min-w-0">
            <div className="flex w-full rounded-full border border-gray-200 overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search for toys, books, games..."
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 outline-none bg-white"
              />
              <button className="bg-[#e91e8c] hover:bg-[#c2187a] px-3 sm:px-5 py-2.5 text-white transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button className="hidden sm:flex flex-col items-center gap-0.5 text-[#1a1a2e] hover:text-[#e91e8c] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs font-semibold">Wishlist</span>
            </button>
            <button className="hidden sm:flex flex-col items-center gap-0.5 text-[#1a1a2e] hover:text-[#e91e8c] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-semibold">Account</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-[#1a1a2e] hover:text-[#e91e8c] transition-colors relative">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-[#e91e8c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-xs font-semibold">Cart</span>
            </button>
            <button
              className="sm:hidden text-[#1a1a2e]"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Nav Links */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) =>
              link.active ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-[#e91e8c] text-white text-sm font-bold px-5 py-2 rounded-full"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[#1a1a2e] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <Link
            href="/special-offers"
            className="bg-[#4caf50] hover:bg-[#43a047] text-white text-sm font-bold px-5 py-2 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <span>⭐</span> Special Offers
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold px-4 py-3 rounded-xl ${link.active ? "bg-[#e91e8c] text-white" : "text-[#1a1a2e] hover:bg-gray-100"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/special-offers"
            onClick={() => setMobileOpen(false)}
            className="bg-[#4caf50] text-white text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 mt-1"
          >
            ⭐ Special Offers
          </Link>
        </div>
      )}
    </header>
  );
}
