"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  QrCode,
  ShieldCheck,
  Check,
  Globe,
  BarChart3,
  Zap,
} from "lucide-react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardHover = {
  rest: { scale: 1, borderColor: "var(--border)" },
  hover: {
    scale: 1.01,
    borderColor: "var(--primary)",
    transition: { duration: 0.3 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground selection:bg-primary/30 selection:text-black overflow-x-hidden">
      {/* 🟢 Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-primary to-yellow-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <QrCode className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              loylpass
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {["Features", "Pricing", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-primary transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-primary/10 hover:text-primary"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-6 bg-primary text-black font-semibold hover:bg-primary/90 shadow-[0_0_15px_-3px_var(--primary)]">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 🟢 Hero Section */}
        <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-52 overflow-hidden">
          {/* Golden Glow Background Spot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-60 mix-blend-screen" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold backdrop-blur-md mb-8 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-primary tracking-wide uppercase">
                  v1.0 Now Live
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
              >
                Loyalty made <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary via-yellow-200 to-primary bg-clip-text text-transparent drop-shadow-sm">
                  Effortless.
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                The digital loyalty wallet that lives in your customer&apos;s
                browser.{" "}
                <span className="text-foreground font-medium">
                  Zero friction.
                </span>{" "}
                No app downloads. 100% retention.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl"
                  >
                    Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 rounded-full text-base border-border/50 bg-background/50 backdrop-blur-md hover:bg-background/80"
                  >
                    View Interactive Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 🟢 Features Bento Grid */}
        <section
          id="features"
          className="py-32 relative border-t border-border/40 bg-gradient-to-b from-background/0 to-background/50"
        >
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Designed for speed & luxury
              </h2>
              <p className="text-xl text-muted-foreground">
                Enterprise-grade tools wrapped in a design your customers will
                actually love to use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
              {/* CARD 1: Instant Scan */}
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row gap-10"
              >
                <div className="flex-1 z-10 flex flex-col justify-center">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary ring-1 ring-primary/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Instant Scanning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Waiters generate a code. Clients scan it. Points land
                    instantly. Built for{" "}
                    <span className="text-foreground font-semibold">
                      0.5s latency
                    </span>{" "}
                    interactions.
                  </p>
                </div>

                {/* Scan Visualization */}
                <div className="flex-1 relative flex items-center justify-center bg-black/5 dark:bg-black/40 rounded-3xl border border-white/5 overflow-hidden">
                  <div className="relative p-6">
                    <QrCode className="w-32 h-32 text-foreground/10" />
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_20px_4px_var(--primary)]"
                    />
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: No App Needed */}
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="md:row-span-2 group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-md p-10 flex flex-col"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary ring-1 ring-primary/20">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No App Required</h3>
                <p className="text-muted-foreground mb-10">
                  Works directly in Safari, Chrome, and native mobile cameras.
                </p>

                {/* Success Card Animation */}
                <div className="flex-1 relative flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full max-w-[220px] bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/20 p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          Points Added
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Starbucks Rewards
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* CARD 3: Security */}
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-md p-10 flex flex-col justify-end"
              >
                <div className="mb-auto">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary ring-1 ring-primary/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
                <p className="text-sm text-muted-foreground">
                  JWT-signed codes. 60s expiration. Impossible to screenshot or
                  fake.
                </p>
              </motion.div>

              {/* CARD 4: Analytics */}
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-md p-10 flex flex-col"
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full border border-primary/20">
                    +24%
                  </div>
                </div>

                {/* Chart Animation */}
                <div className="h-24 flex items-end gap-2 mb-2">
                  {[35, 60, 45, 80, 55].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="flex-1 bg-foreground/5 rounded-t-sm group-hover:bg-primary transition-colors duration-500"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold">Real-time Insights</h3>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🟢 Pricing Section */}
        <section
          id="pricing"
          className="py-32 relative border-t border-border/40"
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Simple Pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Start for free. Upgrade as you grow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* 1. Starter */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2rem] border border-border/50 bg-card/20 backdrop-blur-sm p-8"
              >
                <h3 className="font-semibold text-lg text-muted-foreground tracking-wide uppercase">
                  Starter
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2 text-foreground">
                  $0
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  Perfect for small cafes.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "50 Monthly Clients",
                    "1 Loyalty Program",
                    "Basic Analytics",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground/80"
                    >
                      <Check className="w-4 h-4 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full rounded-full h-12 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                >
                  Get Started
                </Button>
              </motion.div>

              {/* 2. PRO (Gold Card) */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2rem] border-2 border-primary bg-card/80 backdrop-blur-xl p-8 relative shadow-2xl shadow-primary/10 z-10"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-yellow-600 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
                <h3 className="font-bold text-lg text-primary tracking-wide uppercase">
                  Business Pro
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2 text-foreground">
                  $29
                  <span className="text-lg text-muted-foreground font-normal">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  Remove limits & automate.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Clients",
                    "3 Active Programs",
                    "Staff Management",
                    "Customer Data Export",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm font-semibold"
                    >
                      <div className="rounded-full bg-primary/20 p-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full h-12 bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_20px_-5px_var(--primary)]">
                  Start Free Trial
                </Button>
              </motion.div>

              {/* 3. Enterprise */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2rem] border border-border/50 bg-card/20 backdrop-blur-sm p-8"
              >
                <h3 className="font-semibold text-lg text-muted-foreground tracking-wide uppercase">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2 text-foreground">
                  Custom
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  For franchises & chains.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Locations",
                    "White-label Branding",
                    "API Access",
                    "Priority Support",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground/80"
                    >
                      <Check className="w-4 h-4 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full rounded-full h-12 border-border/50 hover:bg-foreground hover:text-background"
                >
                  Contact Sales
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🟢 Footer */}
        <section className="py-24 border-t border-border/40 bg-card/30">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to modernize?</h2>
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full h-14 px-10 text-lg shadow-xl bg-foreground text-background hover:bg-foreground/80"
              >
                Create Free Account
              </Button>
            </Link>
            <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground text-sm opacity-60 hover:opacity-100 transition-opacity">
              <QrCode className="w-4 h-4" />
              <span>© 2025 LoyalPass Inc.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
