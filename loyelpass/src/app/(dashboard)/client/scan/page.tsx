"use client";

import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ScanLine,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScanPage() {
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
          setMessage(`+${data.pointsAdded} Points`);
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate([100, 50, 100]);
          setTimeout(() => router.push("/client"), 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Invalid QR Code");
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(200);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Connection failed");
      }
    }
  };

  const resetScan = () => {
    setStatus("idle");
    setMessage("");
  };

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* 🟢 Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        {/* Back Button (Top Left) */}
        <Link href="/client">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full h-12 w-12 backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>

        {/* Title Pill */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg">
          <span className="text-white text-sm font-semibold tracking-wide">
            Scan QR Code
          </span>
        </div>

        {/* Close Button (Top Right) - Alternative Exit */}
        <Link href="/client">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full h-12 w-12 backdrop-blur-sm"
          >
            <X className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* 🟢 Main Camera Area */}
      <div className="relative flex-1 bg-black flex flex-col justify-center overflow-hidden">
        {/* Camera Layer */}
        <div className="absolute inset-0 z-0">
          <Scanner
            onScan={(result) => result[0] && handleScan(result[0].rawValue)}
            styles={{
              container: { height: "100%", width: "100%" },
              video: { objectFit: "cover", height: "100%" },
            }}
            components={{ audio: false, torch: true }}
          />
        </div>

        {/* Targeting Frame (Idle) */}
        {status === "idle" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="relative w-72 h-72 border-2 border-white/30 rounded-[2rem] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              {/* Corners */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl -mb-1 -mr-1"></div>

              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_20px_rgba(var(--primary),1)] animate-scan-down opacity-80"></div>
              <ScanLine className="absolute inset-0 m-auto text-white/20 h-24 w-24 animate-pulse" />
            </div>
          </div>
        )}

        {/* Processing State */}
        {status === "processing" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-white font-bold text-lg tracking-wide">
                Verifying...
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-green-500/90 backdrop-blur-md animate-in zoom-in">
            <div className="bg-white p-6 rounded-full mb-6 shadow-xl animate-bounce">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-4xl font-black text-white mb-2">AWESOME!</h2>
            <p className="text-white font-bold text-xl">{message}</p>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-600/90 backdrop-blur-md animate-in slide-in-from-bottom-10">
            <XCircle className="h-20 w-20 text-white mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-white/90 text-center px-8 mb-8 font-medium">
              {message}
            </p>
            <Button
              onClick={resetScan}
              className="bg-white text-red-600 hover:bg-gray-100 font-bold rounded-full px-10 py-6 text-lg"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* 🟢 Bottom Controls */}
      <div className="p-8 pb-12 bg-black flex flex-col items-center gap-6 z-30">
        <p className="text-white/60 text-sm font-medium">
          Align QR code within the frame
        </p>

        {/* BIG CANCEL BUTTON */}
        <Link href="/client" className="w-full max-w-xs">
          <Button
            variant="outline"
            className="w-full rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white h-14 text-lg font-medium transition-all active:scale-95"
          >
            Cancel Scan
          </Button>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes scan-down {
          0% {
            top: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan-down {
          animation: scan-down 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
