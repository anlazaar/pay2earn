"use client";

import React from "react";
import { FadeIn } from "../ui/FadeIn"; 

export const HowItWorks = () => {
  return (
    <section
      className="py-32 border-t border-white/5 bg-black relative overflow-hidden"
      id="how-it-works"
    >
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-neutral-400">
              Launch your program in minutes, not months.
            </p>
          </div>
        </FadeIn>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-white/5 hidden md:block"></div>

          {[
            {
              step: "01",
              title: "Create Program",
              desc: "Define your rewards, set point ratios, and upload your branding.",
            },
            {
              step: "02",
              title: "Customer Scans",
              desc: "Customers scan a QR code at checkout. No app download required.",
            },
            {
              step: "03",
              title: "Reward Loyalty",
              desc: "Points are added automatically. Rewards are redeemed instantly.",
            },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div className="relative bg-black border border-white/5 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 bg-neutral-800 rounded-full border-4 border-black flex items-center justify-center font-bold text-white mb-6 relative z-10 group-hover:bg-indigo-600 transition-colors">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
