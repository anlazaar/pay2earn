"use client";

import React from "react";
import { BarChart3, Lock, Smartphone, Zap } from "lucide-react";
import { FadeIn } from "../ui/FadeIn"; 
import { FeatureCard } from "../ui/FeatureCard"; 

export const Features = () => {
  return (
    <section className="py-32 bg-black relative z-10" id="features">
      <div className="container mx-auto px-6">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-20 max-w-2xl">
            Everything you need to <br />
            <span className="text-indigo-500">dominate retention.</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Instant Settlements"
            desc="Points update in real-time across all devices via our edge network."
            icon={<Zap />}
            className="md:col-span-2"
            delay={0.1}
          />
          <FeatureCard
            title="Bank-Grade Security"
            desc="End-to-end encryption ensures points cannot be forged or duplicated."
            icon={<Lock />}
            className="md:col-span-1"
            delay={0.2}
          />
          <FeatureCard
            title="Mobile Native"
            desc="Installable PWA that feels exactly like a native iOS/Android app."
            icon={<Smartphone />}
            className="md:col-span-1"
            delay={0.3}
          />
          <FeatureCard
            title="Customer Insights"
            desc="Deep analytics on spending habits, visit frequency, and churn prediction."
            icon={<BarChart3 />}
            className="md:col-span-2"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};
