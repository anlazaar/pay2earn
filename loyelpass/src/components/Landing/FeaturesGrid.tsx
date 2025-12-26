"use client";

import { motion } from "framer-motion";
import {
  ScanLine,
  Users,
  Settings2,
  ShieldAlert,
  Smartphone,
  Trophy,
} from "lucide-react";

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Built for the entire <br />
            <span className="text-muted-foreground">
              hospitality ecosystem.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Role-based interfaces for Owners, Waiters, and Clients. Secure,
            scalable, and instant.
          </motion.p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* CARD 1: The Waiter Workflow (Wide) */}
          <motion.div
            whileHover="hover"
            initial="rest"
            className="group md:col-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors"
          >
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-semibold mb-2">
                  Instant Waiter Handover
                </h3>
                <p className="text-muted-foreground">
                  Waiters generate a secure QR code at the table. Clients scan
                  to claim points instantly. No hardware required.
                </p>
              </div>
            </div>

            {/* Visual: Waiter Generating -> Client Scanning */}
            <div className="absolute right-0 top-0 h-full w-1/2 hidden md:flex items-center justify-center">
              {/* Phone 1: Waiter */}
              <motion.div
                variants={{ hover: { x: -20, opacity: 0.8 } }}
                className="absolute right-10 w-40 h-64 bg-background border border-border rounded-xl shadow-2xl p-3 z-10"
              >
                <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    WAITER_MODE
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-primary/10 rounded flex items-center justify-center text-xs font-medium text-primary">
                    Generate QR
                  </div>
                  <div className="h-2 w-full bg-secondary rounded" />
                  <div className="h-2 w-2/3 bg-secondary rounded" />
                </div>
              </motion.div>

              {/* Phone 2: Client (QR) */}
              <motion.div
                variants={{
                  rest: { x: 50, opacity: 0 },
                  hover: { x: 40, opacity: 1 },
                }}
                transition={{ duration: 0.4 }}
                className="absolute right-0 w-40 h-64 bg-foreground text-background border border-border rounded-xl shadow-2xl p-4 flex items-center justify-center z-20"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-3 p-1">
                    {/* CSS QR Code pattern */}
                    <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example')] bg-cover opacity-80 mix-blend-multiply" />
                  </div>
                  <div className="text-[10px] font-mono opacity-70">
                    scan_to_claim
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CARD 2: Dynamic Logic (Tall) */}
          <motion.div
            whileHover="hover"
            className="md:row-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8 flex flex-col"
          >
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20">
              <Settings2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Smart Reward Logic</h3>
            <p className="text-muted-foreground mb-8">
              Configure complex rules that fit your margins.
            </p>

            {/* Visual: Rule Builder UI */}
            <div className="flex-1 space-y-3">
              {[
                {
                  label: "Points by Amount",
                  active: true,
                  val: "10 MAD = 1 Pt",
                },
                {
                  label: "Points by Product",
                  active: false,
                  val: "Espresso = 5 Pts",
                },
                {
                  label: "Flat per Visit",
                  active: false,
                  val: "1 Visit = 10 Pts",
                },
              ].map((rule, i) => (
                <motion.div
                  key={i}
                  variants={{ hover: { scale: rule.active ? 1.05 : 1 } }}
                  className={`p-3 rounded-lg border ${
                    rule.active
                      ? "bg-background border-primary/50 shadow-sm"
                      : "bg-transparent border-border opacity-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">{rule.label}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        rule.active ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {rule.val}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CARD 3: Security (Standard) */}
          <motion.div
            whileHover="hover"
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="px-2 py-1 bg-background/50 backdrop-blur rounded border border-orange-500/30 text-[10px] font-mono text-orange-600 dark:text-orange-400">
                JWT_SIGNED
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fraud Prevention</h3>
            <p className="text-sm text-muted-foreground">
              QRs include unique purchase IDs and expire automatically after 60
              seconds.
            </p>

            {/* Countdown Visual */}
            <div className="mt-6 w-full bg-muted h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                whileInView={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                className="h-full bg-orange-500"
              />
            </div>
          </motion.div>

          {/* CARD 4: Staff Performance (Standard) */}
          <motion.div
            whileHover="hover"
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors p-8"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Tracking</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor which waiters generate the most loyalty sign-ups.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                +2 top performers
              </div>
            </div>
          </motion.div>

          {/* CARD 5: Client Experience (Wide) */}
          <motion.div
            whileHover="hover"
            className="md:col-span-2 relative overflow-hidden rounded-3xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors flex flex-col md:flex-row"
          >
            <div className="p-8 flex-1">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6 border border-pink-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                Gamified Client Experience
              </h3>
              <p className="text-muted-foreground">
                Clients track progress, view unlocked tiers, and redeem rewards
                directly from their phone browser.
              </p>
            </div>

            {/* Visual: Reward Tiers */}
            <div className="p-8 flex items-center gap-4">
              {[
                { name: "Silver", color: "bg-slate-300", points: "0 pts" },
                { name: "Gold", color: "bg-yellow-500", points: "500 pts" },
                { name: "Platinum", color: "bg-indigo-500", points: "1k pts" },
              ].map((tier, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${tier.color} opacity-80 shadow-lg border-2 border-background`}
                  />
                  <div className="text-center">
                    <div className="text-xs font-bold">{tier.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {tier.points}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
