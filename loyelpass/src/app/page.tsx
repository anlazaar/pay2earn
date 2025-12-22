"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  QrCode,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Check,
  Zap,
  BarChart3,
  Globe,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* 🟢 Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">LoyalPass</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {["Features", "Pricing", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-6">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 🟢 Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm backdrop-blur-md mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-muted-foreground font-medium">
                  Platform v1.0 Live
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent"
              >
                Loyalty made <br className="hidden md:block" />
                <span className="text-primary">effortless.</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                The digital loyalty wallet that lives in your customer&apos;s
                browser. Zero friction, zero app downloads, 100% retention.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-full text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 rounded-full text-base backdrop-blur-md"
                  >
                    View Interactive Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 🟢 Features Grid (Bento) */}
        <section
          id="features"
          className="py-32 bg-secondary/20 relative border-y border-border/40"
        >
          <div className="container mx-auto px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Designed for speed
              </h2>
              <p className="text-xl text-muted-foreground">
                Enterprise-grade tools wrapped in a design your customers will
                actually love.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
              {/* CARD 1: Instant Scan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md p-10 flex flex-col md:flex-row gap-10 hover:border-primary/30 transition-colors duration-500"
              >
                <div className="flex-1 z-10 flex flex-col justify-center">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Instant Scanning</h3>
                  <p className="text-muted-foreground">
                    Waiters generate a code. Clients scan it. Points land
                    instantly. Built for 0.5s latency.
                  </p>
                </div>

                {/* Abstract Visualization: Scanning Beam */}
                <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-black/5 to-transparent rounded-3xl border border-white/5 overflow-hidden">
                  <div className="relative">
                    <QrCode className="w-32 h-32 text-foreground/20" />
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                    />
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: No App Needed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:row-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md p-10 flex flex-col hover:border-blue-500/30 transition-colors duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No App Required</h3>
                <p className="text-muted-foreground mb-10">
                  Works directly in Safari, Chrome, and native mobile cameras.
                  3x higher adoption than app downloads.
                </p>

                {/* Abstract Visualization: Floating Success Card */}
                <div className="flex-1 relative flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full max-w-[220px] bg-background border border-border rounded-xl shadow-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Success!</div>
                        <div className="text-xs text-muted-foreground">
                          50 Points Added
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* CARD 3: Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md p-10 flex flex-col justify-end hover:border-green-500/30 transition-colors duration-500"
              >
                <div className="mb-auto">
                  <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md p-10 flex flex-col hover:border-orange-500/30 transition-colors duration-500"
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-full">
                    +24%
                  </div>
                </div>

                {/* Abstract Visualization: Animated Bars */}
                <div className="h-20 flex items-end gap-2 mb-4">
                  {[40, 70, 50, 90, 60].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex-1 bg-foreground/10 rounded-t-sm hover:bg-orange-500 transition-colors"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold">Real-time Insights</h3>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🟢 Pricing Section */}
        <section id="pricing" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Simple Pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Start for free. No credit card required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {/* Free Tier */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2rem] border border-border/50 bg-background/40 backdrop-blur-md p-10"
              >
                <h3 className="font-semibold text-lg text-muted-foreground">
                  Starter
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2">$0</div>
                <p className="text-sm text-muted-foreground mb-8">
                  For small cafes.
                </p>
                <ul className="space-y-4 mb-8">
                  {["50 Clients", "1 Program", "Basic Stats"].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-full h-12">
                  Get Started
                </Button>
              </motion.div>

              {/* Pro Tier */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2rem] border-2 border-primary bg-background/80 backdrop-blur-xl p-10 relative shadow-2xl shadow-primary/10"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                  POPULAR
                </div>
                <h3 className="font-semibold text-lg text-primary">
                  Business Pro
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2">
                  $29
                  <span className="text-lg text-muted-foreground font-normal">
                    /mo
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                  Everything to grow.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Clients",
                    "3 Programs",
                    "Staff Management",
                    "Data Export",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm font-medium"
                    >
                      <Check className="w-4 h-4 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full h-12">
                  Start Free Trial
                </Button>
              </motion.div>

              {/* Enterprise Tier */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-[2rem] border border-border/50 bg-background/40 backdrop-blur-md p-10"
              >
                <h3 className="font-semibold text-lg text-muted-foreground">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold mt-4 mb-2">Custom</div>
                <p className="text-sm text-muted-foreground mb-8">
                  For franchises.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Everything",
                    "Custom Branding",
                    "API Access",
                    "Priority Support",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-full h-12">
                  Contact Sales
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🟢 CTA / Footer */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to modernize?</h2>
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full h-14 px-10 text-lg shadow-xl"
              >
                Create Free Account
              </Button>
            </Link>
            <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <QrCode className="w-4 h-4" />
              <span>© 2025 LoyalPass Inc.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
