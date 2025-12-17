"use client";

import React from "react";

export const Marquee = () => {
  return (
    <div className="w-full overflow-hidden bg-background py-10 border-y border-white/5 relative z-10">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex animate-scroll w-max gap-24 items-center">
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {[
              "NIKE",
              "STARBUCKS",
              "SEPHORA",
              "UBER",
              "DOORDASH",
              "SPOTIFY",
            ].map((logo, idx) => (
              <span
                key={idx}
                className="text-4xl font-bold text-neutral-800 uppercase tracking-tighter hover:text-indigo-500 transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
