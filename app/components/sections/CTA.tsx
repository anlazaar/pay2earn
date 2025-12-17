"use client";

import React from "react";

export const CTA = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative bg-gradient-to-b from-indigo-900/20 to-black border border-indigo-500/20 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px]" />

          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter relative z-10">
            Ready to go <br />
            <span className="text-white">Physical?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-xl mx-auto relative z-10">
            Join the thousands of forward-thinking merchants transforming their
            customer experience today.
          </p>
          <button className="relative z-10 h-14 px-10 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Get Started for Free
          </button>
        </div>
      </div>
    </section>
  );
};
