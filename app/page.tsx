"use client";

import React from "react";
import { Navbar } from "./components/layout/Navbar"; 
import { Footer } from "./components/layout/Footer"; 
import { Hero } from "./components/sections/Hero"; 
import { Features } from "./components/sections/Features"; 
import { HowItWorks } from "./components/sections/HowItWorks"; 
import { CTA } from "./components/sections/CTA"; 
import { Marquee } from "./components/ui/Marquee"; 

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <Navbar />
      <Hero />
      <Marquee />
      <Features />  
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
