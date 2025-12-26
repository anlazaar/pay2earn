"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    desc: "For small cafés just getting started.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Up to 100 Monthly Active Users",
      "1 Location",
      "Basic QR Code generation",
      "Standard Analytics",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Growth",
    desc: "For growing businesses & franchises.",
    price: { monthly: 399, yearly: 329 }, // ~20% discount
    features: [
      "Unlimited Active Users",
      "Up to 3 Locations",
      "Advanced Customer Data (CRM)",
      "Email & SMS Marketing Integrations",
      "Staff Performance Tracking",
      "Remove 'Powered by Loylpass'",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "For large chains requiring control.",
    price: { monthly: "Custom", yearly: "Custom" },
    features: [
      "Unlimited Locations",
      "Dedicated Success Manager",
      "Custom API Access",
      "SSO & Advanced Security",
      "White-label Mobile App option",
      "SLA Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t border-border/40 relative"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            No hidden fees. Cancel anytime. Prices in MAD.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-secondary border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-primary rounded-full shadow-sm"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly{" "}
              <span className="text-emerald-500 text-xs ml-1 font-mono">
                -18%
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col",
                plan.popular
                  ? "bg-background border-2 border-primary shadow-2xl shadow-primary/10 z-10 scale-105 md:scale-110"
                  : "bg-secondary/20 border border-border/50 hover:border-border transition-colors"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6 h-10">
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1">
                  {typeof plan.price.monthly === "number" ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight tabular-nums">
                        {isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-lg font-bold text-muted-foreground">
                        MAD
                      </span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight">
                      Custom
                    </span>
                  )}
                </div>
                {isYearly &&
                  typeof plan.price.monthly === "number" &&
                  plan.price.monthly > 0 && (
                    <p className="text-xs text-emerald-500 mt-2 font-medium">
                      Billed {plan.price.yearly * 12} MAD yearly
                    </p>
                  )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className={cn(
                  "w-full rounded-full h-12 font-medium",
                  plan.popular
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-transparent border-border hover:bg-secondary"
                )}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
