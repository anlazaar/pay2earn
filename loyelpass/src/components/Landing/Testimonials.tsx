"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Owner, Bean & Brew",
    content: "customer_1",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "David Chen",
    role: "GM, The Urban Grill",
    content: "customer_2",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Elena Rodriguez",
    role: "Founder, Luxe Spa",
    content: "customer_3",
    image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
  {
    name: "Mark T.",
    role: "Franchise Owner",
    content: "customer_4",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative flex w-full overflow-hidden mask-gradient-x">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-20" />

        {/* The Moving Track (Duplicated for seamless loop) */}
        <div className="flex animate-marquee gap-6 min-w-full">
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map(
            (item, i) => (
              <TestimonialCard key={i} item={item} t={t} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, t }: any) {
  return (
    <div className="relative w-[350px] shrink-0 rounded-2xl border border-border/50 bg-secondary/10 p-6 backdrop-blur-sm hover:bg-secondary/20 transition-colors">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />

      <div className="flex gap-1 mb-4 text-amber-500">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="w-4 h-4 fill-current" />
        ))}
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6 h-20 overflow-hidden text-sm">
        "{t(item.content)}"
      </p>

      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 rounded-full border border-border"
        />
        <div>
          <div className="font-bold text-sm">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.role}</div>
        </div>
      </div>
    </div>
  );
}
