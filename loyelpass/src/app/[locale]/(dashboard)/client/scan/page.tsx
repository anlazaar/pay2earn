"use client";

import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { Loader2, Check, ArrowLeft, ScanLine, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ScanPage() {
  const t = useTranslations("ScanPage");
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = async (text: string) => {
    if (status !== "idle") return;

    if (text) {
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate(50);
      setStatus("processing");

      try {
        const res = await fetch("/api/purchases/scan", {
          method: "POST",
          body: JSON.stringify({ qrData: text }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          // Use translation for success message
          setMessage(t("points_added", { points: data.pointsAdded }));
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate([100, 50, 100]);
          setTimeout(() => router.push("/client"), 2000);
        } else {
          setStatus("error");
          // Fallback to translated invalid code if server doesn't send specific error
          setMessage(data.error || t("invalid_code"));
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(200);
        }
      } catch (err) {
        setStatus("error");
        setMessage(t("connection_failed"));
      }
    }
  };

  const resetScan = () => {
    setStatus("idle");
    setMessage("");
  };

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans">
      {/* 🟢 Top Navigation (Minimal) */}
      <div className="absolute top-0 inset-x-0 z-30 p-6 flex items-center justify-between">
        <Link href="/client">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
          >
            {/* rtl:rotate-180 flips the arrow for Arabic so it points 'back' correctly */}
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          </Button>
        </Link>
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <span className="text-white/90 text-xs font-mono uppercase tracking-widest">
            {t("active")}
          </span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* 🟢 Main Camera Area */}
      <div className="relative flex-1 bg-black flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-80">
          <Scanner
            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
            styles={{
              container: { height: "100%", width: "100%" },
              video: { objectFit: "cover", height: "100%" },
            }}
            components={{ torch: true }}
          />
        </div>

        {/* 🟢 HUD Overlay (Engineered Frame) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64">
            {/* Corners - Using logical naming conventions in comments, though visual corners are symmetrical */}
            <div className="absolute top-0 start-0 w-8 h-8 border-t-2 border-s-2 border-white rounded-tl-lg rtl:rounded-tr-lg rtl:rounded-tl-none" />
            <div className="absolute top-0 end-0 w-8 h-8 border-t-2 border-e-2 border-white rounded-tr-lg rtl:rounded-tl-lg rtl:rounded-tr-none" />
            <div className="absolute bottom-0 start-0 w-8 h-8 border-b-2 border-s-2 border-white rounded-bl-lg rtl:rounded-br-lg rtl:rounded-bl-none" />
            <div className="absolute bottom-0 end-0 w-8 h-8 border-b-2 border-e-2 border-white rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none" />

            {/* Scan Line */}
            {status === "idle" && (
              <motion.div
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: "100%", opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-2 right-2 h-[2px] bg-primary shadow-[0_0_15px_var(--color-primary)]"
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="text-white/10 w-32 h-32" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* 🟢 Result Drawer (Modern Notification) */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-0 inset-x-0 z-40 p-6 bg-gradient-to-t from-black via-black/90 to-transparent"
            >
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto">
                {status === "processing" && (
                  <>
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-white font-medium">{t("verifying")}</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div className="h-10 w-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                      <Check className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {t("success_title")}
                    </h3>
                    {/* Message is already translated in handleScan */}
                    <p className="text-zinc-400 text-sm">{message}</p>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div className="h-10 w-10 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {t("error_title")}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4">{message}</p>
                    <Button
                      onClick={resetScan}
                      className="w-full bg-white text-black hover:bg-gray-200"
                    >
                      {t("try_again")}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🟢 Bottom Footer */}
      {status === "idle" && (
        <div className="p-8 pb-12 bg-black z-30 flex justify-center">
          <Link href="/client">
            <Button variant="ghost" className="text-white/50 hover:text-white">
              {t("cancel")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
