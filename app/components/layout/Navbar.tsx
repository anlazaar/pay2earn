"use client";

import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
          <span className="font-bold text-lg tracking-tight">Loyvo</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-400 hover:text-white hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};
