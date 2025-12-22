"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleScan = async (text: string) => {
    if (status === "processing" || status === "success") return;

    if (text) {
      setStatus("processing");
      try {
        const res = await fetch("/api/purchases/scan", {
          method: "POST",
          body: JSON.stringify({ qrData: text }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(`+${data.pointsAdded} Points Added!`);
          setTimeout(() => router.push("/client"), 2000); // Redirect after 2s
        } else {
          setStatus("error");
          setMessage(data.error || "Scan failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Connection error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <Card className="overflow-hidden border-2 shadow-xl">
        <CardHeader className="text-center bg-muted/50 pb-6">
          <CardTitle>Scan QR Code</CardTitle>
          <p className="text-xs text-muted-foreground">
            Align code within the frame
          </p>
        </CardHeader>
        <CardContent className="p-0 relative h-[400px] bg-black">
          {status === "idle" && (
            <Scanner
              onScan={(result) => result[0] && handleScan(result[0].rawValue)}
              // Simple styling for the container
              styles={{ container: { height: 400 } }}
            />
          )}

          {/* Overlays for different states */}
          {status === "processing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="font-semibold">Verifying...</p>
            </div>
          )}

          {status === "success" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/90 text-white z-10 animate-in fade-in zoom-in">
              <CheckCircle2 className="h-16 w-16 mb-4" />
              <p className="text-2xl font-bold">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/90 text-white z-10 animate-in fade-in">
              <XCircle className="h-16 w-16 mb-4" />
              <p className="text-xl font-bold mb-2">Error</p>
              <p className="mb-6">{message}</p>
              <Button variant="secondary" onClick={() => setStatus("idle")}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
