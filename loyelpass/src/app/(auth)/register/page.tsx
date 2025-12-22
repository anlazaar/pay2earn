"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, QrCode, Store, User } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  // State for Role Toggle
  const [role, setRole] = useState<"BUSINESS" | "CLIENT">("CLIENT");

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: role, // Send the selected role
        }),
      });

      if (res.ok) {
        // Redirect to login on success
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* 🟢 Background Elements */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* 🟢 Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/">
          <Button
            variant="ghost"
            className="gap-2 pl-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10 p-6"
      >
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
            <QrCode className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">
            Get Started
          </h1>
          <p className="text-sm text-muted-foreground">Join LoyalPass today.</p>
        </div>

        {/* 🟢 Role Switcher (Apple Style Segmented Control) */}
        <div className="bg-secondary/50 p-1 rounded-xl flex mb-6 relative border border-white/5">
          {/* Sliding Background */}
          <motion.div
            className="absolute h-[calc(100%-8px)] top-1 bg-background rounded-lg shadow-sm border border-border/50"
            initial={false}
            animate={{
              width: "50%",
              left: role === "CLIENT" ? "4px" : "calc(50% - 4px)",
              x: role === "CLIENT" ? 0 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => setRole("CLIENT")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium z-10 transition-colors ${
              role === "CLIENT" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <User className="w-4 h-4" /> Customer
          </button>
          <button
            onClick={() => setRole("BUSINESS")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium z-10 transition-colors ${
              role === "BUSINESS" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Store className="w-4 h-4" /> Business
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Conditionally Render Business Name */}
            {role === "BUSINESS" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Joe's Coffee Shop"
                  value={formData.businessName}
                  onChange={handleChange}
                  required={role === "BUSINESS"}
                  disabled={isLoading}
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                />
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-10 font-semibold shadow-lg shadow-primary/20 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  Account...
                </>
              ) : role === "BUSINESS" ? (
                "Create Business Account"
              ) : (
                "Join as Customer"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
