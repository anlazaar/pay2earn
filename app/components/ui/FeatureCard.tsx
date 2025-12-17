"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils"; 
import { FadeIn } from "./FadeIn";

export const FeatureCard = ({ title, desc, icon, className, delay }: any) => (
  <FadeIn delay={delay}>
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 p-8 hover:bg-neutral-800/50 transition-colors duration-500",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 h-full flex flex-col">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">{desc}</p>

        {/* Decorative Graphic at bottom */}
        <div className="mt-auto w-full h-32 rounded-xl bg-black/40 border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          {/* Abstract Line Animation */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
          <motion.div
            className="absolute top-1/2 left-0 w-20 h-[1px] bg-indigo-500 shadow-[0_0_15px_#6366f1]"
            animate={{ x: ["-100%", "500%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random(),
            }}
          />
        </div>
      </div>
    </div>
  </FadeIn>
);
